import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormatListText } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';
import { addBid } from '../../../actions/listings';
import { getIdVerificationLink } from '../../../actions/customer';
import { SET_LISTING } from '../../../actions/types';

import IDVerificationModal from '../listings/IDVerificationModal';
import Listing from './Listing';

const useStyles = makeStyles(theme => ({
    noListingContent: {
		backgroundColor: COLORS.lightTeal,
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
		padding: [[theme.spacing(4), 0]]
    },

    noListingIcon: {
        color: theme.palette.primary.main
    },

    noListingText: {
        color: COLORS.grey,
        fontWeight: 300,
        marginTop: theme.spacing(2)
    }
}));

const Listings = ({ getIdVerificationLink }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { document, img } = useSelector(state => state.customer.profile);
    const idVerificationLink = useSelector(state => state.customer.idVerificationLink);
    const { listings } = useSelector(state => state.listings);

    const idVerificationModal = useRef();

    useEffect(() => {
        if (!document && !img) {
            getIdVerificationLink();
        }

        // eslint-disable-next-line
    }, []);

    const checkUserId = () => {
        idVerificationModal.current.openModal();
    };

    const handleAddBid = (e, listing) => {
        e.preventDefault();
        if (!document && !img) {
            return checkUserId();
        }
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
        addBid({
            listingId: listing.id,
            amount: {
                currencyType: listing.minExchangeAmount.currencyType,
                amount: listing.minExchangeAmount.amount
            }
        }, history);
    };

    const dismissAction = () => {
        // Redirect to getID
        window.location.href = idVerificationLink;
    };

    return (
        <>
            <IDVerificationModal ref={idVerificationModal} dismissAction={dismissAction} />
            {listings.length > 0 ? 
                listings.map((listing, index) => (
                    <Listing key={index} listing={listing} handleAddBid={handleAddBid} />
                ))
                :
                <div className={classes.noListingContent}>
                    <FormatListText className={classes.noListingIcon} />
                    <Typography className={classes.noListingText} variant="subtitle2" component="span">No listings found</Typography>
                </div>
            }
        </>
    );
}

Listings.propTypes = {
    addBid: PropTypes.func.isRequired,
    getIdVerificationLink: PropTypes.func.isRequired
};

export default connect(undefined, { addBid, getIdVerificationLink })(Listings);