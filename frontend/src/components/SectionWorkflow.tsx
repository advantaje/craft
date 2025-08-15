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
import { DocumentSection, SectionData, DiffSegment, DiffSummary } from '../types/document.types';
import { 
  generateDraftFromNotes, 
  generateReview, 
  generateDraftFromReview,
  generateDraftFromReviewWithDiff 
} from '../services/api.service';
import FormattedDocument from './FormattedDocument';
import DraftComparisonDialog from './DraftComparisonDialog';

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
  const [comparisonDialog, setComparisonDialog] = useState({
    open: false,
    proposedDraft: '',
    diffSegments: undefined as DiffSegment[] | undefined,
    diffSummary: undefined as DiffSummary | undefined
  });

  const steps = ['Notes', 'Draft & Review Cycle'];

  const getActiveStep = (): number => {
    if (focusedField === `notes-${section.id}`) return 0;
    if (focusedField === `draft-${section.id}` || focusedField === `review-${section.id}`) return 1;
    return -1;
  };

  const getCompletedSteps = (): number[] => {
    const { draft } = section.data;
    const completed = [];
    if (draft.trim()) completed.push(0);
    return completed;
  };

  const setLoadingState = (operation: string, state: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: state }));
  };

  const handleGenerateDraftFromNotes = async () => {
    if (!section.data.notes.trim()) return;
    
    setLoadingState('draft-notes', true);
    try {
      const result = await generateDraftFromNotes({ 
        notes: section.data.notes,
        sectionName: section.name,
        sectionType: section.type
      });
      onSectionUpdate(section.id, 'draft', result);
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setLoadingState('draft-notes', false);
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
      // Try to use the enhanced API with diff support
      const result = await generateDraftFromReviewWithDiff({
        draft: section.data.draft,
        reviewNotes: section.data.reviewNotes,
        sectionName: section.name,
        sectionType: section.type
      });
      
      // Open comparison dialog with diff data
      setComparisonDialog({
        open: true,
        proposedDraft: result.new_draft,
        diffSegments: result.diff_segments,
        diffSummary: result.diff_summary
      });
    } catch (error) {
      console.error('Error revising draft with diff:', error);
      
      // Fallback to original API without diff
      try {
        const fallbackResult = await generateDraftFromReview({
          draft: section.data.draft,
          reviewNotes: section.data.reviewNotes,
          sectionName: section.name,
          sectionType: section.type
        });
        
        setComparisonDialog({
          open: true,
          proposedDraft: fallbackResult,
          diffSegments: undefined,
          diffSummary: undefined
        });
      } catch (fallbackError) {
        console.error('Error with fallback API:', fallbackError);
      }
    } finally {
      setLoadingState('draft-review', false);
    }
  };

  const handleAcceptChanges = () => {
    onSectionUpdate(section.id, 'draft', comparisonDialog.proposedDraft);
    setComparisonDialog({ 
      open: false, 
      proposedDraft: '',
      diffSegments: undefined,
      diffSummary: undefined
    });
  };

  const handleCancelChanges = () => {
    setComparisonDialog({ 
      open: false, 
      proposedDraft: '',
      diffSegments: undefined,
      diffSummary: undefined
    });
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
                  onClick={handleGenerateDraftFromNotes}
                  disabled={!section.data.notes.trim() || loading['draft-notes']}
                  size="small"
                >
                  {loading['draft-notes'] ? (
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
                value={section.data.notes}
                onChange={(e) => onSectionUpdate(section.id, 'notes', e.target.value)}
                onFocus={() => setFocusedField(`notes-${section.id}`)}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your notes and initial thoughts here..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
              title="Step 2: Draft & Review Cycle" 
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

      <DraftComparisonDialog
        open={comparisonDialog.open}
        onClose={handleCancelChanges}
        onAccept={handleAcceptChanges}
        currentDraft={section.data.draft}
        proposedDraft={comparisonDialog.proposedDraft}
        sectionName={section.name}
        isTable={false}
        diffSegments={comparisonDialog.diffSegments}
        diffSummary={comparisonDialog.diffSummary}
      />
    </>
  );
};

export default SectionWorkflow;