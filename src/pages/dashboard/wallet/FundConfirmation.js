import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    Grid,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getAccount } from '../../../actions/bankAccounts';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 5, 2, 5),
        width: '80%',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0, 1, 1, 1),
            width: '90%',
        },
    },

    content: {
        // border: '1px solid red',
        width: '100%',
        // justifyContent: 'center',
    },

    fundingDetails: {
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1),
        padding: theme.spacing(2),
        // margin: theme.spacing(2, ),
        margin: '10px  auto',
        // width: '100%',

        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },

        '& section': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    },
}));



const FundConfirmation = ({ getAccount, handleSetTitle }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const { account } = useSelector(state => state.bankAccounts);
    const { wallets, fundingDetails } = useSelector(state => state.wallets);


    useEffect(() => {
        handleSetTitle('Funding Details');

        if (_.isEmpty(fundingDetails)) {
            navigate(-1);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (fundingDetails.accountId) {
            getAccount(fundingDetails.accountId);
        }
    }, [fundingDetails.accountId, getAccount]);

    const getWalletCurrency = (walletId) => {
        const wallet = wallets.find(wallet => wallet.id === walletId);
        return wallet.currency.value;
    };

    return (
        <Box component="section" className={classes.root}>
            <Typography variant="h6" color="primary" className={classes.pageTitle}>Funding Details</Typography>
            <Typography variant="body2" component="p" className={classes.pageTitle}>Kindly confirm the details you provided below and proceed to Authorize Funding or go back in you need to make changes.</Typography>
            <Box component="div" className={classes.content}>
                <Box component="div" className={classes.fundingDetails}>
                    <Box component="section">
                        <Typography variant="body2" component="p">Method</Typography>
                        <Typography variant="body2" component="p">{fundingDetails.fundingMethod}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Customer</Typography>
                        <Typography variant="body2" component="p">{fundingDetails.customer}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Funding Method</Typography>
                        <Typography variant="body2" component="p">Funding Method</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Currency</Typography>
                        <Typography variant="body2" component="p">{getWalletCurrency(fundingDetails.walletId)}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Amount</Typography>
                        <Typography variant="body2" component="p">{formatNumber(fundingDetails.amount, 2)}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Account Name</Typography>
                        <Typography variant="body2" component="p">{account.accountName}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Account Number</Typography>
                        <Typography variant="body2" component="p">{account.accountNumber}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Institution</Typography>
                        <Typography variant="body2" component="p">{account.bankName}</Typography>
                    </Box>
                    <Box component="section">
                        <Typography variant="body2" component="p">Reference</Typography>
                        <Typography variant="body2" component="p">{fundingDetails.reference}</Typography>
                    </Box>
                    <Box component="section">
                        <Typography variant="body2" component="p">Status</Typography>
                        <Typography variant="body2" component="p">{fundingDetails.status.replace('_', ' ')}</Typography>
                    </Box>
                </Box>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Button 
                            variant="outlined" 
                            size="large"
                            color="primary"
                            fullWidth
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button 
                            type="submit"
                            size="large"
                            variant="contained" 
                            color="primary"
                            fullWidth
                            onClick={() => window.open(fundingDetails.authorisationUrl)}
                        >
                            Authorize Funding
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

FundConfirmation.propTypes = {
    getAccount: PropTypes.func.isRequired
};

export default connect(undefined, { getAccount })(FundConfirmation);