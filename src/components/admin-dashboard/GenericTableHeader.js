import { Box, Typography, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme =>({

  tableHeaderRow: {
      display: 'grid',

      color: '#3C3C3C',
      borderBottom: '2px solid #E3E8EE',
      '& span': {
          fontWeight: '600',
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          fontSize: theme.spacing(2.2),
          fontStretch: '50%'
      }
  },
}));



const GenericTableHeader = ({ columns, gridColumns, headerPadding }) => {
  const classes = useStyles();

  return (
    <>
      <Box component="section" sx={{ gridTemplateColumns: gridColumns, padding: `${headerPadding ? headerPadding : '11.2px 0'}` }} className={classes.tableHeaderRow}>
          {
              columns && columns.map((column) => (
                  <Typography component="span" key={column.id} className={classes.tableCell} variant="subtitle1">
                          { column.label}
                  </Typography>
              ))
          }
      </Box>
    </>
  )
}

export default GenericTableHeader;