import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Checkbox,
  FormControlLabel,
  IconButton, 
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
// import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles';
import { DotsHorizontal } from 'mdi-material-ui';
import { COLORS } from '../../../utils/constants';
import { getAllListings } from '../../../actions/adminListings'
import { getCustomers } from '../../../actions/customer'
import TextClamp from 'react-string-clamp';




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


const AllListings = () => {
  const classes = useStyles();
  const dispatch = useDispatch()

//   const pages = [10, 25, 100]

  const { listings: { listings } } = useSelector(state => state)

//   const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
//   const [page, setPage] = useState(0);
  useEffect(() => {
    dispatch(getAllListings())

  }, [dispatch])


  useEffect(() => {
    dispatch(getCustomers({
        pageNumber: 1,
        pageSize: 15
    }))
  }, [dispatch])
    


  return (
    <>
     {listings && listings.map((customer) => (
        <TableRow role="checkbox" tabIndex={-1} key={customer.id} className={classes.customer} hover>
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
        </TableRow>
        ))}
    </>
  )
}

export default AllListings


