import { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { 
    Box, 
    Divider,
    Grid,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import image from '../../../assets/img/avatar.jpg';
import { COLORS } from '../../../utils/constants';

import ImagePreviewModal from './ImagePreviewModal';

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

const IdentityDetails = () => {
    const classes = useStyles();
    const { profile } = useSelector(state => state.customer); 

    const [img, setImg] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [idFront, setIdFront] = useState('');
    const [idBack, setIdBack] = useState('');
    
    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [alt, setAlt] = useState('');

    useEffect(() => {
        if (profile) {
            const { img, document } = profile;
            setImg(img);
            setIdFront(document?.img);
            setDocumentType(document?.documentType);
            setIdNumber(document?.idNumber);
        }
    }, [profile]);

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
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Type</Typography>
                                <Typography variant="subtitle2" className={classes.info}>{documentType}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Document Number</Typography>
                                <Typography variant="subtitle2" className={classes.info}>{idNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Front</Typography>
                                <br />
                                {/* {idFront && <img src={idFront} alt="" className={classes.photograph} onMouseEnter={handleModalOpen} />} */}
                                <img src={image} alt="" className={classes.idCard} onMouseEnter={() => handleModalOpen(image, 'ID Card Front')} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Back</Typography>
                                <br />
                                {/* {idBack && <img src={idBack} alt=""  className={classes.idCard} onMouseEnter={handleModalOpen} />} */}
                                <img src={image} alt=""  className={classes.idCard} onMouseEnter={() => handleModalOpen(image, 'ID Card Back')} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Photograph</Typography>
                                {/* {img && <img src={img} alt="" className={classes.idCard} onMouseEnter={handleModalOpen} />} */}
                                <img src={image} alt="" className={classes.photograph} onMouseEnter={() => handleModalOpen(image, 'Photograph')} />
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};

export default IdentityDetails;