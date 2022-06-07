import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, 
  TablePagination, 
  Typography, 
  Menu, 
  MenuItem, 
  Divider, 
  FormControlLabel, 
  Slider, 
  Checkbox, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  TableContainer, 
  Table, 
  TableHead, 
  TableCell, 
  TableBody, 
  TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { CLEAR_ALL_CUSTOMERS, SET_CUSTOMER } from '../../../actions/types';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import GenericButton from '../../../components/admin-dashboard/GenericButton'
import DepositAndWithdrawalTable from '../../../components/admin-dashboard/DepositTable'
// import { ADMIN_FILTERS } from '../../../utils/constants';
import { Filter, ArrowTopRight, CloseCircleOutline } from 'mdi-material-ui';
import WithdrawalCard from '../../../components/admin-dashboard/WithdrawalCard'
import clsx from 'clsx';



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
        position: 'relative'
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

    exportBox: {
      position: 'absolute',
      top: 47,
      right: 1,
      borderRadius: 5,
      boxShadow: '1px 1px 1px 1.5px #c7c7c7',
      display: 'flex',
      flexDirection: 'column',
      

      '& span': {
          fontSize: '.9vw',
          backgroundColor: 'white',
          padding: '10px 20px',
          width: '6vw',

          '&:hover': {
              backgroundColor: '#1E6262',
              color: 'white'
          }
      }
    },

  filterBoxContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    zIndex: 1000,
    // width: '100%',
    height: '100%',
  },

  filterBoxContent: {
      width: 400,
      // height: 200,
      backgroundColor: 'white',
      borderRadius: 10,
      boxShadow: '1px 1px 1px 1.3px #c7c7c7',
  },

  filterBoxHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 0px',
      padding: '.7rem 1.5rem',
      borderBottom: '1px solid #CBCBCB',
      alignItems: 'center',

      '& span': {
          fontSize: '1rem',
          cursor: 'pointer'
      }
  },

  filterBoxMain: {
      // padding: '1rem 1.5rem',
  },

  filterContentDate: {
      marginTop: '.6rem',
      // marginBottom: '1.5rem',
      padding: '1rem 1.5rem',

      '& label': {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,

          fontSize: '1rem',

          '& input': {
              height: 30,
              borderRadius: 5,
              outline: 'none',
              border: '1px solid #C4C4C4',
              padding: 5
          }
      }
  },

  filterTransactionType: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      padding: '1rem 1.5rem',
      gap: '.5rem',

      // marginBottom: '1.5rem'
  },

  filterAmount: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #C4C4C4'
  },

  amountRange: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)'
  },

  filterButton: {
      display: 'flex',
      gap: 15,
      justifyContent: 'flex-end',
      marginRight: 10,
      padding: '1.5rem 1.5rem',
  },

  btnIcon: {
    width: 15,
    height: 15
  },

  withdrawalScreen: {
    position: 'fixed',
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(1px)',
    width: '100%',
    height: '100vh',
    top: 0,
    right: 0,
    zIndex: 1000,
    transform: 'translate(0, 84px)'
  },

  withdrawalContainer: {
    backgroundColor: 'white',
    width: '60%',
    height: '75vh',
    margin: '2rem 13vw 0 auto',
    borderRadius: 10,
    paddingTop: 30
  },

  withdrawHeader: {
    // paddingLeft: 40,
    // borderBottom: '1px solid #C4C4C4',
    // paddingBottom: 10,

    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    position: 'relative',
  },

  formGrp: {
    display: 'grid',
    paddingLeft: 40,
    gridTemplateColumns: '350px',
    marginBottom: '50px',
    gap: 40,
    marginTop: 70
  },

  btn: {
    marginLeft: 40,
  },

  headerNumber: {
    borderRadius: '50%',
    backgroundColor: '#C4C4C4',
    color: 'white',
    padding: 2,
    display: 'inline-block',
    width: 20,
    height: 20,
    textAlign: 'center',
  },

  headerTitle: {
    display: 'grid',
    gridTemplateColumns: 'max-content max-content',
    alignItems: 'center',
    gap: 15,
    color: '#C4C4C4',

    borderBottom: '1px solid #C4C4C4',
    paddingBottom: 10,
    cursor: 'pointer',

    '&:first-child': {
      paddingLeft: 40,
    }
  },

  headerNumberActive: {
    backgroundColor: '#1E6262',
  },

  headerTitleActive: {
    color: 'black',
    borderBottom: '1px solid #1E6262',
  },

  withdrawalTable: {
    width: '100%',
    // height: 300,
    marginTop:30,
    borderRadius: 10,
    // backgroundColor: 'white',
    // boxShadow: '1px 1px 1px 1px #c7c7c7',
  },

  withdrawalTableBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr .5fr .5fr 1fr',
    
    '& span': {
      fontSize: 13,
      padding: '11px 15px',
      borderBottom: '1px solid #c7c7c7'
    },
  },

  authorize: {
    display: 'grid',
    paddingLeft: 40,
    gridTemplateColumns: '350px',
    marginBottom: '20px',
    gap: 20,
    marginTop: '15px'
  }
}));

