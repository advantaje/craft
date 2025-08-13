import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip
} from '@material-ui/core';
import { Refresh as RefreshIcon, Check as CheckIcon, Warning as WarningIcon, Block as BlockIcon } from '@material-ui/icons';
import { DocumentSection, SectionData } from '../types/document.types';
import { 
  generateOutline, 
  generateDraftFromOutline, 
  generateReview, 
  generateDraftFromReview 
} from '../services/api.service';
import FormattedDocument from './FormattedDocument';

interface SectionWorkflowProps {
  section: DocumentSection;
  onSectionUpdate: (sectionId: string, field: keyof SectionData, value: string) => void;
  onToggleCompletion: (sectionId: string, completionType?: 'normal' | 'empty' | 'unexclude') => void;
  onTemplateTagUpdate: (sectionId: string, templateTag: string) => void;
}

const SectionWorkflow: React.FC<SectionWorkflowProps> = ({
  section,
  onSectionUpdate,
  onToggleCompletion,
  onTemplateTagUpdate
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const steps = ['Notes', 'Draft Outline', 'Draft & Review Cycle'];

  const getActiveStep = (): number => {
    if (focusedField === `notes-${section.id}`) return 0;
    if (focusedField === `outline-${section.id}`) return 1;
    if (focusedField === `draft-${section.id}` || focusedField === `review-${section.id}`) return 2;
    return -1;
  };

  const getCompletedSteps = (): number[] => {
    const { outline, draft } = section.data;
    const completed = [];
    if (outline.trim()) completed.push(0);
    if (draft.trim()) completed.push(1);
    return completed;
  };

  const setLoadingState = (operation: string, state: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: state }));
  };

  const handleGenerateOutline = async () => {
    if (!section.data.notes.trim()) return;
    
    setLoadingState('outline', true);
    try {
      const result = await generateOutline({ 
        notes: section.data.notes,
        sectionName: section.name,
        sectionType: section.type
      });
      onSectionUpdate(section.id, 'outline', result);
    } catch (error) {
      console.error('Error generating outline:', error);
    } finally {
      setLoadingState('outline', false);
    }
  };

  const handleGenerateDraftFromOutline = async () => {
    if (!section.data.outline.trim()) return;
    
    setLoadingState('draft-outline', true);
    try {
      const result = await generateDraftFromOutline({
        notes: section.data.notes,
        outline: section.data.outline,
        sectionName: section.name,
        sectionType: section.type
      });
      onSectionUpdate(section.id, 'draft', result);
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setLoadingState('draft-outline', false);
    }
  };

  const handleGenerateReview = async () => {
    if (!section.data.draft.trim()) return;
    
    setLoadingState('review', true);
    try {
      const result = await generateReview({ 
        draft: section.data.draft,
        sectionName: section.name,
        sectionType: section.type
      });
      onSectionUpdate(section.id, 'reviewNotes', result);
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setLoadingState('review', false);
    }
  };

  const handleGenerateDraftFromReview = async () => {
    if (!section.data.draft.trim() || !section.data.reviewNotes.trim()) return;
    
    setLoadingState('draft-review', true);
    try {
      const result = await generateDraftFromReview({
        draft: section.data.draft,
        reviewNotes: section.data.reviewNotes,
        sectionName: section.name,
        sectionType: section.type
      });
      onSectionUpdate(section.id, 'draft', result);
    } catch (error) {
      console.error('Error revising draft:', error);
    } finally {
      setLoadingState('draft-review', false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {section.name}
          </Typography>
          <TextField
            label="Template Tag"
            value={section.templateTag || ''}
            onChange={(e) => onTemplateTagUpdate(section.id, e.target.value)}
            size="small"
            variant="outlined"
            placeholder="e.g., background, product, usage"
            helperText="Template placeholder name for Word document"
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </Box>
        <Box>
          {section.completionType === 'empty' ? (
            <Chip
              icon={<BlockIcon style={{ fontSize: '18px' }} />}
              label="Section Excluded"
              variant="outlined"
              style={{ 
                marginRight: '1rem',
                backgroundColor: '#f3e5f5',
                borderColor: '#9c27b0',
                color: '#7b1fa2',
                paddingLeft: '8px'
              }}
            />
          ) : !section.data.draft.trim() && (
            <Chip
              icon={<WarningIcon style={{ fontSize: '18px' }} />}
              label="Draft required to complete"
              color="secondary"
              variant="outlined"
              style={{ 
                marginRight: '1rem',
                backgroundColor: '#fff3e0',
                borderColor: '#ff9800',
                color: '#e65100',
                paddingLeft: '8px'
              }}
            />
          )}
          <Button
            variant={section.isCompleted ? "outlined" : "contained"}
            color={section.isCompleted ? "secondary" : "primary"}
            onClick={() => onToggleCompletion(section.id, 'normal')}
            disabled={!section.data.draft.trim()}
            startIcon={section.isCompleted ? undefined : <CheckIcon />}
            size="large"
          >
            {section.isCompleted ? 'Reopen Section' : 'Mark Complete'}
          </Button>
        </Box>
      </Box>

      {!section.isCompleted && (
        <Box mb={4}>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={getCompletedSteps().includes(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {!section.isCompleted ? (
        <>
          <Card style={{ marginBottom: '1.5rem' }}>
            <CardHeader 
              title="Step 1: Notes" 
              subheader="Write your initial thoughts and ideas"
            />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Notes</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateOutline}
                  disabled={!section.data.notes.trim() || loading.outline}
                  size="small"
                >
                  {loading.outline ? (
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
                onChange={(e) => onSectionUpdate(section.id, 'notes', e.target.value)}
                onFocus={() => setFocusedField(`notes-${section.id}`)}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your notes and initial thoughts here..."
              />
            </CardContent>
          </Card>

          <Card style={{ marginBottom: '1.5rem' }}>
            <CardHeader 
              title="Step 2: Draft Outline" 
              subheader="Structure your document outline"
            />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Outline</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateDraftFromOutline}
                  disabled={!section.data.outline.trim() || loading['draft-outline']}
                  size="small"
                >
                  {loading['draft-outline'] ? (
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
                onChange={(e) => onSectionUpdate(section.id, 'outline', e.target.value)}
                onFocus={() => setFocusedField(`outline-${section.id}`)}
                onBlur={() => setFocusedField(null)}
                placeholder="Your outline will appear here, or write it manually..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
              title="Step 3: Draft & Review Cycle" 
              subheader="Iterate between draft and review to improve your content"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Draft</Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleGenerateReview}
                      disabled={!section.data.draft.trim() || loading.review}
                      size="small"
                    >
                      {loading.review ? (
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
                    onChange={(e) => onSectionUpdate(section.id, 'draft', e.target.value)}
                    onFocus={() => setFocusedField(`draft-${section.id}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your draft content will appear here, or write it manually..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Review & Feedback</Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleGenerateDraftFromReview}
                      disabled={!section.data.draft.trim() || !section.data.reviewNotes.trim() || loading['draft-review']}
                      startIcon={<RefreshIcon />}
                      size="small"
                    >
                      {loading['draft-review'] ? (
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
                    onChange={(e) => onSectionUpdate(section.id, 'reviewNotes', e.target.value)}
                    onFocus={() => setFocusedField(`review-${section.id}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Review suggestions will appear here, or write your own feedback..."
                  />
                </Grid>
              </Grid>
              
            </CardContent>
          </Card>
        </>
      ) : (
        <FormattedDocument content={section.data.draft} title={section.name} />
      )}
    </>
  );
};

export default SectionWorkflow;