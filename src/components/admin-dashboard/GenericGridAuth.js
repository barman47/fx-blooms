import Status from '../../components/admin-dashboard/Status'
import { Box, Typography } from '@material-ui/core';
import { DotsHorizontal } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme =>({
  
  btnGroup: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    alignItems: 'center',
  },

  btnLeft: {
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    textAlign: 'center',
    width: '206px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    border: '1px solid #E3E3E3',
    fontSize: theme.spacing(1.7),
    borderRadius: theme.spacing(.7)
  }
}))

const GenericGridAuth = ({ statusName, bgColor, textColor, twoFactorName, mb, hasSetup2FASetup  }) => {
  const classes = useStyles()

  return (
    <Box component="div" sx={{ marginBottom: mb }} className={classes.btnGroup}>
      <Typography className={classes.btnLeft} component="div">{ twoFactorName } &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Typography>
      <Typography className={classes.btn} component="div">
        <Status wdth="100px"  statusName={statusName} bgColor={bgColor} textColor={textColor} />
      </Typography>
    </Box>
  )
}

export default GenericGridAuth