import { useDispatch } from 'react-redux';
import { Box, Typography, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextClamp from 'react-string-clamp';
import { SET_CUSTOMER } from '../../actions/types';
import handleStatusStyle from '../../utils/statusDisplay';
import formatId from '../../utils/formatId';
import CircularProgressBar from './CircularProgressBar'
import clsx from 'clsx';
import { BankOutline } from 'mdi-material-ui';


const useStyles = makeStyles(theme =>({

  tableBodyRow: {
    display: 'grid',
    // gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1.2fr .8fr 1fr 0.5fr',
    borderBottom: '2px solid #E3E8EE',
    alignItems: 'center',
    cursor: 'pointer',
    // justifyContent: 'flex-start',

    '& span': {
        fontWeight: '300',
        padding: '4.6px 0',
        fontSize: '.8vw',
        fontStretch: '50%',
        // borderLeft: `1px solid red`
    },

    '& span label': {
      marginRight: '0'
    },

    '& span label span:nth-child(2)': {
      display: 'none'
    }
  },

  tableCell: {
    '&:first-child': {
      display: 'flex',
      // justifyContent: 'center',
      alignItems: 'center',
      gap: '5px'
    }
  },

  status: {
    color: 'white',
    fontSize: '11px !important',
    borderRadius: '3.4px',
    backgroundColor: '#C4C4C4',
    padding: '3px',
    width: '87px',
    fontWeight: "500 !important",
    textAlign: 'center'
  },

  verified: {
    backgroundColor: '#DDF2E5',
    color: '#1E6262',
  },

  pending: {
    backgroundColor: '#FFF5CE',
    color: '#FBBC05',
  },

  rejected: {
    backgroundColor: '#FFCECE',
    color: '#FF0000',
  },

  suspended: {
    backgroundColor: '#f5f7be',
    color: '#d1c70c',
  },

  viewBtn: {
    fontSize: theme.spacing(1.95),
    outline: 'none',
    border: 'none',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
  }
}));


const TransactionTable = ({ data, handleClick, viewCustomerProfile, gridColumns, columnList, loading, viewMore }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  // const { CONFIRMED } = CUSTOMER_CATEGORY;
  // const [ isDisabled ] = useState(true)

  const handleButtonClick = (customer, e) => {    
    if (!viewMore) {
      e.preventDefault();
      e.stopPropagation();
      
      dispatch({
        type: SET_CUSTOMER,
        payload: customer
      });
      handleClick(e);
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date)
    const hours = newDate.getHours()
    const mins = newDate.getMinutes()

    const transTime = hours + ':' + mins
    const transDate = newDate.getDate() + ' ' + new Intl.DateTimeFormat('en', { month: 'short' }).format(newDate) + ' ' + newDate.getFullYear().toString().substr(-2)
    return transTime + ' | ' + transDate
  }

  const handleDisplayStatus = (status) => {
    switch (status) {
      case true:
        return 'SUCCESSFUL'
      default:
        return 'ONHOLD'
    }
  }

  // const handleDisplayRow = (value) => {
  //   if (typeof value === 'string') {
  //     return value.substring(0, 25)
  //   }
  //   return value
  // }

  // const handleTimeStamp = useCallback((value) => {
  //   console.log('value', value)
  // }, [])

  return (
    <>
      { loading ? <CircularProgressBar newWidth="40px" newHeight="40px" topMargin="50px" /> :
        data && data.map((customer, i) => (
            <Box component="div" sx={{ gridTemplateColumns: gridColumns, padding: '1px 0px' }} className={classes.tableBodyRow} key={i} onClick={() => viewCustomerProfile(customer)} >
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                  <BankOutline className={classes.recentIcon} color="primary" style={{ color: 'purple', fontSize: 15 }}/>
                  Direct Transfer
                </Typography>

                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[1]].accountName.split(' ')[0]} lines={1} />
                </Typography>

                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[2]].currency + ' ' + customer[columnList[2]].amountTransfered.toLocaleString()} lines={1} />
                </Typography>

                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    {customer[columnList[3]].accountName.split(' ')[0]}
                </Typography>

                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    {formatId(customer[columnList[4]], 'TID', 10)}
                </Typography>

                <Typography component="span" className={clsx(classes.tableCell, classes.status, handleStatusStyle(customer[columnList[5]], classes))} variant="subtitle1">
                  { handleDisplayStatus(customer[columnList[5]]) }
                </Typography>

                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                  {/* <TextClamp text={customer[columnList[6]] ? customer[columnList[6]] : ''} lines={1} /> */}
                  {formatDate(customer[columnList[6]])}
                </Typography>

                <Typography style={{ textAlign: 'left' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <button onClick={() => handleButtonClick()} className={classes.viewBtn}>view more</button>
                </Typography>
            </Box>
        ))
      }
    </>
  )
}

export default TransactionTable;