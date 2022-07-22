import { useMemo } from 'react'
import CircularProgressBar from './CircularProgressBar'
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(() => ({
  exportLoader: {
    position: 'fixed',
    top: 0,
    right: '-5%',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
    // backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100vh',
    transform: 'translate(0, 84px)',

    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center'
},
}))

const ExportAllLoader = ({ loader }) => {
  const classes = useStyles()

  const exportMemo = useMemo(() => (
    <>
      {
        loader ?
        <Box component="div" className={classes.exportLoader}>
            <CircularProgressBar newWidth="40px" newHeight="40px" topMargin="50px" />
        </Box> : ''
      }
    </>
  ), [classes.exportLoader, loader])

  return exportMemo
}

export default ExportAllLoader;