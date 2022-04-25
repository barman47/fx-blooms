import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormatListText } from 'mdi-material-ui';

import { BID_STATUS, COLORS, ID_STATUS, LISTING_STATUS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import { acceptOffer, addBid, checkListingEditable } from '../../../actions/listings';
import { GET_ERRORS, SET_BID, SET_LISTING, TOGGLE_ACCEPT_OFFER, TOGGLE_BID_STATUS } from '../../../actions/types';

import IDVerificationModal from '../listings/IDVerificationModal';
import PendingIdModal from './PendingIdModal';
import BuyerPaymentDrawer from './BuyerPaymentDrawer';
import Listing from './Listing';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';
import AcceptOfferDrawer from './AcceptOfferDrawer';

const { APPROVED, NOT_SUBMITTED, PENDING, REJECTED } = ID_STATUS;
const { open } = LISTING_STATUS;

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

const Listings = ({ acceptOffer, addBid, checkListingEditable }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { customerId, stats } = useSelector(state => state.customer);
    const { idStatus } = useSelector(state => state.customer.stats);
    const errorsState = useSelector(state => state.errors);
    const idVerificationLink = useSelector(state => state.customer.idVerificationLink);
    const { addedBid, acceptedOffer, listings, msg } = useSelector(state => state.listings);

    const [showPendingIdModal, setShowPendingIdModal] = useState(false);
    const [openAcceptOfferDrawer, setOpenAcceptOfferDrawer] = useState(false);
    const [openBuyerPaymentDrawer, setOpenBuyerPaymentDrawer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const idVerificationModal = useRef();
    const toast = useRef();

    const { IN_PROGRES } = BID_STATUS;

    useEffect(() => {
        if (errorsState?.msg) {
            setLoading(false);
            setErrors({ msg: errorsState.msg });
        }
    }, [errorsState]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errors]);

    const checkIdStatus = useCallback(() => {
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
    }, [idStatus, showPendingIdModal]);

    const toggleAcceptOfferDrawer = useCallback(() => {
        setOpenAcceptOfferDrawer(!openAcceptOfferDrawer);
    }, [openAcceptOfferDrawer]);

    const toggleBuyerPaymentDrawer = useCallback(() => {
        setOpenBuyerPaymentDrawer(!openBuyerPaymentDrawer);
    }, [openBuyerPaymentDrawer]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
        }
    }, [msg]);
    
    useEffect(() => {
        if (acceptedOffer) {
            setLoading(false);
            toggleAcceptOfferDrawer();
            dispatch({
                type: TOGGLE_ACCEPT_OFFER
            });
        }
    }, [acceptedOffer, dispatch, toggleAcceptOfferDrawer]);

    useEffect(() => {
        if (addedBid) {
            setLoading(false);
            toggleBuyerPaymentDrawer();
            dispatch({
                type: TOGGLE_BID_STATUS
            });
        }
    }, [addedBid, dispatch, toggleBuyerPaymentDrawer]);

    const verifyUserId = () => {
        idVerificationModal.current.openModal();
    };

    const handleAcceptOffer = (listing) => {
        let activeOffer = false;
        let yourOffer = false;
        if (listing.status !== open) {
            for (let listingBid of listing.bids) {
                if (listingBid.customerId === customerId && listingBid.status === BID_STATUS.IN_PROGRES) {
                    yourOffer = true;
                    break;
                }
                
                if (listingBid.status === BID_STATUS.IN_PROGRES) {
                    activeOffer = true;
                    break;
                }
                
            }
        }

        if (yourOffer) {
            return setErrors({ msg: 'You already have an active offer' });
        }

        if (activeOffer) {
            return setErrors({ msg: 'This listing has an active offer' });
        }

        dispatch({
            type: SET_LISTING,
            payload: listing
        });
        toggleAcceptOfferDrawer();
    };

    const handleAddBid = (listing) => {
        if (stats.idStatus === NOT_SUBMITTED && stats.residencePermitStatus === NOT_SUBMITTED) {
            return checkIdStatus();
        }

        if (listing.status === open) {
            setLoading(true);
            return addBid({
                listingId: listing.id,
                amount: {
                    currencyType: listing.amountAvailable.currencyType,
                    amount: listing.amountAvailable.amount
                }
            }, listing);
        }

        let activeBid = true;
        for (let listingBid of listing.bids) {
            if (listingBid.customerId === customerId && listingBid.status === IN_PROGRES) {
                activeBid = false;
                batch(() => {
                    dispatch({
                        type: SET_BID,
                        payload: listingBid
                    });
                    dispatch({
                        type: SET_LISTING,
                        payload: listing
                    });
                });
                return setOpenBuyerPaymentDrawer(true);
            }
        }

        if (activeBid) {
            return setErrors({ msg: 'This listing is currently in negotiation' });
        }
    };

    const dismissAction = () => {
        window.location.href = idVerificationLink;
    };

    const handleClosePendingIdModal = () => {
        setShowPendingIdModal(false);
    };

    const handleEditListing = (listing) => {
        setLoading(true);
        checkListingEditable(listing, navigate);
    };

    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            {openAcceptOfferDrawer && <AcceptOfferDrawer drawerOpen={openAcceptOfferDrawer} toggleDrawer={toggleAcceptOfferDrawer} />}
            {openBuyerPaymentDrawer && <BuyerPaymentDrawer drawerOpen={openBuyerPaymentDrawer} toggleDrawer={toggleBuyerPaymentDrawer} />}
            <PendingIdModal open={showPendingIdModal} handleCloseModal={handleClosePendingIdModal} />
            <IDVerificationModal ref={idVerificationModal} dismissAction={dismissAction} />
            {listings.length > 0 ? 
                listings.map((listing, index) => (
                    <Listing 
                        key={index} 
                        listing={listing} 
                        handleAcceptOffer={handleAcceptOffer} 
                        handleAddBid={handleAddBid} 
                        checkIdStatus={checkIdStatus} 
                        handleEditListing={handleEditListing} 
                    />
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
    acceptOffer: PropTypes.func.isRequired,
    addBid: PropTypes.func.isRequired,
    checkListingEditable: PropTypes.func.isRequired
};

export default connect(undefined, { acceptOffer, addBid, checkListingEditable })(Listings);