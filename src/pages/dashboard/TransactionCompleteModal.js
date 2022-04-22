import { useState, forwardRef, useImperativeHandle } from 'react';
import { 
    Backdrop,
    Box,
	Button,
    Fade,
	Grid,
    IconButton,
    Modal,
	Tooltip,
	Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CheckboxMarkedCircle, ShareVariant } from 'mdi-material-ui';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    TelegramShareButton,
    TelegramIcon,
    WhatsappShareButton,
    WhatsappIcon
} from 'react-share';
import toast, { Toaster } from 'react-hot-toast';

import { COLORS, SHADOW } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '45vw',
        height: '30vw',
        boxShadow: SHADOW,
        padding: theme.spacing(5, 10),

        [theme.breakpoints.down('md')]: {
            height: '50vw',
            width: '60vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '60vh',
            width: '90vw'
        }
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',

        '& p': {
            fontWeight: 300
        }
    },

    icon: {
        color: theme.palette.primary.main,
        alignSelf: 'center',
        fontSize: theme.spacing(5)
    },

    shareContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
        alignItems: 'center',
        alignSelf: 'center',

        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
        }
    },

    button: {
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(5.5),
        width: theme.spacing(5.5)
    }
}));

const URL = 'https://www.fxblooms.com';
const message = 'Hello, I just exchanged on FXBLOOMS, and it was smooth and seamless. I highly recommend their service';
const hashtags = ['remittance', 'peerexchange', 'P2P', 'Currencyexchange', 'Africansinabroad', 'Africansbackhome'];

const TelegramShare = () => {
    const classes = useStyles();

    return (
        <Tooltip title="Share via Telegram" arrow>
            <TelegramShareButton
                url={URL}
                title={message}
            >
                <TelegramIcon  className={classes.button} />
            </TelegramShareButton>
        </Tooltip>
    );
};

const WhatsappShare = () => {
    const classes = useStyles();

    return (
        <Tooltip title="Share via Whatsapp" arrow>
            <WhatsappShareButton
                url={URL}
                title={message}
            >
                <WhatsappIcon  className={classes.button} />
            </WhatsappShareButton>
        </Tooltip>
    );
};

const TransactionCompleteModal = forwardRef((_props, ref) => {
	const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },

        closeModal: () => {
            setOpen(false);
        }
    }));

    const share = async () => {
        const shareData = {
            title: 'FXBLOOMS',
            text: message,
            url: URL,
        }

        await navigator.share(shareData);
        toast.success('Thanks for telling others about us');
    };

	return (
        <>
            <Toaster />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                disableEscapeKeyDown
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Grid container className={classes.container}>
                        <Grid item xs={12} className={classes.item}>
                            <CheckboxMarkedCircle className={classes.icon} />
                            <Typography variant="subtitle1" component="p">Your transaction is now completed, thanks for using FXBLOOMS.</Typography>
                            <Typography variant="subtitle1" component="p">Kindly tell others about your experience.</Typography>
                            <Box component="div" className={classes.shareContainer}>
                                {matches ? 
                                    <>
                                        <IconButton onClick={share}>
                                            <ShareVariant />
                                        </IconButton>
                                        <Typography variant="subtitle1" component="p">Share with friends</Typography>
                                    
                                    </>
                                    :
                                    <>
                                        <Tooltip title="Share via Facebook" arrow>
                                            <FacebookShareButton
                                                url={URL}
                                                quote={message}
                                                hashtag={hashtags}
                                            >
                                                <FacebookIcon  className={classes.button} />
                                            </FacebookShareButton>
                                        </Tooltip>
                                        <Tooltip title="Share via Twitter" arrow>
                                            <TwitterShareButton
                                                via={` ${message}`}
                                                url={URL}
                                                hashtags={hashtags}
                                            >
                                                <TwitterIcon  className={classes.button} />
                                            </TwitterShareButton>
                                        </Tooltip>
                                        <TelegramShare />
                                        <WhatsappShare />
                                    </>
                                }
                            </Box>
                            <Button variant="contained" onClick={() => setOpen(false)} color="primary" fullWidth>Close</Button>
                        </Grid>
                    </Grid>
                </Fade>
            </Modal>
        </>
	);
});

export default TransactionCompleteModal;