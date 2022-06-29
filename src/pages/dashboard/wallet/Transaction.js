import { Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ContentCopy, ArrowBottomLeftThick, ArrowTopRightThick } from 'mdi-material-ui';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import { convertToLocalTime } from '../../../utils/getTime';

const useStyles = makeStyles(theme => ({
    transaction: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(0.5),
        padding: theme.spacing(1),

        '& div:first-child': {
            display: 'grid',
            gridTemplateColumns: '0.5fr 0.5fr 0.5fr 1fr 0.5fr 0.5fr',
            alignItems: 'center',

            // [theme.breakpoints.down('md')]: {
            //     gridTemplateColumns: '1fr 1fr 1fr', 
            //     gap: theme.spacing(1)  
            // },

            [theme.breakpoints.down('md')]: {
                gridTemplateColumns: '1fr'
            },

            '& section': {
                // border: '1px solid red',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: theme.spacing(0.5),
                // alignItems: 'center',
                // justifyContent: 'center',

                [theme.breakpoints.down('md')]: {
                    alignItems: 'center',
                    gridTemplateColumns: '0.6fr 1fr'
                },

                '& p': {
                    fontWeight: 300,
                    textAlign: 'center',

                    [theme.breakpoints.down('md')]: {
                        textAlign: 'left'
                    },
                },

                '& h6': {
                    fontSize: theme.spacing(1.7),
                    fontWeight: 500,
                    margin: 0,

                    [theme.breakpoints.down('md')]: {
                        textAlign: 'left'
                    },
                }
            },
        }
    },

    creditIcon: {
        color: theme.palette.primary.main,
    },

    debitIcon: {
        color: theme.palette.secondary.main,
    },

    iconContainer: {
        [theme.breakpoints.down('md')]: {
            justifySelf: 'flex-start !important'
        }
    }
}));

const Transaction = ({ date, amount, status, type, destinationAccount, sourceAccount, id }) => {
    const classes = useStyles();

    return (
        <Box component="section" className={classes.transaction}>
            <Box component="div">
                <Box component="section">
                    <Typography variant="body2" component="p">Type</Typography>
                    <Tooltip title={type} arrow placement="bottom" style={{ justifySelf: 'center' }} className={classes.iconContainer}>
                        {type === 'Credit' ?
                            <ArrowBottomLeftThick className={classes.creditIcon} />
                            :
                            <ArrowTopRightThick className={classes.debitIcon} />
                        }
                    </Tooltip> 
                </Box>
                <Box component="section">
                    <Typography variant="body2" component="p">Time</Typography>
                    <Tooltip title={`${moment(convertToLocalTime(date)).format('DD/MM/YYYY by H:mm a')}`} arrow placement="bottom" style={{ cursor: 'pointer' }}>
                        <Typography variant="h6">{moment(convertToLocalTime(date)).fromNow()}</Typography>
                    </Tooltip>
                </Box>
                <Box component="section">
                    <Typography variant="body2" component="p">Amount</Typography>
                    <Typography variant="h6">{formatNumber(amount, 2)}</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="body2" component="p">Account</Typography>
                    <Typography variant="h6">{type === 'Credit' ? sourceAccount : destinationAccount}</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="body2" component="p">Status</Typography>
                    <Typography variant="h6">{status}</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="body2" component="p">Transaction ID</Typography>
                    <Tooltip title="Copy transaction ID" arrow placement="bottom" style={{ justifySelf: 'center' }} className={classes.iconContainer}>
                        <IconButton
                            onClick={() => {
                                copy(id);
                                toast.success('Transaction ID copied!');
                            }}
                        >
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

Transaction.propTypes = {
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    destinationAccount: PropTypes.string,
    sourceAccount: PropTypes.string,
    id: PropTypes.string.isRequired
};

export default Transaction;