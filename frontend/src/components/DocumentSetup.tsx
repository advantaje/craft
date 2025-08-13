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
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip
} from '@material-ui/core';
import { Check as CheckIcon, CloudUpload as UploadIcon, Description as TemplateIcon } from '@material-ui/icons';
import { lookupReview, uploadTemplate } from '../services/api.service';
import { DocumentInfo, TemplateInfo } from '../types/document.types';

interface DocumentSetupProps {
  onDocumentFound?: (data: DocumentInfo | null) => void;
  documentId: string;
  setDocumentId: (id: string) => void;
  documentData: DocumentInfo | null;
  templateInfo: TemplateInfo;
  onTemplateChange: (templateInfo: TemplateInfo) => void;
}

const DocumentInfoDisplay: React.FC<{ data: DocumentInfo }> = ({ data }) => {
  return (
    <Card elevation={2} style={{ marginTop: '2rem' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" style={{ marginRight: '0.5rem' }} />
            <Typography variant="h5">Review Information</Typography>
          </Box>
        }
        subheader="Retrieved from database"
        style={{ backgroundColor: '#f0f7ff' }}
      />
      <CardContent style={{ paddingBottom: '2rem' }}>
        <Grid container spacing={2}>
          {Object.entries(data).map(([field, value], index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={1} style={{ padding: '0.75rem', minHeight: '80px', marginBottom: '0.5rem' }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  {field}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 500, marginTop: '0.5rem' }}>
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

const DocumentSetup: React.FC<DocumentSetupProps> = ({ 
  onDocumentFound, 
  documentId, 
  setDocumentId, 
  documentData,
  templateInfo,
  onTemplateChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const performReviewLookup = async () => {
    if (!documentId.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await lookupReview({ id: documentId });
      onDocumentFound?.(result);
    } catch (error) {
      console.error('Error looking up review:', error);
      setError('Failed to lookup review. Please try again.');
      onDocumentFound?.(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as 'default' | 'custom';
    if (type === 'default') {
      onTemplateChange({
        name: 'template-tagged',
        type: 'default'
      });
      setUploadError(null);
    } else {
      onTemplateChange({
        name: '',
        type: 'custom',
        isUploaded: false
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.docx')) {
      setUploadError('Please upload a .docx file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      await uploadTemplate(file);
      
      onTemplateChange({
        name: file.name,
        type: 'custom',
        isUploaded: true
      });

    } catch (error) {
      console.error('Error uploading template:', error);
      setUploadError('Failed to upload template. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '2rem' }}>
        Review Setup
      </Typography>
      
      <Card>
        <CardHeader
          title="Enter Review ID"
          subheader="Retrieve review information from the database"
        />
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Review ID"
              value={documentId}
              onChange={(e) => {
                setDocumentId(e.target.value);
                // Clear results when user changes the document ID
                if (documentData && e.target.value !== documentId) {
                  onDocumentFound?.(null);
                  setError(null);
                }
              }}
              placeholder="Enter review ID to lookup information..."
              onKeyPress={(e) => e.key === 'Enter' && performReviewLookup()}
              style={{ marginRight: '1rem' }}
              error={!!error}
              helperText={error}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={performReviewLookup}
              disabled={!documentId.trim() || isLoading}
              style={{ height: '56px', minWidth: '150px' }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} style={{ marginRight: '0.5rem' }} />
                  Looking up...
                </>
              ) : (
                'Lookup Review'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {documentData && <DocumentInfoDisplay data={documentData} />}

      <Card style={{ marginTop: '2rem' }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <TemplateIcon color="primary" style={{ marginRight: '0.5rem' }} />
              <Typography variant="h6">Word Template Selection</Typography>
            </Box>
          }
          subheader="Choose the Word template for document generation"
        />
        <CardContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Template Options</FormLabel>
            <RadioGroup
              value={templateInfo.type}
              onChange={handleTemplateTypeChange}
              style={{ marginTop: '1rem' }}
            >
              <FormControlLabel
                value="default"
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" alignItems="center">
                    <Typography>Default Template (template-tagged.docx)</Typography>
                    {templateInfo.type === 'default' && (
                      <Chip
                        label="Active"
                        color="primary"
                        size="small"
                        style={{ marginLeft: '1rem' }}
                      />
                    )}
                  </Box>
                }
              />
              <FormControlLabel
                value="custom"
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" alignItems="center">
                    <Typography>Upload Custom Template</Typography>
                    {templateInfo.type === 'custom' && templateInfo.isUploaded && (
                      <Chip
                        label="Active"
                        color="primary"
                        size="small"
                        style={{ marginLeft: '1rem' }}
                      />
                    )}
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          {templateInfo.type === 'custom' && (
            <Box mt={2} p={2} style={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <input
                accept=".docx"
                style={{ display: 'none' }}
                id="template-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="template-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={uploading}
                  style={{ marginBottom: '1rem' }}
                >
                  {uploading ? (
                    <>
                      <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                      Uploading...
                    </>
                  ) : (
                    'Choose .docx File'
                  )}
                </Button>
              </label>

              {templateInfo.isUploaded && (
                <Box display="flex" alignItems="center" mt={1}>
                  <CheckIcon color="primary" style={{ marginRight: '0.5rem' }} />
                  <Typography variant="body2" color="textSecondary">
                    Template uploaded: <strong>{templateInfo.name}</strong>
                  </Typography>
                </Box>
              )}

              {uploadError && (
                <Typography variant="body2" color="error" style={{ marginTop: '0.5rem' }}>
                  {uploadError}
                </Typography>
              )}

            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DocumentSetup;