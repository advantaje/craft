import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Box,
  FormControl
} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import { TableColumn, TableData } from '../types/document.types';

interface TableEditorProps {
  data: TableData;
  columns: TableColumn[];
  onChange: (data: TableData) => void;
  readOnly?: boolean;
}

const TableEditor: React.FC<TableEditorProps> = ({ 
  data, 
  columns, 
  onChange, 
  readOnly = false 
}) => {
  const handleCellEdit = (rowIndex: number, columnId: string, value: string | number) => {
    const newRows = [...data.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [columnId]: value
    };
    onChange({ rows: newRows });
  };

  const addRow = () => {
    const newRow: { [key: string]: string | number } = {};
    columns.forEach(col => {
      if (col.type === 'number') {
        newRow[col.id] = 0;
      } else if (col.type === 'select' && col.options?.length) {
        newRow[col.id] = col.options[0];
      } else {
        newRow[col.id] = '';
      }
    });
    onChange({ rows: [...data.rows, newRow] });
  };

  const deleteRow = (rowIndex: number) => {
    const newRows = data.rows.filter((_, index) => index !== rowIndex);
    onChange({ rows: newRows });
  };

  return (
    <Box>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {columns.map(col => (
                <TableCell 
                  key={col.id} 
                  style={{ 
                    fontWeight: 'bold',
                    minWidth: col.width || 'auto'
                  }}
                >
                  {col.label}
                  {col.required && <span style={{ color: 'red' }}> *</span>}
                </TableCell>
              ))}
              {!readOnly && <TableCell style={{ fontWeight: 'bold', width: '80px' }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map(col => (
                  <TableCell key={col.id}>
                    {readOnly ? (
                      <span>{row[col.id]}</span>
                    ) : col.type === 'select' ? (
                      <FormControl fullWidth size="small">
                        <Select
                          value={row[col.id] || ''}
                          onChange={(e) => handleCellEdit(rowIndex, col.id, e.target.value as string)}
                          variant="outlined"
                        >
                          {col.options?.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        value={row[col.id] || ''}
                        onChange={(e) => handleCellEdit(rowIndex, col.id, e.target.value)}
                        type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                        fullWidth
                        size="small"
                        variant="outlined"
                        required={col.required}
                        InputLabelProps={col.type === 'date' ? { shrink: true } : undefined}
                      />
                    )}
                  </TableCell>
                ))}
                {!readOnly && (
                  <TableCell>
                    <IconButton 
                      onClick={() => deleteRow(rowIndex)} 
                      size="small"
                      color="secondary"
                      title="Delete row"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {data.rows.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (readOnly ? 0 : 1)} 
                  align="center"
                  style={{ padding: '2rem', color: '#999' }}
                >
                  No data available. {!readOnly && 'Click "Add Row" to start adding data.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {!readOnly && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addRow}
          >
            Add Row
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TableEditor;