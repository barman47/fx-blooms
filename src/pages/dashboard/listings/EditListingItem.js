import { useEffect } from 'react';
import { Tooltip, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
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
    }
}));

const Listing = ({ listing, handleOpenModal }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        console.log(listing);
    }, []);

    const setListing = (listing) => {
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
    };

    const showEditListingModal = (listing) => {
        setListing(listing);
        handleOpenModal();
    };
    
    return (
        <section className={classes.root}>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    &#163;{listing.amountAvailable.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    &#8358;(NGN)
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    &#163;{listing.minExchangeAmount.amount}
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    &#8358;{listing.exchangeRate} to &#163;1
                </Typography>
                <Tooltip title="Edit Listing" aria-label="Edit Listing" arrow>
                    {matches ? 
                        <FileDocumentEdit className={classes.editIcon} onClick={() => showEditListingModal(listing)} />
                        :
                        <FileDocumentEdit className={classes.editIcon} onClick={() => setListing(listing)} />
                    }
                </Tooltip>
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
