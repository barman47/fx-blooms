import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FileDocumentEdit } from 'mdi-material-ui';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import { SET_LISTING } from '../../../actions/types';
import { COLORS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, EDIT_LISTING, MAKE_LISTING } from '../../../routes';

const useStyles = makeStyles(theme => ({
	root: {
        backgroundColor: COLORS.white,
        borderRadius: '5px',
        boxShadow: SHADOW,
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginBottom: theme.spacing(3),

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
                fontSize: theme.spacing(1.4),

                [theme.breakpoints.down('lg')]: {
                    fontSize: theme.spacing(1.2)
                },

                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(1)
                },  
            }
        }
	},

    editIcon: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },

    disabled: {
        color: COLORS.grey,
        pointerEvents: 'disabled'
    }
}));

const EditListingItem = ({ edit, listing }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const listingId = useSelector(state => state.listings?.listing?.id);

    const setListing = (listing) => {
        if (location.pathname.includes(MAKE_LISTING)) {
            dispatch({
                type: SET_LISTING,
                payload: listing
            });
            return history.push(`${DASHBOARD}${EDIT_LISTING}`);
        }
        return dispatch({
            type: SET_LISTING,
            payload: listing
        });
    };
    
    return (
        <section className={classes.root}>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    {`${getCurrencySymbol(listing?.amountAvailable?.currencyType)}${formatNumber(listing?.amountAvailable?.amount)}`}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    {`${getCurrencySymbol(listing?.amountNeeded?.currencyType)}${formatNumber(listing?.amountNeeded?.amount)}`}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    {`${getCurrencySymbol(listing?.minExchangeAmount?.currencyType)}${formatNumber(listing?.minExchangeAmount?.amount)}`}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    {`${getCurrencySymbol(listing?.amountNeeded?.currencyType)}${formatNumber(listing?.exchangeRate)} to ${getCurrencySymbol(listing?.amountAvailable?.currencyType)} 1`}
                </Typography>
                {listing.bank && 
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Paying from</span>
                        {listing.bank}
                    </Typography>
                }
                <Tooltip title="Edit Listing" aria-label="Edit Listing" arrow>
                    <FileDocumentEdit 
                        className={clsx(classes.editIcon, { [`${classes.disabled}`]: edit === true && listing.id === listingId })} 
                        // onClick={edit === true && listing.id === listingId ? () => {} : () => setListing(listing)} 
                        onClick={() => setListing(listing)} 
                    />
                </Tooltip>
            </div>
        </section>
    );
};

EditListingItem.propTypes = {
    edit: PropTypes.bool,
    listing: PropTypes.object.isRequired
};

export default EditListingItem;