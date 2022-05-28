import { useMemo } from 'react'
import {
  Typography,
  Box
} from '@material-ui/core';
import clsx from 'clsx'


const AmlBoard = ({ amlTitle, amlNumber, classes, editable, formField, clsxAmlTitleStyles, otherStyles }) => {

  const AMLBoard = useMemo(() => {
    return (
    <>
      <Box component="div" className={classes.amlTable}>
        <Typography className={clsx(classes.amlTitle, clsxAmlTitleStyles)} variant="subtitle1">{amlTitle}</Typography>
        {
          !!editable ? formField : 
          <Typography className={clsx(classes.amlNumber, otherStyles)} variant="subtitle1">{amlNumber}</Typography>
        }
      </Box>
    </>
    )
  }, [amlTitle, amlNumber, classes, editable, formField, clsxAmlTitleStyles, otherStyles])

  
  return AMLBoard
}

export default AmlBoard;