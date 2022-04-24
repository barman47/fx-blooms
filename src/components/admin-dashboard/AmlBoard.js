import {
  Typography,
  Box
} from '@material-ui/core';

const AmlBoard = ({ amlTitle, amlNumber, classes }) => {

  return (
    <>
      <Box component="div" className={classes.amlTable}>
        <Typography className={classes.amlTitle} variant="subtitle1">{amlTitle}</Typography>
        <Typography className={classes.amlNumber} variant="subtitle1">{amlNumber}</Typography>
      </Box>
    </>
  )
}

export default AmlBoard;