import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, IconButton, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextClamp from 'react-string-clamp';
import { DotsHorizontal } from 'mdi-material-ui';
import { SET_CUSTOMER } from '../../actions/types';
import { CUSTOMER_CATEGORY } from '../../utils/constants';
// import GenericButton from './GenericButton'

const useStyles = makeStyles(theme =>({

  tableBodyRow: {
    display: 'grid',
    // gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1.2fr .8fr 1fr 0.5fr',
    borderBottom: '2px solid #E3E8EE',
    alignItems: 'center',
    cursor: 'pointer',

    '& span': {
        fontWeight: '300',
        paddingTop: theme.spacing(.7),
        paddingBottom: theme.spacing(.7),
        fontSize: theme.spacing(1.9),
        fontStretch: '50%'
    },
  },


  status: {
    color: 'white',
    fontSize: '12px !important',
    borderRadius: theme.spacing(.8),
    backgroundColor: '#C4C4C4',
    padding: '3px 5px',
    width: '87px',
    fontWeight: "500 !important",
    textAlign: 'center'
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


const GenericTableBody = ({ data, handleClick, viewCustomerProfile, gridColumns, addColumn, columnList }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { CONFIRMED, PENDING, REJECTED, SUSPENDED } = CUSTOMER_CATEGORY;
  const [ isDisabled, setDisabled ] = useState(true)

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

  const handleStatus = useCallback((status) => {
    switch (status) {
      case CONFIRMED:
        return classes.verified
      case PENDING:
        return classes.pending
      case REJECTED:
        return classes.suspended
      case SUSPENDED:
        return classes.suspended
      default:
        return
    }
  }, [CONFIRMED, PENDING, REJECTED, SUSPENDED, classes.pending, classes.suspended, classes.verified])

  const handleDisplayStatus = useCallback((status) => {
    switch (status) {
      case CONFIRMED:
        return 'VERIFIED'
      default:
        return status
    }
  }, [])

  const handleGridColumns = useMemo(() => {
    if (!gridColumns) {
      return '0.2fr 1fr 1fr 1.5fr 1.2fr .8fr 1fr 0.3fr'
    }
    return gridColumns
  }, [gridColumns])

  const handleCheckBox = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }


  return (
    <>
      {
        data && data.map((customer, i) => (
            <Box component="div" sx={{ gridTemplateColumns: handleGridColumns }} className={classes.tableBodyRow} key={i} onClick={() => viewCustomerProfile(customer)} >
                <Typography onClick={(e) => handleCheckBox(e)} component="span" className={classes.tableCell} variant="subtitle1">
                    <FormControlLabel control={<Checkbox name="checked" className={classes.checkBox} color="primary" disableFocusRipple disableTouchRipple disableRipple />} /> 
                </Typography>
                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[1]] ? customer[columnList[1]] : ''} lines={1} />
                </Typography>
                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[2]] ? customer[columnList[2]] : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[3]] ? customer[columnList[3]] : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[4]] ? customer[columnList[4]] : ''} lines={1} />
                </Typography>
                <Typography component="span" className={[classes.tableCell, classes.status, handleStatus(customer[columnList[5]])]} variant="subtitle1">
                { handleDisplayStatus(customer[columnList[5]]) }
                </Typography>
                {
                  !!addColumn ? 
                  <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[6]] ? customer[columnList[6]] : ''} lines={1} />
                </Typography> : 
                  ''
                }
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    {customer[columnList[7]]}
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
                </Typography>
            </Box>
        ))
      }

      {/* <Box component="div" sx={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', width: "100%" }}>
        <Box component="div">
            <Typography component="span">{ data?.length ?? 0 } results</Typography>
        </Box>

        <Box component="div" sx={{ display: 'flex', gap: '15px' }}>
            <GenericButton isDisabled={isDisabled} buttonName="Previous" />
            <GenericButton isDisabled={!isDisabled} buttonName="Next" />
        </Box> 
      </Box> */}
    </>
  )
}

export default GenericTableBody;