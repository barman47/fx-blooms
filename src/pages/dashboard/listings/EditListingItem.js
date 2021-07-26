import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FileDocumentEdit } from 'mdi-material-ui';

import { SET_LISTING } from '../../../actions/types';
import { COLORS, SHADOW } from '../../../utils/constants';

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

const EditListingItem = ({ listing }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const listingId = useSelector(state => state.listings.listing.id);

    const setListing = (listing) => {
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
    };
    
    return (
        <section className={classes.root}>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    &#163;{listing?.amountAvailable.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    &#8358;(NGN)
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    &#163;{listing?.minExchangeAmount.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    &#8358;{listing?.exchangeRate} to &#163;1
                </Typography>
                <Tooltip title="Edit Listing" aria-label="Edit Listing" arrow>
                    <FileDocumentEdit 
                        className={clsx(classes.editIcon, { [`${classes.disabled}`]: listing.id === listingId })} 
                        onClick={listing.id === listingId ? () => {} : () => setListing(listing)} 
                    />
                </Tooltip>
            </div>
        </section>
    );
};

EditListingItem.propTypes = {
    listing: PropTypes.object.isRequired
};

export default EditListingItem;