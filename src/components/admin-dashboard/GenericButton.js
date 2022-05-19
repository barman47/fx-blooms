import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';
import clsx from 'clsx';


const useStyles = makeStyles(theme => ({

  btn: {
    '& button': {
      display: 'flex',
      gap: '10px',
      outline: 'none',
      padding: '5px 10px',
      width: 'max-content',
      // border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',

      '& p': {
        fontWeight: 400,
        textAlign: 'center',
      },
    }
  },

  disabled: {
    color: '#9DA0AB !important',
    border: '1px solid #EFEFF0 !important',
  }
}))

const GenericButton = ({ padding, buttonName, children, isDisabled, clickAction, fontColor, bgColor, fontsize, bxShadw, bdaColor }) => {

  const classes = useStyles()

  const handleDisabled = useMemo(() => clsx({
    [classes.disabled]: !!isDisabled
  }), [isDisabled, classes.disabled])

  return (
    <Box component="span" className={classes.btn}>
      <button
      onClick={clickAction} 
      type="button" 
      style={{  border: `1px solid ${bdaColor ? bdaColor : '#ACAFB7'}`, 
      color: fontColor ?? '#3C4257', 
      backgroundColor: bgColor ?? 'white', 
      boxShadow: !bxShadw ?'1px 1px 1px #dbdddd' : 'none',
      padding: padding ? padding : '' 
    }} 
      disabled={isDisabled} className={handleDisabled}
      >
        { children ? <Typography>{ children }</Typography> : ''}
        <Typography style={{ fontSize: fontsize ?? '17.6px'}} >{ buttonName }</Typography>     
      </button>
    </Box>
  )
}

export default GenericButton