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
                padding: [[theme.spacing(1), theme.spacing(2)]]
            },

            '& p': {
                fontWeight: 300,
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(1)
                },
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
                padding: theme.spacing(1)
            },

            '& span': {
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(1)
                },  
            }
        }
	},

    button: {
        padding: [[theme.spacing(0.5), theme.spacing(5)]],
        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(0.1), theme.spacing(0.5)]],
            minWidth: 'initial'
        }
    },

    buttonLabel: {
        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(0.5), theme.spacing(0.2)]],
        }
    }
}));

const Listing = ({ listing, by, negotiation, buttonText, editListing }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();

    const setListing = (listing) => {
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
    };

    return (
        <section className={classes.root}>
            <header>
                <Typography variant="body2" component="p">
                    Listed by: <RouterLink to={`${DASHBOARD}${USER_DETAILS}`}><span style={{ color: theme.palette.primary.main }}>{by ? 'Me' : 'walecalfos'}</span></RouterLink>
                </Typography>
                <Typography variant="body2" component="p">100% Listings, 89% Completion</Typography>
            </header>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    &#163;25,000.00
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    &#8358;(NGN)
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    &#163;5,000.00
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    &#8358;650 to &#163;1
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
                            // roo: classes.buttonLabel 
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
                            // roo: classes.buttonLabel 
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
