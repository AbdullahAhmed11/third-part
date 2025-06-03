import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Checkbox,
  IconButton,
  Tooltip
} from '@mui/material';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Menu, MenuItem, ListItemIcon } from '@mui/material';
import { MdDelete, MdEdit, MdVisibility, MdNotInterested } from 'react-icons/md';

const DynamicTable = ({
  columns,
  data,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onNotActive, // New prop
  showNotActive = false, // New prop (default false)
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAllRows,
  sortable = false,
  sortField = '',
  sortDirection = 'asc',
  onSort,
  pagination = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount = 0,
  emptyMessage = 'No data available',
  showActions = true,
  dense = false
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleSort = (field) => {
    if (sortable && onSort) {
      const isAsc = sortField === field && sortDirection === 'asc';
      onSort(field, isAsc ? 'desc' : 'asc');
    }
  };

  const handleSelectAll = (event) => {
    if (selectable && onSelectAllRows) {
      onSelectAllRows(event.target.checked ? data.map(row => row.id) : []);
    }
  };

  const handleSelectRow = (event, id) => {
    if (selectable && onSelectRow) {
      event.stopPropagation();
      const selectedIndex = selectedRows.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedRows, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedRows.slice(1));
      } else if (selectedIndex === selectedRows.length - 1) {
        newSelected = newSelected.concat(selectedRows.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedRows.slice(0, selectedIndex),
          selectedRows.slice(selectedIndex + 1),
        );
      }

      onSelectRow(newSelected);
    }
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', background: "#f3f4f6" }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader aria-label="dynamic table" size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={sortField === column.field}
                      direction={sortField === column.field ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}

              {showActions && (onEdit || onDelete || onView || onNotActive) && (
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    selected={isItemSelected}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) => handleSelectRow(event, row.id)}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => (
                      <TableCell key={`${row.id}-${column.field}`} align={column.align || 'left'}>
                        {column.renderCell ? column.renderCell(row) : row[column.field]}
                      </TableCell>
                    ))}

                    {showActions && (onEdit || onDelete || onView || onNotActive) && (
                      <TableCell align="right">
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, row);
                            }}
                          >
                            <HiOutlineDotsVertical />
                          </IconButton>
                        </div>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedRow?.id === row.id}
                          onClose={handleMenuClose}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onView && (
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(selectedRow);
                                handleMenuClose();
                              }}
                            >
                              <ListItemIcon>
                                <MdVisibility fontSize="small" />
                              </ListItemIcon>
                              View
                            </MenuItem>
                          )}
                          {onEdit && (
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(selectedRow);
                                handleMenuClose();
                              }}
                            >
                              <ListItemIcon>
                                <MdEdit fontSize="small" />
                              </ListItemIcon>
                              Edit
                            </MenuItem>
                          )}
                          {showNotActive && onNotActive && (
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotActive(selectedRow);
                                handleMenuClose();
                              }}
       sx={{ color: '#F54135' }}                            >
                              <ListItemIcon>
                                <MdNotInterested fontSize="small" style={{ color: '#F54135' }} />
                              </ListItemIcon>
                              Not Active
                            </MenuItem>
                          )}
                          {onDelete && (
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(selectedRow);
                                handleMenuClose();
                              }}
                              sx={{ color: '#F54135' }}
                            >
                              <ListItemIcon>
                                <MdDelete fontSize="small" style={{ color: '#F54135' }} />
                              </ListItemIcon>
                              Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
};

export default DynamicTable;