import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { SET_LISTING } from '../../../actions/types';

import { COLORS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, USER_DETAILS } from '../../../routes';

const useStyles = makeStyles(theme => ({
	root: {
        borderRadius: '5px',
        boxShadow: SHADOW,
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginBottom: theme.spacing(3),

        '& header': {
            backgroundColor: COLORS.lightTeal,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: [[theme.spacing(2), theme.spacing(3)]],

            [theme.breakpoints.down('sm')]: {
                display: 'grid',
                gridTemplateColumns: '1fr',
                rowGap: theme.spacing(2),
                padding: theme.spacing(1, 2)
            },

            '& p': {
                fontWeight: 300,
                '& a': {
                    textDecoration: 'none'
                }
            }
        },

        '& div': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: [[theme.spacing(4), theme.spacing(3)]],

            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1),
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: theme.spacing(2)
            }
        },

        [theme.breakpoints.down('sm')]: {

        }
	},

    button: {
        padding: [[theme.spacing(0.5), theme.spacing(5)]],
        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    }
}));

const Listing = ({ listing, by, negotiation, buttonText, editListing }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();

    // const userId = useSelector(state => state.customer.id);

    // eslint-disable-next-line
    const { amountAvailable, amountNeeded, bids, status, minExchangeAmount, exchangeRate, listedBy, customerId } = listing;

    const setListing = (listing) => {
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
    };

    // const isMyListing = (customerId) => {
    //     if (customerId === )
    // };

    return (
        <section className={classes.root}>
            <header>
                <Typography variant="body2" component="p">
                    Listed by: <RouterLink to={`${DASHBOARD}${USER_DETAILS}`}><span style={{ color: theme.palette.primary.main }}>{listedBy}</span></RouterLink>
                    {/* Listed by: <RouterLink to={`${DASHBOARD}${USER_DETAILS}`}><span style={{ color: theme.palette.primary.main }}>{by ? 'Me' : 'walecalfos'}</span></RouterLink> */}
                </Typography>
                <Typography variant="body2" component="p">100% Listings, 89% Completion</Typography>
            </header>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    &#163;{amountAvailable.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    &#8358;{amountNeeded.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    &#163;{minExchangeAmount.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    &#8358;{exchangeRate} to &#163;1
                </Typography>
                {negotiation ? 
                    <Button 
                        disabled
                        to="#!"
                        component={RouterLink} 
                        variant="contained" 
                        size="small" 
                        color="primary"
                        disableElevation
                        classes={{ 
                            contained: classes.button,
                            root: classes.button
                        }}
                    >
                        In Negotiation
                    </Button>
                    :
                    <Button 
                        to="#!"
                        component={RouterLink} 
                        variant="contained" 
                        size="small" 
                        color="primary"
                        disableElevation
                        classes={{ 
                            contained: classes.button,
                            root: classes.button
                        }}
                        onClick={editListing ? () => { setListing(listing)} : () => {}}
                    >
                        { buttonText ? buttonText : 'Contact'}
                    </Button>
                }
            </div>
        </section>
    );
};

Listing.propTypes = {
    negotiation: PropTypes.bool,
    by: PropTypes.bool,
    buttonText: PropTypes.string

};
export default Listing;
