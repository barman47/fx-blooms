import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme =>({

  status: {
    padding: theme.spacing(.4, 1.3), 
    fontSize: theme.spacing(2),
    borderRadius: '7px',
    boxShadow: '3px 2px 3px #DCDCDC',
    textAlign: 'center'
  }
}))

const Status = ({ statusName, textColor, bgColor, wdth }) => {
  const classes = useStyles()

  return (
    <Typography style={{ fontWeight: '300', color: textColor, backgroundColor: bgColor, width: wdth }} className={classes.status} variant="subtitle2">
      {statusName}
    </Typography>
  )
}

export default Status