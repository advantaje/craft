import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { DiffSegment } from '../types/document.types';
import { getDiffContainerStyle, getDiffSegmentStyle } from '../utils/diffStyles';
import { formatContent } from '../utils/jsonFormatter';

export type DiffViewMode = 'unified' | 'sideBySide' | 'sideBySideDiff';

interface DiffViewerProps {
  currentContent: string;
  proposedContent: string;
  isTable?: boolean;
  fieldOrder?: string[];
  diffSegments?: DiffSegment[];
  viewMode: DiffViewMode;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  currentContent,
  proposedContent,
  isTable = false,
  fieldOrder,
  diffSegments,
  viewMode
}) => {
  
  const renderContent = (content: string) => (
    <Box style={getDiffContainerStyle(isTable)}>
      {formatContent(content, isTable, fieldOrder)}
    </Box>
  );

  const renderDiffSegments = (segments: DiffSegment[]) => (
    <Box style={getDiffContainerStyle(isTable)}>
      {segments.map((segment, index) => (
        <span
          key={index}
          style={getDiffSegmentStyle(segment.type)}
        >
          {segment.text}
        </span>
      ))}
    </Box>
  );

  const splitDiffSegments = (segments: DiffSegment[]) => {
    const leftSegments: DiffSegment[] = [];
    const rightSegments: DiffSegment[] = [];
    
    segments.forEach(segment => {
      if (segment.type === 'removed' || segment.type === 'unchanged') {
        leftSegments.push(segment);
      }
      if (segment.type === 'added' || segment.type === 'unchanged') {
        rightSegments.push(segment);
      }
    });
    
    return { leftSegments, rightSegments };
  };

  const renderSplitDiffSegments = (segments: DiffSegment[], side: 'left' | 'right') => (
    <Box style={getDiffContainerStyle(isTable)}>
      {segments.map((segment, index) => (
        <span
          key={index}
          style={getDiffSegmentStyle(segment.type, side)}
        >
          {segment.text}
        </span>
      ))}
    </Box>
  );

  // Unified view - single pane with highlighted changes
  if (viewMode === 'unified' && diffSegments) {
    return (
      <Box p={2} style={{ height: '100%' }}>
        <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginBottom: '16px' }}>
          Proposed Changes (Highlighted)
        </Typography>
        {renderDiffSegments(diffSegments)}
      </Box>
    );
  }

  // Side-by-side view without highlighting
  if (viewMode === 'sideBySide' || (!diffSegments && viewMode === 'unified')) {
    return (
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={6} style={{ borderRight: '1px solid #e0e0e0' }}>
          <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#666' }}>
              Current Version
            </Typography>
            {renderContent(currentContent)}
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Proposed Changes
            </Typography>
            {renderContent(proposedContent)}
          </Box>
        </Grid>
      </Grid>
    );
  }

  // Side-by-side view with diff highlighting
  if (viewMode === 'sideBySideDiff' && diffSegments) {
    const { leftSegments, rightSegments } = splitDiffSegments(diffSegments);
    
    return (
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={6} style={{ borderRight: '1px solid #e0e0e0' }}>
          <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#b71c1c' }}>
              Current Version (Removals Highlighted)
            </Typography>
            {renderSplitDiffSegments(leftSegments, 'left')}
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Proposed Changes (Additions Highlighted)
            </Typography>
            {renderSplitDiffSegments(rightSegments, 'right')}
          </Box>
        </Grid>
      </Grid>
    );
  }

  // Fallback - render plain side-by-side
  return (
    <Grid container style={{ height: '100%' }}>
      <Grid item xs={6} style={{ borderRight: '1px solid #e0e0e0' }}>
        <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#666' }}>
            Current Version
          </Typography>
          {renderContent(currentContent)}
        </Box>
      </Grid>
      
      <Grid item xs={6}>
        <Box p={2} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#2e7d32' }}>
            Proposed Changes
          </Typography>
          {renderContent(proposedContent)}
        </Box>
      </Grid>
    </Grid>
  );
};

export default DiffViewer;