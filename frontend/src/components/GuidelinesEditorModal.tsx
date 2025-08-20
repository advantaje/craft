import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Tabs,
  Tab
} from '@material-ui/core';
import { Save as SaveIcon, Close as CloseIcon, Restore as RestoreIcon } from '@material-ui/icons';
import { SectionGuidelines } from '../config/defaultGuidelines';

interface GuidelinesEditorModalProps {
  open: boolean;
  onClose: () => void;
  guidelines: SectionGuidelines;
  onSave: (guidelines: SectionGuidelines) => void;
  sectionName: string;
  sectionType: string;
  defaultGuidelines: SectionGuidelines;
}

const GuidelinesEditorModal: React.FC<GuidelinesEditorModalProps> = ({
  open,
  onClose,
  guidelines,
  onSave,
  sectionName,
  sectionType,
  defaultGuidelines
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editedGuidelines, setEditedGuidelines] = useState<SectionGuidelines>(guidelines);

  // Update local state when guidelines prop changes
  useEffect(() => {
    setEditedGuidelines(guidelines);
  }, [guidelines]);

  const handleSave = () => {
    onSave(editedGuidelines);
    onClose();
  };

  const handleCancel = () => {
    setEditedGuidelines(guidelines); // Reset to original
    onClose();
  };

  const handleResetToDefault = () => {
    setEditedGuidelines(defaultGuidelines);
  };

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const updateGuideline = (operation: keyof SectionGuidelines, value: string) => {
    setEditedGuidelines(prev => ({
      ...prev,
      [operation]: value
    }));
  };

  const operationLabels = {
    draft: 'Draft Writing', 
    review: 'Review & Feedback',
    revision: 'Revision Process'
  };

  const operationDescriptions = {
    draft: 'Instructions for writing the section content from notes',
    review: 'Instructions for reviewing and providing feedback on the draft',
    revision: 'Instructions for revising the draft based on feedback'
  };

  const operations: (keyof SectionGuidelines)[] = ['draft', 'review', 'revision'];

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          height: '80vh',
          maxHeight: '700px'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Edit Guidelines for "{sectionName}"
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '4px' }}>
          Customize how AI generates content for this section. Draft guidelines are used for initial content creation.
        </Typography>
      </DialogTitle>

      <DialogContent dividers style={{ padding: 0 }}>
        <Box style={{ borderBottom: '1px solid #e0e0e0' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {operations.map((operation, index) => (
              <Tab
                key={operation}
                label={operationLabels[operation]}
                id={`guidelines-tab-${index}`}
                aria-controls={`guidelines-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {operations.map((operation, index) => (
          <Box
            key={operation}
            role="tabpanel"
            hidden={currentTab !== index}
            id={`guidelines-tabpanel-${index}`}
            aria-labelledby={`guidelines-tab-${index}`}
            style={{ padding: '24px', height: '100%' }}
          >
            {currentTab === index && (
              <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                  {operationLabels[operation]}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
                  {operationDescriptions[operation]}
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={24}
                  variant="outlined"
                  value={editedGuidelines[operation]}
                  onChange={(e) => updateGuideline(operation, e.target.value)}
                  placeholder={`Enter guidelines for ${operation} generation...`}
                  style={{ flex: 1 }}
                  helperText="These instructions will be included in the AI prompt for this operation"
                />
              </Box>
            )}
          </Box>
        ))}
      </DialogContent>

      <DialogActions style={{ padding: '16px 24px' }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            onClick={handleResetToDefault}
            startIcon={<RestoreIcon />}
            style={{ color: '#666' }}
          >
            Reset to Default
          </Button>
          
          <Box>
            <Button
              onClick={handleCancel}
              startIcon={<CloseIcon />}
              style={{ marginRight: '8px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save Guidelines
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default GuidelinesEditorModal;