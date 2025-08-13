import React from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  AppBar,
  Toolbar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Grid,
  Paper
} from '@material-ui/core';
import { 
  Link,
  Star as AIIcon,
  Description as DocumentIcon,
  Speed as SpeedIcon,
  Loop as LoopIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  TableChart as TableIcon,
  GetApp as DownloadIcon
} from '@material-ui/icons';

const About: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CRAFT - Document Planning & Drafting
          </Typography>
          <Button
            component={Link}
            to="/"
            color="inherit"
            style={{ textTransform: 'none' }}
          >
            ← Back to CRAFT
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom color="primary" style={{ fontWeight: 'bold' }}>
            Welcome to CRAFT
          </Typography>
          <Typography variant="h5" color="textSecondary" style={{ marginBottom: '2rem' }}>
            AI-Powered Document Planning & Drafting Tool
          </Typography>
          <Typography variant="body1" style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
            CRAFT transforms the way you create professional documents. Using advanced AI technology, 
            it guides you through a structured workflow from initial planning to final document generation, 
            making document creation faster, more consistent, and higher quality.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* What is CRAFT */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader
                title="What is CRAFT?"
                avatar={<DocumentIcon color="primary" />}
                titleTypographyProps={{ variant: 'h4' }}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  CRAFT (Document Planning & Drafting) is an intelligent document creation platform that combines 
                  human expertise with AI assistance. It's designed for professionals who need to create structured, 
                  high-quality documents like technical reports, assessments, proposals, and documentation.
                </Typography>
                <Typography variant="body1" paragraph>
                  Unlike traditional word processors, CRAFT uses a section-based approach where each part of your 
                  document goes through a proven workflow: planning → outlining → drafting → reviewing → refining. 
                  AI assists you at every step, but you remain in control of the content and direction.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Key Features */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} style={{ height: '100%' }}>
              <CardHeader
                title="Key Features"
                avatar={<AIIcon color="primary" />}
                titleTypographyProps={{ variant: 'h5' }}
              />
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SpeedIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="AI-Powered Content Generation"
                      secondary="Generate outlines, drafts, and reviews with AI assistance"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LoopIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Iterative Improvement Workflow"
                      secondary="Refine content through multiple review and revision cycles"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TableIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Structured Data Sections"
                      secondary="Special handling for tables, limitations, and risk assessments"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Professional Word Documents"
                      secondary="Export to properly formatted Word documents with custom templates"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Who Should Use CRAFT */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} style={{ height: '100%' }}>
              <CardHeader
                title="Who Should Use CRAFT?"
                avatar={<CheckIcon color="primary" />}
                titleTypographyProps={{ variant: 'h5' }}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  CRAFT is ideal for professionals who create:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="• Technical documentation and reports" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Model validation and assessment documents" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Risk assessment and compliance reports" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Project proposals and planning documents" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Product specifications and user guides" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="• Research papers and analysis reports" />
                  </ListItem>
                </List>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                  Perfect for consultants, analysts, researchers, product managers, and technical writers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* How to Use CRAFT */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader
                title="How to Use CRAFT - Step by Step"
                avatar={<EditIcon color="primary" />}
                titleTypographyProps={{ variant: 'h4' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', height: '100%' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        📋 Phase 1: Document Setup
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>1. Review Lookup:</strong> Enter your Review ID to fetch document information 
                        from the database. This populates metadata that will be used throughout the document.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>2. Template Selection:</strong> Choose between the default template or upload 
                        your own custom Word template. Templates control the final document formatting.
                      </Typography>
                      <Chip 
                        label="Home Tab" 
                        color="primary" 
                        size="small" 
                        style={{ marginTop: '0.5rem' }} 
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} style={{ padding: '1.5rem', backgroundColor: '#f0f8f0', height: '100%' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ✍️ Phase 2: Content Creation
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>3. Section Workflow:</strong> For each section tab (Background, Product, Usage, etc.):
                      </Typography>
                      <List dense>
                        <ListItem style={{ paddingLeft: 0 }}>
                          <ListItemText 
                            primary="• Add Notes: Input your requirements and key points"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem style={{ paddingLeft: 0 }}>
                          <ListItemText 
                            primary="• Generate Outline: AI creates a structured outline"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem style={{ paddingLeft: 0 }}>
                          <ListItemText 
                            primary="• Generate Draft: AI writes content from the outline"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem style={{ paddingLeft: 0 }}>
                          <ListItemText 
                            primary="• Review & Refine: AI suggests improvements, iterate as needed"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} style={{ padding: '1.5rem', backgroundColor: '#fff8e1', height: '100%' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        📊 Special: Table Sections
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Model Limitations & Risk Issues:</strong> These sections use structured tables 
                        instead of free text. AI generates properly formatted table data with:
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • <strong>Model Limitations:</strong> Title, Description, Category (Data/Technical/Scope)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • <strong>Risk Issues:</strong> Title, Description, Category (Operational/Market/Credit), Importance
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Edit cells directly or use AI generation for complete table population.
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} style={{ padding: '1.5rem', backgroundColor: '#e8f5e8', height: '100%' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        📄 Phase 3: Document Generation
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>4. Complete All Sections:</strong> Mark sections complete as you finish them. 
                        You can exclude sections that don't apply to your document.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>5. Generate Document:</strong> Once all sections are complete, click the 
                        "Generate Document" button to create a professionally formatted Word document.
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <DownloadIcon color="primary" style={{ marginRight: '0.5rem' }} />
                        <Typography variant="body2" color="primary">
                          Downloads as .docx file with your content properly formatted
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Tips for Success */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader
                title="Tips for Best Results"
                avatar={<AIIcon color="secondary" />}
                titleTypographyProps={{ variant: 'h5' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      💡 Writing Effective Notes
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Be specific about requirements and constraints" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Include context about your audience and purpose" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Mention key points that must be covered" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Provide examples or references when helpful" />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      🔄 Using the Review Cycle
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Generate reviews to get AI suggestions for improvement" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Apply review feedback iteratively for better results" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Edit AI-generated content to match your voice and style" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Use multiple review cycles for complex sections" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
                
                <Divider style={{ margin: '1.5rem 0' }} />
                
                <Box textAlign="center" style={{ backgroundColor: '#f0f7ff', padding: '1rem', borderRadius: '8px' }}>
                  <Typography variant="body1" color="primary" style={{ fontWeight: 'bold' }}>
                    💭 Remember: AI is your assistant, not your replacement
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                    Review and refine all AI-generated content to ensure it meets your specific needs, 
                    maintains your voice, and aligns with your standards and requirements.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </>
  );
};

export default About;