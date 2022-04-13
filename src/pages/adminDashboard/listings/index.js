import { useState } from 'react';
// import { batch, useDispatch } from 'react-redux';
// import { SET_CUSTOMER, SET_ID_CHECK_DATA, SET_PROFILE_CHECK_DATA } from '../../../actions/types';
import clsx from 'clsx';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { COLORS, LISTING_DETAILS } from '../../../utils/constants';
import AllListings from './AllListings'
// import Spinner from '../../../components/common/Spinner';
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
    gridTemplateColumns: '0.2fr 1fr 1.5fr .5fr .5fr 0.5fr 0.5fr 0.5fr 0.7fr 1fr 1fr .5fr',
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
    { id: 'id', label: '', maxWidth: 10},
    {
      id: 'listing ID',
      label: 'Listing ID',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'owner',
      label: 'Owner',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'amount',
      label: 'Amount',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'timeStamp',
      label: 'Timestamp',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'rate',
      label: 'Rate',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'originalAmount',
      label: 'Original Amount',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Status',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'associatedTransactions',
      label: 'Associated Transactions',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'riskScore',
      label: 'Risk Score',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'action',
      label: 'Action',
      format: (value) => value.toLocaleString('en-US'),
    },
];

const pages = [10, 25, 50, 100]

const Listings = () => {
  const classes = useStyles()
//   const dispatch = useDispatch()
//   const dispatch = useDispatch();
  const { ALL_LISTINGS, ALL_TRANSACTIONS } = LISTING_DETAILS;
  const [tab, setTab] = useState(ALL_LISTINGS);

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
          <Typography variant="h6" >ALL USERS</Typography>
          <Box component="section" className={classes.tabContainer}>
              <div className={clsx(classes.tab, tab === ALL_LISTINGS && classes.active)} onClick={() => setTab(ALL_LISTINGS)}>
                  <Typography variant="subtitle2" component="span">{ALL_LISTINGS}</Typography>
              </div>
              <div className={clsx(classes.tab, tab === ALL_TRANSACTIONS && classes.active)} onClick={() => setTab(ALL_TRANSACTIONS)}>
                  <Typography variant="subtitle2" component="span">{ALL_TRANSACTIONS}</Typography>
              </div>
          </Box>
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
                            {tab === ALL_LISTINGS && <AllListings  />}
                            {/* {tab === ALL_TRANSACTIONS && <PersonalDetails  />} */}
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

export default Listings;