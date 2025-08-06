import React from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Chip
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CRAFT - Document Planning & Drafting
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Card elevation={3}>
          <CardContent style={{ padding: '3rem' }}>
            <Typography variant="h3" gutterBottom align="center" color="primary">
              About CRAFT
            </Typography>
            
            <Typography variant="h6" paragraph color="textSecondary" align="center" style={{ marginBottom: '2rem' }}>
              Your Document Planning & Drafting Assistant
            </Typography>

            <Typography variant="body1" paragraph style={{ fontSize: '16px', lineHeight: 1.7 }}>
              CRAFT is a sophisticated document planning and drafting application that guides you through a structured 3-step workflow to create high-quality documents with AI assistance and smart completion tracking.
            </Typography>

            <Box mt={4} mb={3}>
              <Typography variant="h5" gutterBottom color="primary">
                ✨ Key Features
              </Typography>
              
              <Box mb={2}>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                  🏠 Document Lookup (Home Tab)
                </Typography>
                <Typography variant="body2" paragraph color="textSecondary">
                  Retrieve document metadata using IDs with flexible field display and visual success indicators
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                  📝 3-Step Workflow
                </Typography>
                <Typography variant="body2" paragraph color="textSecondary">
                  <strong>Notes → Draft Outline → Draft & Review Cycle</strong> with smart progress tracking and focus-based highlighting
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                  🎯 Section Management
                </Typography>
                <Typography variant="body2" paragraph color="textSecondary">
                  Pre-defined sections (Introduction, Background, Usage, Conclusion) plus unlimited custom sections
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                  🤖 AI-Powered Processing
                </Typography>
                <Typography variant="body2" paragraph color="textSecondary">
                  Generate outlines, drafts, and review suggestions with cyclical revision capabilities
                </Typography>
              </Box>
            </Box>

            <Box mt={4} mb={3}>
              <Typography variant="h5" gutterBottom color="primary">
                🔧 Built With
              </Typography>
              <Box display="flex" flexWrap="wrap" mb={2} style={{ gap: '8px' }}>
                <Chip label="React 17" color="primary" variant="outlined" />
                <Chip label="TypeScript" color="primary" variant="outlined" />
                <Chip label="Material-UI v4" color="primary" variant="outlined" />
                <Chip label="Python Tornado" color="secondary" variant="outlined" />
                <Chip label="REST API" color="secondary" variant="outlined" />
              </Box>
              
              <Typography variant="body2" color="textSecondary" paragraph>
                <strong>Frontend:</strong> React with TypeScript, Material-UI components, and React Router for navigation
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                <strong>Backend:</strong> Python Tornado async web server with structured API endpoints for document processing
              </Typography>
            </Box>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom color="primary">
                🚀 How to Use
              </Typography>
              <ol style={{ paddingLeft: '1.5rem' }}>
                <li>
                  <Typography variant="body2" paragraph color="textSecondary">
                    <strong>Start with Home Tab:</strong> Optionally lookup existing document metadata
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph color="textSecondary">
                    <strong>Choose a Section:</strong> Work on Introduction, Background, Usage, Conclusion, or add custom sections
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph color="textSecondary">
                    <strong>Follow the Workflow:</strong> Complete the 3-step process with AI assistance
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph color="textSecondary">
                    <strong>Mark Complete:</strong> Finalize sections to view professionally formatted documents
                  </Typography>
                </li>
              </ol>
            </Box>

            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/"
                style={{ padding: '12px 32px' }}
              >
                Start Creating Documents
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default About;