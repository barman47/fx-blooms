import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Button, 
    Container, 
    IconButton,
    TextField,
    Tooltip,
    Typography 
    } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

import { logout } from '../../../actions/customer';
import { enableTwoFactor, getBarcode } from '../../../actions/twoFactor';
import { SET_2FA_MSG } from '../../../actions/types';
import { COLORS } from '../../../utils/constants';

import { ContentCopy } from 'mdi-material-ui';

const useStyles = makeStyles(theme => ({
    root: {
        // padding: ,
        // marginTop: theme.spacing(-8),
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },
    
    content: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        justifyContent: 'center',
        fontWeight: 300,
        marginTop: theme.spacing(5),
        padding: theme.spacing(3),
        textAlign: 'center',

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2)
        }
    },

    image: {
        margin: '0 auto',
        width: '20vw',

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    code: {
        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.5)
        }
    },

    button: {
        margin: '0 auto',
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
        transition: '0.3s linear all',
        // width: '15%',

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },

    cancelButton: {
        color: COLORS.red,
        
        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
        }
    }
}));

const QrCode = ({ enableTwoFactor, getBarcode, toggleShowVerifyQrCode }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { hasSetup2FA } = useSelector(state => state.customer);
    const { barcode, msg } = useSelector(state => state.twoFactor);
    
    const [spinnerText, setSpinnerText] = useState('');
    const [loading, setLoading] = useState(false);
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        getBarcode();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (msg) {
            setLoading(false);
        }
    }, [msg]);

    useEffect(() => {
        if (barcode?.qrCodeSetupImageUrl) {
            setBarcodeImage(barcode.qrCodeSetupImageUrl);
        }
    }, [barcode?.qrCodeSetupImageUrl]);

    useEffect(() => {
        if (toastMessage) {
            toast.current.handleClick();
        }
    }, [toastMessage])

    const copyCode = () => {
        const el = document.createElement('textarea');
        el.value = barcode.manualEntryKey;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setToastMessage('Code copied');
    };

    const handleEnable2FA = () => {
        setSpinnerText('Enabling 2FA...');
        setLoading(true);
        enableTwoFactor();
    };

    const dismissAction = () => {
        dispatch({
            type: SET_2FA_MSG,
            payload: null
        });
    };

    return (
        <>
            {loading && <Spinner text={spinnerText} />}
            {toastMessage && 
                <Toast 
                    ref={toast}
                    duration={5000}
                    msg={toastMessage}
                    type="success"
                />
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <Container className={classes.root}>
                <div className={classes.content}>
                    {hasSetup2FA ?
                        <>
                            <Typography variant="h6" color="primary">You have two factor authentication disabled.</Typography>
                            <Typography variant="subtitle1" component="p">Click the button below to enable 2FA.</Typography>
                            <Button variant="contained" color="primary" className={classes.button} onClick={handleEnable2FA}>Enable 2FA</Button>
                        </>
                        :
                        <>
                            <Typography variant="h5">Register FXBLOOMS</Typography>
                            <Typography variant="subtitle1" component="p">Open the Google authenticator app and scan the QR code below.</Typography>
                            {barcodeImage && 
                                <img src={barcodeImage} className={classes.image} alt="QR Code" style={{ alignSelf: 'center' }} />
                            }
                            <Typography variant="subtitle1" component="p" className={classes.code}>Or enter the following code manually 
                                <IconButton
                                    aria-label="copy code"
                                    onClick={copyCode}
                                    color="primary"
                                >
                                    <Tooltip title="Copy code" placement="bottom" arrow>
                                        <ContentCopy />
                                    </Tooltip>
                                </IconButton>
                            </Typography>
                            <TextField
                                value={barcode?.manualEntryKey}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                            />
                            <Typography variant="subtitle1" component="p">Once FXBLOOMS is registered, you'll see a 6-digit code on your authenticator app</Typography>
                            <Button variant="contained" color="primary" className={classes.button} onClick={toggleShowVerifyQrCode}>Proceed</Button>
                            {/* <Button className={clsx(classes.button, classes.cancelButton)} onClick={() => props.logout(navigate)}>Cancel</Button> */}
                        </>
                    }
                </div>
            </Container>
        </>
    );
}

QrCode.propTypes = {
    enableTwoFactor: PropTypes.func.isRequired,
    getBarcode: PropTypes.func.isRequired,
    toggleShowVerifyQrCode: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { enableTwoFactor, getBarcode, logout })(QrCode);