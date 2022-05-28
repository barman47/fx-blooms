import Status from '../../components/admin-dashboard/Status'
import { Box, Typography } from '@material-ui/core';
import { DotsHorizontal } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme =>({
  
  btnGroup: {
    display: 'grid',
    gap: '1.1vw',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  btnLeft: {
    boxSizing: 'border-box',
    padding: '.1vw .1vw .1vw .2vw',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    border: '1px solid #E3E3E3',
    fontSize: '.7vw',
    borderRadius: theme.spacing(.7),
    alignItems: 'center',
  }
}))

const GenericGridAuth = ({ statusName, bgColor, textColor, twoFactorName, mb, btnWidth, gridColumns, conditionalStyles  }) => {
  const classes = useStyles()

  return (
    <Box component="div" sx={{ marginBottom: mb, gridTemplateColumns: gridColumns ?? '2fr 1fr', }} className={classes.btnGroup}>
      <Typography style={{ width: btnWidth ?? '10.8vw'}} className={classes.btnLeft} component="div">{ twoFactorName } &nbsp; &nbsp; &nbsp; <DotsHorizontal /></Typography>
      <Status extraStyles={conditionalStyles} wdth="max-content" fontSz=".9vw" statusName={statusName} bgColor={bgColor} textColor={textColor} />
    </Box>
  )
}

export default GenericGridAuth