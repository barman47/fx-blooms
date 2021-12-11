import { connect } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { DeleteForever } from 'mdi-material-ui';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import { deleteListing } from '../../../actions/listings';
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

    deleteButton: {
        color: COLORS.darkRed,
        cursor: 'pointer'
    },

    disabled: {
        color: COLORS.grey,
        pointerEvents: 'disabled'
    }
}));

const EditListingItem = ({ deleteListing, listing }) => {
    const classes = useStyles();

    const handleDeleteListing = () => {
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
                    <Tooltip title="Delete Listing" aria-label="Delete Listing" arrow style={{ marginLeft: '10px' }}>
                        <DeleteForever 
                            className={classes.deleteButton}
                            onClick={handleDeleteListing} 
                        />
                    </Tooltip>
                </section>
            </div>
        </section>
    );
};

EditListingItem.propTypes = {
    deleteListing: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired
};

export default connect(undefined, { deleteListing })(EditListingItem);