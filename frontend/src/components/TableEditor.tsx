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
  FormControl,
  Checkbox
} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import { TableColumn, TableData } from '../types/document.types';

interface TableEditorProps {
  data: TableData;
  columns: TableColumn[];
  onChange: (data: TableData) => void;
  readOnly?: boolean;
  selectedRowIndices?: number[];
  onRowSelect?: (indices: number[]) => void;
  showRowSelection?: boolean;
}

const TableEditor: React.FC<TableEditorProps> = ({ 
  data, 
  columns, 
  onChange, 
  readOnly = false,
  selectedRowIndices = [],
  onRowSelect,
  showRowSelection = false
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

  const handleRowSelection = (rowIndex: number) => {
    if (!onRowSelect) return;
    
    const isSelected = selectedRowIndices.includes(rowIndex);
    let newSelection: number[];
    
    if (isSelected) {
      // Remove from selection
      newSelection = selectedRowIndices.filter(index => index !== rowIndex);
    } else {
      // Add to selection
      newSelection = [...selectedRowIndices, rowIndex];
    }
    
    onRowSelect(newSelection);
  };

  const handleSelectAll = () => {
    if (!onRowSelect) return;
    
    const allSelected = selectedRowIndices.length === data.rows.length;
    if (allSelected) {
      // Deselect all
      onRowSelect([]);
    } else {
      // Select all
      onRowSelect(data.rows.map((_, index) => index));
    }
  };

  const isAllSelected = selectedRowIndices.length === data.rows.length && data.rows.length > 0;
  const isIndeterminate = selectedRowIndices.length > 0 && selectedRowIndices.length < data.rows.length;

  return (
    <Box>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {showRowSelection && (
                <TableCell style={{ fontWeight: 'bold', width: '50px' }}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    size="small"
                    color="primary"
                  />
                </TableCell>
              )}
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
              <TableRow 
                key={rowIndex} 
                hover
                style={{
                  backgroundColor: selectedRowIndices.includes(rowIndex) ? '#e3f2fd' : 'transparent'
                }}
              >
                {showRowSelection && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRowIndices.includes(rowIndex)}
                      onChange={() => handleRowSelection(rowIndex)}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                )}
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
                        multiline={col.id === 'description'}
                        rows={col.id === 'description' ? 3 : 1}
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
                  colSpan={columns.length + (readOnly ? 0 : 1) + (showRowSelection ? 1 : 0)} 
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