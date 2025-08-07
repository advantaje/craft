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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@material-ui/core';
import { Add as AddIcon, Check as CheckIcon, GetApp as DownloadIcon, Close as CloseIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useDocumentSections } from '../hooks/useDocumentSections';
import { DocumentInfo, SectionData } from '../types/document.types';
import DocumentLookup from './DocumentLookup';
import SectionWorkflow from './SectionWorkflow';
import TableWorkflow from './TableWorkflow';
import FileGenerationModal from './FileGenerationModal';
import { getTableConfiguration } from '../config/tableConfigurations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
};

const Craft: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [addTabDialog, setAddTabDialog] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [documentData, setDocumentData] = useState<DocumentInfo | null>(null);
  const [documentId, setDocumentId] = useState('');
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  
  const {
    sections,
    updateSectionData,
    toggleSectionCompletion,
    addSection,
    removeSection,
    canRemoveSection
  } = useDocumentSections();

  // Check if all sections are complete and document lookup is done
  const isAllComplete = () => {
    const homeComplete = documentData !== null;
    const sectionsComplete = sections.every(section => section.isCompleted);
    return homeComplete && sectionsComplete;
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === sections.length + 1) {
      setAddTabDialog(true);
    } else {
      setCurrentTab(newValue);
    }
  };

  const handleRemoveSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (canRemoveSection(sectionId)) {
      // If we're removing the currently active tab, switch to Home tab
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      if (currentTab === sectionIndex + 1) { // +1 because Home tab is index 0
        setCurrentTab(0);
      }
      removeSection(sectionId);
    }
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      addSection(newTabName);
      setCurrentTab(sections.length + 1);
      setNewTabName('');
    }
    setAddTabDialog(false);
  };

  const handleSectionUpdate = (sectionId: string, field: keyof SectionData, value: string) => {
    updateSectionData(sectionId, field, value);
  };

  const handleDocumentFound = (data: DocumentInfo | null) => {
    setDocumentData(data);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CRAFT - Document Planning & Drafting
          </Typography>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" style={{ marginTop: '1rem' }}>
        <Paper elevation={1}>
          <Box display="flex" alignItems="center">
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              style={{ flex: 1 }}
            >
            <Tab 
              label={
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                  <span>Home</span>
                  {documentData && (
                    <CheckIcon 
                      color="primary" 
                      style={{ marginLeft: '0.5rem', fontSize: '18px' }} 
                    />
                  )}
                </Box>
              }
            />
            {sections.map((section) => (
              <Tab 
                key={section.id} 
                label={
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    minWidth="120px" 
                    width="100%" 
                    position="relative"
                    paddingRight={canRemoveSection(section.id) ? "24px" : "0"}
                  >
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <span style={{ marginRight: section.isCompleted ? '0.5rem' : '0' }}>{section.name}</span>
                      {section.isCompleted && (
                        <CheckIcon 
                          color="primary" 
                          style={{ fontSize: '18px' }} 
                        />
                      )}
                    </Box>
                    {canRemoveSection(section.id) && (
                      <Box position="absolute" right="2px" top="50%" style={{ transform: 'translateY(-50%)' }}>
                        <IconButton
                          size="small"
                          onClick={(e: React.MouseEvent) => handleRemoveSection(section.id, e)}
                          title={`Remove ${section.name} section`}
                          style={{
                            padding: '2px',
                            width: '20px',
                            height: '20px'
                          }}
                        >
                          <CloseIcon 
                            style={{ 
                              fontSize: '12px',
                              opacity: 0.7
                            }}
                          />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                }
                style={{ 
                  marginRight: '8px',
                  minWidth: '120px'
                }}
              />
            ))}
            <Tab 
              icon={<AddIcon />} 
              aria-label="add section"
              style={{ minWidth: 'auto' }}
            />
            </Tabs>
            
            {isAllComplete() && (
              <Box ml={2} mr={2}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => setShowGenerationModal(true)}
                  style={{ 
                    backgroundColor: '#4caf50',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  title="Generate Document - All sections complete!"
                >
                  Generate Document
                </Button>
              </Box>
            )}
          </Box>
          
          <TabPanel value={currentTab} index={0}>
            <DocumentLookup 
              onDocumentFound={handleDocumentFound}
              documentId={documentId}
              setDocumentId={setDocumentId}
              documentData={documentData}
            />
          </TabPanel>

          {sections.map((section, index) => (
            <TabPanel key={section.id} value={currentTab} index={index + 1}>
              {section.type === 'limitations' || section.type === 'risk' ? (
                <TableWorkflow
                  section={section}
                  tableConfig={getTableConfiguration(section.type)}
                  onSectionUpdate={handleSectionUpdate}
                  onToggleCompletion={toggleSectionCompletion}
                />
              ) : (
                <SectionWorkflow
                  section={section}
                  onSectionUpdate={handleSectionUpdate}
                  onToggleCompletion={toggleSectionCompletion}
                />
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

      <FileGenerationModal
        open={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        documentId={documentId}
        documentData={documentData}
        sections={sections}
      />
    </>
  );
};

export default Craft;