import { Table, TableRow, TablePagination, TableHead, TableContainer, TableCell, TableBody } from '@material-ui/core';

const AllListings = () => {

  const columns = [
    { id: 'id', label: 'ID', width: 70 },
    { id: 'firstName', label: 'First name', width: 130 },
    { id: 'lastName', label: 'Last name', width: 130 },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      width: 90,
    },
    {
      id: 'fullName',
      label: 'Full name',
      width: 160,
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  return (
    <>
      
    </>
  )
}

export default AllListings