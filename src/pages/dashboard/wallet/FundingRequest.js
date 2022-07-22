import { connect } from 'react-redux';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Refresh } from 'mdi-material-ui';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getFundingDetails } from '../../../actions/wallets';

import formatNumber from '../../../utils/formatNumber';
import { convertToLocalTime } from '../../../utils/getTime';
import { COLORS, FUNDING_STATUS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    fundingRequest: {
        // backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '0.5fr 0.5fr 0.5fr 0.5fr 0.5fr',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        padding: theme.spacing(1),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr'
        },

        '& section': {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing(0.5),

            [theme.breakpoints.down('md')]: {
                alignItems: 'center',
                gridTemplateColumns: '0.6fr 1fr'
            },

            '& p': {
                fontWeight: 300,
                textAlign: 'center',

                [theme.breakpoints.down('md')]: {
                    textAlign: 'left'
                }
            },

            '& h6': {
                fontSize: theme.spacing(1.7),
                fontWeight: 600,
                margin: 0,

                [theme.breakpoints.down('md')]: {
                    textAlign: 'left'
                }
            }
        }
    },

    button: {
        [theme.breakpoints.down('md')]: {
            gridColumn: '1 / span 2'
        }
    }
}));

const FundingRequest = ({ date, amount, status, currency, paymentId, paymentRequestId, getFundingDetails, handleSetLoading }) => {
    const classes = useStyles();

    const handleRefreshStatus = () => {
        handleSetLoading(true);
        getFundingDetails(paymentId, paymentRequestId);
    };

    const { PENDING } = FUNDING_STATUS;

    return (
        <section className={classes.fundingRequest}>
            <Box component="section">
                <Typography variant="body2" component="p">Status</Typography>
                <Typography 
                    variant="h6"
                    style={{
                        color: status === PENDING ? COLORS.orange : COLORS.primary,
                        fontWeight: 600
                    }}
                >
                    {status}
                </Typography>
            </Box>
            <Box component="section">
                <Typography variant="body2" component="p">Amount</Typography>
                <Typography variant="h6">{formatNumber(amount, 2)}</Typography>
            </Box>
            <Box component="section">
                <Typography variant="body2" component="p">Time</Typography>
                <Tooltip title={`${moment(convertToLocalTime(date)).format('DD/MM/YYYY by H:mm a')}`} arrow placement="bottom" style={{ cursor: 'pointer' }}>
                    <Typography variant="h6">{moment(convertToLocalTime(date)).fromNow()}</Typography>
                </Tooltip>
            </Box>
            <Box component="section">
                <Typography variant="body2" component="p">Currency</Typography>
                <Typography variant="h6">{currency}</Typography>
            </Box>
            <Box component="section">
                <Typography variant="body2" component="p"></Typography>
                <Button
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    startIcon={<Refresh />}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    onClick={handleRefreshStatus}
                    disabled={status.toUpperCase() === FUNDING_STATUS.COMPLETED ? true : false}
                >
                    Refresh
                </Button>
            </Box>
        </section>
    );
};

FundingRequest.propTypes = {
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    // reference: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    paymentId: PropTypes.string.isRequired,
    paymentRequestId: PropTypes.string.isRequired,
    getFundingDetails: PropTypes.func.isRequired,
    handleSetLoading: PropTypes.func.isRequired
};

export default connect(undefined, { getFundingDetails })(FundingRequest);