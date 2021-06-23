import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    Fade,
	Grid,
    Modal,
	TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS, SHADOW } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: SHADOW
    },

    container: {
		backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
		padding: theme.spacing(4, 2),
        minWidth: '80%',
        width: '80%',

        [theme.breakpoints.down('sm')]: {
            overflowY: 'auto'
        },

        '& header': {
            marginBottom: theme.spacing(4),
            textAlign: 'center',
            
            '& h6': {
                fontWeight: 600,
            },

            '& span': {
                [theme.breakpoints.down('sm')]: {
                    display: 'inline-block',
                    textAlign: 'left',
                }
            }
        }
	}
}));

const SellerAccountModal = ({ open, handleCloseModal }) => {
	const classes = useStyles();

	const [AccountName, setAccountName] = useState('');
    const [AccountNumber, setAccountNumber] = useState('');
    const [BankName, setBankName] = useState('');

    // eslint-disable-next-line
	const [errors, setErrors] = useState({});

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid item lg={3} className={classes.container}>
                    <header>
                        <div>
                            <Typography variant="h6">Add Account Details</Typography>
                            <Typography variant="subtitle1" component="span">You are required to provide your bank details after your second listing.</Typography>
                        </div>
                    </header>
                    <form>
                        <Grid container direction="row" spacing={2} className={classes.formContainer}>
                            <Grid item xs={12}>
                                <TextField
                                    value={AccountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Name"
                                    label="Account Name" 
                                    helperText={errors.AccountName}
                                    fullWidth
                                    required
                                    error={errors.AccountName ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={AccountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Number"
                                    label="Account Number" 
                                    helperText={errors.AccountNumber}
                                    fullWidth
                                    required
                                    error={errors.AccountNumber ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={BankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Bank Name"
                                    label="Bank Name" 
                                    helperText={errors.BankName}
                                    fullWidth
                                    required
                                    error={errors.BankName ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Fade>
        </Modal>
	);
};

SellerAccountModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default SellerAccountModal;