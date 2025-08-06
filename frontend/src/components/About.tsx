import React from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Craft - Document Planning & Drafting
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              About Craft
            </Typography>
            <Typography variant="body1" paragraph>
              Craft is a document planning and drafting website that helps you create structured documents through a 4-step workflow.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Features:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  <strong>Section-based Organization:</strong> Create documents with Introduction, Background, Usage, and Conclusion sections
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Custom Sections:</strong> Add your own custom document sections as needed
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>4-Step Workflow:</strong> Progress through Notes → Draft Outline → Initial Draft → Review Notes
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>AI-Powered Processing:</strong> Each step can be enhanced with AI processing to generate outlines and drafts
                </Typography>
              </li>
            </ul>
            <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
              Built With:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  <strong>Frontend:</strong> React with TypeScript, Material-UI v4, and React Router
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Backend:</strong> Python with Tornado web framework for document processing
                </Typography>
              </li>
            </ul>
            <Box marginTop={3}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
              >
                Back to Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default About;