import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FileDocumentEdit, DeleteForever } from 'mdi-material-ui';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import { deleteListing } from '../../../actions/listings';
import { DELETED_LISTING, SET_LISTING } from '../../../actions/types';
import { COLORS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, EDIT_LISTING, MAKE_LISTING } from '../../../routes';

import SuccessModal from '../../../components/common/SuccessModal';

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

    deleteButton: {
        color: COLORS.darkRed,
        cursor: 'pointer'
    },

    disabled: {
        color: COLORS.grey,
        pointerEvents: 'disabled'
    }
}));

const EditListingItem = ({ deleteListing, edit, listing }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const listingId = useSelector(state => state.listings?.listing?.id);
    const { deletedListing, msg } = useSelector(state => state.listings);

    const successModal = useRef();

    useEffect(() => {
        if (deletedListing) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [deletedListing, dispatch, msg]);

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

    const handleDeleteListing = () => {
        const confirm = window.confirm('Are you sure you want to delete this listing?');
        if (confirm) {
            deleteListing(listing.id);
        }
    };

    const dismissSuccessModal = () => {
		dispatch({
			type: DELETED_LISTING
		});
	};
    
    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
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
                    {/* {listing.bank &&  */}
                        <Typography variant="subtitle2" component="span">
                            <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Paying from</span>
                            {listing.bank}
                        </Typography>
                    {/* } */}
                    <section>
                        <Tooltip title="Edit Listing" aria-label="Edit Listing" arrow>
                            <FileDocumentEdit 
                                className={clsx(classes.editIcon, { [`${classes.disabled}`]: edit === true && listing.id === listingId })} 
                                // onClick={edit === true && listing.id === listingId ? () => {} : () => setListing(listing)} 
                                onClick={() => setListing(listing)} 
                            />
                        </Tooltip>
                        <Tooltip title="Delete Listing" aria-label="Delete Listing" arrow style={{ marginLeft: '10px' }}>
                            <DeleteForever 
                                className={classes.deleteButton}
                                onClick={handleDeleteListing} 
                            />
                        </Tooltip>
                    </section>
                </div>
            </section>
        </>
    );
};

EditListingItem.propTypes = {
    edit: PropTypes.bool,
    deleteListing: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired
};

export default connect(undefined, { deleteListing })(EditListingItem);