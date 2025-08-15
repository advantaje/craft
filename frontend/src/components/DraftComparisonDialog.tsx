import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  Box,
  Divider,
  Paper
} from '@material-ui/core';
import { Check as CheckIcon, Close as CloseIcon } from '@material-ui/icons';
import { DiffSegment, DiffSummary } from '../types/document.types';

interface DraftComparisonDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  currentDraft: string;
  proposedDraft: string;
  sectionName: string;
  isTable?: boolean;
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
  diffSegments,
  diffSummary
}) => {
  const handleAccept = () => {
    onAccept();
    onClose();
  };

  const formatContent = (content: string) => {
    if (isTable) {
      try {
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return content;
      }
    }
    return content;
  };

  const renderDiffContent = (segments: DiffSegment[]) => {
    return (
      <Box
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: isTable ? 'monospace' : 'inherit',
          fontSize: isTable ? '0.875rem' : 'inherit',
          padding: '12px',
          backgroundColor: '#fafafa',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          height: '100%',
          overflow: 'auto'
        }}
      >
        {segments.map((segment, index) => (
          <span
            key={index}
            style={{
              backgroundColor:
                segment.type === 'added' ? '#d4f4dd' :
                segment.type === 'removed' ? '#ffebee' :
                'transparent',
              textDecoration: segment.type === 'removed' ? 'line-through' : 'none',
              color:
                segment.type === 'added' ? '#1b5e20' :
                segment.type === 'removed' ? '#b71c1c' :
                'inherit',
              borderBottom: segment.type === 'added' ? '1px solid #4caf50' : 'none'
            }}
          >
            {isTable ? formatContent(segment.text) : segment.text}
          </span>
        ))}
      </Box>
    );
  };

  const renderSummary = (summary: DiffSummary) => (
    <Box mb={2} p={2} style={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
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
        style: {
          height: '80vh',
          maxHeight: '800px'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Review Changes for "{sectionName}"
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {diffSegments ? 'Differences are highlighted below' : 'Compare the current version with the proposed changes'}
        </Typography>
        {diffSummary && renderSummary(diffSummary)}
      </DialogTitle>
      
      <DialogContent dividers style={{ padding: 0 }}>
        {diffSegments ? (
          // Unified diff view with highlights
          <Box p={2} style={{ height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              Proposed Changes (Highlighted)
            </Typography>
            {renderDiffContent(diffSegments)}
          </Box>
        ) : (
          // Side-by-side comparison (fallback)
          <Grid container style={{ height: '100%' }}>
            <Grid item xs={6} style={{ borderRight: '1px solid #e0e0e0' }}>
              <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#666' }}>
                  Current Version
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  value={formatContent(currentDraft)}
                  InputProps={{
                    readOnly: true,
                    style: {
                      fontFamily: isTable ? 'monospace' : 'inherit',
                      fontSize: isTable ? '0.875rem' : 'inherit'
                    }
                  }}
                  style={{ flex: 1 }}
                  inputProps={{
                    style: {
                      height: '100%',
                      overflow: 'auto'
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  Proposed Changes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  value={formatContent(proposedDraft)}
                  InputProps={{
                    readOnly: true,
                    style: {
                      fontFamily: isTable ? 'monospace' : 'inherit',
                      fontSize: isTable ? '0.875rem' : 'inherit',
                      backgroundColor: '#f8fff8'
                    }
                  }}
                  style={{ flex: 1 }}
                  inputProps={{
                    style: {
                      height: '100%',
                      overflow: 'auto'
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}
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