import {
  Typography,
  Box
} from '@material-ui/core';

const AmlBoard = ({ amlTitle, amlNumber, classes, editable, formField }) => {

  return (
    <>
      <Box component="div" className={classes.amlTable}>
        <Typography className={classes.amlTitle} variant="subtitle1">{amlTitle}</Typography>
        {
          !!editable ? formField : 
          <Typography className={classes.amlNumber} variant="subtitle1">{amlNumber}</Typography>
        }
      </Box>
    </>
  )
}

export default AmlBoard;