const columns = [
  { id: 'id', label: '', maxWidth: 10 },
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

const withdrawalColumns = [
  {
    id: 'fullname',
    label: 'Full name',
    format: (value) => value.toLocaleString('en-US'),
  },
  // {
  //   id: 'institutionId',
  //   label: 'Institution ID',
  //   format: (value) => value.toLocaleString('en-US'),
  // },
  {
    id: 'reference',
    label: 'Reference',
    format: (value) => value.toLocaleString('en-US'),
  },
  // {
  //   id: 'walletId',
  //   label: 'Wallet ID',
  //   format: (value) => value.toLocaleString('en-US'),
  // },
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
    id: 'payment status',
    label: 'Payment status',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'date',
    label: 'Date',
    format: (value) => value.toLocaleString('en-US'),
  },
];

// const pages = [10, 25, 50, 100]

const gridColumns = '.3fr 1fr 1fr 1fr 1fr .8fr 1fr 0.5fr';
// const withdrawalGridCol = "1fr 1fr 1fr 1fr 1fr .5fr .5fr 1fr"

function valuetext(value) {
  // console.log('valueText', value)
  return `${value}°C`;
}

const Withdrawals = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null)

  const [openFilterBx, setOpenFilterBx] = useState(false)
  const [openXport, closeXport] = useState(false);
  const [value, setValue] = useState([1, 70]);

  const [withdrawalScreen, setWithdrawalScreen] = useState(false);
  const [screen, setScreen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


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

    
    const downloadAll = async () => {
      // await exportAllUserRecords(admin)
    }

    const downloadRecords = () => {
      // let data = []        
      // switch (tab) {
      //     case ALL_LISTINGS:
      //         data = [...listings];
      //         break;

      //     case ALL_OPEN:
      //         data = [...activeListings];
      //         break;
          
      //     case ALL_COMPLETED:
      //         data = [...finalisedListings];
      //         break;

      //     case ALL_NEGOTIATIONS:
      //         data = [...inProgressListings];
      //         break;

      //     case ALL_DELETED:
      //         data = [...deletedListings];
      //         break;

      //     default:
      //         break;
      // }

      // if (exportRecords(data, admin, tab)?.errors) {
      //     return
      // }
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
        <WithdrawalCard cardTitle="Total Withdrawal"/>

        <Box component="div" sx={{ display: 'flex', position: 'relative', gap: '10px', justifyContent: 'flex-end', marginTop: 20, marginBottom: 20 }}>
          <GenericButton clickAction={() => setWithdrawalScreen(() => {
            setScreen(true)
            return !withdrawalScreen
          })} buttonName="Manual" fontColor="#1E6262" fontsize="15px" bxShadw="none" bdaColor="#1E6262" />
          <GenericButton clickAction={() => setWithdrawalScreen(() => {
            setScreen(true)
            return !withdrawalScreen
          })} buttonName="Auto" fontColor="white" fontsize="15px" bxShadw="none" bgColor="#1E6262" />
          <GenericButton fontsize="15px" clickAction={() => setOpenFilterBx(() => {
            closeXport(false)
            return !openFilterBx
          })} buttonName="Filter">
              <Filter className={classes.btnIcon} />
          </GenericButton>
          <GenericButton fontsize="15px" clickAction={() => closeXport(() => {
            setOpenFilterBx(false)
            return !openXport
          })} buttonName="Export">
              <ArrowTopRight className={classes.btnIcon} />
              {
                  openXport ? 
                  <Box className={classes.exportBox} component="span">
                      <Typography onClick={downloadAll} component="span">Export All</Typography>
                      <Typography onClick={downloadRecords} component="span">Export Page</Typography>
                  </Box> : ''
              }
          </GenericButton>
          {
              openFilterBx ? 
              <Box component="div" className={classes.filterBoxContainer}>
                <Box component="div" className={classes.filterBoxContent}>
                  <Box component="div" className={classes.filterBoxHeader}>
                    <Typography component="h6" variant="h6">Filter</Typography>
                    <Typography component="span" onClick={() => setOpenFilterBx(false)}>x</Typography>
                  </Box>
                  <Box component="div" className={classes.filterBoxMain}>
                    <Box component="div" className={classes.filterContentDate}>
                      <label>
                          Date
                          <input type="date" />
                      </label>
                    </Box>

                    <Box component="div" className={classes.filterTransactionType}>
                      <Typography variant="body1">Transaction Type</Typography>
                      <Box component="div" className={classes.checkBoxContainer}>
                          <FormControlLabel control={<Checkbox defaultChecked />} label="Wallet Transfer" />
                          <FormControlLabel control={<Checkbox />} label="Deposit" />
                          <FormControlLabel control={<Checkbox defaultChecked />} label="Direct Transfer" />
                          <FormControlLabel control={<Checkbox />} label="Withdrawal" />
                      </Box>
                    </Box>

                    <Box component="div" className={classes.filterAmount}>
                      <Typography variant="body1">Amount</Typography>
                      <Box component="span" className={classes.amountRange}>
                          <Typography>$1</Typography>
                          <Typography>-</Typography>
                          <Typography>$1</Typography>
                          <Typography>-</Typography>
                          <Typography>$1</Typography>
                          <Typography>-</Typography>
                          <Typography>$1</Typography>
                      </Box>
                      <Slider
                      getAriaLabel={() => 'Temperature range'}
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      />
                    </Box>

                    <Box component="div" className={classes.filterButton}>
                      <GenericButton clickAction={() => setOpenFilterBx(false)} bdaColor="#1E6262" bxShadw="none" fontColor="#1E6262" buttonName="Cancel"/>
                      <GenericButton bdaColor="#1E6262" bxShadw="none" fontColor="white" bgColor="#1E6262" buttonName="Apply filter" />
                    </Box>
                  </Box>
                </Box>
              </Box> : ''
            }
            {/* <Menu
                id="customer-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: classes.menu }}
                disableScrollLock={ true }
            >
                <MenuItem onClick={viewDetails}>Filter by staus</MenuItem>
            </Menu> */}
        </Box>
        
        <Box component="div" className={classes.table}>
          <GenericTableHeader columns={columns} gridColumns={gridColumns} headerPadding="11px 15px" />
          <DepositAndWithdrawalTable data={customers} handleClick={handleClick} />
        </Box>

        {
          withdrawalScreen ? 
          <Box component="div" className={classes.withdrawalScreen}>
            <Box component="div" className={classes.withdrawalContainer}>
              <Box component="div" className={classes.withdrawHeader}>
                <Typography onClick={() => setScreen(true)} className={clsx(classes.headerTitle, screen && classes.headerTitleActive)} variant="h6"><Typography component="span" className={clsx(classes.headerNumber, screen && classes.headerNumberActive)}>1</Typography> Withdrawal Request</Typography>
                <Typography className={clsx(classes.headerTitle, !screen && classes.headerTitleActive)} variant="h6"><Typography component="span" className={clsx(classes.headerNumber, !screen && classes.headerNumberActive)}>2</Typography>Payment Authorization</Typography>
                <CloseCircleOutline onClick={() => setWithdrawalScreen(() => {
                  setScreen(false)
                  return !withdrawalScreen
                })} style={{ cursor: 'pointer', position: 'absolute', top: -15, right: 14 }} />
              </Box>

              {
                screen ? 
                  <>
                    <Box component="div" className={classes.formGrp}>
                      <TextField
                        variant="outlined"
                        id="demo-helper-text-aligned"
                        label="Number of request"
                        size="medium"
                      />

                      <FormControl sx={{ m: 1, minWidth: 120 }} size="medium" variant="outlined">
                        <InputLabel id="demo-select-small">Age</InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          // value={age}
                          label="Age"
                          // onChange={handleChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button onClick={() => setScreen(false)} className={classes.btn} color="primary" size="medium" variant="contained">Submit</Button> 
                  </>
                : 
                  <>
                    <TableContainer style={{ marginTop: 20, height: '53%', overflowY: 'scroll' }}>
                      <Table aria-label="a dense table">
                        <TableHead>
                          <TableRow style={{ '& th': { fontWeight: 'bold' } }}>
                            {
                              withdrawalColumns && withdrawalColumns.map((req) => 
                                <TableCell key={req.id}>{req.label}</TableCell>      
                              )
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody> 
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">Godstrump George</TableCell>
                            <TableCell align="left">Wise</TableCell>
                            {/* <TableCell align="left">WT6464646</TableCell>
                            <TableCell align="left">WT6464646</TableCell> */}
                            <TableCell align="left">10101010101</TableCell>
                            <TableCell align="left">$ 300</TableCell>
                            <TableCell align="left">BATCHED</TableCell>
                            <TableCell align="left">Fri 03 June 2022</TableCell>
                          </TableRow>

                          <TableRow
                            sx={{ fontWeight: 'bold', '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                            Godstrump George
                            </TableCell>
                            <TableCell align="left">Wise</TableCell>
                            {/* <TableCell align="left">WT6464646</TableCell>
                            <TableCell align="left">WT6464646</TableCell> */}
                            <TableCell align="left">10101010101</TableCell>
                            <TableCell align="left">$ 300</TableCell>
                            <TableCell align="left">BATCHED</TableCell>
                            <TableCell align="left">Fri 03 June 2022</TableCell>
                          </TableRow>               
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 15]}
                      component="div"
                      // count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <Box component="div" className={classes.authorize}>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="medium" variant="outlined">
                        <InputLabel id="demo-select-small">Age</InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          // value={age}
                          label="Age"
                          // onChange={handleChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button className={classes.btn} color="primary" size="medium" variant="contained">Submit</Button> 
                    {/* <Box component="div" className={classes.withdrawalTable}>
                      <GenericTableHeader columns={withdrawalColumns} gridColumns={withdrawalGridCol} headerPadding="11px 15px" />
                      <Box component="div" className={classes.withdrawalTableBody}>
                        <Typography component="span">Revolut</Typography>
                        <Typography component="span">FXBLOOMS</Typography>
                        <Typography component="span">1011011011</Typography>
                        <Typography component="span">₤32000</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>

                        <Typography component="span">Revolut</Typography>
                        <Typography component="span">FXBLOOMS</Typography>
                        <Typography component="span">1011011011</Typography>
                        <Typography component="span">₤32000</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                      </Box>
                    </Box> */}
                  </>
              }
            </Box>
          </Box> : ''
        }

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