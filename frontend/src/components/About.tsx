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
            Hello World App
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
              About This App
            </Typography>
            <Typography variant="body1" paragraph>
              This is a simple Hello World application built with:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  <strong>Frontend:</strong> React with TypeScript, Material-UI v4, and React Router
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Backend:</strong> Python with Tornado web framework
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