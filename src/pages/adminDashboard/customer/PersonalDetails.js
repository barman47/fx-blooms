import { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import { 
    Box, 
    Button,
    FormControlLabel,
    Switch,
    Typography, 
    TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants'; 

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: '30px',
        marginTop: theme.spacing(3),
        padding: [[theme.spacing(2), theme.spacing(3)]],

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: theme.spacing(2)
    },


    box: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(2)
    },

    label: {
        color: COLORS.offBlack,
        // fontWeight: 300
    },

    info: {
        color: theme.palette.primary.main,
        fontWeight: 600
    },

    buttonContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        alignItems: 'center',
        columnGap: theme.spacing(2)
        
    },

    button: {
        fontWeight: 600,
    },

    remarkContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(2)
    },

    saveRemarkButton: {
        alignSelf: 'flex-end',
        marginTop: theme.spacing(2)
    }
}));

const PersonalDetails = () => {
    const classes = useStyles();
    const location = useLocation();

    const { customer } = useSelector(state => state.customers);

    const [firstName, setFirstName] = useState(customer.firstName);
    const [middleName, setMiddleName] = useState(customer.middleName);
    const [lastName, setLastName] = useState(customer.lastName);
    const [userName, setUserName] = useState(customer.userName);
    const [occupation, setOccupation] = useState(customer.occupation);
    const [dateOfBirth, setDateOfBirth] = useState(customer.dateOfBirth);
    const [address, setAddress] = useState(customer.address);
    const [postalCode, setPostalCode] = useState(customer.postalCode);
    const [city, setCity] = useState(customer.city);
    const [country, setCountry] = useState(customer.countryId);
    const [nationality, setNationality] = useState(customer.nationality);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNo);
    const [riskProfile, setRiskProfile] = useState(customer.riskProfile);
    const [remark, setRemark] = useState(customer.remark);
    const [email, setEmail] = useState(customer.email);

    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { state } = location;
        if (state?.editProfile) {
            setEditable(true);
        }
    }, [location]);

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Box component="section" className={classes.root}>
            <form onSubmit={onSubmit} noValidate className={classes.form}>
                <Box component="div" className={classes.box}>
                    <Box component="header">
                        <FormControlLabel
                            value="top"
                            control={<Switch color="primary" />}
                            label="Personal Details"
                            labelPlacement="start"
                        />
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={firstName || ''}
                                onChange={(e) => setFirstName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter First Name"
                                helperText={errors.firstName}
                                fullWidth
                                required
                                error={errors.firstName ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{firstName}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={lastName || ''}
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Last Name"
                                helperText={errors.lastName}
                                fullWidth
                                required
                                error={errors.lastName ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{lastName}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Username</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={userName || ''}
                                onChange={(e) => setUserName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Username"
                                helperText={errors.userName}
                                fullWidth
                                required
                                error={errors.userName ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{userName}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Occupation</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={occupation || ''}
                                onChange={(e) => setOccupation(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Occupation"
                                helperText={errors.occupation}
                                fullWidth
                                required
                                error={errors.occupation ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{occupation}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={address || ''}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Address"
                                helperText={errors.address}
                                fullWidth
                                required
                                error={errors.address ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{address}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={postalCode || ''}
                                onChange={(e) => setPostalCode(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Postal Code"
                                helperText={errors.postalCode}
                                fullWidth
                                required
                                error={errors.postalCode ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{postalCode}</Typography>    
                        }
                    </Box>
                </Box>
                <Box component="div" className={classes.box}>
                    <Box component="div" className={classes.buttonContainer}>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small" 
                            className={classes.button}
                            disabled={loading}
                        >
                            CONTACT
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small" 
                            className={classes.button}
                            onClick={() =>setEditable(true)}
                            disabled={loading || editable ? true : false}
                        >
                            EDIT
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small" 
                            className={classes.button}
                            disabled={loading || !editable ? true : false}
                        >
                            SAVE
                        </Button>
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Middle Names</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={middleName || ''}
                                onChange={(e) => setMiddleName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Middle Name"
                                helperText={errors.middleName}
                                fullWidth
                                required
                                error={errors.middleName ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{middleName}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Birth</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={dateOfBirth || ''}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Date of Birth"
                                helperText={errors.dateOfBirth}
                                fullWidth
                                required
                                error={errors.dateOfBirth ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{dateOfBirth}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Email</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={email || ''}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                variant="outlined" 
                                placeholder="Enter Email Address"
                                helperText={errors.email}
                                fullWidth
                                required
                                error={errors.email ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{email}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Nationality</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={nationality || ''}
                                onChange={(e) => setNationality(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Nationality"
                                helperText={errors.nationality}
                                fullWidth
                                required
                                error={errors.nationality ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{nationality}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>City</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={city || ''}
                                onChange={(e) => setCity(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Email City"
                                helperText={errors.city}
                                fullWidth
                                required
                                error={errors.city ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{city}</Typography>    
                        }
                    </Box>
                </Box>
                <Box component="div" className={classes.box}>
                    <img src="" alt="" />
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={phoneNumber || ''}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Phone Number"
                                helperText={errors.phoneNumber}
                                fullWidth
                                required
                                error={errors.phoneNumber ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{phoneNumber}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Client Since</Typography>
                        <Typography variant="subtitle2" className={classes.info}>{customer?.email}</Typography>    
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Risk Profile</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={riskProfile || ''}
                                onChange={(e) => setRiskProfile(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Risk Profile"
                                helperText={errors.riskProfile}
                                fullWidth
                                required
                                error={errors.riskProfile ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{riskProfile}</Typography>    
                        }
                    </Box>
                    <Box component="div">
                        <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                        {editable ? 
                            <TextField 
                                className={classes.input}
                                value={country || ''}
                                onChange={(e) => setCountry(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Country"
                                helperText={errors.country}
                                fullWidth
                                required
                                error={errors.country ? true : false}
                            />
                            :
                            <Typography variant="subtitle2" className={classes.info}>{country}</Typography>    
                        }
                    </Box>
                </Box>
            </form>
            <form className={classes.remarkContainer}>
                <Typography variant="subtitle2" className={classes.info}>Remark</Typography>
                <TextField 
                    className={classes.input}
                    value={remark || ''}
                    onChange={(e) => setRemark(e.target.value)}
                    type="text"
                    multiline
                    minRows={3}
                    variant="outlined" 
                    placeholder="Add new remark"
                    helperText={errors.remark}
                    fullWidth
                    required
                    error={errors.remark ? true : false}
                />
                <Button variant="outlined" type="submit" color="primary" className={classes.saveRemarkButton}>Save</Button>
            </form>
        </Box>
    );
};

export default PersonalDetails;