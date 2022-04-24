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
      padding: '4px 10px',
      backgroundColor: 'white',
      color: '#3C4257',
      boxShadow: '3px 2px 3px grey',
      // border: 'none',
      border: '1px solid #ACAFB7',
      borderRadius: '5px',
      cursor: 'pointer',

      '& p': {
        fontWeight: 500,
        fontSize: theme.spacing(2.2),
        textAlign: 'center',
      }
    }
  },

  disabled: {
    color: '#9DA0AB !important',
    border: '1px solid #EFEFF0 !important',
  }
}))

const GenericButton = ({  buttonName, children, isDisabled, clickAction }) => {

  const classes = useStyles()

  const handleDisabled = useMemo(() => clsx({
    [classes.disabled]: !!isDisabled
  }), [isDisabled, classes.disabled])

  return (
    <Box component="span" className={classes.btn}>
      <button onClick={clickAction} type="button" disabled={isDisabled} className={handleDisabled}>
        <Typography>{ children }</Typography>
        <Typography>{ buttonName }</Typography>     
    </button>
    </Box>
  )
}

export default GenericButton