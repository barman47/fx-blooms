import { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Box, 
  // Select, 
  // MenuItem, 
  // InputLabel, 
  // FormControl,
  Paper,
  Divider,
} from '@material-ui/core'
import { COLORS } from '../../../utils/constants';
import { makeStyles } from '@material-ui/core/styles';
import { getCustomer } from '../../../actions/customer';
// import { getAllListings } from '../../../actions/adminListings'


const useStyles = makeStyles(theme =>({
  root: {
      backgroundColor: 'white',
      borderRadius: theme.shape.borderRadius,
      padding: [[theme.spacing(2), theme.spacing(5)]],

      [theme.breakpoints.down('md')]: {
          paddingBottom: theme.spacing(4)
      }
  },

  content: {
      display: 'grid',
      gridTemplateColumns: '1fr 0.2fr 1fr'
  },

  detail: {
      marginBottom: theme.spacing(2),

      '& h6:first-child': {
          margin: theme.spacing(2, 0)
      }
  },

  select: {
    '&:before': {
        borderColor: COLORS.lightTeal,
    },
    '&:after': {
        borderColor: COLORS.lightTeal,
    },
  },

  selectRoot: {
    fill: COLORS.lightTeal + '!important',
  },

  icon: {
    top: 'calc(50% - 17px) !important',
  },

  subDetailTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),

    '& h6': {
      paddingRight: theme.spacing(5)
    },
    '& div': {
      marginBottom: theme.spacing(.5)
    }
  },

  selectForm: {
    border: '1px solid',
    borderColor: COLORS.lightTeal,
    '& label': {
      fontSize: '12px !important'
    }
  },

  divider: {
      backgroundColor: theme.palette.primary.main,
      width: theme.spacing(0.5)
  },

  detailTitle: {
    marginBottom: theme.spacing(5)
  },

  label: {
    fontSize: theme.spacing(2)
  },

  paperBx: {
    marginRight: theme.spacing(5),
    padding: [[theme.spacing(1), theme.spacing(2)]],
    border: `1px solid ${COLORS.primary}`,
    
    '&:not(:last-child)': {
      marginBottom: theme.spacing(5),
    },
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    '& subtitle2': {
      fontWeight: '600'
    },

    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  },

  detailsRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& h6': {
      fontSize: '14px',
      fontWeight: 'normal'
    },

    '& h6:last-child': {
      color: COLORS.primary,
      fontWeight: 'bold'
    }
  },

  paperWalletCard: {
    height: '200px',
    maxWidth: '24rem',
    borderRadius: '10px',
    // border: 'none',
    backgroundImage: `linear-gradient(60deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.9) 90%)`,

    display: 'flex',
    alignItems: 'center',

    '&:not(:last-child)': {
      marginBottom: theme.spacing(5),
    },
  },

  cardRightContent: {
    background: COLORS.primary,
    borderRadius: '10px',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(67% 0, 83% 0, 100% 0, 100% 79%, 100% 100%, 85% 100%, 79% 62%, 50% 31%, 47% 0)',
  },

  cardRightContent2: {
    background: COLORS.darkTeal,
    borderRadius: '10px',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(28% 0, 45% 53%, 72% 100%, 0% 100%, 0 57%, 0% 0%)',
  },

  cardLeftContent: {
    width: '50%',
    alignSelf: 'flex-start',
    paddingTop: '20px',
    paddingLeft: '25px',

    '& h6': {
      color: COLORS.primary,
    },

    '& h6:not(:last-child)': {
      marginBottom: '45px'
    },

    '& h6:last-child': {
      fontSize: '1rem'
    },
  }

}));

const TransactionDetails = () => {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { customer } = useSelector(state => state.customers);

  // useEffect(() => {
  //   dispatch(getAllListings())

  // }, [dispatch])

  
  useEffect(() => {
    dispatch(getCustomer(customer.id))
  }, [dispatch, customer])

  console.log('hello')
  
  return (
    <>
    <Box component="section" className={classes.root}>
      <Typography className={classes.detailTitle} variant="h6" color="primary">Transaction Details</Typography>
      <Box component="section" className={classes.content}>
        <Box component="div" className={classes.detail}>
          {/* <div className={classes.subDetailTitle}>
            <Typography color="primary" variant="h6">Transactions</Typography>
            <Box component="div" sx={{ minWidth: 70 }}>
              <FormControl fullWidth className={classes.selectForm}>
                <InputLabel id="week">WEEK</InputLabel>
                <Select
                  labelId="week"
                  id="demo-simple-select"
                  label="Week"
                  inputProps={{
                    classes: {
                        icon: classes.icon,
                    },
                  }}
                >
                  <MenuItem>Ten</MenuItem>
                  <MenuItem>Twenty</MenuItem>
                  <MenuItem>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div> */}
          <Paper className={classes.paperBx} elevation={2} variant="outlined" rectangle>
            <Typography component="h6">Listings</Typography>
            <div className={classes.paperBxContent}>
                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Completed
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Uncompleted
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Deleted
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Expired
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Total
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>
            </div>
          </Paper>
          <Paper className={classes.paperBx} elevation={2} variant="outlined" rectangle>
            <Typography component="subtitle2" variant="h">Transactions</Typography>
            <div className={classes.paperBxContent}>
                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Buys
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Sells
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Disputed Buys
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Disputed Sells
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>
            </div>

          </Paper>

          <Paper className={classes.paperBx} elevation={2} variant="outlined" rectangle>
            <Typography component="h6" >Volume</Typography>
            <div className={classes.paperBxContent}>
                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Buys
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Sells
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Average Buys
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Averyage Sells
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>
            </div>

          </Paper>

          <Paper className={classes.paperBx} elevation={2} variant="outlined" rectangle>
            <Typography component="subtitle2" variant="h">Fees</Typography>
            <div className={classes.paperBxContent}>
                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Buying Fees
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Selling Fees
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>

                  <div className={classes.detailsRow}>
                    <Typography variant="h6">
                      Total
                    </Typography>
                    <Typography variant="h6">
                      0
                    </Typography>
                  </div>
            </div>

          </Paper>
        </Box>


        <Divider orientation="vertical" flexItem classes={{ root: classes.divider }} /> 
        


        <Box component="div" className={classes.detail}>
          <div className={classes.subDetailTitle}>
            <Typography color="primary" variant="h6">Wallets</Typography>
          </div>
          <Paper className={classes.paperWalletCard} elevation={3} variant="outlined" rectangle>
            <div className={classes.cardLeftContent}>
              <Typography variant="subtitle2">
                EUR WALLET
              </Typography>

              <Typography variant="h6">
                EUR 5000
              </Typography>
            </div>
            <div className={classes.cardRightContent}></div>
          </Paper>
          <Paper className={classes.paperWalletCard} elevation={2} variant="outlined" rectangle>
            <div className={classes.cardRightContent2}></div>
            <div className={classes.cardLeftContent}>
              <Typography variant="subtitle2">
                EUR WALLET
              </Typography>

              <Typography variant="h6">
                EUR 5000
              </Typography>
            </div>
          </Paper>

        </Box>
      </Box>
    </Box>
    </>
  )
}

export default TransactionDetails