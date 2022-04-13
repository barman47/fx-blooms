import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { 
    Button, 
    Container, 
    IconButton,
    TextField,
    Tooltip,
    Typography 
    } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Toast from '../../components/common/Toast';

import { logout } from '../../actions/customer';
import { getBarcode } from '../../actions/twoFactor';
import { COLORS } from '../../utils/constants';
import { VERIFY_2FA } from '../../routes';

import logo from '../../assets/img/logo.svg';
import { ContentCopy } from 'mdi-material-ui';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },
    
    content: {
        backgroundColor: COLORS.lightTeal,
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
        width: 'initial',

        [theme.breakpoints.down('sm')]: {
            width: '90vw'
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
        width: '15%',

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

const QrCode = (props) => {
    const classes = useStyles();
    
    const navigate = useNavigate();

    const { barcode } = useSelector(state => state.twoFactor);
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [msg, setMsg] = useState('');

    const toast = useRef();

    useEffect(() => {
        props.getBarcode();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (barcode?.qrCodeSetupImageUrl) {
            setBarcodeImage(barcode.qrCodeSetupImageUrl);
        }
    }, [barcode.qrCodeSetupImageUrl]);

    useEffect(() => {
        if (msg) {
            toast.current.handleClick();
        }
    }, [msg])

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
        setMsg('Code copied');
    };


    return (
        <>
            <Helmet><title>Setup Two Factor Authentication | FXBLOOMS.com</title></Helmet>
            {msg && 
                <Toast 
                    ref={toast}
                    duration={5000}
                    msg={msg}
                    type="success"
                />
            }
            <Container className={classes.root}>
                <RouterLink to="/" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </RouterLink>
                <div className={classes.content}>
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
                        value={barcode.manualEntryKey}
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                    />
                    <Typography variant="subtitle1" component="p">Once FXBLOOMS is registered, you'll see a 6-digit code on your authenticator app</Typography>
                    <Button variant="contained" color="primary" component={RouterLink} to={VERIFY_2FA} className={classes.button}>Proceed</Button>
                    <Button className={clsx(classes.button, classes.cancelButton)} onClick={() => props.logout(navigate)}>Cancel</Button>
                </div>
            </Container>
        </>
    );
}

QrCode.propTypes = {
    getBarcode: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { getBarcode, logout })(QrCode);