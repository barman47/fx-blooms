import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Box, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getCurrencies } from '../../../actions/currencies';

const useStyles = makeStyles(theme => ({
    root: {
        border: '1px solid red'
    }
}));

const Transactions = ({ getCurrencies }) => {
    const classes = useStyles();

    const { currencies } = useSelector(state => state);

    const [currency, setCurrency] = useState('ALL');
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currencies.length === 0) {
            // setLoading(true);
            getCurrencies();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Box component="section" className={classes.root}>
            <Typography variant="h6">Transaction History</Typography>
            <Typography variant="body2" component="p">Here are your recent transactions</Typography>
            <Box component="section">
                <Box component="div">
                    <FormControl 
                        variant="outlined" 
                        // error={errors.ReceivingAccount ? true : false } 
                        fullWidth 
                        required
                        disabled={loading ? true : false}
                    >
                        <Select
                            labelId="Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value="ALL" selected>ALL</MenuItem>
                            {currencies.map((currency, index) => <MenuItem key={index} value={currency}>{currency}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </Box>
    );
};

Transactions.propTypes = {
    getCurrencies: PropTypes.func.isRequired
};

export default connect(undefined, { getCurrencies })(Transactions);