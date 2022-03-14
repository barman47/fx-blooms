import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@material-ui/core';

import { CLEAR_CUSTOMER_STATUS_MSG, SET_CUSTOMER, SET_PAGE_NUMBER, SET_PAGE_SIZE } from '../../../actions/types';

import { COLORS, LISTING_DETAILS } from '../../../utils/constants';
import AllListings from './AllListings'
import SuccessModal from '../../../components/common/SuccessModal';
import isEmpty from '../../../utils/isEmpty';


const useStyles = makeStyles((theme) => ({
  root: {
      padding: theme.spacing(0, 3)
  },

  title: {
      fontWeight: 600
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

  active: {
      backgroundColor: theme.palette.primary.main,
      
      '& span': {
          color: `${COLORS.offWhite} !important`,
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

const Listings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const { admin } = useSelector(state => state);
  const { customer, customers, msg } = useSelector(state => state.customers);
  const { ALL_LISTINGS, ALL_TRANSACTIONS } = LISTING_DETAILS;
  const [tab, setTab] = useState(ALL_LISTINGS);

  const pages = [10, 25, 100]
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[0]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const successModal = useRef();

  // Set page number for search when page number changes
  useEffect(() => {
      dispatch({
          type: SET_PAGE_NUMBER,
          payload: page
      });
  }, [dispatch, page]);

  // Set page size for search when page size changes
  useEffect(() => {
      dispatch({
          type: SET_PAGE_SIZE,
          payload: rowsPerPage
      });
  }, [dispatch, rowsPerPage]);

  useEffect(() => {
      if (msg && customer) {
          setLoading(false);
          successModal.current.openModal();
          successModal.current.setModalText(msg);
      }
  }, [customer, msg]);

  const dismissAction = () => {
      batch(() => {
          dispatch({
              type: SET_CUSTOMER,
              payload: {}
          });
          dispatch({
              type: CLEAR_CUSTOMER_STATUS_MSG
          });
      });
  };


  return (
    <>
      {error && 
                <Alert
                    severity="warning"
                    onClose={() => {
                        setError('');
                    }}
                    >
                    {error}
                </Alert>
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section className={classes.root}>
                <Grid container direction="row" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body1" className={classes.title}>ALL USERS</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" className={classes.link}>Download Records</Typography>
                    </Grid>
                </Grid>
                <Box component="section" className={classes.filterContainer}>
                    <div className={clsx(classes.filter, tab === ALL_LISTINGS && classes.active)}>
                        <Typography variant="subtitle2" component="span">ALL LISTINGS</Typography>
                        <Typography variant="subtitle2" component="span">0</Typography>
                    </div>
                    <div className={clsx(classes.filter, tab === ALL_TRANSACTIONS && classes.active)}>
                        <Typography variant="subtitle2" component="span">ALL TRANSACTIONS</Typography>
                        <Typography variant="subtitle2" component="span">0</Typography>
                    </div>
                </Box>
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
                                {tab === ALL_LISTINGS && 
                                    <AllListings 
                                        handleClick={handleClick} 
                                    />
                                }
                                {tab === ALL_TRANSACTIONS && 
                                    <AllListings 
                                        handleClick={handleClick} 
                                    />
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={pages}
                        component="div"
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
            </section>
    </>
  )
}

export default Listings;