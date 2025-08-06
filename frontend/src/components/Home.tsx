import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  CircularProgress
} from '@material-ui/core';
import { Link } from 'react-router-dom';

interface HelloResponse {
  message: string;
  timestamp: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHello = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8888/api/hello');
      const result: HelloResponse = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching hello:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Hello World App
          </Typography>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Box textAlign="center" marginBottom={4}>
          <Typography variant="h3" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Click the button below to get a hello message from the backend
          </Typography>
        </Box>

        <Box textAlign="center" marginBottom={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchHello}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Get Hello World'}
          </Button>
        </Box>

        {data && (
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {data.message}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Received at: {new Date(data.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Home;