import React, { useState, useCallback } from 'react';
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
  Chip,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { 
  Refresh as RefreshIcon, 
  Check as CheckIcon, 
  Block as BlockIcon,
  Settings as SettingsIcon 
} from '@material-ui/icons';
import { DocumentSection, SectionData, DiffSegment, DiffSummary } from '../types/document.types';
import { 
  generateDraftFromNotes, 
  generateReview, 
  generateDraftFromReviewWithDiff,
  generateReviewForSelection,
  applyReviewToSelectionWithDiff 
} from '../services/api.service';
import FormattedDocument from './FormattedDocument';
import DraftComparisonDialog from './DraftComparisonDialog';
import GuidelinesEditorModal from './GuidelinesEditorModal';
import { getSectionDefaultGuidelines, SectionGuidelines } from '../config/defaultGuidelines';

interface SectionWorkflowProps {
  section: DocumentSection;
  onSectionUpdate: (sectionId: string, field: keyof SectionData, value: string) => void;
  onToggleCompletion: (sectionId: string, completionType?: 'normal' | 'empty' | 'unexclude') => void;
  onTemplateTagUpdate: (sectionId: string, templateTag: string) => void;
  onGuidelinesUpdate: (sectionId: string, guidelines: any) => void;
}

const SectionWorkflow: React.FC<SectionWorkflowProps> = ({
  section,
  onSectionUpdate,
  onToggleCompletion,
  onTemplateTagUpdate,
  onGuidelinesUpdate
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [comparisonDialog, setComparisonDialog] = useState({
    open: false,
    proposedDraft: '',
    diffSegments: undefined as DiffSegment[] | undefined,
    diffSummary: undefined as DiffSummary | undefined
  });
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);
  const [textSelection, setTextSelection] = useState<{
    text: string;
    start: number;
    end: number;
  } | null>(null);

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
    
    setLoadingState('notes', true);
    try {
      const result = await generateDraftFromNotes({ 
        notes: section.data.notes,
        sectionName: section.name,
        sectionType: section.type,
        guidelines: section.guidelines?.draft
      });
      onSectionUpdate(section.id, 'draft', result);
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setLoadingState('notes', false);
    }
  };


  const handleGenerateReview = async () => {
    if (!section.data.draft.trim()) return;
    
    setLoadingState('generate-review', true);
    try {
      const result = await generateReview({ 
        draft: section.data.draft,
        sectionName: section.name,
        sectionType: section.type,
        guidelines: section.guidelines?.review
      });
      onSectionUpdate(section.id, 'reviewNotes', result);
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setLoadingState('generate-review', false);
    }
  };

  const handleGenerateDraftFromReview = async () => {
    if (!section.data.draft.trim() || !section.data.reviewNotes.trim()) return;
    
    setLoadingState('apply-review', true);
    try {
      const result = await generateDraftFromReviewWithDiff({
        draft: section.data.draft,
        reviewNotes: section.data.reviewNotes,
        sectionName: section.name,
        sectionType: section.type,
        guidelines: section.guidelines?.revision
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
    } finally {
      setLoadingState('apply-review', false);
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

  const handleOpenGuidelinesModal = () => {
    setGuidelinesModalOpen(true);
  };

  const handleCloseGuidelinesModal = () => {
    setGuidelinesModalOpen(false);
  };

  const handleSaveGuidelines = (guidelines: SectionGuidelines) => {
    onGuidelinesUpdate(section.id, guidelines);
  };

  // Debounced text selection handler for real-time updates
  const handleTextSelection = useCallback((event: React.SyntheticEvent) => {
    const target = event.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    
    // Handle selection immediately for better UX
    if (start !== null && end !== null && start !== end) {
      const selectedText = section.data.draft.substring(start, end);
      setTextSelection({ text: selectedText, start, end });
    } else {
      setTextSelection(null);
    }
  }, [section.data.draft]);

  // Immediate selection handler for real-time feedback
  const handleSelectionChange = useCallback((event: React.SyntheticEvent) => {
    handleTextSelection(event);
  }, [handleTextSelection]);

  const handleGenerateReviewForSelection = async () => {
    if (!textSelection) return;
    
    setLoadingState('review-selection', true);
    try {
      const contextBefore = section.data.draft.substring(Math.max(0, textSelection.start - 100), textSelection.start);
      const contextAfter = section.data.draft.substring(textSelection.end, Math.min(section.data.draft.length, textSelection.end + 100));
      
      const result = await generateReviewForSelection({
        selectedText: textSelection.text,
        contextBefore,
        contextAfter,
        sectionName: section.name,
        sectionType: section.type,
        guidelines: section.guidelines?.review,
        fullDraft: section.data.draft
      });
      
      onSectionUpdate(section.id, 'reviewNotes', result);
    } catch (error) {
      console.error('Error generating review for selection:', error);
    } finally {
      setLoadingState('review-selection', false);
    }
  };

  const handleApplyReviewToSelection = async () => {
    if (!textSelection || !section.data.reviewNotes.trim()) return;
    
    setLoadingState('apply-selection', true);
    try {
      const result = await applyReviewToSelectionWithDiff({
        fullDraft: section.data.draft,
        selectedText: textSelection.text,
        selectionStart: textSelection.start,
        selectionEnd: textSelection.end,
        reviewNotes: section.data.reviewNotes,
        sectionName: section.name,
        sectionType: section.type,
        guidelines: section.guidelines?.revision
      });
      
      setComparisonDialog({
        open: true,
        proposedDraft: result.new_draft,
        diffSegments: result.diff_segments,
        diffSummary: result.diff_summary
      });
    } catch (error) {
      console.error('Error applying review to selection:', error);
    } finally {
      setLoadingState('apply-selection', false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Box display="flex" alignItems="center" style={{ marginBottom: '16px' }}>
            <Typography variant="h4" style={{ marginRight: '8px', marginBottom: 0 }}>
              {section.name}
            </Typography>
            <Tooltip title="Edit section guidelines">
              <IconButton
                onClick={handleOpenGuidelinesModal}
                size="small"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            label="Template Tag"
            value={section.templateTag || ''}
            onChange={(e) => onTemplateTagUpdate(section.id, e.target.value)}
            size="small"
            variant="outlined"
            placeholder="e.g., background, product, usage"
            helperText="Template tag for Word document"
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </Box>
        <Box>
          {section.completionType === 'empty' && (
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
          )}
          <Tooltip 
            title={!section.data.draft.trim() ? "Draft required to complete" : ""}
            disableHoverListener={!!section.data.draft.trim() || section.isCompleted}
          >
            <span>
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
            </span>
          </Tooltip>
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
                  disabled={!section.data.notes.trim() || loading['notes']}
                  size="small"
                >
                  {loading['notes'] ? (
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
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">Draft</Typography>
                      {textSelection && (
                        <Chip
                          label={`${textSelection.text.length} characters selected`}
                          size="small"
                          variant="outlined"
                          style={{ marginLeft: '8px' }}
                        />
                      )}
                    </Box>
                    <Box display="flex" style={{ gap: '8px' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleGenerateReview}
                        disabled={!section.data.draft.trim() || loading['generate-review']}
                        size="small"
                      >
                        {loading['generate-review'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Analyzing...
                          </>
                        ) : (
                          'Generate Review →'
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleGenerateReviewForSelection}
                        disabled={!textSelection || loading['review-selection']}
                        size="small"
                      >
                        {loading['review-selection'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Reviewing...
                          </>
                        ) : (
                          'Review Highlighted'
                        )}
                      </Button>
                    </Box>
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
                    onSelect={handleSelectionChange}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    placeholder="Your draft content will appear here, or write it manually..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">Review & Feedback</Typography>
                    <Box display="flex" style={{ gap: '8px' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGenerateDraftFromReview}
                        disabled={!section.data.draft.trim() || !section.data.reviewNotes.trim() || loading['apply-review']}
                        startIcon={<RefreshIcon />}
                        size="small"
                      >
                        {loading['apply-review'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Revising...
                          </>
                        ) : (
                          '← Apply & Update Draft'
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyReviewToSelection}
                        disabled={!textSelection || !section.data.reviewNotes.trim() || loading['apply-selection']}
                        startIcon={<RefreshIcon />}
                        size="small"
                      >
                        {loading['apply-selection'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Applying...
                          </>
                        ) : (
                          '← Apply to Highlighted'
                        )}
                      </Button>
                    </Box>
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

      <GuidelinesEditorModal
        open={guidelinesModalOpen}
        onClose={handleCloseGuidelinesModal}
        guidelines={section.guidelines || getSectionDefaultGuidelines(section.type)}
        onSave={handleSaveGuidelines}
        sectionName={section.name}
        sectionType={section.type}
        defaultGuidelines={getSectionDefaultGuidelines(section.type)}
      />
    </>
  );
};

export default SectionWorkflow;