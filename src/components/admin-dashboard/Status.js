import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx'

const useStyles = makeStyles(theme =>({

  status: {
    padding: theme.spacing(.4, 1.3), 
    borderRadius: '7px',
    boxShadow: '3px 2px 3px #DCDCDC',
    textAlign: 'center'
  }
}))

const Status = ({ statusName, textColor, bgColor, wdth, fontSz, extraStyles }) => {
  const classes = useStyles()
  
  return (
    <Typography style={{ fontSize: fontSz ?? '16px', fontWeight: '300', color: textColor, backgroundColor: bgColor, width: wdth }} className={clsx(classes.status, extraStyles)} variant="body2">
      {statusName}
    </Typography>
  )
}

export default Status