import { useMemo } from 'react'
import {
  Typography,
  Box
} from '@material-ui/core';
import clsx from 'clsx'


const AmlBoard = ({ amlTitle, amlNumber, classes, editable, formField, clsxAmlTitleStyles, clsxAmlNumStyles }) => {

  const AMLBoard = useMemo(() => {
    return (
    <>
      <Box component="div" className={classes.amlTable}>
        <Typography className={clsx(classes.amlTitle, clsxAmlTitleStyles)} variant="subtitle1">{amlTitle}</Typography>
        {
          !!editable ? formField : 
          <Typography className={clsx(classes.amlNumber, clsxAmlNumStyles)} variant="subtitle1">{amlNumber}</Typography>
        }
      </Box>
    </>
    )
  }, [amlTitle, amlNumber, classes, editable, formField, clsxAmlTitleStyles, clsxAmlNumStyles])

  
  return AMLBoard
}

export default AmlBoard;