import { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, TextField, Typography, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

import isEmpty from '../../../utils/isEmpty';
import validateSetPin from '../../../utils/validation/pin/setPin';
import { COLORS } from '../../../utils/constants';
import moveToNextField from '../../../utils/moveToNextField';
import handleSetValue from '../../../utils/handleSetValue';

import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    // root: {
    //     height: '100vh',
    //     paddingLeft: theme.spacing(35),
    //     paddingRight: theme.spacing(35)
    // },

    title: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    label: {
        color: COLORS.offBlack,
        fontWeight: 300,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },

    inputs: {
        marginTop: theme.spacing(2)
    },

    input: {
        '& .MuiOutlinedInput-input': {
            textAlign: 'center'
        }
    },

    button: {
        width: '50%'
    }
}));

const SetPin = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');
    const [fifth, setFifth] = useState('');
    const [sixth, setSixth] = useState('');
    const [seventh, setSeventh] = useState('');
    const [eighth, setEighth] = useState('');
    const [errors, setErrors] = useState({});
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);

    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();
    const fifthField = useRef();
    const sixthField = useRef();
    const seventhField = useRef();
    const eighthField = useRef();
    const toast = useRef();

    // Show error toast and error messages when there is a message
    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            first,
            second,
            third,
            fourth,
            fifth,
            sixth,
            seventh,
            eighth
        };

        const { errors, isValid } = validateSetPin(data);

        if (!isValid) {
            return setErrors(errors);
        }

        // const pin = `${first}${second}${third}${fourth}`;
    };
    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <Box component="section" className={classes.root}>
                <Typography variant="h6" color="primary" className={classes.title}>Set-up a 4-Digit Security PIN</Typography>
                <Typography variant="body2" component="p" className={classes.label}>Enter a new 4 digit PIN to reset your PIN</Typography>
                <form onSubmit={handleFormSubmit} noValidate>
                    <Grid className={classes.inputs} container direction="row" justifyContent="center" alignItems="center" spacing={matches ? 2 : 3}>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="p">Enter PIN</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={first}
                                onChange={(e) => {
                                    handleSetValue(e.target.value, setFirst);
                                    // setFirst(e.target.value)
                                }}
                                onKeyUp={(e) => moveToNextField(e.target, secondField.current, null)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={firstField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={second}
                                onChange={(e) => setSecond(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, thirdField.current, firstField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={secondField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={third}
                                onChange={(e) => setThird(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, fourthField.current, secondField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={thirdField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={fourth}
                                onChange={(e) => setFourth(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, fifthField.current, thirdField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={fourthField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="p">Re-enter PIN</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={fifth}
                                onChange={(e) => setFifth(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, sixthField.current, fourthField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={fifthField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={sixth}
                                onChange={(e) => setSixth(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, seventhField.current, fifthField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={sixthField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={seventh}
                                onChange={(e) => setSeventh(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, eighthField.current, sixthField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={seventhField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={eighth}
                                onChange={(e) => setEighth(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, null, seventhField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={!isEmpty(errors) ? true : false}
                                ref={eighthField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit"
                                variant="contained" 
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    );
};

export default SetPin;