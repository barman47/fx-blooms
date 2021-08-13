import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { 
    Backdrop,
	Button,
    CircularProgress,
    Fade,
	FormControl,
	FormHelperText,
	Grid,
	MenuItem,
    Modal,
	Select,
	TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CloudUpload } from 'mdi-material-ui';
import { getListingsOpenForBid } from '../../../actions/listings';
import { addResidentPermit } from '../../../actions/customer';
import { getDocuments } from '../../../actions/documents';
import validateResidencePermit from '../../../utils/validation/customer/residencePermit';

import Spinner from '../../../components/common/Spinner';

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
        padding: theme.spacing(3),
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

    error: {
        color: COLORS.red,
        fontSize: theme.spacing(1.5)
    },

    clearButton: {
        color: 'red',
        transition: '0.3s linear all',

        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
        }
    },

    progress: {
        // backgroundColor: COLORS.lightTeal,
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        color: COLORS.offWhite,
        display: 'inline-block',
        marginTop: '10px',
        textAlign: 'center',
        width: '100%'
    }
}));

const ResidencePermitModal = ({ addResidentPermit, open, handleCloseModal,  getDocuments }) => {
    const classes = useStyles();

    const { documents } = useSelector(state => state);
    const errorsState = useSelector(state => state.errors);

    const [PermitFront, setPermitFront] = useState('');
    const [permitFrontUrl, setPermitFrontUrl] = useState('');
    const [permitFrontPhoto, setPermitFrontPhoto] = useState(null);
    const [uploadedPermitFront, setUploadedIdFront] = useState(false);
    
    const [PermitBack, setPermitBack] = useState('');
    const [permitBackUrl, setPermitBackUrl] = useState('');
    const [permitBackPhoto, setPermitBackPhoto] = useState(null);
    const [uploadedPermitBack, setUploadedPermitBack] = useState(false);

	const [idNumber, setIdNumber] = useState('');
	const [documentType, setDocumentType] = useState('');
	const [document, setDocument] = useState('');

	const [errors, setErrors] = useState({});
	const [loadingText, setLoadingText] = useState('');
	const [loading, setLoading] = useState(false);

    const [backUploadProgress, setBackUploadProgress] = useState('');
    const [frontUploadProgress, setFrontUploadProgress] = useState('');

    useEffect(() => {
        if (isEmpty(documents)) {
            getDocuments();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
        }
    }, [errorsState, errors]);

    useEffect(() => {
        if (documentType) {
            const item = documents.find(item => item.text === documentType);
            setDocument(item.value);
        }
    }, [documents,documentType]);

    const uploadPermitFront = async () => {
        setErrors({});
        try {
            const file = PermitFront;
            if (!file) {
                return setErrors({ msg: 'Photo is required!', idFront: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', idFront: 'Photo must not be greater than 3MB' });
            }

            setLoading(true);
            setLoadingText('Uploading Front . . .');
            
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    setFrontUploadProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
                }
            });
            setPermitFrontUrl(res.data.fileName);
            setUploadedIdFront(true);
            setLoading(false);
            setFrontUploadProgress('');
        } catch (err) {
            setFrontUploadProgress('');
            return handleError(err, 'idFront', 'ID upload failed');
        }
    };

    const uploadPermitBack = async () => {
        setErrors({});
        try {
            const file = PermitBack;
            if (!file) {
                return setErrors({ msg: 'Photo is required!', permitBack: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', permitBack: 'Photo must not be greater than 3MB' });
            }

            setLoadingText('Uploading Back . . .');
            setLoading(true);
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    setBackUploadProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
                }
            });
            setPermitBackUrl(res.data.fileName);
            setUploadedPermitBack(true);
            setLoading(false);
            setBackUploadProgress('');
        } catch (err) {
            setBackUploadProgress('');
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

    const onSubmit = (e) => {
		e.preventDefault();
		setErrors({});

        const data = {
            idNumber,
            documentType: document,
            img: permitFrontUrl,
            backImg: permitBackUrl
        };
        
        const { errors, isValid } = validateResidencePermit(data);

        if (!isValid) {
            console.log(errors);
            return setErrors(errors);
        }

        setErrors({});
        setLoading(true);
        addResidentPermit(data);
	};

	return (
        <>
            {loading && <Spinner text={loadingText} />}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                disableEscapeKeyDown={loading ? true : false}
                disableBackdropClick={loading ? true : false}
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
                                            error={errors.img ? true : false}
                                        />
                                        {
                                            PermitFront ? 
                                            <>
                                                <div style={{backgroundImage: `url(${permitFrontPhoto})`,}} className={classes.permitPhoto}></div>
                                                <br />
                                                {
                                                    uploadedPermitFront
                                                    ?
                                                    <span className={classes.uploadSuccess}>ID Front Uploaded</span>
                                                    :
                                                    <>
                                                        <Button onClick={selectPermitFront} color="primary" disabled={loading ? true : false}>Change Photo</Button>
                                                        <Button onClick={uploadPermitFront} variant="contained" color="primary" size="small" disabled={loading ? true : false}>Upload</Button>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className={classes.fileUpload} onClick={selectPermitFront}>
                                                    <Typography variant="subtitle2" component="span">Upload a clear photograph of your resident permit</Typography>
                                                    <CloudUpload className={classes.uploadIcon} />
                                                </div>
                                                <span className={classes.progress}>{`${frontUploadProgress}${Number(backUploadProgress) > 0 ? '%' : ''}`}</span>
                                            </>
                                        }
                                        {errors.img && <span className={classes.error}>{errors.img}</span>}
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
                                            helperText={errors.backImg || 'ID Card Back'}
                                            fullWidth
                                            error={errors.backImg ? true : false}
                                        />
                                        {
                                            PermitBack ? 
                                            <>
                                                <div style={{backgroundImage: `url(${permitBackPhoto})`,}} className={classes.permitPhoto}></div>
                                                <br />
                                                {
                                                    uploadedPermitBack
                                                    ?
                                                    <span className={classes.uploadSuccess}>ID Back Uploaded</span>
                                                    :
                                                    <>
                                                        <Button onClick={selectPermitBack} color="primary" disabled={loading ? true : false}>Change Photo</Button>
                                                        <Button onClick={uploadPermitBack} variant="contained" color="primary" size="small" disabled={loading ? true : false}>Upload</Button>
                                                    </>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className={classes.fileUpload} onClick={selectPermitBack}>
                                                    <Typography variant="subtitle2" component="span">Upload a clear photograph of your resident permit</Typography>
                                                    <CloudUpload className={classes.uploadIcon} />
                                                </div>
                                                <span className={classes.progress}>{`${backUploadProgress}${Number(backUploadProgress) > 0 ? '%' : ''}`}</span>
                                            </>
                                        }
                                        {errors.backImg && <span className={classes.error}>{errors.backImg}</span>}
                                    </Grid>
                                    {(!permitFrontUrl && !permitBackUrl) && 
                                        <Grid item xs={12}>
                                            <Button className={classes.clearButton} onClick={removeFiles} disabled={loading ? true : false}>Clear</Button>
                                        </Grid>	
                                    }
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" component="span">Identity Card Type</Typography>
                                        <FormControl 
                                            variant="outlined" 
                                            error={errors.documentType ? true : false}
                                            fullWidth 
                                            required
                                        >
                                            <Select
                                                labelId="idCardType"
                                                className={classes.input}
                                                value={documentType}
                                                onChange={(e) => setDocumentType(e.target.value)}
                                            
                                            >
                                                <MenuItem value="">Select ID type</MenuItem>
                                                {documents.length > 0 &&
                                                    documents.map((document, index) => (
                                                        <MenuItem key={index} value={document?.text}>{document?.text}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                            <FormHelperText>{errors.documentType}</FormHelperText>
                                        </FormControl>
                                    </Grid>		
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" component="span">ID Number</Typography>
                                        <TextField 
                                            className={classes.input}
                                            value={idNumber}
                                            onChange={(e) => setIdNumber(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Document Number"
                                            helperText={errors.idNumber}
                                            fullWidth
                                            required
                                            error={errors.idNumber ? true : false}
                                        />
                                    </Grid>			
                                    <Grid item xs={12}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            color="primary"
                                            fullWidth
                                            disabled={loading ? true : false}
                                        >
                                            {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                        </Button>
                                    </Grid>			
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Fade>
            </Modal>
        </>
	);
};

ResidencePermitModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    addResidentPermit: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired
};

export default connect(undefined, { addResidentPermit, getListingsOpenForBid, getDocuments })(ResidencePermitModal);