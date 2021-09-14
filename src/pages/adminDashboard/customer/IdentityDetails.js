import { useState } from 'react'; 
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box, 
    Divider,
    Grid,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';
import { getIdCardValidationResponse, getResidencePermitValidationResponse } from '../../../actions/customer';

import ImagePreviewModal from '../../../components/common/ImagePreviewModal';

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        padding: [[theme.spacing(2), theme.spacing(3)]],
        height: '100%',

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    header: {
        color: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 500,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },

    label: {
        fontWeight: 300
    },

    info: {
        fontWeight: 600
    },

    photograph: {
        borderRadius: theme.shape.borderRadius,
        width: '100%'
    },

    idCard: {
        borderRadius: theme.shape.borderRadius,
        width: '100%'
    }
}));

const IdentityDetails = ({ getIdCardValidationResponse, getResidencePermitValidationResponse }) => {
    const classes = useStyles();
    const { customer } = useSelector(state => state.customers);
    const { customerId } = useSelector(state => state.customer);
    
    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [alt, setAlt] = useState('');

    const handleCloseModal = () => {
        setModalImage('');
        setAlt('');
        setOpen(false);
    };

    const handleModalOpen = (img, alt) => {
        setModalImage(img);
        setAlt(alt);
        setOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <ImagePreviewModal handleCloseModal={handleCloseModal} open={open} alt={alt} img={modalImage} />
            <Grid className={classes.root} container direction="column">
                <Grid item>
                    <Box className={classes.header}>
                        <Typography variant="subtitle2">Identity Details</Typography>
                    </Box>
                </Grid>
                <Divider />
                <br />
                <Grid item>
                    <button onClick={() => getIdCardValidationResponse(customer.id)}>ID Check</button>
                    <button onClick={() => getResidencePermitValidationResponse(customer.id)}>Profile Check</button>
                    {/* <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Type</Typography>
                                <Typography variant="subtitle2" className={classes.info}>{customer?.documentation?.documentType}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Document Number</Typography>
                                <Typography variant="subtitle2" className={classes.info}>{customer?.documentation?.idNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Front</Typography>
                                <br />
                                <img src={customer?.documentation?.img} alt="" className={classes.idCard} onMouseEnter={() => handleModalOpen(customer?.documentation?.img, 'ID Card Front')} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Back</Typography>
                                <br />
                                <img src={customer?.documentation?.img} alt=""  className={classes.idCard} onMouseEnter={() => handleModalOpen(customer?.documentation?.img, 'ID Card Back')} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Photograph</Typography>
                                <img src={customer.img} alt="" className={classes.photograph} onMouseEnter={() => handleModalOpen(customer.img, 'Photograph')} />
                            </Grid>
                        </Grid>
                    </form> */}
                </Grid>
            </Grid>
        </>
    );
};

IdentityDetails.propTypes = {
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired
};

export default connect(undefined, { getIdCardValidationResponse, getResidencePermitValidationResponse })(IdentityDetails);