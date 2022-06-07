// import { useState } from 'react';
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader';
import GenericButton from '../../../components/admin-dashboard/GenericButton';
import { TrashCanOutline, Plus } from 'mdi-material-ui'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#F8F9FA',
    paddingLeft: 30,
    paddingTop: 20,
    height: '100vh',

    '& h2': {
      fontSize: 19,
      fontWeight: 'bold',
    }
  },

  table: {
    width: '60%',
    // height: 300,
    marginTop:30,
    borderRadius: 10,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 1px #c7c7c7',
  },

  tableBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr 1.5fr 1fr .5fr',
    
    '& span': {
      fontSize: 13,
      padding: '11px 15px',
      borderBottom: '1px solid #c7c7c7'
    }
  },

  icon: {
    textAlign: 'center',
  },

  addBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 100,
    marginRight: 10,
    paddingBottom: 11
  }
}))


const columns = [
  // { id: 'id', label: ''},
  {
    id: 'institution',
    label: 'Institution',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'account name',
    label: 'Account name',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'account acct',
    label: 'Account number',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'balance',
    label: 'Balance',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
      id: 'actions',
      label: 'Actions',
      format: (value) => value.toLocaleString('en-US'),
  },
];

const gridColumns = '1fr 1.4fr 1.5fr 1fr .5fr';

const FXBAccounts = () => {
  const classes = useStyles();

  // const [data, setData] = useState([{}])


  return (
    <>
      <Box component="div" className={classes.root}>
        <Typography variant="h2">FXBLOOMS Bank Accounts</Typography>
        <Box component="div" className={classes.table}>
          <GenericTableHeader columns={columns} gridColumns={gridColumns} headerPadding="11px 15px" />
          <Box component="div" className={classes.tableBody}>
            <Typography component="span">Revolut</Typography>
            <Typography component="span">FXBLOOMS</Typography>
            <Typography component="span">1011011011</Typography>
            <Typography component="span">₤32000</Typography>
            <Typography className={classes.icon} component="span"><TrashCanOutline /></Typography>

            <Typography component="span">Revolut</Typography>
            <Typography component="span">FXBLOOMS</Typography>
            <Typography component="span">1011011011</Typography>
            <Typography component="span">₤32000</Typography>
            <Typography className={classes.icon} component="span"><TrashCanOutline /></Typography>
          </Box>


          <Box component="div" className={classes.addBtn}>
            <GenericButton fontsize="15px" buttonName="Add account" bxShadw="none">
              <Plus style={{ width: '15px', height: '15px', color: 'green' }} />
            </GenericButton>
          </Box>
          {/* {
              data && data.map((bank, i) => (
                <Box component="div">
                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.institution}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.account}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.number}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.balance}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    ...
                  </Typography>
                </Box>
              ))
          } */}
        </Box>

        {/* {
          add ? 
        } */}
      </Box>
    </>
  )
}

export default FXBAccounts