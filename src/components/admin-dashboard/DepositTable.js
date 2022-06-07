// import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, IconButton, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextClamp from 'react-string-clamp';
import { DotsHorizontal } from 'mdi-material-ui';
import { SET_CUSTOMER } from '../../actions/types';
// import { CUSTOMER_CATEGORY } from '../../utils/constants';
import clsx from 'clsx'


const useStyles = makeStyles(theme =>({

  tableBodyRow: {
    display: 'grid',
    gridTemplateColumns: '.3fr 1fr 1fr 1fr 1fr .8fr 1fr 0.5fr',
    borderBottom: '1px solid #E8E8E8',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: '15px',
    paddingRight: '15px',

    '& span': {
        fontWeight: '300',
        paddingTop: theme.spacing(.8),
        paddingBottom: theme.spacing(.8),
        fontSize: theme.spacing(1.9),
        fontStretch: '50%',
    },
  },


  status: {
    color: 'white',
    fontSize: '12px !important',
    borderRadius: theme.spacing(.8),
    backgroundColor: '#C4C4C4',
    padding: '3px 5px',
    width: 'fit-content',
    fontWeight: "500 !important"
  },

  verified: {
    backgroundColor: '#DDF2E5',
    color: '#48BB78',
  },

  pending: {
    backgroundColor: '#FFF5CE',
    color: '#FBBC05',
  },

  suspended: {
    backgroundColor: '#FFCECE',
    color: '#FF0000',
  },
}));


const DepositAndWithdrawalTable = ({ data, handleClick, otherRows }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  // const { fourthRow, fifthRow, sixthRow } = otherRows

  const handleButtonClick = (customer, e) => {
    console.log('mennnuuu')
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({
        type: SET_CUSTOMER,
        payload: customer
    });
    handleClick(e);
  };

  const handleCheckBox = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }


  return (
    <>
      {
        data && data.map((customer, i) => (
            <Box component="div" className={classes.tableBodyRow} key={i} >
              <Typography onClick={(e) => handleCheckBox(e)} component="span" className={classes.tableCell} variant="subtitle1">
                <FormControlLabel  onClick={(e) => handleCheckBox(e)}  control={<Checkbox name="checked" className={classes.tableCell} color="primary" disableFocusRipple disableTouchRipple disableRipple />} /> 
              </Typography>
              <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                  <TextClamp text={customer.firstName ? customer.firstName : ''} lines={1} />
              </Typography>
              <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                  <TextClamp text={customer.lastName ? customer.lastName : ''} lines={1} />
              </Typography>
              <Typography component="span" className={classes.tableCell} variant="subtitle1">
                  <TextClamp text={customer.email ? customer.email : ''} lines={1} />
              </Typography>
              <Typography component="span" className={clsx(classes.tableCell, classes.status)} variant="subtitle1">
              { customer.customerStatus }
              </Typography>
              <Typography component="span" className={clsx(classes.tableCell, classes.status)} variant="subtitle1">
              { customer.customerStatus }
              </Typography>
              <Typography component="span" className={clsx(classes.tableCell, classes.status)} variant="subtitle1">
              { customer.customerStatus }
              </Typography>
              <Typography component="span" className={classes.tableCell} variant="subtitle1">
                  <IconButton 
                          variant="text" 
                          size="small" 
                          className={classes.button} 
                          aria-controls="customer-menu" 
                          aria-haspopup="true" 
                          onClick={(e) => handleButtonClick(customer, e)}
                          disableRipple
                      >
                          <DotsHorizontal />
                      </IconButton>
              </Typography>
                {/* <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer.user ? customer.user : ''} lines={1} />
                </Typography>
                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer.transactionId ? customer.transactionId : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer.amount ? customer.amount : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[fourthRow] ? customer[fourthRow] : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[fifthRow] ? customer[fifthRow] : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[sixthRow] ? customer[sixthRow] : ''} lines={1} />
                </Typography>
                <Typography style={{ textAlign: 'center' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <IconButton 
                            variant="text" 
                            size="small" 
                            className={classes.button} 
                            aria-controls="customer-menu" 
                            aria-haspopup="true" 
                            onClick={(e) => handleButtonClick(customer, e)}
                            disableRipple
                        >
                            <DotsHorizontal />
                        </IconButton>
                </Typography> */}
            </Box>
            
        ))
      }
    </>
  )
}

export default DepositAndWithdrawalTable;