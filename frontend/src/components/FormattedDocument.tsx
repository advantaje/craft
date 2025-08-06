import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Box,
  Divider
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

interface FormattedDocumentProps {
  content: string;
  title: string;
}

const FormattedDocument: React.FC<FormattedDocumentProps> = ({ content, title }) => {
  const formatContent = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      const cleanParagraph = paragraph.replace(/\[.*?\]/g, '').trim();
      if (!cleanParagraph) return null;
      
      return (
        <Typography
          key={index}
          variant="body1"
          paragraph
          style={{
            lineHeight: 1.8,
            marginBottom: '1rem',
            textAlign: 'justify',
            fontSize: '16px'
          }}
        >
          {cleanParagraph}
        </Typography>
      );
    });
  };

  return (
    <Card elevation={3} style={{ marginTop: '2rem' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" style={{ marginRight: '0.5rem' }} />
            <Typography variant="h5">Final Document: {title}</Typography>
          </Box>
        }
        subheader="Completed and ready for use"
        style={{ backgroundColor: '#f5f5f5' }}
      />
      <CardContent style={{ padding: '2rem' }}>
        <Paper elevation={1} style={{ padding: '2rem', backgroundColor: '#fafafa' }}>
          <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', textAlign: 'center', color: '#1976d2' }}>
            {title}
          </Typography>
          <Divider style={{ marginBottom: '2rem' }} />
          {formatContent(content)}
        </Paper>
      </CardContent>
    </Card>
  );
};

export default FormattedDocument;