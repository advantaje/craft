import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import { Check as CheckIcon, Close as CloseIcon } from '@material-ui/icons';
import { DiffSegment, DiffSummary } from '../types/document.types';
import DiffViewer, { DiffViewMode } from './DiffViewer';
import { dialogStyles } from '../utils/diffStyles';

interface DraftComparisonDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  currentDraft: string;
  proposedDraft: string;
  sectionName: string;
  isTable?: boolean;
  fieldOrder?: string[];
  diffSegments?: DiffSegment[];
  diffSummary?: DiffSummary;
}

const DraftComparisonDialog: React.FC<DraftComparisonDialogProps> = ({
  open,
  onClose,
  onAccept,
  currentDraft,
  proposedDraft,
  sectionName,
  isTable = false,
  fieldOrder,
  diffSegments,
  diffSummary
}) => {
  const [viewMode, setViewMode] = useState<DiffViewMode>('unified');

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  const handleViewModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewMode(event.target.value as DiffViewMode);
  };

  const renderSummary = (summary: DiffSummary) => (
    <Box style={dialogStyles.summary}>
      <Typography variant="body2" color="textSecondary">
        <strong>Changes Summary:</strong>{' '}
        <span style={{ color: '#4caf50' }}>+{summary.words_added} words</span>
        {summary.words_removed > 0 && (
          <>, <span style={{ color: '#f44336' }}>-{summary.words_removed} words</span></>
        )}
        {summary.words_unchanged > 0 && (
          <>, {summary.words_unchanged} unchanged</>
        )}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: dialogStyles.dialog
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Review Changes for "{sectionName}"
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {diffSegments ? 'Choose your preferred view mode below' : 'Compare the current version with the proposed changes'}
        </Typography>
        {diffSummary && renderSummary(diffSummary)}
        
        {/* View Mode Selector */}
        {diffSegments && (
          <Box style={dialogStyles.viewModeSelector}>
            <Typography variant="subtitle2" gutterBottom style={{ fontWeight: 'bold' }}>
              View Mode:
            </Typography>
            <RadioGroup 
              row 
              value={viewMode} 
              onChange={handleViewModeChange}
              style={{ marginTop: '8px' }}
            >
              <FormControlLabel 
                value="unified" 
                control={<Radio size="small" />} 
                label="Unified View" 
                style={{ marginRight: '24px' }}
              />
              <FormControlLabel 
                value="sideBySide" 
                control={<Radio size="small" />} 
                label="Side by Side" 
                style={{ marginRight: '24px' }}
              />
              <FormControlLabel 
                value="sideBySideDiff" 
                control={<Radio size="small" />} 
                label="Side by Side (Highlighted)" 
              />
            </RadioGroup>
          </Box>
        )}
      </DialogTitle>
      
      <DialogContent dividers style={{ padding: 0 }}>
        <DiffViewer
          currentContent={currentDraft}
          proposedContent={proposedDraft}
          isTable={isTable}
          fieldOrder={fieldOrder}
          diffSegments={diffSegments}
          viewMode={viewMode}
        />
      </DialogContent>
      
      <DialogActions style={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          style={{ marginRight: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
        >
          Accept Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DraftComparisonDialog;