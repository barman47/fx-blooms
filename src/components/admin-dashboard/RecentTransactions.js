import {
  Box,
  Typography
} from '@mui/material';

const RecentTransactions = ({ classes, recentName, children, recentDate, recentAmount}) => {

  return (
    <>
      <Box component="div" className={classes.recentList}>
          {/* <iconComponent className={classes.recentIcon} color="primary" /> */}
          { children }
          <Typography className={classes.recentName}  component="h6" variant="h6">{ recentName }</Typography>
      </Box>
      <Box component="div" className={classes.recentList}>
          <Typography className={classes.recentDivider} component="span" variant="subtitle1">
          </Typography>
          <Typography className={classes.recentDate} component="span" variant="subtitle1">{ recentDate }</Typography>
          <Typography className={classes.recentAmount} component="h6" variant="subtitle1">&#43; &#163; { recentAmount }</Typography>
      </Box>
    </>
  )
}

export default RecentTransactions;