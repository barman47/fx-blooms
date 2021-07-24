import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { 
    Backdrop,
	Button,
    Fade,
	FormControl,
	FormHelperText,
	Grid,
	Link, 
	MenuItem,
    Modal,
	Select,
	TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CloudUpload } from 'mdi-material-ui';
import { getListingsOpenForBid } from '../../../actions/listings';
import validatePriceFilter from '../../../utils/validation/listing/priceFilter';

import { COLORS, UPLOAD_LIMIT } from '../../../utils/constants';
import handleError from '../../../utils/handleError';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(5),
        width: '35vw',

        '& span': {
            fontWeight: 300
        }
    },
    
    fileUpload: {
        border: `1px solid ${COLORS.grey}`,
        borderRadius: theme.shape.borderRadius,
        color: COLORS.grey,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 300,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: [[theme.spacing(8), 0]],
        
        '& span': {
            display: 'block',
            fontSize: theme.spacing(1.5),
            width: '90%'
        }

    },

    uploadIcon: {
        color: theme.palette.primary.main
    },

    photo: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(40),
        width: theme.spacing(40)
    },

    permitPhoto: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(25),
        width: '100%'
    },

    clearButton: {
        color: 'red',
        transition: '0.3s linear all',

        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
        }
    }
}));

const MobileFilterModal = ({ open, handleCloseModal }) => {
    const classes = useStyles();

    const [PermitFront, setPermitFront] = useState('');
    const [PermitFrontUrl, setPermitFrontUrl] = useState('');
    const [permitFrontPhoto, setPermitFrontPhoto] = useState(null);
    const [uploadedPermitFront, setUploadedIdFront] = useState(false);
    
    const [PermitBack, setPermitBack] = useState('');
    const [permitBackUrl, setPermitBackUrl] = useState('');
    const [permitBackPhoto, setPermitBackPhoto] = useState(null);
    const [uploadedPermitBack, setUploadedPermitBack] = useState(false);
	// eslint-disable-next-line
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
		e.preventDefault();
		setErrors({});
	};

    const uploadPermitFront = async () => {
        setErrors({});
        try {
            const file = PermitFront;
            console.log(file);
            if (!file) {
                return setErrors({ msg: 'Photo is required!', idFront: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', idFront: 'Photo must not be greater than 3MB' });
            }

            setLoading(true);
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setPermitFrontUrl(res.data.fileName);
            setUploadedIdFront(true);
            setLoading(false);
        } catch (err) {
            return handleError(err, 'idFront', 'ID upload failed');
        }
    };

    const uploadPermitBack = async () => {
        setErrors({});
        try {
            const file = PermitBack;
            console.log(file);
            if (!file) {
                return setErrors({ msg: 'Photo is required!', permitBack: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', permitBack: 'Photo must not be greater than 3MB' });
            }

            setLoading(true);
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setPermitBackUrl(res.data.fileName);
            setUploadedPermitBack(true);
            setLoading(false);
        } catch (err) {
            return handleError(err, 'permitBack', 'ID upload failed');
        }
    };

    const selectPermitFront = () => document.getElementById('permitFront').click();
    
    const selectPermitBack = () => document.getElementById('permitBack').click();

    const handleSetPermitFront = (e) => {
        setPermitFront(e.target.files[0]);
        const reader = new FileReader();

        reader.onload = (() => {
            const image = reader.result; //Array Buffer
            setPermitFrontPhoto(image);
        });
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSetPermitBack = (e) => {
        setPermitBack(e.target.files[0]);
        const reader = new FileReader();

        reader.onload = (() => {
            const image = reader.result; //Array Buffer
            setPermitBackPhoto(image);
        });
        reader.readAsDataURL(e.target.files[0]);
    };

    const removeFiles = () => {
        setPermitFront('');
        setPermitFrontUrl('');
        setPermitFrontPhoto(null);
        setUploadedIdFront(false);
    
        setPermitBack('');
        setPermitBackUrl('');
        setPermitBackPhoto(null);
        setUploadedPermitBack(false);

	    setErrors({});
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={(reason) => {
                console.log(reason);
                handleCloseModal();
            }}
            closeAfterTransition
            disableEscapeKeyDown={true}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container direction="column" spacing={1} className={classes.modalContent}>
                    <Grid item>
                        <Typography variant="h6">Resident Permit</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" component="span">You are required to provide your resident permit before making a listing.</Typography>
                    </Grid>
                    <Grid item>
                        <form onSubmit={onSubmit} noValidate>
                            <Grid container direction="row" spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span">Resident Permit (Front)</Typography>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetPermitFront}
                                        id="permitFront"
                                        type="file"
                                        variant="outlined"
                                        style={{ display: 'none' }}
                                        inputProps={{
                                            accept: 'image/*'
                                        }}
                                        fullWidth
                                        error={errors.permitFront ? true : false}
                                    />
                                    {
                                        PermitFront ? 
                                        <>
                                            <div style={{backgroundImage: `url(${permitFrontPhoto})`,}} className={classes.permitPhoto}></div>
                                            {errors.permitFront && <span className={classes.error}>{errors.permitFront}</span>}
                                            <br />
                                            {
                                                uploadedPermitFront
                                                ?
                                                <span className={classes.uploadSuccess}>ID Back Uploaded</span>
                                                :
                                                <>
                                                    <Button onClick={selectPermitFront} color="primary">Change Photo</Button>
                                                    <Button onClick={uploadPermitFront} variant="contained" color="primary" size="small">Upload</Button>
                                                </>
                                            }
                                        </>
                                        :
                                        <div className={classes.fileUpload} onClick={selectPermitFront}>
                                            <Typography variant="subtitle2" component="span">Upload a clear photograph of your resident permit</Typography>
                                            <CloudUpload className={classes.uploadIcon} />
                                        </div>
                                    }
                                </Grid>			
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span">Resident Permit (Back)</Typography>
                                    <TextField 
                                        onChange={handleSetPermitBack}
                                        id="permitBack"
                                        type="file"
                                        variant="outlined"
                                        style={{ display: 'none' }}
                                        inputProps={{
                                            accept: 'image/*'
                                        }}
                                        helperText={errors.permitBack || 'ID Card Back'}
                                        fullWidth
                                        error={errors.permitBack ? true : false}
                                    />
                                    {
                                        PermitBack ? 
                                        <>
                                            <div style={{backgroundImage: `url(${permitBackPhoto})`,}} className={classes.permitPhoto}></div>
                                            {errors.permitBack && <span className={classes.error}>{errors.permitBack}</span>}
                                            <br />
                                            {
                                                uploadedPermitBack
                                                ?
                                                <span className={classes.uploadSuccess}>ID Back Uploaded</span>
                                                :
                                                <>
                                                    <Button onClick={selectPermitBack} color="primary">Change Photo</Button>
                                                    <Button onClick={uploadPermitBack} variant="contained" color="primary" size="small">Upload</Button>
                                                </>
                                            }
                                        </>
                                        :
                                        <div className={classes.fileUpload} onClick={selectPermitBack}>
                                            <Typography variant="subtitle2" component="span">Upload a clear photograph of your resident permit</Typography>
                                            <CloudUpload className={classes.uploadIcon} />
                                        </div>
                                    }
                                </Grid>	
                                <Grid item xs={12}>
                                    <Button className={classes.clearButton} onClick={removeFiles}>Clear</Button>
                                </Grid>		
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary"
                                        fullWidth
                                        >
                                            Submit
                                    </Button>
                                </Grid>			
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

MobileFilterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default connect(undefined, { getListingsOpenForBid })(MobileFilterModal);