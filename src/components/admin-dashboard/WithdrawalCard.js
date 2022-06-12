import { useState } from 'react';
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GenericSelect from './GenericSelect';
import { ADMIN_FILTERS } from '../../utils/constants';
import { Triangle } from 'mdi-material-ui';


const useStyles = makeStyles((theme) => ({
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
      fontSize: '1.5vw',
      color: '#A0AEC0',
      marginBottom: theme.spacing(3),
      fontStretch: '50%'
  },

  withdrawalCardAmount: {
      fontSize: '2vw',
      color: '#1E6262',
      fontWeight: '900 !important',
      fontStretch: '50%'
  },

  percentage: {
      display: 'grid',
      gridTemplateColumns: '15px 25px',
      // color: '#1E6262',
      alignSelf: 'center',
      color: 'red',
      alignItems: 'center',
      
      '& svg': {
          fontSize: '.5vw',
          // marginTop: '13px',
          transform: 'rotate(180deg)',
      },

      '& span': {
          fontSize: '1vw',
      }
  },

  selectBtn: {
      justifySelf: 'flex-end',
      marginTop: theme.spacing(-3)
  },
}))

const WithdrawalCard = ({ cardTitle, totalAmount }) => {
  const classes = useStyles()

  const [ withdrawalFilter, setDepositFilter ] = useState('')
  const [ loadingDeposit ] = useState(false)


  return (
    <Box component="div" className={classes.withdrawalCard}>
      <Typography variant="h6" className={classes.withdrawalCardTitle} >{ cardTitle }</Typography>
      <Typography component="span" variant="body2" className={classes.selectBtn}>
          <GenericSelect FILTERS={ADMIN_FILTERS} selectValue={withdrawalFilter} setOnChange={setDepositFilter} loading={loadingDeposit}/>
      </Typography>
      
      <Typography variant="h6" className={classes.withdrawalCardAmount}>EUR 350000000.00</Typography>
      <Typography component="span" className={classes.percentage}>
          <Triangle />
          <Typography component="span" variant="subtitle2">4.5%</Typography>
      </Typography>
    </Box>
  )
}

export default WithdrawalCard