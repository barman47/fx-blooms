import { useState, } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Menu, MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { CLEAR_ALL_CUSTOMERS, SET_CUSTOMER } from '../../../actions/types';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import DepositAndWithdrawalTable from '../../../components/admin-dashboard/DepositTable'
// import { ADMIN_FILTERS } from '../../../utils/constants';
// import { Triangle } from 'mdi-material-ui';
import WithdrawalCard from '../../../components/admin-dashboard/WithdrawalCard'



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

    depositCard: {
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

    depositCardTitle: {
        fontSize: theme.spacing(3.5),
        color: '#A0AEC0',
        marginBottom: theme.spacing(3),
        fontStretch: '50%'
    },

    depositCardAmount: {
        fontSize: theme.spacing(5),
        color: '#1E6262',
        fontWeight: '900 !important',
        fontStretch: '50%'
    },

    percentage: {
        display: 'grid',
        gridTemplateColumns: '25px 25px',
        color: '#1E6262',
        alignSelf: 'flex-end',
        
        '& svg': {
            fontSize: theme.spacing(2),
            marginTop: '13px'
        },

        '& span': {
            fontSize: theme.spacing(3)
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

const Deposits = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  // const [ depositFilter, setDepositFilter ] = useState('')
  // const [ loadingDeposit ] = useState(false)


    const customers = useSelector(state => state.customers?.customers?.items);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


  return (
    <>
      <section className={classes.root}>

        <Typography variant="h6" >Deposits</Typography>
        <WithdrawalCard cardTitle="Total Deposts" />
      
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