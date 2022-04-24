import { FormControl, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme =>({
  select: {
    fontSize: theme.spacing(1.5),
    minWidth: theme.spacing(3),
    paddingBottom: theme.spacing(0.6),
    paddingTop: theme.spacing(0.6),
    backgroundColor: 'white',
    border: '.7px solid #E6E6E6',
    boxShadow: '3px 2px 3px grey',

    '&:active': {
      outline: 'none'
    }
  },
}))

const GenericSelect = ({ FILTERS, selectValue, setOnChange, loading }) => {
  const classes = useStyles();

  return (
    <FormControl 
        variant="outlined"
    >
        <Select
            value={selectValue}
            onChange={(e) => setOnChange(e.target.value)}
            displayEmpty
            classes={{ select: classes.select }}
            inputProps={{ 'aria-label': 'Filter', MenuProps: {disableScrollLock: true} }}
            name="usersFilter"
            disabled={loading}
        >
            <MenuItem value="" disabled>Filter</MenuItem>
            {Object.entries(FILTERS).map(([key, value], index) => (
                <MenuItem key={index} value={value}>{value}</MenuItem>
            ))}
        </Select>
    </FormControl>
  )
}

export default GenericSelect;