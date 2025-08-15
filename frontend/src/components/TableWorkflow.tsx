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
  Divider,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Paper
} from '@material-ui/core';
import { Refresh as RefreshIcon, Check as CheckIcon, Warning as WarningIcon, Block as BlockIcon } from '@material-ui/icons';
import { DocumentSection, SectionData, TableData, DiffSegment, DiffSummary } from '../types/document.types';
import { TableConfiguration } from '../config/tableConfigurations';
import { 
  generateDraftFromNotes, 
  generateReview, 
  generateDraftFromReview,
  generateDraftFromReviewWithDiff 
} from '../services/api.service';
import TableEditor from './TableEditor';
import TableRenderer from './TableRenderer';
import DraftComparisonDialog from './DraftComparisonDialog';

interface TableWorkflowProps {
  section: DocumentSection;
  tableConfig: TableConfiguration;
  onSectionUpdate: (sectionId: string, field: keyof SectionData, value: string) => void;
  onToggleCompletion: (sectionId: string, completionType?: 'normal' | 'empty' | 'unexclude') => void;
  onTemplateTagUpdate: (sectionId: string, templateTag: string) => void;
}

const TableWorkflow: React.FC<TableWorkflowProps> = ({
  section,
  tableConfig,
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

  const steps = ['Notes', 'Table Data & Review'];

  const parseTableData = (dataString: string): TableData => {
    try {
      const parsed = JSON.parse(dataString);
      if (parsed && Array.isArray(parsed.rows)) {
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing table data:', error);
    }
    return { rows: [] };
  };

  const hasTableData = (): boolean => {
    if (!section.data.draft.trim() || section.data.draft === '{"rows":[]}') {
      return false;
    }
    const tableData = parseTableData(section.data.draft);
    return tableData.rows.length > 0;
  };

  const getActiveStep = (): number => {
    if (focusedField === `notes-${section.id}`) return 0;
    if (focusedField === `draft-${section.id}` || focusedField === `review-${section.id}`) return 1;
    return -1;
  };

  const getCompletedSteps = (): number[] => {
    const { draft } = section.data;
    const completed = [];
    // Check if draft has actual data rows, not just empty structure
    if (draft.trim() && draft !== '{"rows":[]}') {
      const tableData = parseTableData(draft);
      if (tableData.rows.length > 0) {
        completed.push(0);
      }
    }
    return completed;
  };

  const setLoadingState = (operation: string, state: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: state }));
  };

  const handleGenerateTableFromNotes = async () => {
    if (!section.data.notes.trim()) return;
    
    setLoadingState('table-notes', true);
    try {
      const result = await generateDraftFromNotes({ 
        notes: section.data.notes,
        sectionName: section.name,
        sectionType: tableConfig.sectionType
      });
      onSectionUpdate(section.id, 'draft', result);
    } catch (error) {
      console.error('Error generating table data:', error);
    } finally {
      setLoadingState('table-notes', false);
    }
  };


  const handleGenerateReview = async () => {
    if (!section.data.draft.trim()) return;
    
    setLoadingState('review', true);
    try {
      const result = await generateReview({ 
        draft: section.data.draft,
        sectionName: section.name,
        sectionType: tableConfig.sectionType
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
        sectionType: tableConfig.sectionType
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
          sectionType: tableConfig.sectionType
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

  const handleTableChange = (tableData: TableData) => {
    onSectionUpdate(section.id, 'draft', JSON.stringify(tableData));
  };


  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {section.name} (Table)
          </Typography>
          <TextField
            label="Template Tag"
            value={section.templateTag || ''}
            disabled={true}
            size="small"
            variant="outlined"
            placeholder="e.g., model_limitations, model_risk_issues"
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
          ) : !hasTableData() && (
            <Chip
              icon={<WarningIcon style={{ fontSize: '18px' }} />}
              label="Table data required to complete"
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
            disabled={!hasTableData()}
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
              subheader="Describe what data you want in your table"
            />
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Notes</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateTableFromNotes}
                  disabled={!section.data.notes.trim() || loading['table-notes']}
                  size="small"
                >
                  {loading['table-notes'] ? (
                    <>
                      <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                      Generating...
                    </>
                  ) : (
                    'Generate Table Data →'
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
                placeholder="Describe the table data you need. For example: 'Create a table of project tasks with their status and deadlines...'"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
              title="Step 2: Table Data & Review" 
              subheader="Edit table data and get feedback"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Table Data</Typography>
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
                  
                  <TableEditor
                    data={parseTableData(section.data.draft)}
                    columns={tableConfig.columns}
                    onChange={handleTableChange}
                    readOnly={false}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
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
                          Updating...
                        </>
                      ) : (
                        '← Apply & Update Table'
                      )}
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    value={section.data.reviewNotes}
                    onChange={(e) => onSectionUpdate(section.id, 'reviewNotes', e.target.value)}
                    onFocus={() => setFocusedField(`review-${section.id}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Review suggestions will appear here, or write your own feedback for the table data..."
                  />
                </Grid>
              </Grid>
              
            </CardContent>
          </Card>
        </>
      ) : (
        <TableRenderer 
          content={section.data.draft} 
          title={section.name}
          columns={tableConfig.columns}
        />
      )}

      <DraftComparisonDialog
        open={comparisonDialog.open}
        onClose={handleCancelChanges}
        onAccept={handleAcceptChanges}
        currentDraft={section.data.draft}
        proposedDraft={comparisonDialog.proposedDraft}
        sectionName={section.name}
        isTable={true}
        diffSegments={comparisonDialog.diffSegments}
        diffSummary={comparisonDialog.diffSummary}
      />
    </>
  );
};

export default TableWorkflow;