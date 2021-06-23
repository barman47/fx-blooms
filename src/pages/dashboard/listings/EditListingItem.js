import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { FileDocumentEdit } from 'mdi-material-ui';

import { COLORS, SHADOW } from '../../../utils/constants';
import { useMediaQuery } from '@material-ui/core';

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

const Listing = ({ handleOpenModal }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));



    const editListing = () => {
        handleOpenModal();
    };
    
    return (
        <section className={classes.root}>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    &#163;25,000.00
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    &#8358;(NGN)
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    &#163;5,000.00
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    &#8358;650 to &#163;1
                </Typography>
                <Tooltip title="Edit Listing" aria-label="Edit Listing" arrow>
                    {matches ? 
                        <FileDocumentEdit className={classes.editIcon} onClick={() => editListing()} />
                        :
                        <FileDocumentEdit className={classes.editIcon} />
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
