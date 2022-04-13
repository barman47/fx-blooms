import { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { COLORS } from '../../../utils/constants';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';


const useStyles = makeStyles(theme =>({
    root: {
        padding: [[theme.spacing(2), theme.spacing(3)]],
  
        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
        },
  
        '& h6': {
            fontWeight: 600
        },
    },
  
    title: {
      fontWeight: 600
  },
  
    tabContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing(4),
        marginTop: theme.spacing(2)
    },
  
    tab: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),
  
        '& span:first-child': {
            fontWeight: 600,
            color: theme.palette.primary.main
        },
  
        '& span:last-child': {
            color: theme.palette.primary.main,
            fontWeight: 600
        }
    },
  
    active: {
        backgroundColor: theme.palette.primary.main,
        
        '& span': {
            color: `${COLORS.offWhite} !important`,
        }
    },
  
    container: {
        marginTop: theme.spacing(1)
    },
  
    buttonContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
  
    button: {
        padding: [[theme.spacing(2), theme.spacing(3)]]
    },
  
    reactivateButton: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
  
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: COLORS.offWhite
        }
    },
  
    deactivateButton: {
        borderColor: COLORS.red,
        color: COLORS.red,
  
        '&:hover': {
            backgroundColor: 'initial'
        }
    },
  
    removeButton: {
        color: COLORS.white,
        backgroundColor: COLORS.red,
  
        '&:hover': {
            backgroundColor: COLORS.red
        }
    },
  
    link: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
  },
  
  filterContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: theme.spacing(4),
      marginTop: theme.spacing(1)
  },
  
  filter: {
      backgroundColor: COLORS.lightTeal,
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
  
      '& span:first-child': {
          fontWeight: 600,
          color: theme.palette.primary.main
      },
  
      '& span:last-child': {
          color: theme.palette.primary.main,
          fontWeight: 600
      }
  },
  
  table: {
      borderTop: `1px solid ${theme.palette.primary.main}`,
      borderLeft: `1px solid ${theme.palette.primary.main}`,
      borderRight: `1px solid ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      maxHeight: '50vh',
      backgroundColor: COLORS.lightTeal,
      marginTop: theme.spacing(3)
  },
  
  tableHeader: {
      display: 'grid',
      gridTemplateColumns: '0.2fr repeat(7, 1fr)',
  },
  
  content: {
      display: 'grid',
      gridTemplateColumns: '1fr'
  },
  
  customerLink: {
      color: `${theme.palette.primary.main}`,
      cursor: 'pointer'
  },
  
  pagination: {
      backgroundColor: COLORS.lightTeal,
      borderBottom: `1px solid ${theme.palette.primary.main}`,
      borderLeft: `1px solid ${theme.palette.primary.main}`,
      borderRight: `1px solid ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
  },
  
  menu: {
      backgroundColor: COLORS.lightTeal,
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius
  }
}));

const columns = [
  { id: 'id', label: '', maxWidth: 10 },
  {
    id: 'depositor',
    label: 'Depositor',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'transactionID',
    label: 'Transaction ID',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'Amount',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'method',
    label: 'Method',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'time',
    label: 'Time',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'date',
    label: 'Date',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: 'Action',
    format: (value) => value.toLocaleString('en-US'),
  },
];

const pages = [10, 25, 50, 100]

const Deposits = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };


  return (
    <>
      <section className={classes.root}>
          <Typography variant="h6" >Deposits</Typography>
          <Box component="section" className={classes.container}>
            <Paper>
                <TableContainer className={classes.table}>
                    <Table stickyHeader aria-label="sticky table" style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow className={classes.tableHeader}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ background: 'transparent', minWidth: column.minWidth, fontWeight: 'bold',  }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.content}>
                          {/* <TableRow role="checkbox" tabIndex={-1} key={customer.id} className={classes.customer} hover>
                            <TableCell className={classes.item}>
                                <FormControlLabel control={<Checkbox name="checked" color="primary" disableFocusRipple disableTouchRipple disableRipple />} />    
                            </TableCell>
                            <TableCell className={classes.item} style={{ cursor: 'pointer' }} ><TextClamp text={customer.firstName || ''} lines={1} className={classes.text} /></TableCell>
                            <TableCell className={classes.item} style={{ cursor: 'pointer' }} ><TextClamp text={customer.lastName || ''} lines={1} className={classes.text} /></TableCell>
                            <TableCell className={classes.item} style={{ cursor: 'pointer' }} ><TextClamp text={customer.email || ''} lines={1} className={classes.text} /></TableCell>
                            <TableCell className={classes.item} style={{ cursor: 'pointer' }} ><TextClamp text={customer.dateCreated.toLocaleString() || ''} lines={1} className={classes.text} /></TableCell>
                            <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer.customerStatus}</Typography></TableCell>
                            <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer?.amountAvailable.amount}</Typography></TableCell>
                            <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer?.riskProfile}</Typography></TableCell>
                            <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer?.riskProfile}</Typography></TableCell>
                            <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer?.riskProfile}</Typography></TableCell>
                            <TableCell className={classes.item} style={{ justifySelf: 'stretch' }}>
                                <IconButton 
                                    variant="text" 
                                    size="small" 
                                    className={classes.button} 
                                    aria-controls="customer-menu" 
                                    aria-haspopup="true" 
                                    // onClick={(e) => handleButtonClick(customer, e)} 
                                    disableRipple
                                >
                                    <DotsHorizontal />
                                </IconButton>
                            </TableCell>
                          </TableRow> */}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={pages}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    classes={{
                        root: classes.pagination
                    }}
                />
            </Paper>
            {/* <Menu
                id="customer-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: classes.menu }}
            >
                <MenuItem>View Details</MenuItem>
                <Divider />
                <MenuItem>Edit Profile</MenuItem>
                <Divider />
                <MenuItem>Contact</MenuItem>
                <Divider />
                <MenuItem disabled={filter === SUSPENDED || filter === REJECTED}>Suspend</MenuItem>
                <Divider />
                <MenuItem>Change Risk Profile</MenuItem>
            </Menu> */}
          </Box>
      </section>
    </>
  )
}

export default Deposits