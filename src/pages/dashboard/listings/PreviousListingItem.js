import { useHistory, useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from  'clsx';
import { DeleteForever, FileDocumentEdit } from 'mdi-material-ui';

import { SET_LISTING } from '../../../actions/types';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import { deleteListing } from '../../../actions/listings';
import { COLORS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { EDIT_LISTING, MAKE_LISTING } from '../../../routes';

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

    deleteIcon: {
        color: COLORS.darkRed
    },

    editIcon: {
        color: theme.palette.primary.main
    },

    disabled: {
        color: COLORS.grey,
        pointerEvents: 'disabled'
    }
}));

const PreviousListingItem = ({ deleteListing, listing }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const { open } = LISTING_STATUS;

    const setListing = (listing) => {
        if (listing.status !== open) {
            return;
        }
        if (location.pathname.includes(MAKE_LISTING)) {
            dispatch({
                type: SET_LISTING,
                payload: listing
            });
            return history.push(EDIT_LISTING);
        }
        return dispatch({
            type: SET_LISTING,
            payload: listing
        });
    };

    const handleDeleteListing = () => {
        if (listing.status !== open) {
            return;
        }
        const confirm = window.confirm('Are you sure you want to delete this listing?');
        if (confirm) {
            deleteListing(listing.id);
        }
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
                    {listing?.minExchangeAmount?.amount ? `${listing?.minExchangeAmount?.currencyType}${formatNumber(listing?.minExchangeAmount?.amount)}` : `${listing?.amountAvailable?.currencyType}${formatNumber(listing?.amountAvailable?.amount)}`}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    {`${getCurrencySymbol(listing?.amountNeeded?.currencyType)}${formatNumber(listing?.exchangeRate)} to ${getCurrencySymbol(listing?.amountAvailable?.currencyType)} 1`}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Paying from</span>
                    {listing.bank.toUpperCase()}
                </Typography>
                <section>
                    <Tooltip title="Edit Listing" aria-label="Edit Listing" arrow>
                        <FileDocumentEdit 
                            className={clsx(classes.editIcon, { [`${classes.disabled}`]: listing.status !== open })} 
                            style={{ cursor: listing.status !== open ? 'not-allowed' : 'pointer' }}
                            onClick={() => setListing(listing)} 
                            disabled={listing.status !== open ? true : false}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Listing" aria-label="Delete Listing" arrow style={{ marginLeft: '10px' }}>
                        <DeleteForever 
                            className={clsx(classes.deleteIcon, { [`${classes.disabled}`]: listing.status !== open })} 
                            style={{ cursor: listing.status !== open ? 'not-allowed' : 'pointer' }}
                            onClick={handleDeleteListing} 
                            disabled={listing.status !== open ? true : false}
                        />
                    </Tooltip>
                </section>
            </div>
        </section>
    );
};

PreviousListingItem.propTypes = {
    deleteListing: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired
};

export default connect(undefined, { deleteListing })(PreviousListingItem);