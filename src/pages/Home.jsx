import React, {useState} from 'react'
import Navbar from '../component/Navbar'
import Sidebar from '../component/Sidebar'
import MainLayout from '../component/MainLayout'
import DynamicTable from '../component/DynamicTable'

const Home = () => {
    const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    // ... more users
  ]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'email', headerName: 'Email', sortable: true },
    { 
      field: 'role', 
      headerName: 'Role', 
      sortable: true,
      renderCell: (row) => <span style={{ color: row.role === 'Admin' ? 'green' : 'inherit' }}>{row.role}</span>
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      align: 'center',
      renderCell: (row) => (
        <span style={{ 
          color: row.status === 'Active' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {row.status}
        </span>
      )
    },
  ];

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    // Here you would typically sort your data or call an API
    const sortedUsers = [...users].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
    // Open edit dialog or navigate to edit page
  }; 

  const handleDelete = (user) => {
    console.log('Delete user:', user);
    // Show confirmation dialog and then delete
    setUsers(users.filter(u => u.id !== user.id));
  };

  const handleView = (user) => {
    console.log('View user:', user);
    // Navigate to user details page
  };

  const handleRowClick = (user) => {
    console.log('Row clicked:', user);
    // Optional: Handle row click (e.g., navigate to details)
  };

  const handleSelectRow = (selectedIds) => {
    setSelectedUsers(selectedIds);
  };

  const handleSelectAllRows = (selectedIds) => {
    setSelectedUsers(selectedIds);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // Typically you would fetch data for the new page here
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Typically you would fetch data with the new rows per page here
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>
      <DynamicTable
        columns={columns}
        data={users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        selectable={true}
        selectedRows={selectedUsers}
        onSelectRow={handleSelectRow}
        onSelectAllRows={handleSelectAllRows}
        sortable={true}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={users.length}
        emptyMessage="No users found"
        showActions={true}
      />
    </div>
  )
}

export default Home