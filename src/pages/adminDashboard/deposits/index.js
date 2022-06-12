import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Menu, MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { CLEAR_ALL_CUSTOMERS, SET_CUSTOMER } from '../../../actions/types';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import DepositAndWithdrawalTable from '../../../components/admin-dashboard/DepositTable'
// import { ADMIN_FILTERS } from '../../../utils/constants';
// import { Triangle } from 'mdi-material-ui';
import WithdrawalCard from '../../../components/admin-dashboard/WithdrawalCard';
import GenericButton from '../../../components/admin-dashboard/GenericButton'
import { getAllDeposits } from '../../../actions/wallets'
// import { SET_PAGE_NUMBER, SET_PAGE_SIZE } from '../../../actions/types';

import clsx from 'clsx'


const useStyles = makeStyles(theme =>({
  root: {
      // padding: [[theme.spacing(2), theme.spacing(3)]],
      paddingRight: theme.spacing(8),
      paddingLeft: theme.spacing(5),
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(12),

      [theme.breakpoints.down('sm')]: {
          padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
      },

      '& h6': {
          fontWeight: 600
      },
      backgroundColor: '#F7F8F9',
      height: '100vh'
  },

  title: {
    fontWeight: 600
  },

  table: {
      borderRadius: theme.spacing(1),
      boxShadow: '3px 2px 3px white',
      border: '1px solid white',
      backgroundColor: '#FEFEFE',
      paddingBottom: '50px'
  },

  selected: {
    borderBottom: '2px solid #1E6262',
    fontWeight: 600,
    fontSize: '1.4vw'
  },

  pageList: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
  },
}));

const columns = [
//   { id: 'id', label: '', maxWidth: 10 },
  {
    id: 'name',
    label: 'Name',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'account',
    label: 'Account',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'Amount',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'paymentstatus',
    label: 'Payment Status',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'paymenttype',
    label: 'Payment Type',
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

// const pages = [10, 25, 50, 100]

const gridColumns = '1fr 1fr .7fr 1fr 1fr 1fr 0.5fr';
const pages = [15, 50, 75, 100]

const Deposits = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  // const [ depositFilter, setDepositFilter ] = useState('')
  // const [ loadingDeposit ] = useState(false)
  // const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
  const [rowsPerPage] = useState(pages[0]);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageNumberList, setPageNumberList] = useState([])
  const [lastPage, setLastPage] = useState(pageNumberList?.length)
  const [pageCount, setPageCount] = useState(0);

  const [loading, setLoading] = useState(true)
  const { fundingRequests, totalPageCount } = useSelector(state => state.wallets);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const handlePageNUmberList = useCallback(() => {
    const pageNumArr = []
    if (pageCount >= 1) {
        for (let i=1; i<=pageCount; i++) {
            pageNumArr.push(i)
        }
    }
    setPageNumberList(pageNumArr)
    setLastPage(pageCount)
  }, [pageCount])

  useEffect(() => {
    if (!!fundingRequests.items) {
    setLoading(false)
    handlePageNUmberList()
    }
  }, [fundingRequests.items, handlePageNUmberList])

  useEffect(() => {
    setLoading(true)
    dispatch(getAllDeposits({
      pageSize: rowsPerPage,
      pageNumber: currentPage
    }))

    setPageCount(totalPageCount || 0);
  }, [currentPage, dispatch, rowsPerPage, totalPageCount])

  const onNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const onPrevPage = () => {
      setCurrentPage(currentPage - 1)
  }

  return (
    <>
      <section className={clsx(classes.root, 'animate__animated animate__fadeInLeft')}>

        <Typography variant="h6" >Deposits</Typography>
        <WithdrawalCard cardTitle="Total Deposts" />
      
        <Box component="div" className={classes.table}>
          <GenericTableHeader columns={columns} gridColumns={gridColumns} headerPadding="11px 15px" />
          <DepositAndWithdrawalTable loading={loading} displayChck={false} data={fundingRequests.items} handleClick={handleClick} />


          {
            loading ? '' :
              <Box component="div" sx={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', width: "100%" }}>
                  <Box component="div" sx={{ alignSelf: "flex-start" }}>
                      {/* <Typography component="span">{'20'} results</Typography> */}
                  </Box>

                  <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <Box component="div" sx={{ display: 'flex', gap: '15px' }}>
                          <GenericButton clickAction={onPrevPage} isDisabled={currentPage === 1} buttonName="Previous" />
                          <GenericButton clickAction={onNextPage} isDisabled={currentPage === lastPage} buttonName="Next" />
                      </Box> 
                      <Box component="span"  sx={{ display: 'flex', justifyContent:'center', gap: '10px' }}>
                          {
                            pageNumberList && pageNumberList.map((pageNUmber, i) => (
                                <Typography className={clsx(classes.pageList, pageNUmber === currentPage && classes.selected)} onClick={() => setCurrentPage(pageNUmber)} variant="subtitle2" key={i}>{pageNUmber}</Typography>
                            ))
                          }
                      </Box>
                  </Box>                    
              </Box>
          }
        </Box>
        <Menu
          id="customer-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          classes={{ paper: classes.menu }}
          disableScrollLock={ true }
        >
          <MenuItem>View Details</MenuItem>
          <Divider />
          <MenuItem >Edit Profile</MenuItem>
          <Divider />
          <MenuItem>Contact</MenuItem>
          <Divider />
          <MenuItem>Suspend</MenuItem>
          <Divider />
          <MenuItem>Change Risk Profile</MenuItem>
        </Menu>
      </section>
    </>
  )
}

export default Deposits