import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  CircularProgress,
  Grid,
  Paper
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import { apiService } from '../services/api.service';
import { DocumentInfo } from '../types/document.types';

interface DocumentLookupProps {
  onDocumentFound?: (data: DocumentInfo) => void;
}

const DocumentInfoDisplay: React.FC<{ data: DocumentInfo }> = ({ data }) => {
  return (
    <Card elevation={2} style={{ marginTop: '2rem' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" style={{ marginRight: '0.5rem' }} />
            <Typography variant="h5">Document Information</Typography>
          </Box>
        }
        subheader="Retrieved from database"
        style={{ backgroundColor: '#f0f7ff' }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {Object.entries(data).map(([field, value], index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={1} style={{ padding: '1rem', height: '100%' }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  {field}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const DocumentLookup: React.FC<DocumentLookupProps> = ({ onDocumentFound }) => {
  const [documentId, setDocumentId] = useState('');
  const [documentData, setDocumentData] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupDocument = async () => {
    if (!documentId.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.lookupDocument({ id: documentId });
      setDocumentData(result.data);
      onDocumentFound?.(result.data);
    } catch (error) {
      console.error('Error looking up document:', error);
      setError('Failed to lookup document. Please try again.');
      setDocumentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '2rem' }}>
        Document Lookup
      </Typography>
      
      <Card>
        <CardHeader
          title="Enter Document ID"
          subheader="Retrieve document information from the database"
        />
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Document ID"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="Enter document ID to lookup information..."
              onKeyPress={(e) => e.key === 'Enter' && lookupDocument()}
              style={{ marginRight: '1rem' }}
              error={!!error}
              helperText={error}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={lookupDocument}
              disabled={!documentId.trim() || isLoading}
              style={{ height: '56px', minWidth: '150px' }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} style={{ marginRight: '0.5rem' }} />
                  Looking up...
                </>
              ) : (
                'Lookup Document'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {documentData && <DocumentInfoDisplay data={documentData} />}
    </>
  );
};

export default DocumentLookup;