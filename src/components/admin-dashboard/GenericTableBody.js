import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, IconButton, FormControlLabel, Checkbox, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextClamp from 'react-string-clamp';
import { DotsHorizontal } from 'mdi-material-ui';
import { SET_CUSTOMER } from '../../actions/types';
import { CUSTOMER_CATEGORY } from '../../utils/constants';
import formatId from '../../utils/formatId';
import CircularProgressBar from './CircularProgressBar'
import clsx from 'clsx';


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


const GenericTableBody = ({ data, handleClick, viewCustomerProfile, gridColumns, addColumn, columnList, loading, viewMore }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { CONFIRMED, PENDING, REJECTED, SUSPENDED } = CUSTOMER_CATEGORY;
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

  const handleStatus = useCallback((status) => {
    switch (status) {
      case CONFIRMED:
        return classes.verified
      case PENDING:
        return classes.pending
      case REJECTED:
        return classes.rejected
      case SUSPENDED:
        return classes.suspended
      default:
        return
    }
  }, [CONFIRMED, PENDING, REJECTED, SUSPENDED, classes.pending, classes.suspended, classes.verified, classes.rejected])

  const handleDisplayStatus = useCallback((status) => {
    switch (status) {
      case CONFIRMED:
        return 'VERIFIED'
      default:
        return status
    }
  }, [CONFIRMED])

  const handleGridColumns = useMemo(() => {
    if (!gridColumns) {
      return 'minmax(0, 0.15fr) repeat(2, minmax(0, 1fr)) repeat(2, minmax(0, 1.2fr)) .8fr 1fr 0.3fr'
    }
    return gridColumns
  }, [gridColumns])

  const handleCheckBox = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDisplayRow = (value) => {
    if (typeof value === 'string') {
      return value.substring(0, 25)
    }
    return value
  }

  // const handleTimeStamp = useCallback((value) => {
  //   console.log('value', value)
  // }, [])

  return (
    <>
      { loading ? <CircularProgressBar newWidth="40px" newHeight="40px" topMargin="50px" /> :
        data && data.map((customer, i) => (
            <Box component="div" sx={{ gridTemplateColumns: handleGridColumns, padding: '1px 0px' }} className={classes.tableBodyRow} key={i} onClick={() => viewCustomerProfile(customer)} >
                <Typography onClick={(e) => handleCheckBox(e)} component="span" className={classes.tableCell} variant="subtitle1">
                  <FormControlLabel  onClick={(e) => handleCheckBox(e)}  control={<Checkbox name="checked" className={classes.tableCell} color="primary" disableFocusRipple disableTouchRipple disableRipple />} /> 
                </Typography>
                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[1]] ? formatId(customer[columnList[1]]) : ''} lines={1} />
                </Typography>
                <Typography style={{ textTransform: 'capitalize' }} component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[2]] ? customer[columnList[2]] : ''} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={handleDisplayRow(customer[columnList[3]].amount ? customer[columnList[3]].amount : customer[columnList[3]] ?? '')} lines={1} />
                </Typography>
                <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={handleDisplayRow(customer[columnList[4]] ? customer[columnList[4]] : '')} lines={1} />
                </Typography>
                <Typography component="span" className={clsx(classes.tableCell, classes.status, handleStatus(customer[columnList[5]]))} variant="subtitle1">
                { handleDisplayStatus(customer[columnList[5]]) }
                </Typography>
                {
                  !!addColumn ? 
                  <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    <TextClamp text={customer[columnList[6]] ? customer[columnList[6]] : ''} lines={1} />
                </Typography> : 
                  ''
                }
                { 
                  !addColumn ?
                  <Typography component="span" className={classes.tableCell} variant="subtitle1">
                    {customer[columnList[7]]}
                  </Typography> : ''
                }
                <Typography style={{ textAlign: 'center' }} component="span" className={classes.tableCell} variant="subtitle1">
                    {
                      viewMore && viewMore 
                      ? <button onClick={() => handleButtonClick()} className={classes.viewBtn}>view more</button> :
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
                    }
                </Typography>
            </Box>
        ))
      }

      {/* {
        loading ? '' :
        <Box component="div" sx={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', width: "100%" }}>
            <Box component="div" sx={{ alignSelf: "flex-start" }}>
                <Typography component="span">{data?.length ?? 0} results</Typography>
            </Box>

            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Box component="div" sx={{ display: 'flex', gap: '15px' }}>
                    <GenericButton isDisabled={isDisabled} buttonName="Previous" />
                    <GenericButton isDisabled={!isDisabled} buttonName="Next" />
                </Box> 
                <Box component="span"  sx={{ display: 'flex', justifyContent:'center', gap: '10px' }}>
                    {
                        pageNumberList.map(n => (
                            <Typography variant="subtitle2">{n}</Typography>
                        ))
                    }
                </Box>
            </Box>                    
        </Box>
    } */}
    </>
  )
}

export default GenericTableBody;