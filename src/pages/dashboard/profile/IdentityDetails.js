import { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { 
    Box, 
    Button, 
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants'; 

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

    button: {
        fontWeight: 500
    },

    label: {
        fontWeight: 300
    },

    info: {
        fontWeight: 600
    },

    photograph: {
        height: '100%',
        width: '100%'
    },

    idCard: {
        height: '100%',
        width: '100%'
    }
}));

const IdentityDetails = () => {
    const classes = useStyles();
    const { documents } = useSelector(state => state); 
    const { profile } = useSelector(state => state.customer); 

    const [img, setImg] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [idFront, setIdFront] = useState('');
    const [idBack, setIdBack] = useState('');
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (profile) {
            const { img, document } = profile;
            setImg(img);
            setIdFront(document?.img);
            setDocumentType(document?.documentType);
            setIdNumber(document?.idNumber);
        }
    }, [profile]);

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Grid className={classes.root} container direction="column">
            <Grid item>
                <Box className={classes.header}>
                    <Typography variant="subtitle2">Identity Details</Typography>
                    <Button color="primary" classes={{ root: classes.button }} onClick={() => setEditable(true)}>Edit</Button>
                </Box>
            </Grid>
            <Divider />
            <br />
            <Grid item>
                <form onSubmit={onSubmit} noValidate>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Type</Typography>
                            <FormControl 
                                variant="outlined" 
                                error={errors.documentType ? true : false}
                                disabled={editable ? false : true}
                                fullWidth 
                                required
                            >
                                <Select
                                    labelId="CountryCode"
                                    className={classes.input}
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                
                                >
                                    <MenuItem value="">Select Document Type</MenuItem>
                                    {documents.map((document, index) => (
                                        <MenuItem key={index} value={document.value}>{document.text}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.documentType}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Document Number</Typography>
                            <TextField 
                                className={classes.info}
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                type="text"
                                variant="outlined" 
                                helperText={errors.documentNumber}
                                fullWidth
                                required
                                disabled={editable ? false : true}
                                error={errors.documentNumber ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Front</Typography>
                            <br />
                            {idFront && <img src={idFront} alt="" className={classes.photograph} />}
                            {/* <TextField 
                                className={classes.info}
                                value={LastName}
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Last Name"
                                helperText={errors.LastName}
                                fullWidth
                                required
                                disabled={editable ? true : false}
                                error={errors.LastName ? true : false}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Back</Typography>
                            <br />
                            {idBack && <img src={idBack} alt=""  className={classes.idCard}/>}
                            {/* <TextField 
                                className={classes.info}
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                variant="outlined" 
                                placeholder="Enter Email"
                                helperText={errors.Email}
                                fullWidth
                                required
                                disabled={editable ? true : false}
                                error={errors.Email ? true : false}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Photograph</Typography>
                            {img && <img src={img} alt="" className={classes.idCard} />}
                            {/* <TextField 
                                className={classes.info}
                                value={Username}
                                type="text"
                                variant="outlined" 
                                helperText={errors.Username}
                                fullWidth
                                required
                                disabled
                            /> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={editable ? false : true}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default IdentityDetails;