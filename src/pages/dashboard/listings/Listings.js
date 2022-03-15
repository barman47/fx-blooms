import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormatListText } from 'mdi-material-ui';

import { COLORS, ID_STATUS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import { addBid, checkListingEditable } from '../../../actions/listings';
import { GET_ERRORS, SET_BID, SET_LISTING, TOGGLE_BID_STATUS } from '../../../actions/types';

import IDVerificationModal from '../listings/IDVerificationModal';
import PendingIdModal from './PendingIdModal';
import SendEurDrawer from './SendEurDrawer';
import Listing from './Listing';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';

const { APPROVED, NOT_SUBMITTED, PENDING, REJECTED } = ID_STATUS;

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

const Listings = ({ addBid, checkListingEditable }) => {
    const classes = useStyles();
    const history = useHistory();

    const dispatch = useDispatch();

    const { customerId, stats } = useSelector(state => state.customer);
    const { idStatus } = useSelector(state => state.customer.stats);
    const errorsState = useSelector(state => state.errors);
    const idVerificationLink = useSelector(state => state.customer.idVerificationLink);
    const { addedBid, listings, msg } = useSelector(state => state.listings);

    const [showPendingIdModal, setShowPendingIdModal] = useState(false);
    const [openSendEurDrawer, setOpenSendEurDrawer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const idVerificationModal = useRef();
    const toast = useRef();

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

    const toggleSendEurDrawer = useCallback(() => {
        setOpenSendEurDrawer(!openSendEurDrawer);
    }, [openSendEurDrawer]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
        }
    }, [msg]);
    
    useEffect(() => {
        if (addedBid) {
            setLoading(false);
            toggleSendEurDrawer();
            dispatch({
                type: TOGGLE_BID_STATUS
            });
        }
    }, [addedBid, dispatch, toggleSendEurDrawer]);

    // useEffect(() => {
    //     if (openSendEurDrawer) {
    //         getAccount(listing.sellersAccountId);
    //     } else {
    //         dispatch({
    //             type: SET_ACCOUNT,
    //             payload: {}
    //         });
    //     }
    // }, [dispatch, getAccount, listing.sellersAccountId, openSendEurDrawer]);

    const verifyUserId = () => {
        idVerificationModal.current.openModal();
    };

    const shouldResumeTransaction = (bids) => {
        let resume = false;
        for (const bid of bids) {
            if (bid.status === 'IN_PROGRESS' && bid.customerId === customerId) {
                console.log('Setting bid');
                dispatch({
                    type: SET_BID,
                    payload: bid
                });
                resume = true;
                break;
            }
        }
        return resume;
    };

    const handleAddBid = (listing) => {
        if (stats.idStatus === NOT_SUBMITTED && stats.residencePermitStatus === NOT_SUBMITTED) {
            return checkIdStatus();
        }

        const shouldResume = shouldResumeTransaction(listing.bids);
        if (shouldResume){
            dispatch({
                type: SET_LISTING,
                payload: listing
            });
            return toggleSendEurDrawer();
        }

        setLoading(true);
        addBid({
            listingId: listing.id,
            amount: {
                currencyType: listing.amountAvailable.currencyType,
                amount: listing.amountAvailable.amount
            }
        }, listing);
    };

    const dismissAction = () => {
        window.location.href = idVerificationLink;
    };

    const handleClosePendingIdModal = () => {
        setShowPendingIdModal(false);
    };

    const handleEditListing = (listing) => {
        setLoading(true);
        checkListingEditable(listing, history);
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
            {openSendEurDrawer && <SendEurDrawer drawerOpen={openSendEurDrawer} toggleDrawer={toggleSendEurDrawer} />}
            <PendingIdModal open={showPendingIdModal} handleCloseModal={handleClosePendingIdModal} />
            <IDVerificationModal ref={idVerificationModal} dismissAction={dismissAction} />
            {listings.length > 0 ? 
                listings.map((listing, index) => (
                    <Listing key={index} listing={listing} handleAddBid={handleAddBid} checkIdStatus={checkIdStatus} handleEditListing={handleEditListing} />
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
    checkListingEditable: PropTypes.func.isRequired
};

export default connect(undefined, { addBid, checkListingEditable })(Listings);