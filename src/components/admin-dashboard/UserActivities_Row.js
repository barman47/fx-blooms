import React, { useState, useEffect } from 'react';

import {
    Box,
    Typography
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress'

const UserActivitiesRow = ({ classname, category, number, progressNumber }) => {
  const [progress, setProgress] = useState(60);
  // const [buffer, setBuffer] = useState(10);

  // const progressRef = useRef(() => {});
  useEffect(() => {
    setProgress(progressNumber)
  }, [setProgress, progressNumber]);

  return (
    <Box component="div" className={classname}>
      <Typography component="h6" variant="subtitle2">
          {category}
      </Typography>
      <Typography component="h6" variant="subtitle2">{number}</Typography>
      <Typography component="h6" variant="subtitle2">
        <Typography style={{ fontSize: '.9vw'}}>{ progress + '%' }</Typography>
        <LinearProgress color="success" variant="determinate" value={progress} />
        </Typography>
    </Box>
  )
}

export default UserActivitiesRow;