import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
  Box,
  CircularProgress,
  Chip
} from '@material-ui/core';
import { Check as CheckIcon, GetApp as DownloadIcon, Error as ErrorIcon } from '@material-ui/icons';
import { DocumentInfo, DocumentSection, DocumentGenerationProgressEvent } from '../types/document.types';

interface FileGenerationModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  documentData: DocumentInfo | null;
  sections: DocumentSection[];
}

type GenerationStep = 'validating' | 'preparing' | 'header' | 'metadata' | 'processing' | 'finalizing' | 'complete' | 'ready' | 'error';

const FileGenerationModal: React.FC<FileGenerationModalProps> = ({
  open,
  onClose,
  documentId,
  documentData,
  sections
}) => {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('validating');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('Validating sections...');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const stepLabels: { [key in GenerationStep]: string } = {
    validating: 'Validating sections...',
    preparing: 'Preparing document structure...',
    header: 'Creating document header...',
    metadata: 'Adding document information...',
    processing: 'Processing sections...',
    finalizing: 'Finalizing document...',
    complete: 'Document generation complete!',
    ready: 'Document ready for download!',
    error: 'Error generating document'
  };

  const resetState = () => {
    setCurrentStep('validating');
    setProgress(0);
    setStatusMessage('Validating sections...');
    setError(null);
    setDownloadUrl(null);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  const generateDocument = async () => {
    try {
      resetState();
      
      // Get only completed sections
      const completedSections = sections.filter(section => section.isCompleted);
      
      // Create EventSource for SSE
      const es = new EventSource('http://localhost:8888/api/generate-document-stream');
      setEventSource(es);
      
      // Send the request data via POST (EventSource doesn't support POST directly)
      // We'll need to modify this approach since EventSource only supports GET
      // Instead, we'll use fetch with streaming
      es.close(); // Close the EventSource since we need to use fetch for POST
      
      const response = await fetch('http://localhost:8888/api/generate-document-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          documentData,
          sections: completedSections
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start document generation');
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No response body');
      }
      
      // Read the SSE stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData: DocumentGenerationProgressEvent = JSON.parse(line.substring(6));
              
              setCurrentStep(eventData.status);
              setProgress(eventData.progress);
              setStatusMessage(eventData.message);
              
              if (eventData.status === 'error') {
                setError(eventData.message);
                break;
              }
              
              if (eventData.status === 'ready' && eventData.downloadData) {
                // Create blob URL for download
                const blob = new Blob([eventData.downloadData.content], {
                  type: eventData.downloadData.contentType
                });
                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url);
                break;
              }
            } catch (e) {
              console.error('Error parsing SSE event:', e);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error generating document:', error);
      setCurrentStep('error');
      setError('Failed to generate document. Please try again.');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `document_${documentId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);
      
      // Close modal after download
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Start generation when modal opens
  useEffect(() => {
    if (open) {
      generateDocument();
    }
    
    // Cleanup function to close EventSource when component unmounts or modal closes
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [open]);

  const getStepIcon = () => {
    switch (currentStep) {
      case 'validating':
      case 'preparing':
      case 'header':
      case 'metadata':
      case 'processing':
      case 'finalizing':
      case 'complete':
        return <CircularProgress size={24} />;
      case 'ready':
        return <CheckIcon style={{ color: '#4caf50' }} />;
      case 'error':
        return <ErrorIcon style={{ color: '#f44336' }} />;
    }
  };

  const getProgressColor = () => {
    switch (currentStep) {
      case 'ready':
        return 'primary';
      case 'error':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <DownloadIcon style={{ marginRight: '0.5rem' }} />
          Generate Document
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box mb={3}>
          <Typography variant="body1" gutterBottom>
            Creating a complete document from all your sections...
          </Typography>
          
          <Box display="flex" alignItems="center" mt={2} mb={2}>
            {getStepIcon()}
            <Typography variant="body2" style={{ marginLeft: '0.5rem', flex: 1 }}>
              {statusMessage}
            </Typography>
            {currentStep === 'ready' && (
              <Chip 
                label="Complete" 
                color="primary" 
                size="small"
                icon={<CheckIcon />}
              />
            )}
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color={getProgressColor()}
            style={{ marginBottom: '1rem' }}
          />
        </Box>

        {currentStep === 'ready' && (
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Document includes {sections.filter(s => s.isCompleted).length} completed sections:
            </Typography>
            <Box mt={1}>
              {sections
                .filter(section => section.isCompleted)
                .map(section => (
                  <Chip
                    key={section.id}
                    label={section.name}
                    size="small"
                    style={{ margin: '0.25rem' }}
                    icon={<CheckIcon />}
                  />
                ))
              }
            </Box>
          </Box>
        )}

        {error && (
          <Box mb={2}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Close
        </Button>
        
        {currentStep === 'ready' && (
          <Button
            onClick={handleDownload}
            color="primary"
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Download Document
          </Button>
        )}
        
        {currentStep === 'error' && (
          <Button
            onClick={generateDocument}
            color="primary"
            variant="outlined"
          >
            Retry
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FileGenerationModal;