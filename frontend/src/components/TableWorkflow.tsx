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
  IconButton,
  Tooltip
} from '@material-ui/core';
import { 
  Refresh as RefreshIcon, 
  Check as CheckIcon, 
  Block as BlockIcon,
  Settings as SettingsIcon 
} from '@material-ui/icons';
import { DocumentSection, SectionData, TableData, DiffSegment, DiffSummary } from '../types/document.types';
import { TableConfiguration } from '../config/tableConfigurations';
import { 
  generateDraftFromNotes, 
  generateReview,
  generateRowFromReviewWithDiff,
  generateTableFromReviewWithDiff 
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
  onSelectedRowsUpdate: (sectionId: string, selectedRows: number[]) => void;
  onSelectedRowsClear: (sectionId: string) => void;
  onToggleCompletion: (sectionId: string, completionType?: 'normal' | 'empty' | 'unexclude') => void;
  onTemplateTagUpdate: (sectionId: string, templateTag: string) => void;
  onGuidelinesUpdate: (sectionId: string, guidelines: any) => void;
  selectedModel: string;
}

const TableWorkflow: React.FC<TableWorkflowProps> = ({
  section,
  tableConfig,
  onSectionUpdate,
  onSelectedRowsUpdate,
  onSelectedRowsClear,
  onToggleCompletion,
  onTemplateTagUpdate,
  onGuidelinesUpdate,
  selectedModel
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  // Use persistent selected rows from section data instead of local state
  const selectedRowIndices = section.data.selectedRows || [];
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
    
    setLoadingState('notes', true);
    try {
      const result = await generateDraftFromNotes({ 
        notes: section.data.notes,
        sectionName: section.name,
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.draft,
        modelId: selectedModel
      });
      onSectionUpdate(section.id, 'draft', result);
      // Clear row selection when generating new table since content is completely replaced
      onSelectedRowsClear(section.id);
    } catch (error) {
      console.error('Error generating table data:', error);
    } finally {
      setLoadingState('notes', false);
    }
  };


  const handleGenerateTableReview = async () => {
    if (!section.data.draft.trim()) return;
    
    setLoadingState('generate-table-review', true);
    try {
      const result = await generateReview({ 
        draft: section.data.draft,
        sectionName: section.name,
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.review,
        modelId: selectedModel
      });
      onSectionUpdate(section.id, 'reviewNotes', result);
    } catch (error) {
      console.error('Error generating table review:', error);
    } finally {
      setLoadingState('generate-table-review', false);
    }
  };

  const handleGenerateSelectedRowsReview = async () => {
    if (!section.data.draft.trim() || selectedRowIndices.length === 0) return;
    
    const tableData = parseTableData(section.data.draft);
    
    setLoadingState('generate-selected-review', true);
    try {
      // Create subset table with selected rows
      const selectedRows = selectedRowIndices.map(index => tableData.rows[index]).filter(row => row);
      const subsetTable = { rows: selectedRows };
      const draftToReview = JSON.stringify(subsetTable);
      
      const result = await generateReview({ 
        draft: draftToReview,
        sectionName: `${section.name} - Selected Rows`,
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.review,
        modelId: selectedModel
      });
      onSectionUpdate(section.id, 'reviewNotes', result);
    } catch (error) {
      console.error('Error generating selected rows review:', error);
    } finally {
      setLoadingState('generate-selected-review', false);
    }
  };

  const handleApplyTableReview = async () => {
    if (!section.data.draft.trim() || !section.data.reviewNotes.trim()) return;
    
    setLoadingState('apply-table-review', true);
    try {
      const result = await generateTableFromReviewWithDiff({
        draft: section.data.draft,
        reviewNotes: section.data.reviewNotes,
        sectionName: section.name,
        sectionType: tableConfig.sectionType,
        guidelines: section.guidelines?.revision,
        modelId: selectedModel
      });
      
      // Open comparison dialog for table with diff data
      setComparisonDialog({
        open: true,
        proposedDraft: result.new_draft,
        diffSegments: result.diff_segments,
        diffSummary: result.diff_summary
      });
    } catch (error) {
      console.error('Error applying table review:', error);
    } finally {
      setLoadingState('apply-table-review', false);
    }
  };

  const handleApplySelectedRowsReview = async () => {
    if (selectedRowIndices.length === 0 || !section.data.reviewNotes.trim()) return;
    
    const tableData = parseTableData(section.data.draft);
    
    setLoadingState('apply-selected-review', true);
    try {
      if (selectedRowIndices.length === 1) {
        // Single row: use existing row-specific API for better UX
        const rowIndex = selectedRowIndices[0];
        const rowData = tableData.rows[rowIndex];
        
        if (!rowData) return;
        
        const result = await generateRowFromReviewWithDiff({
          rowData,
          rowIndex,
          reviewNotes: section.data.reviewNotes,
          columns: tableConfig.columns,
          sectionName: section.name,
          sectionType: tableConfig.sectionType,
          guidelines: section.guidelines?.revision,
          fullTableData: tableData,
          modelId: selectedModel
        });
        
        // Open row comparison dialog using backend-formatted strings
        setRowComparisonDialog({
          open: true,
          originalRow: result.original_formatted,
          proposedRow: result.new_formatted,
          diffSegments: result.diff_segments,
          diffSummary: result.diff_summary
        });
      } else {
        // Multiple rows: create subset table and use table API
        const selectedRows = selectedRowIndices.map(index => tableData.rows[index]).filter(row => row);
        const subsetTable = { rows: selectedRows };
        const draftToApply = JSON.stringify(subsetTable);
        
        const result = await generateTableFromReviewWithDiff({
          draft: draftToApply,
          reviewNotes: section.data.reviewNotes,
          sectionName: `${section.name} - Selected Rows`,
          sectionType: tableConfig.sectionType,
          guidelines: section.guidelines?.revision,
          modelId: selectedModel
        });
        
        // Parse the reviewed subset returned by LLM
        const reviewedSubset = JSON.parse(result.new_draft);
        
        // Merge reviewed subset back into original table
        const mergedTable = [...tableData.rows];
        const sortedIndices = [...selectedRowIndices].sort((a, b) => a - b);
        
        // Remove original selected rows (in reverse order to maintain indices)
        for (let i = sortedIndices.length - 1; i >= 0; i--) {
          mergedTable.splice(sortedIndices[i], 1);
        }
        
        // Insert reviewed rows at the position where the first selected row was
        const insertPosition = sortedIndices[0];
        mergedTable.splice(insertPosition, 0, ...reviewedSubset.rows);
        
        const finalTable = { rows: mergedTable };
        const finalTableString = JSON.stringify(finalTable);
        
        // Reuse diff segments from the subset comparison
        const diffSegments = result.diff_segments;
        
        // Open comparison dialog with merged table
        setComparisonDialog({
          open: true,
          proposedDraft: finalTableString,
          diffSegments: diffSegments,
          diffSummary: result.diff_summary
        });
      }
    } catch (error) {
      console.error('Error applying selected rows review:', error);
    } finally {
      setLoadingState('apply-selected-review', false);
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
    // Clear selection after applying changes
    onSelectedRowsClear(section.id);
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

  const handleRowSelect = (indices: number[]) => {
    onSelectedRowsUpdate(section.id, indices);
  };

  const handleAcceptRowChanges = () => {
    const tableData = parseTableData(section.data.draft);
    const updatedRows = [...tableData.rows];
    
    // Parse the new row data from the dialog - now handles multiple rows
    try {
      const parsedData = JSON.parse(rowComparisonDialog.proposedRow);
      
      // Determine if we have single or multiple rows
      let newRows: any[];
      if (Array.isArray(parsedData)) {
        // Direct array of rows
        newRows = parsedData;
      } else if (parsedData.rows && Array.isArray(parsedData.rows)) {
        // Table format with rows array
        newRows = parsedData.rows;
      } else {
        // Single row object
        newRows = [parsedData];
      }
      
      // Replace the original selected row with all new rows
      if (selectedRowIndices.length > 0 && selectedRowIndices[0] < updatedRows.length) {
        const insertIndex = selectedRowIndices[0];
        // Remove 1 row at insertIndex and insert all new rows
        updatedRows.splice(insertIndex, 1, ...newRows);
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
    // Clear selection after applying changes
    onSelectedRowsClear(section.id);
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
                  disabled={!section.data.notes.trim() || loading['notes']}
                  size="small"
                >
                  {loading['notes'] ? (
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
                rows={24}
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
                    <Box display="flex" style={{ gap: '8px' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleGenerateTableReview}
                        disabled={!section.data.draft.trim() || !hasTableData() || loading['generate-table-review']}
                        size="small"
                      >
                        {loading['generate-table-review'] ? (
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
                        onClick={handleGenerateSelectedRowsReview}
                        disabled={selectedRowIndices.length === 0 || !hasTableData() || loading['generate-selected-review']}
                        size="small"
                      >
                        {loading['generate-selected-review'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Reviewing...
                          </>
                        ) : (
                          `Review Selected (${selectedRowIndices.length})`
                        )}
                      </Button>
                    </Box>
                  </Box>
                  
                  <TableEditor
                    data={parseTableData(section.data.draft)}
                    columns={tableConfig.columns}
                    onChange={handleTableChange}
                    readOnly={false}
                    selectedRowIndices={selectedRowIndices}
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
                    <Box display="flex" style={{ gap: '8px' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyTableReview}
                        disabled={!section.data.draft.trim() || !hasTableData() || !section.data.reviewNotes.trim() || loading['apply-table-review']}
                        startIcon={<RefreshIcon />}
                        size="small"
                      >
                        {loading['apply-table-review'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Updating...
                          </>
                        ) : (
                          '← Apply & Update Table'
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleApplySelectedRowsReview}
                        disabled={selectedRowIndices.length === 0 || !hasTableData() || !section.data.reviewNotes.trim() || loading['apply-selected-review']}
                        startIcon={<RefreshIcon />}
                        size="small"
                      >
                        {loading['apply-selected-review'] ? (
                          <>
                            <CircularProgress size={16} style={{ marginRight: '0.5rem' }} />
                            Applying...
                          </>
                        ) : (
                          `← Apply to Selected (${selectedRowIndices.length})`
                        )}
                      </Button>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={24}
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
        sectionName={`${section.name} - ${selectedRowIndices.length === 1 ? `Row #${selectedRowIndices[0] + 1}` : `Selected Rows`}`}
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