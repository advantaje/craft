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
  CircularProgress,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Stepper,
  Step,
  StepLabel,
  Chip
} from '@material-ui/core';
import { Add as AddIcon, Refresh as RefreshIcon, Check as CheckIcon, Warning as WarningIcon } from '@material-ui/icons';
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
  isCompleted: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
};

const FormattedDocument: React.FC<{ content: string; title: string }> = ({ content, title }) => {
  const formatContent = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      // Remove any [Generated...] markers
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

const Craft: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({});
  const [addTabDialog, setAddTabDialog] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [sections, setSections] = useState<DocumentSection[]>([
    { id: '1', name: 'Introduction', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false },
    { id: '2', name: 'Background', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false },
    { id: '3', name: 'Usage', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false },
    { id: '4', name: 'Conclusion', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false }
  ]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === sections.length) {
      setAddTabDialog(true);
    } else {
      setCurrentTab(newValue);
    }
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      const newSection: DocumentSection = {
        id: Date.now().toString(),
        name: newTabName.trim(),
        data: { notes: '', outline: '', draft: '', reviewNotes: '' },
        isCompleted: false
      };
      setSections([...sections, newSection]);
      setCurrentTab(sections.length);
      setNewTabName('');
    }
    setAddTabDialog(false);
  };

  const toggleSectionCompletion = (sectionId: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, isCompleted: !section.isCompleted }
        : section
    );
    setSections(updatedSections);
  };

  const updateSectionData = (field: keyof SectionData, value: string) => {
    const updatedSections = sections.map(section => 
      section.id === sections[currentTab].id 
        ? { ...section, data: { ...section.data, [field]: value } }
        : section
    );
    setSections(updatedSections);
  };

  const setProcessing = (operation: string, status: boolean) => {
    setIsProcessing(prev => ({ ...prev, [operation]: status }));
  };

  const getActiveStepForSection = (section: DocumentSection): number => {
    const sectionId = section.id;
    // Only show active state for focused field
    if (focusedField === `notes-${sectionId}`) return 0;
    if (focusedField === `outline-${sectionId}`) return 1;
    if (focusedField === `draft-${sectionId}` || focusedField === `review-${sectionId}`) return 2;
    return -1; // No step is active
  };

  const getCompletedSteps = (section: DocumentSection): number[] => {
    const { notes, outline, draft, reviewNotes } = section.data;
    const completed = [];
    
    // Step 0 is completed if step 1 (outline) has content
    if (outline.trim()) completed.push(0);
    // Step 1 is completed if step 2 (draft) has content  
    if (draft.trim()) completed.push(1);
    // Step 2 is always in progress if draft exists (cyclical)
    
    return completed;
  };

  const steps = ['Notes', 'Draft Outline', 'Draft & Review Cycle'];

  const generateOutline = async () => {
    const currentSection = sections[currentTab];
    if (!currentSection.data.notes.trim()) return;

    setProcessing('outline', true);
    try {
      const response = await fetch('http://localhost:8888/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: currentSection.data.notes })
      });
      const result = await response.json();
      updateSectionData('outline', result.outline);
    } catch (error) {
      console.error('Error generating outline:', error);
    } finally {
      setProcessing('outline', false);
    }
  };

  const generateDraftFromOutline = async () => {
    const currentSection = sections[currentTab];
    if (!currentSection.data.outline.trim()) return;

    setProcessing('draft-outline', true);
    try {
      const response = await fetch('http://localhost:8888/api/generate-draft-from-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notes: currentSection.data.notes,
          outline: currentSection.data.outline 
        })
      });
      const result = await response.json();
      updateSectionData('draft', result.draft);
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setProcessing('draft-outline', false);
    }
  };

  const generateReview = async () => {
    const currentSection = sections[currentTab];
    if (!currentSection.data.draft.trim()) return;

    setProcessing('review', true);
    try {
      const response = await fetch('http://localhost:8888/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: currentSection.data.draft })
      });
      const result = await response.json();
      updateSectionData('reviewNotes', result.review);
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setProcessing('review', false);
    }
  };

  const generateDraftFromReview = async () => {
    const currentSection = sections[currentTab];
    if (!currentSection.data.draft.trim() || !currentSection.data.reviewNotes.trim()) return;

    setProcessing('draft-review', true);
    try {
      const response = await fetch('http://localhost:8888/api/generate-draft-from-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          draft: currentSection.data.draft,
          reviewNotes: currentSection.data.reviewNotes 
        })
      });
      const result = await response.json();
      updateSectionData('draft', result.draft);
    } catch (error) {
      console.error('Error revising draft:', error);
    } finally {
      setProcessing('draft-review', false);
    }
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

      <Container maxWidth="xl" style={{ marginTop: '1rem' }}>
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
              <Tab 
                key={section.id} 
                label={
                  <Box display="flex" alignItems="center">
                    <span>{section.name}</span>
                    {section.isCompleted && (
                      <CheckIcon 
                        color="primary" 
                        style={{ marginLeft: '0.5rem', fontSize: '18px' }} 
                      />
                    )}
                  </Box>
                }
              />
            ))}
            <Tab 
              icon={<AddIcon />} 
              aria-label="add section"
              style={{ minWidth: 'auto' }}
            />
          </Tabs>
          
          {sections.map((section, index) => (
            <TabPanel key={section.id} value={currentTab} index={index}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" gutterBottom>
                  {section.name}
                </Typography>
                <Box>
                  {!section.data.draft.trim() && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Draft required to complete"
                      color="secondary"
                      variant="outlined"
                      style={{ 
                        marginRight: '1rem',
                        backgroundColor: '#fff3e0',
                        borderColor: '#ff9800',
                        color: '#e65100'
                      }}
                    />
                  )}
                  <Button
                    variant={section.isCompleted ? "outlined" : "contained"}
                    color={section.isCompleted ? "secondary" : "primary"}
                    onClick={() => toggleSectionCompletion(section.id)}
                    disabled={!section.data.draft.trim()}
                    startIcon={section.isCompleted ? undefined : <CheckIcon />}
                    size="large"
                  >
                    {section.isCompleted ? 'Reopen Section' : 'Mark Complete'}
                  </Button>
                </Box>
              </Box>

              {/* Progress Stepper - Only show if not completed */}
              {!section.isCompleted && (
                <Box mb={4}>
                  <Stepper activeStep={getActiveStepForSection(section)} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={label} completed={getCompletedSteps(section).includes(index)}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              {/* Show workflow steps if not completed */}
              {!section.isCompleted ? (
                <>
                  {/* Step 1: Notes */}
                  <Card style={{ marginBottom: '1.5rem' }}>
                    <CardHeader 
                      title="Step 1: Notes" 
                      subheader="Write your initial thoughts and ideas"
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">
                          Notes
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={generateOutline}
                          disabled={!section.data.notes.trim() || isProcessing.outline}
                          size="small"
                        >
                          {isProcessing.outline ? (
                            <>
                              <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                              Generating...
                            </>
                          ) : (
                            'Generate Outline →'
                          )}
                        </Button>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        value={section.data.notes}
                        onChange={(e) => updateSectionData('notes', e.target.value)}
                        onFocus={() => setFocusedField(`notes-${section.id}`)}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your notes and initial thoughts here..."
                        disabled={section.isCompleted}
                      />
                    </CardContent>
                  </Card>

                  {/* Step 2: Outline */}
                  <Card style={{ marginBottom: '1.5rem' }}>
                    <CardHeader 
                      title="Step 2: Draft Outline" 
                      subheader="Structure your document outline"
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">
                          Outline
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={generateDraftFromOutline}
                          disabled={!section.data.outline.trim() || isProcessing['draft-outline']}
                          size="small"
                        >
                          {isProcessing['draft-outline'] ? (
                            <>
                              <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                              Generating...
                            </>
                          ) : (
                            'Generate Draft →'
                          )}
                        </Button>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        value={section.data.outline}
                        onChange={(e) => updateSectionData('outline', e.target.value)}
                        onFocus={() => setFocusedField(`outline-${section.id}`)}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your outline will appear here, or write it manually..."
                        disabled={section.isCompleted}
                      />
                    </CardContent>
                  </Card>

                  {/* Step 3: Draft & Review Cycle */}
                  <Card>
                    <CardHeader 
                      title="Step 3: Draft & Review Cycle" 
                      subheader="Iterate between draft and review to improve your content"
                    />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">
                              Draft
                            </Typography>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={generateReview}
                              disabled={!section.data.draft.trim() || isProcessing.review}
                              size="small"
                            >
                              {isProcessing.review ? (
                                <>
                                  <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                                  Analyzing...
                                </>
                              ) : (
                                'Generate Review →'
                              )}
                            </Button>
                          </Box>
                          <TextField
                            fullWidth
                            multiline
                            rows={12}
                            variant="outlined"
                            value={section.data.draft}
                            onChange={(e) => updateSectionData('draft', e.target.value)}
                            onFocus={() => setFocusedField(`draft-${section.id}`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Your draft content will appear here, or write it manually..."
                            disabled={section.isCompleted}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">
                              Review & Feedback
                            </Typography>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={generateDraftFromReview}
                              disabled={!section.data.draft.trim() || !section.data.reviewNotes.trim() || isProcessing['draft-review']}
                              startIcon={<RefreshIcon />}
                              size="small"
                            >
                              {isProcessing['draft-review'] ? (
                                <>
                                  <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                                  Revising...
                                </>
                              ) : (
                                '← Apply & Update Draft'
                              )}
                            </Button>
                          </Box>
                          <TextField
                            fullWidth
                            multiline
                            rows={12}
                            variant="outlined"
                            value={section.data.reviewNotes}
                            onChange={(e) => updateSectionData('reviewNotes', e.target.value)}
                            onFocus={() => setFocusedField(`review-${section.id}`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Review suggestions will appear here, or write your own feedback..."
                            disabled={section.isCompleted}
                          />
                        </Grid>
                      </Grid>
                      
                      <Box mt={3}>
                        <Divider />
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                          💡 Tip: This is a cyclical process. Generate reviews, apply feedback, and repeat to continuously improve your draft.
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Show formatted document view when completed */
                <FormattedDocument content={section.data.draft} title={section.name} />
              )}
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