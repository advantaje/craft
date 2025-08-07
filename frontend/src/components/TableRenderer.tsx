import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import { TableColumn, TableData } from '../types/document.types';

interface TableRendererProps {
  content: string;
  title: string;
  columns: TableColumn[];
}

const TableRenderer: React.FC<TableRendererProps> = ({ content, title, columns }) => {
  let tableData: TableData = { rows: [] };
  
  try {
    tableData = JSON.parse(content);
  } catch (error) {
    console.error('Error parsing table data:', error);
  }

  return (
    <Card elevation={3} style={{ marginTop: '2rem' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" style={{ marginRight: '0.5rem' }} />
            <Typography variant="h5">Final Document: {title}</Typography>
          </Box>
        }
        subheader="Completed table ready for use"
        style={{ backgroundColor: '#f5f5f5' }}
      />
      <CardContent style={{ padding: '2rem' }}>
        <Paper elevation={1} style={{ padding: '2rem', backgroundColor: '#fafafa' }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            style={{ marginBottom: '2rem', textAlign: 'center', color: '#1976d2' }}
          >
            {title}
          </Typography>
          <Divider style={{ marginBottom: '2rem' }} />
          
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead style={{ backgroundColor: '#e3f2fd' }}>
                <TableRow>
                  {columns.map(col => (
                    <TableCell 
                      key={col.id} 
                      style={{ 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#1976d2'
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.rows.map((row, idx) => (
                  <TableRow key={idx} hover>
                    {columns.map(col => (
                      <TableCell key={col.id} style={{ fontSize: '15px' }}>
                        {row[col.id] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {tableData.rows.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length} 
                      align="center"
                      style={{ padding: '2rem', color: '#999' }}
                    >
                      No data in table
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box mt={2} style={{ textAlign: 'right', color: '#666', fontSize: '14px' }}>
            Total rows: {tableData.rows.length}
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default TableRenderer;