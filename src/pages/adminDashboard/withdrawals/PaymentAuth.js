import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GenericButton from '../../../components/admin-dashboard/GenericButton';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'white',
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(3),
    justifyContent: 'center',
  },

  paymentContent: {
    display: 'grid',
    gridTemplateColumns: '150px max-content',
    gap: 20,

    marginTop: theme.spacing(5),
  }
}))


const PaymentAuth = () => {
  const classes = useStyles()

  return (
    <Box component="div" className={classes.root}>
      <Typography variant="h6">Payment authorization</Typography>

      <Box component="div" className={classes.paymentContent}>
        <Typography component="span">Consent token: </Typography>
        <Typography component="span">xjjxjxjx</Typography>

        <Typography component="span">Request token: </Typography>
        <Typography component="span">xvvzvzvzv</Typography>

        <Typography component="span">Type</Typography>
        <Typography component="span">Debit</Typography>

        <Box component="span" sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 20, marginTop: 25 }}>
          <GenericButton buttonName="Create payment" fontColor="white" fontsize="15px" bxShadw="none" bgColor="#1E6262" />
          <GenericButton buttonName="Cancel" fontColor="#1E6262" fontsize="15px" bxShadw="none" bdaColor="#1E6262" />
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentAuth;