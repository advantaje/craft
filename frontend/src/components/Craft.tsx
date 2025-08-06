import React, { useState } from 'react';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface SectionData {
  notes: string;
  outline: string;
  draft: string;
  reviewNotes: string;
}

interface DocumentSection {
  id: string;
  name: string;
  data: SectionData;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const Craft: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addTabDialog, setAddTabDialog] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  const [sections, setSections] = useState<DocumentSection[]>([
    { id: '1', name: 'Introduction', data: { notes: '', outline: '', draft: '', reviewNotes: '' } },
    { id: '2', name: 'Background', data: { notes: '', outline: '', draft: '', reviewNotes: '' } },
    { id: '3', name: 'Usage', data: { notes: '', outline: '', draft: '', reviewNotes: '' } },
    { id: '4', name: 'Conclusion', data: { notes: '', outline: '', draft: '', reviewNotes: '' } }
  ]);

  const steps = ['Notes', 'Draft Outline', 'Initial Draft', 'Review Notes'];

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === sections.length) {
      setAddTabDialog(true);
    } else {
      setCurrentTab(newValue);
      setCurrentStep(0);
    }
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      const newSection: DocumentSection = {
        id: Date.now().toString(),
        name: newTabName.trim(),
        data: { notes: '', outline: '', draft: '', reviewNotes: '' }
      };
      setSections([...sections, newSection]);
      setCurrentTab(sections.length);
      setNewTabName('');
    }
    setAddTabDialog(false);
  };

  const updateSectionData = (field: keyof SectionData, value: string) => {
    const updatedSections = sections.map(section => 
      section.id === sections[currentTab].id 
        ? { ...section, data: { ...section.data, [field]: value } }
        : section
    );
    setSections(updatedSections);
  };

  const processStep = async () => {
    setIsProcessing(true);
    const currentSection = sections[currentTab];
    
    try {
      let endpoint = '';
      let payload = {};
      
      switch (currentStep) {
        case 0: // Notes to Outline
          endpoint = '/api/generate-outline';
          payload = { notes: currentSection.data.notes };
          break;
        case 1: // Outline to Draft
          endpoint = '/api/generate-draft';
          payload = { 
            notes: currentSection.data.notes, 
            outline: currentSection.data.outline 
          };
          break;
        case 2: // Draft to Review (or regenerate draft)
          endpoint = '/api/generate-review';
          payload = { 
            draft: currentSection.data.draft,
            reviewNotes: currentSection.data.reviewNotes
          };
          break;
      }

      const response = await fetch(`http://localhost:8888${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      // Update the appropriate field with processed content
      switch (currentStep) {
        case 0:
          updateSectionData('outline', result.outline);
          break;
        case 1:
          updateSectionData('draft', result.draft);
          break;
        case 2:
          if (result.updatedDraft) {
            updateSectionData('draft', result.updatedDraft);
          }
          break;
      }
      
      // Move to next step (except for review step which can loop back)
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
      
    } catch (error) {
      console.error('Error processing step:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentStepContent = () => {
    const currentSection = sections[currentTab];
    if (!currentSection) return '';
    
    switch (currentStep) {
      case 0: return currentSection.data.notes;
      case 1: return currentSection.data.outline;
      case 2: return currentSection.data.draft;
      case 3: return currentSection.data.reviewNotes;
      default: return '';
    }
  };

  const updateCurrentStepContent = (value: string) => {
    switch (currentStep) {
      case 0: updateSectionData('notes', value); break;
      case 1: updateSectionData('outline', value); break;
      case 2: updateSectionData('draft', value); break;
      case 3: updateSectionData('reviewNotes', value); break;
    }
  };

  const canProceed = () => {
    const content = getCurrentStepContent().trim();
    return content.length > 0 && !isProcessing;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Craft - Document Planning & Drafting
          </Typography>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Paper elevation={1}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {sections.map((section, index) => (
              <Tab key={section.id} label={section.name} />
            ))}
            <Tab 
              icon={<AddIcon />} 
              aria-label="add section"
              style={{ minWidth: 'auto' }}
            />
          </Tabs>
          
          {sections.map((section, index) => (
            <TabPanel key={section.id} value={currentTab} index={index}>
              <Box mb={3}>
                <Stepper activeStep={currentStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box mb={3}>
                <Typography variant="h5" gutterBottom>
                  {section.name} - {steps[currentStep]}
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  variant="outlined"
                  value={getCurrentStepContent()}
                  onChange={(e) => updateCurrentStepContent(e.target.value)}
                  placeholder={`Enter ${steps[currentStep].toLowerCase()} for ${section.name}...`}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                >
                  Previous Step
                </Button>
                
                <Box>
                  {currentStep < 3 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={processStep}
                      disabled={!canProceed()}
                      style={{ marginRight: '1rem' }}
                    >
                      {isProcessing ? (
                        <CircularProgress size={20} />
                      ) : (
                        `Generate ${steps[currentStep + 1]}`
                      )}
                    </Button>
                  )}
                  
                  {currentStep === 3 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setCurrentStep(2)}
                      disabled={isProcessing}
                      style={{ marginRight: '1rem' }}
                    >
                      Revise Draft
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    disabled={currentStep === 3}
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                  >
                    Next Step
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          ))}
        </Paper>
      </Container>

      <Dialog open={addTabDialog} onClose={() => setAddTabDialog(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            fullWidth
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTab()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTabDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTab} color="primary" disabled={!newTabName.trim()}>
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Craft;