import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Menu, MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { CLEAR_ALL_CUSTOMERS, SET_CUSTOMER } from '../../../actions/types';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import GenericSelect from '../../../components/admin-dashboard/GenericSelect'
import DepositAndWithdrawalTable from '../../../components/admin-dashboard/DepositTable'
import { ADMIN_FILTERS } from '../../../utils/constants';
import { Triangle } from 'mdi-material-ui';



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
        backgroundColor: '#F7F8F9'
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

    withdrawalCard: {
        padding: theme.spacing(5),
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateColumns: '5fr 1fr',
        marginBottom: theme.spacing(5),
        width: '30vw',
        margin: '0 auto',
        borderRadius: theme.spacing(1),
        boxShadow: '8px 6px 8px #E5E5E5',

    },

    withdrawalCardTitle: {
        fontSize: theme.spacing(3.5),
        color: '#A0AEC0',
        marginBottom: theme.spacing(3),
        fontStretch: '50%'
    },

    withdrawalCardAmount: {
        fontSize: theme.spacing(5),
        color: '#1E6262',
        fontWeight: '900 !important',
        fontStretch: '50%'
    },

    percentage: {
        display: 'grid',
        gridTemplateColumns: '25px 25px',
        // color: '#1E6262',
        alignSelf: 'flex-end',
        color: 'red',
        
        '& svg': {
            fontSize: theme.spacing(2),
            marginTop: '13px',
            transform: 'rotate(180deg)',
        },

        '& span': {
            fontSize: theme.spacing(3),
        }
    },

    selectBtn: {
        justifySelf: 'flex-end',
        marginTop: theme.spacing(-3)
    }
}));

const columns = [
//   { id: 'id', label: '', maxWidth: 10 },
  {
    id: 'user',
    label: 'User',
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

// const pages = [10, 25, 50, 100]

const gridColumns = '1fr 1fr 1fr 1fr .8fr 1fr 0.5fr';

const Withdrawals = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [ withdrawalFilter, setDepositFilter ] = useState('')
  const [ loadingDeposit, setLoadingDeposit ] = useState(false)


//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(pages[0]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

  
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(1);
//   };

    // const dispatch = useDispatch();

    const customers = useSelector(state => state.customers?.customers?.items);

  // const handleSwitchCase = (switchType, getFunction, setLoadingType, setFilterType, total) => {
  //     const { TWENTY_FOUR_HOURS, SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS, ALL } = ADMIN_FILTERS;
  //     switch (switchType) {
  //         case TWENTY_FOUR_HOURS:
  //             getFunction('1');
  //             setLoadingType(true);
  //             break;

  //         case SEVEN_DAYS:
  //             getFunction('7');
  //             setLoadingType(true);
  //             break;

  //         case THIRTY_DAYS:
  //             getFunction('30');
  //             setLoadingType(true);
  //             break;

  //         case THREE_MONTHS:
  //             getFunction('90');
  //             setLoadingType(true);
  //             break;

  //         case ALL:
  //             setFilterType(total);
  //             break;
          
  //         default:
  //             break;
  //     }
  // }

    // const handleVolumeFilter = useCallback((timeframe) => {
    //     handleSwitchCase(timeframe)
    // }, []);

    // useEffect(() => {
    //     // handleSetTitle('All Customers');
    //     getCustomers({
    //         pageNumber: 1,
    //         pageSize: 25
    //     });
    //     // eslint-disable-next-line
    // }, []);

    // useEffect(() => {
    //     if (withdrawalFilter) {
    //         handleUsersFilter(withdrawalFilter)
    //     }
    // }, [handleUsersFilter, usersFilter]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // useEffect(() => {
    //     return () => {
    //         dispatch({ type: CLEAR_ALL_CUSTOMERS });
    //     };

    //     // eslint-disable-next-line
    // }, []);

  return (
    <>
      <section className={classes.root}>

          <Typography variant="h6" >Withdrawals</Typography>
          <Box component="div" className={classes.withdrawalCard}>
            <Typography variant="h6" className={classes.withdrawalCardTitle} >Total Withdrawals</Typography>
            <Typography compoennt="span" variant="span" className={classes.selectBtn}>
                <GenericSelect FILTERS={ADMIN_FILTERS} selectValue={withdrawalFilter} setOnChange={setDepositFilter} loading={loadingDeposit}/>
            </Typography>
            
            <Typography variant="h6" className={classes.withdrawalCardAmount}>EUR 350000000.00</Typography>
            <Typography component="span" className={classes.percentage}>
                <Triangle />
                <Typography component="span" variant="subtitle2">4.5%</Typography>
            </Typography>
          </Box>
        
          <Box component="div" className={classes.table}>
            <GenericTableHeader columns={columns} gridColumns={gridColumns} headerPadding="11px 15px" />
            <DepositAndWithdrawalTable data={customers} handleClick={handleClick} />
          </Box>
          <Menu
            id="customer-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            classes={{ paper: classes.menu }}
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

export default Withdrawals