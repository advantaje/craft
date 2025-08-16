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
  Paper,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { 
  Refresh as RefreshIcon, 
  Check as CheckIcon, 
  Warning as WarningIcon, 
  Block as BlockIcon,
  Settings as SettingsIcon 
} from '@material-ui/icons';
import { DocumentSection, SectionData, TableData, DiffSegment, DiffSummary } from '../types/document.types';
import { TableConfiguration } from '../config/tableConfigurations';
import { 
  generateDraftFromNotes, 
  generateReview, 
  generateDraftFromReview,
  generateDraftFromReviewWithDiff,
  generateRowReviewWithDiff 
} from '../services/api.service';
import TableEditor from './TableEditor';
import TableRenderer from './TableRenderer';
import DraftComparisonDialog from './DraftComparisonDialog';
import GuidelinesEditorModal from './GuidelinesEditorModal';
import { getSectionDefaultGuidelines, SectionGuidelines } from '../config/defaultGuidelines';

interface TableWorkflowProps {
  section: DocumentSection;
  tableConfig: TableConfiguration;
  onSectionUpdate: (sectionId: string, field: keyof SectionData, value: string) => void;
  onToggleCompletion: (sectionId: string, completionType?: 'normal' | 'empty' | 'unexclude') => void;
  onTemplateTagUpdate: (sectionId: string, templateTag: string) => void;
  onGuidelinesUpdate: (sectionId: string, guidelines: any) => void;
}

const TableWorkflow: React.FC<TableWorkflowProps> = ({
  section,
  tableConfig,
  onSectionUpdate,
  onToggleCompletion,
  onTemplateTagUpdate,
  onGuidelinesUpdate
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [comparisonDialog, setComparisonDialog] = useState({
    open: false,
    proposedDraft: '',
    diffSegments: undefined as DiffSegment[] | undefined,
    diffSummary: undefined as DiffSummary | undefined
  });
  const [rowComparisonDialog, setRowComparisonDialog] = useState({
    open: false,
    originalRow: '',
    proposedRow: '',
    diffSegments: undefined as DiffSegment[] | undefined,
    diffSummary: undefined as DiffSummary | undefined
  });
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);

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

  // Get field order for consistent formatting
  const getFieldOrder = () => tableConfig.columns.map(col => col.id);

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
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.draft
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
    
    // If a row is selected, do row-specific review
    if (selectedRowIndex !== null) {
      await handleGenerateRowReview();
      return;
    }
    
    // Otherwise, do full table review
    setLoadingState('review', true);
    try {
      const result = await generateReview({ 
        draft: section.data.draft,
        sectionName: section.name,
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.review
      });
      onSectionUpdate(section.id, 'reviewNotes', result);
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setLoadingState('review', false);
    }
  };

  const handleGenerateRowReview = async () => {
    if (selectedRowIndex === null || !section.data.reviewNotes.trim()) return;
    
    const tableData = parseTableData(section.data.draft);
    const rowData = tableData.rows[selectedRowIndex];
    
    if (!rowData) return;
    
    setLoadingState('review', true);
    try {
      const result = await generateRowReviewWithDiff({
        rowData,
        rowIndex: selectedRowIndex,
        reviewNotes: section.data.reviewNotes,
        columns: tableConfig.columns,
        sectionName: section.name,
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.revision
      });
      
      // Open row comparison dialog using backend-formatted strings
      setRowComparisonDialog({
        open: true,
        originalRow: result.original_formatted,
        proposedRow: result.new_formatted,
        diffSegments: result.diff_segments,
        diffSummary: result.diff_summary
      });
    } catch (error) {
      console.error('Error generating row review:', error);
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
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.revision
      });
      
      // Open comparison dialog with diff data
      setComparisonDialog({
        open: true,
        proposedDraft: result.new_formatted || result.new_draft,
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
          sectionType: tableConfig.sectionType,
          guidelines: section.guidelines?.revision
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

  const handleRowSelect = (index: number) => {
    setSelectedRowIndex(index);
  };

  const handleAcceptRowChanges = () => {
    const tableData = parseTableData(section.data.draft);
    const updatedRows = [...tableData.rows];
    
    // Parse the new row data from the dialog
    try {
      const newRowData = JSON.parse(rowComparisonDialog.proposedRow);
      if (selectedRowIndex !== null && selectedRowIndex < updatedRows.length) {
        updatedRows[selectedRowIndex] = newRowData;
        const updatedTableData = { rows: updatedRows };
        onSectionUpdate(section.id, 'draft', JSON.stringify(updatedTableData));
      }
    } catch (error) {
      console.error('Error parsing row data:', error);
    }
    
    setRowComparisonDialog({ 
      open: false, 
      originalRow: '',
      proposedRow: '',
      diffSegments: undefined,
      diffSummary: undefined
    });
  };

  const handleCancelRowChanges = () => {
    setRowComparisonDialog({ 
      open: false, 
      originalRow: '',
      proposedRow: '',
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


  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Box display="flex" alignItems="center" style={{ marginBottom: '16px' }}>
            <Typography variant="h4" style={{ marginRight: '8px', marginBottom: 0 }}>
              {section.name} (Table)
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
            disabled={true}
            size="small"
            variant="outlined"
            placeholder="e.g., model_limitations, model_risk_issues"
            helperText="Template placeholder name for Word document"
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
            title={!hasTableData() ? "Table data required to complete" : ""}
            disableHoverListener={hasTableData() || section.isCompleted}
          >
            <span>
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
                      ) : selectedRowIndex !== null ? (
                        `Review Row #${selectedRowIndex + 1} →`
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
                    selectedRowIndex={selectedRowIndex ?? undefined}
                    onRowSelect={handleRowSelect}
                    showRowSelection={true}
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
        fieldOrder={getFieldOrder()}
        diffSegments={comparisonDialog.diffSegments}
        diffSummary={comparisonDialog.diffSummary}
      />
      
      <DraftComparisonDialog
        open={rowComparisonDialog.open}
        onClose={handleCancelRowChanges}
        onAccept={handleAcceptRowChanges}
        currentDraft={rowComparisonDialog.originalRow}
        proposedDraft={rowComparisonDialog.proposedRow}
        sectionName={`${section.name} - Row #${(selectedRowIndex ?? 0) + 1}`}
        isTable={true}
        fieldOrder={getFieldOrder()}
        diffSegments={rowComparisonDialog.diffSegments}
        diffSummary={rowComparisonDialog.diffSummary}
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

export default TableWorkflow;