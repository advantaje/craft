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
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl
} from '@material-ui/core';
import { Add as AddIcon, Check as CheckIcon, GetApp as DownloadIcon, Close as CloseIcon, Block as BlockIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { useDocumentSections } from '../hooks/useDocumentSections';
import { DocumentInfo, SectionData, TemplateInfo } from '../types/document.types';
import DocumentSetup from './DocumentSetup';
import SectionWorkflow from './SectionWorkflow';
import TableWorkflow from './TableWorkflow';
import FileGenerationModal from './FileGenerationModal';
import { getTableConfiguration } from '../config/tableConfigurations';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '../config/modelConfigurations';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  // Persistent state that survives browser sessions
  const [currentTab, setCurrentTab] = useLocalStorage<number>('craft-current-tab', 0);
  const [documentData, setDocumentData] = useLocalStorage<DocumentInfo | null>('craft-document-data', null);
  const [documentId, setDocumentId] = useLocalStorage<string>('craft-document-id', '');
  const [templateInfo, setTemplateInfo] = useLocalStorage<TemplateInfo>('craft-template-info', {
    name: 'template-tagged',
    type: 'default'
  });
  const [selectedModel, setSelectedModel] = useLocalStorage<string>(
    'craft-selected-model',
    DEFAULT_MODEL,
    {
      serialize: (value) => value,
      deserialize: (value) => {
        // Validate the model exists in available models
        return AVAILABLE_MODELS.some(m => m.id === value) ? value : DEFAULT_MODEL;
      }
    }
  );
  
  // Temporary UI state (doesn't need persistence)
  const [addTabDialog, setAddTabDialog] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [newTabTemplateTag, setNewTabTemplateTag] = useState('');
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; sectionId: string } | null>(null);
  
  const {
    sections,
    updateSectionData,
    updateSectionTemplateTag,
    updateSectionGuidelines,
    toggleSectionCompletion,
    addSection,
    removeSection,
    canRemoveSection,
    resetAllSections
  } = useDocumentSections();

  // Check if document setup is complete (document found + template selected/uploaded)
  const isDocumentSetupComplete = (): boolean => {
    const documentFound = documentData !== null;
    const templateReady = templateInfo.type === 'default' || 
                         (templateInfo.type === 'custom' && templateInfo.isUploaded === true);
    return documentFound && templateReady;
  };

  // Check if all sections are complete and document setup is done
  const isAllComplete = () => {
    const setupComplete = isDocumentSetupComplete();
    const sectionsComplete = sections.every(section => section.isCompleted);
    return setupComplete && sectionsComplete;
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
      const section = sections.find(s => s.id === sectionId);
      const confirmed = window.confirm(`Are you sure you want to remove the "${section?.name}" section?`);
      
      if (confirmed) {
        // If we're removing the currently active tab, switch to Home tab
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        if (currentTab === sectionIndex + 1) { // +1 because Home tab is index 0
          setCurrentTab(0);
        }
        removeSection(sectionId);
      }
    }
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      addSection(newTabName, newTabTemplateTag);
      setCurrentTab(sections.length + 1);
      setNewTabName('');
      setNewTabTemplateTag('');
    }
    setAddTabDialog(false);
  };

  const handleSectionUpdate = (sectionId: string, field: keyof SectionData, value: string) => {
    updateSectionData(sectionId, field, value);
  };

  const handleDocumentFound = (data: DocumentInfo | null) => {
    setDocumentData(data);
  };

  const handleTemplateChange = (newTemplateInfo: TemplateInfo) => {
    setTemplateInfo(newTemplateInfo);
  };

  const handleTabContextMenu = (event: React.MouseEvent, sectionId: string) => {
    event.preventDefault();
    const section = sections.find(s => s.id === sectionId);
    // Show context menu for all sections except normally completed ones (they can be excluded)
    // and excluded sections (they can be unexcluded)
    if (section) {
      setContextMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        sectionId
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleExcludeSection = () => {
    if (contextMenu) {
      const section = sections.find(s => s.id === contextMenu.sectionId);
      if (section?.completionType === 'empty') {
        // Unexclude the section
        toggleSectionCompletion(contextMenu.sectionId, 'unexclude');
      } else {
        // Exclude the section
        toggleSectionCompletion(contextMenu.sectionId, 'empty');
      }
      handleCloseContextMenu();
    }
  };

  const handleModelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newModel = event.target.value as string;
    setSelectedModel(newModel);
  };

  const handleClearAllData = () => {
    // Clear all localStorage data
    setDocumentData(null);
    setDocumentId('');
    setTemplateInfo({ name: 'template-tagged', type: 'default' });
    setCurrentTab(0);
    setSelectedModel(DEFAULT_MODEL);
    resetAllSections();
    
    // Close the dialog
    setShowClearDataDialog(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Left Section - App Title */}
          <Box display="flex" alignItems="center">
            <Typography variant="h6">
              CRAFT - Document Planning & Drafting
            </Typography>
          </Box>
          
          {/* Center Section - Document Info */}
          <Box display="flex" alignItems="center" justifyContent="center" style={{ flexGrow: 1 }}>
            {documentData && (
              <Box display="flex" alignItems="center" style={{ color: 'white' }}>
                {documentData['Review ID'] && (
                  <Typography variant="body2" style={{ marginRight: '1.5rem' }}>
                    <strong>Review ID:</strong> {documentData['Review ID'].value}
                  </Typography>
                )}
                {documentData['Model Name'] && (
                  <Typography variant="body2" style={{ marginRight: '1.5rem' }}>
                    <strong>Model Name:</strong> {documentData['Model Name'].value}
                  </Typography>
                )}
                {documentData['Review Lead'] && (
                  <Typography variant="body2">
                    <strong>Review Lead:</strong> {documentData['Review Lead'].value}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Right Section - Controls */}
          <Box display="flex" alignItems="center">
            {/* Model Selector */}
            <Box mr={1}>
              <FormControl variant="outlined" size="small">
                <Select
                  value={selectedModel}
                  onChange={handleModelChange}
                  style={{ 
                    color: 'white',
                    minWidth: 140,
                    fontSize: '0.875rem'
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        marginTop: '8px'
                      }
                    }
                  }}
                >
                  {AVAILABLE_MODELS.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Clear Data Button */}
            <Box>
              <Button
                size="small"
                onClick={() => setShowClearDataDialog(true)}
                style={{ 
                  color: 'white',
                  textTransform: 'none',
                  minWidth: 'auto',
                  padding: '4px 8px'
                }}
                startIcon={<DeleteIcon style={{ fontSize: '16px' }} />}
                title="Clear all saved data"
              >
                Clear Data
              </Button>
            </Box>
          </Box>
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
                  {isDocumentSetupComplete() && (
                    <CheckIcon 
                      style={{ marginLeft: '0.5rem', fontSize: '18px', color: '#4caf50' }} 
                    />
                  )}
                </Box>
              }
            />
            {sections.map((section) => (
              <Tab 
                key={section.id}
                onContextMenu={(e) => handleTabContextMenu(e, section.id)}
                label={
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    minWidth="120px" 
                    width="100%" 
                    position="relative"
                    paddingRight={canRemoveSection(section.id) ? "24px" : "0"}
                    style={{
                      padding: '4px 8px'
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <span style={{ 
                        marginRight: section.isCompleted ? '0.5rem' : '0',
                        color: section.completionType === 'empty' ? '#757575' : 'inherit'
                      }}>
                        {section.name}
                      </span>
                      {section.isCompleted && (
                        section.completionType === 'empty' ? (
                          <BlockIcon 
                            style={{ fontSize: '18px', color: '#757575' }} 
                          />
                        ) : (
                          <CheckIcon 
                            style={{ fontSize: '18px', color: '#4caf50' }} 
                          />
                        )
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
                  minWidth: '120px',
                  backgroundColor: section.completionType === 'empty' ? '#eeeeee' : 'transparent'
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
            <DocumentSetup 
              onDocumentFound={handleDocumentFound}
              documentId={documentId}
              setDocumentId={setDocumentId}
              documentData={documentData}
              templateInfo={templateInfo}
              onTemplateChange={handleTemplateChange}
            />
          </TabPanel>

          {sections.map((section, index) => (
            <TabPanel key={section.id} value={currentTab} index={index + 1}>
              {section.type === 'model_limitations' || section.type === 'model_risk_issues' ? (
                <TableWorkflow
                  section={section}
                  tableConfig={getTableConfiguration(section.type)}
                  onSectionUpdate={handleSectionUpdate}
                  onToggleCompletion={toggleSectionCompletion}
                  onTemplateTagUpdate={updateSectionTemplateTag}
                  onGuidelinesUpdate={updateSectionGuidelines}
                  selectedModel={selectedModel}
                />
              ) : (
                <SectionWorkflow
                  section={section}
                  onSectionUpdate={handleSectionUpdate}
                  onToggleCompletion={toggleSectionCompletion}
                  onTemplateTagUpdate={updateSectionTemplateTag}
                  onGuidelinesUpdate={updateSectionGuidelines}
                  selectedModel={selectedModel}
                />
              )}
            </TabPanel>
          ))}
        </Paper>

        {/* Global Tip */}
        <Box mt={4} mb={2} textAlign="center">
          <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
            💡 Need help? 
            <Button 
              component="a"
              href="/#/about"
              target="_blank"
              rel="noopener noreferrer"
              size="small" 
              style={{ 
                marginLeft: '0.5rem',
                textTransform: 'none',
                fontSize: 'inherit',
                fontStyle: 'italic',
                textDecoration: 'underline'
              }}
            >
              Learn more
            </Button>
          </Typography>
        </Box>
      </Container>

      <Dialog open={addTabDialog} onClose={() => { setAddTabDialog(false); setNewTabName(''); setNewTabTemplateTag(''); }}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            fullWidth
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <TextField
            margin="dense"
            label="Template Tag"
            fullWidth
            value={newTabTemplateTag}
            onChange={(e) => setNewTabTemplateTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTab()}
            placeholder="e.g., executive_summary, methodology"
            helperText="Template placeholder name for Word document (optional)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddTabDialog(false); setNewTabName(''); setNewTabTemplateTag(''); }}>Cancel</Button>
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
        templateInfo={templateInfo}
      />
      
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleExcludeSection}>
          {sections.find(s => s.id === contextMenu?.sectionId)?.completionType === 'empty' 
            ? '✅ Include Section'
            : '🚫 Exclude Section'
          }
        </MenuItem>
      </Menu>

      {/* Clear Data Confirmation Dialog */}
      <Dialog
        open={showClearDataDialog}
        onClose={() => setShowClearDataDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Clear All Saved Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Are you sure you want to clear all saved data? This will remove:
          </Typography>
          <Typography component="ul" variant="body2" style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
            <li>All section content (notes, drafts, reviews)</li>
            <li>Document setup information</li>
            <li>Template preferences</li>
            <li>Custom sections you've added</li>
            <li>Model selection</li>
          </Typography>
          <Typography variant="body2" color="error">
            <strong>This action cannot be undone.</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDataDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleClearAllData} 
            color="secondary"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Craft;