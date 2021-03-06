import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    Grid,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import { AUTH_TOKEN, COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5, 2, 5),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0, 1, 1, 1),
            width: '95%',
        }
    },

    text: {
        fontWeight: 300,
        marginBottom: theme.spacing(2),
    },

    content: {
        width: '60%',
        [theme.breakpoints.down('md')]: {
            width: '90%'
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    fundingRequest: {
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1),
        padding: theme.spacing(2),
        margin: '10px  auto',

        [theme.breakpoints.down('sm')]: {
            margin: 0,
            marginBottom: theme.spacing(2)
        },

        '& section': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }
}));



const FundConfirmation = ({ handleSetTitle }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const { wallets, fundingRequest } = useSelector(state => state.wallets);

    useEffect(() => {
        // Set token to localStorage from sessionStorage
        localStorage.setItem(AUTH_TOKEN, sessionStorage.getItem(AUTH_TOKEN));
        handleSetTitle('Funding Details');

        if (_.isEmpty(fundingRequest)) {
            navigate(-1);
        }
        // eslint-disable-next-line
    }, []);

    const getWalletCurrency = (walletId) => {
        const wallet = wallets.find(wallet => wallet.id === walletId);
        return wallet.currency.value;
    };

    return (
        <Box component="section" className={classes.root}>
            <Typography variant="h6" color="primary">Funding Details</Typography>
            <Typography variant="body2" component="p" className={classes.text}>Kindly confirm the details you provided below and proceed to Authorize Funding or go back if you need to make any changes.</Typography>
            <Box component="div" className={classes.content}>
                <Box component="div" className={classes.fundingRequest}>
                    <Box component="section">
                        <Typography variant="body2" component="p">Method</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.fundingMethod.toUpperCase()}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Customer</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.customer.toUpperCase()}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Currency</Typography>
                        <Typography variant="body2" component="p">{getWalletCurrency(fundingRequest.walletId)}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Amount</Typography>
                        <Typography variant="body2" component="p">{formatNumber(fundingRequest.amount, 2)}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Account Name</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.accountName.toUpperCase()}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Account Number</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.accountNumber}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Institution</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.institution}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Reference</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.reference}</Typography>
                    </Box>
                    <Divider />
                    <Box component="section">
                        <Typography variant="body2" component="p">Status</Typography>
                        <Typography variant="body2" component="p">{fundingRequest.status.replace('_', ' ')}</Typography>
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
                            onClick={() => window.open(fundingRequest.authorisationUrl, '_self')}
                        >
                            Authorize Funding
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default FundConfirmation;