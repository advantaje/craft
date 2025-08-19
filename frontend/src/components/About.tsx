import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Settings as SettingsIcon,
  Description as DocumentIcon,
  TableChart as TableIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CloudDownload as DownloadIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Block as BlockIcon,
  Compare as CompareIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Help as TipIcon
} from '@material-ui/icons';

// Custom Alert component for Material-UI v4 compatibility
interface CustomAlertProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ severity, children, style }) => {
  const getAlertStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '1rem',
      border: '1px solid',
      display: 'flex',
      alignItems: 'flex-start',
      ...style
    };

    switch (severity) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
          color: '#155724'
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          color: '#0c5460'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fff3cd',
          borderColor: '#ffeeba',
          color: '#856404'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          color: '#721c24'
        };
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckIcon style={{ marginRight: '8px', fontSize: '20px' }} />;
      case 'info':
        return <InfoIcon style={{ marginRight: '8px', fontSize: '20px' }} />;
      case 'warning':
        return <WarningIcon style={{ marginRight: '8px', fontSize: '20px' }} />;
      case 'error':
        return <WarningIcon style={{ marginRight: '8px', fontSize: '20px' }} />;
      default:
        return null;
    }
  };

  return (
    <Paper style={getAlertStyles()} elevation={0}>
      {getIcon()}
      <Box style={{ flex: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};

const About: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>('overview');

  const handleAccordionChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const sectionStyle = {
    marginBottom: '1rem'
  };

  const featureBoxStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    marginBottom: '1rem'
  };

  const stepBoxStyle = {
    padding: '1rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    marginBottom: '0.5rem'
  };

  const buttonExample = {
    padding: '0.25rem 0.5rem',
    fontSize: '0.8rem',
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: '4px',
    fontFamily: 'monospace'
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom color="primary" style={{ fontWeight: 'bold' }}>
          CRAFT User Guide
        </Typography>
        <Typography variant="h5" color="textSecondary" style={{ marginBottom: '1rem' }}>
          Complete AI-Powered Document Planning & Drafting System
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Master every feature of CRAFT with this comprehensive guide
        </Typography>
      </Box>

      <Accordion expanded={expandedPanel === 'overview'} onChange={handleAccordionChange('overview')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <InfoIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">What is CRAFT?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography paragraph>
              CRAFT (Document Planning & Drafting) is a sophisticated AI-powered system that transforms your ideas into polished professional documents. It combines intelligent content generation with iterative improvement cycles to create high-quality documentation efficiently.
            </Typography>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🎯 Key Benefits
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      <EditIcon style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      AI-Powered Writing
                    </Typography>
                    <Typography variant="body2">
                      Generate drafts from your notes, get AI feedback, and iteratively improve content quality.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      <TableIcon style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      Structured Data
                    </Typography>
                    <Typography variant="body2">
                      Create and manage complex tables with AI assistance for Model Limitations and Risk Issues.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      <CompareIcon style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      Smart Diff Visualization
                    </Typography>
                    <Typography variant="body2">
                      See exactly what changes before applying them with multiple visualization modes.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      <DocumentIcon style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      Professional Output
                    </Typography>
                    <Typography variant="body2">
                      Generate polished Word documents using default or custom templates.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              👥 Who Should Use CRAFT?
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Business analysts creating detailed reports and documentation" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Risk management professionals documenting model limitations and risks" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Anyone needing to create structured, professional documents with AI assistance" />
              </ListItem>
            </List>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'getting-started'} onChange={handleAccordionChange('getting-started')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <HomeIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Getting Started</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              🚀 Quick Start Guide
            </Typography>
            <Typography paragraph>
              Follow these steps to create your first document with CRAFT:
            </Typography>

            <Box style={stepBoxStyle}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>1</span>
                Start on the Home Tab
              </Typography>
              <Typography>
                The Home tab is your starting point. You'll see document setup options and a green checkmark when setup is complete.
              </Typography>
            </Box>

            <Box style={stepBoxStyle}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>2</span>
                Enter Review ID
              </Typography>
              <Typography>
                Enter your review ID and click <span style={buttonExample}>Lookup Review</span> to fetch document metadata.
              </Typography>
            </Box>

            <Box style={stepBoxStyle}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>3</span>
                Choose Template
              </Typography>
              <Typography>
                Select either the default template or upload your custom .docx template.
              </Typography>
            </Box>

            <Box style={stepBoxStyle}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>4</span>
                Work on Sections
              </Typography>
              <Typography>
                Move through the section tabs (Background, Product, Usage, etc.) and complete each one.
              </Typography>
            </Box>

            <Box style={stepBoxStyle}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#4caf50', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>✓</span>
                Generate Document
              </Typography>
              <Typography>
                When all sections are complete, click <span style={{ ...buttonExample, backgroundColor: '#4caf50' }}>Generate Document</span> to create your Word file.
              </Typography>
            </Box>

            <CustomAlert severity="success" style={{ marginTop: '1rem' }}>
              <Typography variant="body2">
                <strong>Pro Tip:</strong> The interface shows progress indicators and checkmarks throughout the process. Green checkmarks mean you're on track!
              </Typography>
            </CustomAlert>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'document-setup'} onChange={handleAccordionChange('document-setup')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SearchIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Document Setup Process</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              📋 Review ID Lookup
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>What it does:</strong> Fetches document metadata from your system database to populate document fields automatically.
              </Typography>
              <Typography paragraph>
                <strong>How to use:</strong> Enter your review ID in the text field and click <span style={buttonExample}>Lookup Review</span>. You'll see a loading spinner, then a detailed information card with retrieved data.
              </Typography>
              <Typography paragraph>
                <strong>Fields Retrieved:</strong> Review ID, Model Name, Author, Department, Creation Date, Status, Priority, and Review Type (hover over field names to see internal field mappings).
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              📄 Template Selection
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Default Template:</strong> Ready-to-use template with predefined section placeholders. Select this option for quick start.
              </Typography>
              <Typography paragraph>
                <strong>Custom Template:</strong> Upload your own .docx template with custom formatting and placeholders. Click <span style={buttonExample}>Choose .docx File</span> and select your template.
              </Typography>
              <CustomAlert severity="info">
                <Typography variant="body2">
                  <strong>Template Requirements:</strong> Custom templates must be .docx files with Jinja2-style placeholders like <code>{'{{ background }}'}</code> that match your section template tags.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              ✅ Setup Completion
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Both review lookup and template selection must be completed before you can generate your final document. You'll see:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Green checkmark on the Home tab when setup is complete" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Document information displayed in the header" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Active template chip showing your selection" />
                </ListItem>
              </List>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'section-management'} onChange={handleAccordionChange('section-management')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ViewIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Working with Sections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              📑 Default Sections
            </Typography>
            <Grid container spacing={2} style={{ marginBottom: '1.5rem' }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      📚 Background
                    </Typography>
                    <Typography variant="body2">
                      Historical context, previous work, current landscape, and justification for this work.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      🎯 Product
                    </Typography>
                    <Typography variant="body2">
                      Key findings, recommendations, actionable next steps, and conclusions.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      📖 Usage
                    </Typography>
                    <Typography variant="body2">
                      Step-by-step instructions, examples, use cases, and implementation guidance.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      <TableIcon style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      Model Limitations
                    </Typography>
                    <Typography variant="body2">
                      Table format: Title, Description, Category (Data/Technical/Scope limitations).
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      <TableIcon style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      Model Risk Issues
                    </Typography>
                    <Typography variant="body2">
                      Table format: Title, Description, Category (Operational/Market/Credit), Importance.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              ➕ Adding Custom Sections
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Click the <AddIcon style={{ verticalAlign: 'middle' }} /> tab to add new sections for additional content types.
              </Typography>
              <Typography paragraph>
                <strong>Section Name:</strong> Choose a descriptive name that will appear on the tab.
              </Typography>
              <Typography paragraph>
                <strong>Template Tag:</strong> Optional placeholder name for your Word template (e.g., "executive_summary", "methodology").
              </Typography>
              <Typography paragraph>
                <strong>Removal:</strong> Custom sections show an ❌ icon for removal. Default sections cannot be removed.
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🚫 Section Exclusion System
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Right-click any section tab</strong> to access the context menu with exclusion options:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><BlockIcon color="secondary" /></ListItemIcon>
                  <ListItemText 
                    primary="Exclude Section" 
                    secondary="Mark section as excluded - won't appear in final document but content is preserved" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Include Section" 
                    secondary="Re-include a previously excluded section" 
                  />
                </ListItem>
              </List>
              <CustomAlert severity="info">
                <Typography variant="body2">
                  Excluded sections show a <BlockIcon style={{ fontSize: '1rem', verticalAlign: 'middle' }} /> icon and grayed styling. They're marked complete but send empty content to the document.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              ✅ Section Completion
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Each section shows its completion status:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon style={{ color: '#4caf50' }} /></ListItemIcon>
                  <ListItemText primary="Green checkmark: Section completed with content" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BlockIcon style={{ color: '#757575' }} /></ListItemIcon>
                  <ListItemText primary="Block icon: Section excluded from document" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><div style={{ width: '24px', height: '24px', border: '1px solid #ccc', borderRadius: '50%' }}></div></ListItemIcon>
                  <ListItemText primary="Empty circle: Section not yet completed" />
                </ListItem>
              </List>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'text-workflow'} onChange={handleAccordionChange('text-workflow')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <EditIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Text Section Workflow</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              📝 Step 1: Notes Input
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Start by writing your initial thoughts, ideas, and key points in the Notes field. This is your creative space - don't worry about formatting or perfect prose.
              </Typography>
              <Typography paragraph>
                <strong>Button Available:</strong> <span style={buttonExample}>Generate Draft →</span> becomes active when you have notes.
              </Typography>
              <Typography paragraph>
                <strong>What happens:</strong> AI uses your notes plus section-specific guidelines to create a structured draft automatically.
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🔄 Step 2: Draft & Review Cycle
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Draft Area (Left Side):
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Edit manually or use AI-generated content"
                    secondary="Full editing capabilities with real-time text selection tracking"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Text Selection Features"
                    secondary="Select any text to see character count and access targeted review options"
                  />
                </ListItem>
              </List>

              <Typography paragraph style={{ marginTop: '1rem' }}>
                <strong>Buttons Available:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={<span style={buttonExample}>Generate Review →</span>}
                    secondary="Analyze the entire draft and provide improvement suggestions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={<span style={{ ...buttonExample, backgroundColor: '#9c27b0' }}>Review Highlighted</span>}
                    secondary="Get focused feedback on selected text only (only when text is selected)"
                  />
                </ListItem>
              </List>
            </Box>

            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Review Area (Right Side):
              </Typography>
              <Typography paragraph>
                AI-generated feedback appears here, or you can write your own review notes. The AI considers context, section type, and your custom guidelines.
              </Typography>

              <Typography paragraph>
                <strong>Buttons Available:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={<span style={{ ...buttonExample, backgroundColor: '#f44336' }}>← Apply & Update Draft</span>}
                    secondary="Apply review feedback to the entire draft with diff preview"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={<span style={buttonExample}>← Apply to Highlighted</span>}
                    secondary="Apply feedback only to selected text (only when text is selected)"
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🎯 Text Selection Features
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Real-time Selection:</strong> Select any text in the draft to see:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Character count chip showing selection size" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Additional buttons for targeted review and editing" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Context-aware AI that considers surrounding text" />
                </ListItem>
              </List>

              <CustomAlert severity="success">
                <Typography variant="body2">
                  <strong>Pro Tip:</strong> Use text selection for precise improvements. Select problematic sentences or paragraphs for targeted feedback instead of reviewing the entire document.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              ⚙️ Guidelines Customization
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Click the <SettingsIcon style={{ verticalAlign: 'middle' }} /> icon next to the section name to customize AI guidelines:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Draft Writing Guidelines" 
                    secondary="Instructions for generating content from notes"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Review & Feedback Guidelines" 
                    secondary="How the AI should analyze and provide feedback"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Revision Process Guidelines" 
                    secondary="Instructions for improving drafts based on feedback"
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Features:</strong> Tabbed editor, reset to default option, and section-specific customization.
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'table-workflow'} onChange={handleAccordionChange('table-workflow')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TableIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Table Section Workflow</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              📊 Table Types Available
            </Typography>
            <Grid container spacing={2} style={{ marginBottom: '1.5rem' }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      Model Limitations
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Columns:</strong> Title, Description, Category
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Categories:</strong> Data Limitations, Technical Limitations, Scope Limitations
                    </Typography>
                    <Typography variant="body2">
                      <strong>Purpose:</strong> Document technical constraints and scope boundaries that users need to understand.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                      Model Risk Issues
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Columns:</strong> Title, Description, Category, Importance
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Categories:</strong> Operational Risk, Market Risk, Credit Risk
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Importance:</strong> Critical, High, Low
                    </Typography>
                    <Typography variant="body2">
                      <strong>Purpose:</strong> Identify and assess risks for stakeholder awareness and mitigation planning.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              📝 Step 1: Notes Input
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Describe what data you want in your table. Be specific about:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Types of limitations or risks to include" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Level of detail needed in descriptions" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Specific categories or importance levels to focus on" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Industry context or specific use cases" />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Button Available:</strong> <span style={buttonExample}>Generate Table Data →</span> creates structured JSON data from your notes.
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              📊 Step 2: Table Data & Review
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Table Editor Features:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Interactive Editing"
                    secondary="Click any cell to edit. Dropdown menus for category and importance fields."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Row Management"
                    secondary="Add new rows with the Add Row button. Delete rows with the trash icon."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Multi-Row Selection"
                    secondary="Use checkboxes to select multiple rows. Select All checkbox in header."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Visual Feedback"
                    secondary="Selected rows highlighted in blue. Required fields marked with red asterisk."
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🔄 Review & Improvement Options
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Whole Table Review:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={<span style={buttonExample}>Generate Review →</span>}
                    secondary="Analyze all table data and provide comprehensive feedback"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={<span style={{ ...buttonExample, backgroundColor: '#f44336' }}>← Apply & Update Table</span>}
                    secondary="Apply review feedback to the entire table with diff preview"
                  />
                </ListItem>
              </List>

              <Typography paragraph style={{ marginTop: '1rem' }}>
                <strong>Selected Rows Review:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={<span style={{ ...buttonExample, backgroundColor: '#9c27b0' }}>Review Selected (n)</span>}
                    secondary="Focus review on selected rows only (shows count of selected rows)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={<span style={buttonExample}>← Apply to Selected (n)</span>}
                    secondary="Apply feedback only to selected rows with smart merging"
                  />
                </ListItem>
              </List>

              <CustomAlert severity="info">
                <Typography variant="body2">
                  <strong>Smart Row Handling:</strong> Single row selections get individual row comparison dialogs. Multiple row selections are processed as a group and merged back intelligently.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              ⚙️ Template Tags
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Table sections have fixed template tags that cannot be edited:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="model_limitations" 
                    secondary="Maps to {{model_limitations}} in your Word template"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="model_risk_issues" 
                    secondary="Maps to {{model_risk_issues}} in your Word template"
                  />
                </ListItem>
              </List>
              <Typography variant="body2">
                The system automatically formats table data for proper Word document integration.
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'advanced-features'} onChange={handleAccordionChange('advanced-features')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <CompareIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Advanced Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              👁️ Diff Visualization Modes
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                When applying AI improvements, you get a comprehensive diff preview with multiple viewing options:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                        🎯 Unified View
                      </Typography>
                      <Typography variant="body2">
                        Single pane showing the final result with additions in <span style={{ backgroundColor: '#c8e6c9', padding: '2px 4px' }}>green</span> and deletions in <span style={{ backgroundColor: '#ffcdd2', padding: '2px 4px' }}>red</span>.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                        📄 Side by Side
                      </Typography>
                      <Typography variant="body2">
                        Clean comparison with current version on left and proposed changes on right. No highlighting.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                        🔍 Side by Side (Highlighted)
                      </Typography>
                      <Typography variant="body2">
                        Side-by-side with removals highlighted on left and additions highlighted on right.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography paragraph style={{ marginTop: '1rem' }}>
                <strong>Change Summary:</strong> Every diff shows word counts for added, removed, and unchanged content.
              </Typography>

              <CustomAlert severity="success">
                <Typography variant="body2">
                  <strong>Pro Tip:</strong> Use Unified View for quick overview, Side by Side for detailed comparison, and Highlighted mode to see exactly what's changing where.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              ⚙️ Guidelines Editor Deep Dive
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Each section can have completely customized AI behavior through the guidelines system:
              </Typography>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Three Operation Types:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><EditIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Draft Writing Guidelines"
                    secondary="Controls how AI generates initial content from your notes. Used when clicking 'Generate Draft' buttons."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ViewIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Review & Feedback Guidelines"
                    secondary="Determines what the AI looks for when analyzing your content. Used for 'Generate Review' operations."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><RefreshIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Revision Process Guidelines"
                    secondary="Guides how AI applies feedback to improve content. Used when applying review notes."
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Editor Features:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Tabbed Interface"
                    secondary="Switch between operation types easily"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Large Text Areas"
                    secondary="Ample space for detailed instructions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Reset to Default"
                    secondary="Restore original guidelines anytime"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Per-Section Customization"
                    secondary="Each section can have unique guidelines"
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              📍 Progress Tracking
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                The system provides multiple levels of progress feedback:
              </Typography>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Global Progress:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Tab Indicators"
                    secondary="Green checkmarks show completed sections, block icons show excluded sections"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Generate Document Button"
                    secondary="Appears only when all sections are complete and setup is done"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Header Information"
                    secondary="Shows document metadata when review lookup is complete"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Section Progress:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Step Indicators"
                    secondary="Visual stepper shows current step and completed steps"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Loading States"
                    secondary="Buttons show spinners and loading text during AI operations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Completion Requirements"
                    secondary="Clear indication of what's needed to complete each section"
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🔗 Context Menus & Shortcuts
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Section Tab Context Menu:</strong> Right-click any section tab to access:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="🚫 Exclude Section"
                    secondary="Remove from final document while preserving content"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="✅ Include Section"
                    secondary="Re-add previously excluded sections"
                  />
                </ListItem>
              </List>

              <Typography paragraph>
                <strong>Keyboard Navigation:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Tab Navigation"
                    secondary="Use keyboard to navigate between tabs and fields"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Enter Key Shortcuts"
                    secondary="Press Enter in Review ID field to trigger lookup"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'document-generation'} onChange={handleAccordionChange('document-generation')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <DownloadIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Document Generation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              📋 Prerequisites
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                Before you can generate your document, ensure:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Review ID lookup completed (document metadata retrieved)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Template selected (default or custom uploaded)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="All desired sections completed (green checkmarks visible)" />
                </ListItem>
              </List>
              <CustomAlert severity="info">
                <Typography variant="body2">
                  The <span style={{ ...buttonExample, backgroundColor: '#4caf50' }}>Generate Document</span> button only appears when all prerequisites are met.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🔄 Generation Process
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                When you click <span style={{ ...buttonExample, backgroundColor: '#4caf50' }}>Generate Document</span>:
              </Typography>

              <Box style={stepBoxStyle}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>1</span>
                  Modal Opens Automatically
                </Typography>
                <Typography>
                  Generation modal appears and starts processing immediately.
                </Typography>
              </Box>

              <Box style={stepBoxStyle}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>2</span>
                  Content Processing
                </Typography>
                <Typography>
                  System maps section content to template placeholders. Excluded sections send empty content.
                </Typography>
              </Box>

              <Box style={stepBoxStyle}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>3</span>
                  Template Rendering
                </Typography>
                <Typography>
                  Your selected template is populated with content using Jinja2 templating.
                </Typography>
              </Box>

              <Box style={stepBoxStyle}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#4caf50', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem', fontSize: '0.8rem' }}>✓</span>
                  Download Ready
                </Typography>
                <Typography>
                  <span style={{ ...buttonExample, backgroundColor: '#4caf50' }}>Download Document</span> button appears. Progress bar shows 100%.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              📄 Template Mapping
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>How Content Maps to Templates:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Section Template Tags"
                    secondary="Each section's content replaces {{template_tag}} placeholders in your Word template"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Document Metadata"
                    secondary="Review information populates document header fields automatically"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Table Formatting"
                    secondary="Table sections are formatted as proper Word tables with column headers"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Excluded Sections"
                    secondary="Excluded sections result in empty template placeholders"
                  />
                </ListItem>
              </List>

              <CustomAlert severity="info">
                <Typography variant="body2">
                  <strong>Template Requirements:</strong> Your custom templates must use Jinja2 syntax like <code>{'{{ background }}'}</code>, <code>{'{{ product }}'}</code>, <code>{'{{ model_limitations }}'}</code> etc.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              💾 Download & Completion
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Successful Generation:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Included Sections Display"
                    secondary="Modal shows chips for all sections included in the document"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Automatic File Naming"
                    secondary="Document named as [ReviewID].docx automatically"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Browser Download"
                    secondary="File downloads through your browser's default download location"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Auto-Close"
                    secondary="Modal closes automatically after download completes"
                  />
                </ListItem>
              </List>

              <Typography paragraph style={{ marginTop: '1rem' }}>
                <strong>Error Handling:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Retry Option"
                    secondary="If generation fails, a Retry button appears"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Error Messages"
                    secondary="Clear error descriptions help identify issues"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Close & Restart"
                    secondary="Can close modal and try again after fixing issues"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'tips-best-practices'} onChange={handleAccordionChange('tips-best-practices')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TipIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Tips & Best Practices</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              ✍️ Writing Effective Notes
            </Typography>
            <Box style={featureBoxStyle}>
              <CustomAlert severity="success" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Golden Rule:</strong> The better your notes, the better your AI-generated content will be!
                </Typography>
              </CustomAlert>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                For Text Sections:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Be Specific and Detailed"
                    secondary="Instead of 'background info,' write 'historical development of risk models from 2010-2020, key regulatory changes, current industry challenges'"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Include Key Points as Bullets"
                    secondary="List main ideas, supporting evidence, examples, and conclusions you want covered"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Mention Tone and Audience"
                    secondary="'Technical documentation for risk managers' vs 'executive summary for board presentation'"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Reference Sources"
                    secondary="Mention specific studies, regulations, or industry standards to reference"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                For Table Sections:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Specify Number of Items"
                    secondary="'Create 5-7 model limitations' vs 'create some limitations'"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Describe Detail Level"
                    secondary="'Brief one-sentence descriptions' vs 'comprehensive explanations with impact analysis'"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Mention Category Distribution"
                    secondary="'Focus on technical limitations' or 'balance across all limitation types'"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TipIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Include Business Context"
                    secondary="'For credit risk model in retail banking' provides better context than generic requests"
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🔄 Optimizing the Review Cycle
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Getting Better AI Reviews:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Customize Guidelines First"
                    secondary="Set up section-specific guidelines before generating reviews for more targeted feedback"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Use Text Selection for Focus"
                    secondary="Select specific paragraphs or sentences that need improvement rather than reviewing entire sections"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Iterate Multiple Times"
                    secondary="Don't expect perfection in one cycle. Apply feedback, review again, refine further"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Mix AI and Manual Reviews"
                    secondary="Generate AI feedback, then add your own observations in the review field"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Working with Diff Previews:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><ViewIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Start with Unified View"
                    secondary="Get quick overview of changes, then switch to side-by-side for detailed comparison"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ViewIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Check Change Summary"
                    secondary="Large word counts might indicate over-revision. Small counts might mean insufficient improvement"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ViewIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Don't Auto-Accept"
                    secondary="Always review changes before accepting. AI might misunderstand your intent"
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              📊 Table Management Best Practices
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Efficient Row Management:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><TableIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Start with AI Generation"
                    secondary="Generate initial table from notes, then edit manually rather than starting from scratch"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TableIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Use Multi-Row Selection Wisely"
                    secondary="Select related rows for batch review (e.g., all 'Technical Limitations' for consistency)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TableIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Review Individual Rows First"
                    secondary="Perfect one row as an example, then apply similar feedback to multiple rows"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TableIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Check Category Balance"
                    secondary="Ensure good distribution across limitation/risk categories for comprehensive coverage"
                  />
                </ListItem>
              </List>

              <CustomAlert severity="info" style={{ marginTop: '1rem' }}>
                <Typography variant="body2">
                  <strong>Pro Tip:</strong> For Model Risk Issues, balance importance levels. Don't mark everything as 'Critical' - use High and Low ratings strategically.
                </Typography>
              </CustomAlert>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              📄 Template Customization Tips
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Creating Effective Custom Templates:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Use Descriptive Template Tags"
                    secondary="Instead of {{section1}}, use {{executive_summary}} or {{risk_assessment}}"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Plan Your Section Flow"
                    secondary="Organize template structure before adding sections. Consider reader journey"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Test with Sample Content"
                    secondary="Create a test document with sample content to verify template formatting works"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Include Table Placeholders"
                    secondary="Add {{model_limitations}} and {{model_risk_issues}} where you want tables"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                Section Organization Strategy:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Use Standard Flow: Background → Product → Usage → Limitations → Risk Issues"
                    secondary="This follows a logical progression from context to conclusions to technical details"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Add Custom Sections for Unique Needs"
                    secondary="Executive Summary, Methodology, Recommendations, Implementation Timeline, etc."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Consider Your Audience"
                    secondary="Executive audiences need summaries first; technical audiences might prefer methodology upfront"
                  />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              ⚡ Performance & Efficiency Tips
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                Workflow Optimization:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><RefreshIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Complete Setup First"
                    secondary="Finish review lookup and template selection before working on sections"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><RefreshIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Work Section by Section"
                    secondary="Complete one section fully before moving to the next for better focus"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><RefreshIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Save Progress Naturally"
                    secondary="All changes auto-save to browser storage - no manual save needed"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><RefreshIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Use Section Exclusion Strategically"
                    secondary="Exclude sections you don't need rather than leaving them incomplete"
                  />
                </ListItem>
              </List>

              <CustomAlert severity="warning" style={{ marginTop: '1rem' }}>
                <Typography variant="body2">
                  <strong>Browser Storage:</strong> Your work is saved locally in your browser. Clear browser data will lose your progress.
                </Typography>
              </CustomAlert>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'troubleshooting'} onChange={handleAccordionChange('troubleshooting')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <WarningIcon style={{ marginRight: '0.5rem' }} />
          <Typography variant="h6">Troubleshooting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" gutterBottom>
              🚨 Common Issues & Solutions
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1rem' }}>
              Document Setup Issues:
            </Typography>
            <Box style={featureBoxStyle}>
              <CustomAlert severity="error" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> "Failed to lookup review" error message
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Solutions:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Check Review ID format - ensure no extra spaces or special characters" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Verify Review ID exists in the database" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Check network connection - lookup requires API access" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Try refreshing the page and attempting lookup again" />
                </ListItem>
              </List>
            </Box>

            <Box style={featureBoxStyle}>
              <CustomAlert severity="error" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> Custom template upload fails
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Solutions:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Ensure file is in .docx format (not .doc, .pdf, or other formats)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Check file size - very large templates may fail to upload" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Verify template isn't password-protected or corrupted" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Try using the default template if custom upload continues to fail" />
                </ListItem>
              </List>
            </Box>

            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1.5rem' }}>
              AI Generation Issues:
            </Typography>
            <Box style={featureBoxStyle}>
              <CustomAlert severity="error" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> AI operations timeout or fail
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Solutions:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Check internet connection - AI requires stable connection" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Try shorter, simpler notes if generation fails" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Wait a moment and retry - temporary service issues may resolve" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Simplify custom guidelines if using complex instructions" />
                </ListItem>
              </List>
            </Box>

            <Box style={featureBoxStyle}>
              <CustomAlert severity="warning" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> Generated content is not what you expected
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Solutions:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Rewrite notes with more specific details and examples" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Customize section guidelines to better direct AI behavior" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use the review cycle to iteratively improve content" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Edit manually and then use AI review for suggestions" />
                </ListItem>
              </List>
            </Box>

            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1.5rem' }}>
              Document Generation Issues:
            </Typography>
            <Box style={featureBoxStyle}>
              <CustomAlert severity="error" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> "Generate Document" button doesn't appear
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Check These Requirements:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Review ID lookup completed (green checkmark on Home tab)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Template selected (default or custom uploaded)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="All sections either completed or excluded" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="At least one section has actual content (not all excluded)" />
                </ListItem>
              </List>
            </Box>

            <Box style={featureBoxStyle}>
              <CustomAlert severity="error" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> Document generation fails or produces empty document
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Solutions:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Verify custom template has correct Jinja2 placeholders" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Check that section template tags match template placeholders" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Ensure at least one section has content (not all excluded)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Try using default template to isolate template issues" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Use the Retry button if generation fails" />
                </ListItem>
              </List>
            </Box>

            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: '1.5rem' }}>
              Interface & Performance Issues:
            </Typography>
            <Box style={featureBoxStyle}>
              <CustomAlert severity="warning" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> Interface is slow or unresponsive
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Solutions:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Close other browser tabs to free up memory" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Refresh the page to reset the application state" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Clear browser cache and cookies for the site" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Try a different browser if issues persist" />
                </ListItem>
              </List>
            </Box>

            <Box style={featureBoxStyle}>
              <CustomAlert severity="info" style={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Issue:</strong> Lost work after browser refresh
                </Typography>
              </CustomAlert>
              <Typography paragraph>
                <strong>Prevention & Recovery:</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Work is auto-saved to browser storage - should persist across sessions" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Avoid clearing browser data if you have unsaved work" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Generate documents frequently to preserve progress" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Copy important content to external files as backup" />
                </ListItem>
              </List>
            </Box>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              🔧 Advanced Troubleshooting
            </Typography>
            <Box style={featureBoxStyle}>
              <Typography paragraph>
                <strong>Developer Console Errors:</strong>
              </Typography>
              <Typography paragraph>
                If you encounter persistent issues, press F12 to open developer tools and check the Console tab for error messages. This can help identify specific problems.
              </Typography>

              <Typography paragraph>
                <strong>Network Issues:</strong>
              </Typography>
              <Typography paragraph>
                CRAFT requires stable internet connection for AI operations and API calls. Check Network tab in developer tools for failed requests.
              </Typography>

              <Typography paragraph>
                <strong>Browser Compatibility:</strong>
              </Typography>
              <Typography paragraph>
                CRAFT works best in modern browsers (Chrome, Firefox, Safari, Edge). Very old browsers may not support all features.
              </Typography>

              <CustomAlert severity="info" style={{ marginTop: '1rem' }}>
                <Typography variant="body2">
                  <strong>Still Having Issues?</strong> If problems persist after trying these solutions, document the exact error messages and steps that led to the issue for technical support.
                </Typography>
              </CustomAlert>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box textAlign="center" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
          🎉 Ready to Get Started?
        </Typography>
        <Typography paragraph color="textSecondary">
          You now have complete knowledge of every feature in CRAFT. Start creating your first document!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => window.location.href = '/#/'}
          style={{
            backgroundColor: '#4caf50',
            fontSize: '1.1rem',
            padding: '12px 24px'
          }}
        >
          Launch CRAFT Application
        </Button>
      </Box>
    </Container>
  );
};

export default About;