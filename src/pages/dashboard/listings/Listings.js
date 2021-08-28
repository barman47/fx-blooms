import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormatListText } from 'mdi-material-ui';

import { APPROVED, COLORS, NOT_SUBMITTED, PENDING, REJECTED } from '../../../utils/constants';
import { addBid } from '../../../actions/listings';
import { GET_ERRORS, SET_LISTING } from '../../../actions/types';

import Spinner from '../../../components/common/Spinner';
import IDVerificationModal from '../listings/IDVerificationModal';
import PendingIdModal from './PendingIdModal';
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

const Listings = ({ addBid }) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const history = useHistory();

    const { idStatus } = useSelector(state => state.customer.stats);
    const errorsState = useSelector(state => state.errors);
    const idVerificationLink = useSelector(state => state.customer.idVerificationLink);
    const { listings } = useSelector(state => state.listings);

    const [showPendingIdModal, setShowPendingIdModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const idVerificationModal = useRef();

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors(errorsState);
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    const checkIdStatus = () => {
        switch (idStatus) {
            case APPROVED:
                break;

            case PENDING:
                showPendingIdModal(true);
                break;

            case REJECTED:
                verifyUserId();
                break;

            case NOT_SUBMITTED:
                verifyUserId();
                break;

            default:
                break;
        }
    };

    const verifyUserId = () => {
        idVerificationModal.current.openModal();
    };

    const handleAddBid = (e, listing) => {
        e.preventDefault();
        if (idStatus !== APPROVED) {
            return checkIdStatus();
        } 

        setLoading(true);
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
        window.location.href = idVerificationLink;
    };

    const handleClosePendingIdModal = () => {
        setShowPendingIdModal(false);
    };

    return (
        <>
            <PendingIdModal open={showPendingIdModal} handleCloseModal={handleClosePendingIdModal} />
            <IDVerificationModal ref={idVerificationModal} dismissAction={dismissAction} />
            {loading && <Spinner />}
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
    addBid: PropTypes.func.isRequired
};

export default connect(undefined, { addBid })(Listings);