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
  TextField
} from '@material-ui/core';
import { Add as AddIcon, Check as CheckIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useDocumentSections } from '../hooks/useDocumentSections';
import { DocumentInfo, SectionData } from '../types/document.types';
import DocumentLookup from './DocumentLookup';
import SectionWorkflow from './SectionWorkflow';

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
  
  const {
    sections,
    updateSectionData,
    toggleSectionCompletion,
    addSection
  } = useDocumentSections();

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === sections.length + 1) {
      setAddTabDialog(true);
    } else {
      setCurrentTab(newValue);
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

  const handleDocumentFound = (data: DocumentInfo) => {
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
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label={
                <Box display="flex" alignItems="center">
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
                  <Box display="flex" alignItems="center">
                    <span>{section.name}</span>
                    {section.isCompleted && (
                      <CheckIcon 
                        color="primary" 
                        style={{ marginLeft: '0.5rem', fontSize: '18px' }} 
                      />
                    )}
                  </Box>
                }
              />
            ))}
            <Tab 
              icon={<AddIcon />} 
              aria-label="add section"
              style={{ minWidth: 'auto' }}
            />
          </Tabs>
          
          <TabPanel value={currentTab} index={0}>
            <DocumentLookup onDocumentFound={handleDocumentFound} />
          </TabPanel>

          {sections.map((section, index) => (
            <TabPanel key={section.id} value={currentTab} index={index + 1}>
              <SectionWorkflow
                section={section}
                onSectionUpdate={handleSectionUpdate}
                onToggleCompletion={toggleSectionCompletion}
              />
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
    </>
  );
};

export default Craft;