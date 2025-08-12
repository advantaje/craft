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
import { DocumentInfo, DocumentSection, TemplateInfo } from '../types/document.types';
import { generateDocument as generateDocumentAPI } from '../services/api.service';

interface FileGenerationModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  documentData: DocumentInfo | null;
  sections: DocumentSection[];
  templateInfo: TemplateInfo;
}

type GenerationState = 'loading' | 'complete' | 'error';

const FileGenerationModal: React.FC<FileGenerationModalProps> = ({
  open,
  onClose,
  documentId,
  documentData,
  sections,
  templateInfo
}) => {
  const [state, setState] = useState<GenerationState>('loading');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('Starting document generation...');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const resetState = () => {
    setState('loading');
    setProgress(0);
    setStatusMessage('Starting document generation...');
    setError(null);
    setDownloadUrl(null);
    setFilename(null);
  };

  const generateDocument = async () => {
    try {
      resetState();
      
      // Get only completed sections and prepare data for backend
      const completedSections = sections
        .filter(section => section.isCompleted)
        .map(section => {
          // For excluded sections, send empty data to backend while preserving frontend content
          if (section.completionType === 'empty') {
            return {
              ...section,
              data: {
                notes: '',
                outline: '',
                draft: section.type === 'model_limitations' || section.type === 'model_risk_issues' ? '{"rows":[]}' : '',
                reviewNotes: ''
              }
            };
          }
          // For normal sections, send original data
          return section;
        });
      
      // Generate document using regular API
      setState('loading');
      setStatusMessage('Generating document...');
      setProgress(50);
      
      const result = await generateDocumentAPI({
        documentId,
        documentData,
        sections: completedSections,
        templateInfo
      });
      
      if (result.downloadUrl) {
        setState('complete');
        setProgress(100);
        setStatusMessage('Document ready for download!');
        setDownloadUrl(result.downloadUrl);
        setFilename(`${documentId}.docx`);
      } else {
        setState('error');
        setError('Failed to generate document');
      }
      
    } catch (error) {
      console.error('Error generating document:', error);
      setState('error');
      setError('Failed to generate document. Please try again.');
    }
  };

  const handleDownload = () => {
    if (downloadUrl && filename) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const getStepIcon = () => {
    switch (state) {
      case 'loading':
        return <CircularProgress size={24} />;
      case 'complete':
        return <CheckIcon style={{ color: '#4caf50' }} />;
      case 'error':
        return <ErrorIcon style={{ color: '#f44336' }} />;
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
            {state === 'complete' && (
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
            color={state === 'error' ? 'secondary' : 'primary'}
            style={{ marginBottom: '1rem' }}
          />
        </Box>

        {state === 'complete' && (
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Document includes {sections.filter(s => s.isCompleted && s.completionType !== 'empty').length} included sections:
            </Typography>
            <Box mt={1}>
              {sections
                .filter(section => section.isCompleted && section.completionType !== 'empty')
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
        
        {state === 'complete' && (
          <Button
            onClick={handleDownload}
            color="primary"
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Download Document
          </Button>
        )}
        
        {state === 'error' && (
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