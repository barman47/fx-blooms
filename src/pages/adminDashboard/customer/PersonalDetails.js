import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
    Avatar,
    Box,
    // Button,
    // FormControl,
    // FormControlLabel,
    // FormHelperText,
    Menu,
    MenuItem,
    // Select,
    // Switch,
    // TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import PropTypes from 'prop-types';
// import moment from 'moment';
import clsx from "clsx";
import {
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
    setCustomerStatus,
} from "../../../actions/customer";
import { updateCustomerProfile } from "../../../actions/admin";
import PropTypes from "prop-types";
import { CUSTOMER_CATEGORY } from "../../../utils/constants";
import validateCustomerProfile from "../../../utils/validation/customer/validateCustomerProfile";
import isEmpty from "../../../utils/isEmpty";
import avatar from "../../../assets/img/avatar.jpg";

// import Spinner from '../../../components/common/Spinner';
import Toast from "../../../components/common/Toast";
import { SquareEditOutline, CheckDecagram } from "mdi-material-ui";
import AmlBoard from "../../../components/admin-dashboard/AmlBoard";
// import Status from '../../../components/admin-dashboard/Status'
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import GenericTextField from "../../../components/admin-dashboard/GenericTextField";
import CircularProgressBar from "../../../components/admin-dashboard/CircularProgressBar";
import formatDate from "../../../utils/formatDate";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "1px 1px 3px #dbdddd",
        padding: [[theme.spacing(2), theme.spacing(5)]],
        boxSizing: "200px 10px 20px white",

        [theme.breakpoints.down("md")]: {
            paddingBottom: theme.spacing(4),
        },
    },

    // NEW STYLE
    userDetails: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        marginTop: theme.spacing(2),
    },

    headerTitle: {
        color: "#5D6060",
        fontWeight: "600",
        fontSize: theme.spacing(2.7),
    },

    headerIcon: {
        justifySelf: "flex-end",
        color: "#5D6060",
        fontSize: theme.spacing(4.5),

        cursor: "pointer",
    },

    userPassport: {
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",

        marginTop: theme.spacing(2),
    },

    avatar: {
        width: theme.spacing(30),
        height: theme.spacing(35),

        display: "flex",
        justifyContent: "flex-start",

        "& img": {
            width: "15vw",
            height: "80%",
            display: "flex",
            borderRadius: "10px",
            justifyContent: "flex-start",
        },
    },

    userStatus: {
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    userStatusTitle: {
        // backgroundColor: '#DDF2E5',
        color: "#1E6262",
        width: "fit-content",
        padding: "5.6px 1vw",
        borderRadius: "10px",
        fontSize: "1.4vw",
        marginBottom: theme.spacing(3),
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    status: {
        color: "white",
        fontWeight: "500 !important",
        textAlign: "center",
        backgroundColor: "#C4C4C4",
    },

    verified: {
        backgroundColor: "#DDF2E5",
        color: "#1E6262",
    },

    pending: {
        backgroundColor: "#FFF5CE",
        color: "#FBBC05",
    },

    rejected: {
        backgroundColor: "#FFCECE",
        color: "#FF0000",
    },

    suspended: {
        backgroundColor: "#f5f7be",
        color: "#d1c70c",
    },

    userStatusSub: {
        // alignItems: 'flex-start',
        padding: theme.spacing(1),
        // alignSelf: 'center',

        "& p": {
            fontSize: ".9vw",
        },
    },

    userPersonalDetails: {
        // marginTop: theme.spacing(1.5)
    },

    amlTable: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: theme.spacing(1),
        // width: '100%',

        "&:not(:last-child)": {
            borderBottom: "1px solid #E5E5E5",
        },
    },

    amlTitle: {
        fontWeight: "350 !important",
        fontSize: ".9vw",
    },

    amlNumber: {
        fontWeight: "500 !important",
        justifySelf: "flex-end",
        fontSize: ".9vw",
    },

    saveBtn: {
        marginTop: theme.spacing(3),

        display: "flex",
        justifyContent: "flex-end",
    },

    menu: {
        backgroundColor: "white",
        border: `none`,
        borderRadius: theme.spacing(1.5),
        marginRight: "10px",
        cursor: "pointer",
        // left: '675px !important',
        top: "390px !important",
        width: "175px !important",

        "& ul": {
            padding: "8px",
        },

        "& li": {
            padding: "12px 12px 12px 17px",
        },

        "& li:hover": {
            borderRadius: theme.spacing(1.5),
            backgroundColor: "#E7EEEE",
            color: "#1E6262",
        },
    },

    remark: {
        color: "#5D6060",
        display: "flex",
        flexDirection: "column",
        gap: "15px",

        "& h5": {
            fontWeight: "600",
            fontSize: "25px",
        },

        "& p": {
            color: "#000000",
            fontSize: "15px",
        },
    },

    remarkArea: {
        width: "100%",
        outline: "none",
        border: "none",
        borderRadius: "10px",
        boxShadow: "1px 1px 3px #dbdddd",
        padding: "10px",
    },

    editMode: {
        color: "#1E6262",
    },
}));

const PersonalDetails = ({
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
    setCustomerStatus,
    updateCustomerProfile,
}) => {
    const classes = useStyles();
    const location = useLocation();

    const { customer, idCheckData, msg, profileCheckData } = useSelector(
        (state) => state.customers
    );
    const errorsState = useSelector((state) => state.errors);

    const [anchorEl, setAnchorEl] = useState(null);

    const [firstName] = useState(customer.firstName);
    const [middleName] = useState(customer.otherName);
    const [lastName] = useState(customer.lastName);
    const [userName] = useState(customer.userName);
    const [occupation, setOccupation] = useState(customer.occupation ?? "");
    const [dateOfBirth] = useState(
        idCheckData?.dateOfBirth || profileCheckData?.dateOfBirth
    );
    const [address, setAddress] = useState(customer.address ?? "");
    const [postalCode] = useState(customer.postalCode);
    const [city] = useState(customer.city);
    const [country] = useState(customer.countryId);
    const [nationality] = useState(customer.nationality);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNo ?? "");
    const [riskProfile, setRiskProfile] = useState(customer.riskProfile);
    // const [riskProfile] = useState(customer.riskProfile);
    const [remarks, setRemarks] = useState(customer.remarks);
    const [email] = useState(customer.email);
    const [status, setStatus] = useState(customer.customerStatus);
    const [dateJoined] = useState(customer.dateCreated);

    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);

    const toast = useRef();

    const { CONFIRMED, SUSPENDED, PENDING, REJECTED } = CUSTOMER_CATEGORY;
    // const RISK_PROFILES= ['Risk Profile 1', 'Risk Profile 2', 'Risk Profile 3'];

    // useEffect(() => {
    //     if (!idCheckData) {
    //         getIdCardValidationResponse(customer.id);
    //     }

    //     if (!profileCheckData) {
    //         getResidencePermitValidationResponse(customer.id);
    //     }

    //     // eslint-disable-next-line
    // }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (e) => {
        setAnchorEl(e.currentTarget);
    };

    useEffect(() => {
        const { state } = location;

        if (state?.editProfile) {
            setEditable(true);
        }
    }, [location]);

    useEffect(() => {
        if (errorsState?.msg) {
            setLoading(false);
            toast.current.handleClick();
        }
    }, [errorsState, errors]);

    useEffect(() => {
        // setEditable(false);
        // const { customerStatus } = customer;
        // const { address, occupation, riskProfile, remark, status } = customer;
        // console.log('cs', remarks)
        // setStatus(customer.customerStatus);
        if (!editable) {
            setAddress(address);
            setStatus(customer.customerStatus);
            setOccupation(occupation);
            setRiskProfile(riskProfile);
            setRemarks(remarks);
        }
    }, [
        customer.customerStatus,
        editable,
        address,
        remarks,
        riskProfile,
        occupation,
        status,
    ]);

    const editMode = useCallback(() => {
        if (editable) {
            return classes.editMode;
        }
    }, [editable, classes.editMode]);

    const suspendCustomer = () => {
        handleClose();
        setLoading(true);
        if (
            customer.customerStatus !== SUSPENDED &&
            customer.customerStatus === CONFIRMED
        ) {
            setCustomerStatus({
                customerID: customer.id,
                newStatus: SUSPENDED,
                currentStatus: status,
                isPersonal: true,
            });
        } else {
            setErrors({
                msg: "Only verified Users can be suspended",
                ...errors,
            });
        }
    };

    const confirmCustomer = () => {
        // setLoadingText('Confirming Customer...');
        handleClose();
        setLoading(true);
        if (
            customer.customerStatus !== CONFIRMED &&
            customer.customerStatus === SUSPENDED
        ) {
            setCustomerStatus({
                customerID: customer.id,
                newStatus: CONFIRMED,
                currentStatus: status,
                isPersonal: true,
            });
        } else {
            setErrors({
                msg: "Only suspended Users can be verified",
                ...errors,
            });
        }
        // setErrors({})
    };

    const handleStatus = useCallback(
        (status) => {
            switch (status) {
                case CONFIRMED:
                    return classes.verified;
                case PENDING:
                    return classes.pending;
                case REJECTED:
                    return classes.rejected;
                case SUSPENDED:
                    return classes.suspended;
                default:
                    return;
            }
        },
        [
            CONFIRMED,
            PENDING,
            REJECTED,
            SUSPENDED,
            classes.pending,
            classes.suspended,
            classes.verified,
            classes.rejected,
        ]
    );

    const handleDisplayStatus = useCallback(
        (status) => {
            switch (status) {
                case CONFIRMED:
                    return "VERIFIED";
                default:
                    return status;
            }
        },
        [CONFIRMED]
    );

    useEffect(() => {
        if (!!msg) {
            console.log("heloo p");
            setLoading(false);
            setEditable(false);
        }
    }, [msg]);

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setSaveLoader(true);
        // setLoadingText('');

        const data = {
            customerId: customer.id,
            firstName: firstName,
            lastName: lastName,
            otherName: middleName,
            phoneNumber: phoneNumber,
            country: country,
            address: address,
            postalCode: postalCode,
            occupation: occupation,
            risk: riskProfile,
            remarks: remarks,
        };

        const { updateErrors, isValid } = validateCustomerProfile(data);
        if (!isValid) {
            console.log("data", data);
            setSaveLoader(false);
            return setErrors({ msg: "Invalid customer data", ...updateErrors });
        }
        // setLoadingText('Updating Customer . . .');
        console.log("data", data);
        setEditable(false);
        setErrors({});
        updateCustomerProfile(data);
    };

    // useEffect(() => {
    //     dispatch({
    //         type: GET_ERRORS,
    //         payload: {},
    //     });
    // }, [dispatch]);

    // const saveRemark = (e) => {
    //     e.preventDefault();
    //     setErrors({});
    //     setLoadingText('');

    //     const data = {
    //         customerId: customer.id,
    //         firstName: firstName,
    //         lastName: lastName,
    //         otherName: middleName,
    //         phoneNumber: '',
    //         country: '',
    //         address: '',
    //         postalCode: '',
    //         occupation: '',
    //         risk: '',
    //         remarks
    //     };

    //     setLoadingText('Saving Remark . . .');
    //     setLoading(true);
    //     setErrors({});
    //     updateCustomerProfile(data);
    // };

    return (
        <>
            {/* {loading && <Spinner text={loadingText} />} */}
            {!isEmpty(errorsState) && (
                <Toast
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ""}
                    type="error"
                />
            )}
            {errors && (
                <Toast
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ""}
                    type="error"
                />
            )}
            <Box component="section" className={classes.root}>
                <Box component="div" className={classes.userDetails}>
                    <Typography className={classes.headerTitle}>
                        Personal details
                    </Typography>
                    <SquareEditOutline
                        onClick={() => setEditable(!editable)}
                        className={clsx(classes.headerIcon, editMode())}
                    />
                </Box>
                <Box component="div" className={classes.userPassport}>
                    <Avatar
                        variant="square"
                        alt="Avatar"
                        src={avatar}
                        className={classes.avatar}
                    />
                    <Typography component="div" className={classes.userStatus}>
                        <Typography
                            variant="h6"
                            className={clsx(
                                classes.userStatusTitle,
                                classes.status,
                                handleStatus(status)
                            )}
                        >
                            {status === CONFIRMED ? (
                                <CheckDecagram
                                    className={classes.userStatusIcon}
                                />
                            ) : (
                                ""
                            )}
                            {loading ? (
                                <CircularProgressBar
                                    newWidth="20px"
                                    newHeight="20px"
                                />
                            ) : (
                                handleDisplayStatus(status)
                            )}
                        </Typography>
                        <GenericButton
                            clickAction={handleMenu}
                            fontsize=".9vw"
                            buttonName="CHANGE STATUS"
                            fontColor="white"
                            bgColor="#1E6262"
                            textColor="white"
                        />
                        <Menu
                            id="customer-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            classes={{ paper: classes.menu }}
                            disableScrollLock={true}
                        >
                            <MenuItem
                                disabled={customer.customerStatus === CONFIRMED}
                                onClick={confirmCustomer}
                            >
                                Verify
                            </MenuItem>
                            {/* <MenuItem>Pending</MenuItem> */}
                            <MenuItem
                                onClick={suspendCustomer}
                                disabled={customer.customerStatus === SUSPENDED}
                            >
                                Suspend
                            </MenuItem>
                            {/* <MenuItem>No Profile</MenuItem>
                            <MenuItem>Rejected</MenuItem> */}
                        </Menu>
                    </Typography>
                </Box>
                <form
                    onSubmit={onSubmit}
                    noValidate
                    className={classes.userPersonalDetails}
                >
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Username"}
                        amlNumber={userName}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"First Name"}
                        amlNumber={firstName}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Middle Name"}
                        amlNumber={middleName}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Last Name"}
                        amlNumber={lastName}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Date of Birth"}
                        amlNumber={dateOfBirth}
                    />
                    <AmlBoard
                        editable={editable}
                        classes={classes}
                        amlTitle={"Phone Number"}
                        amlNumber={phoneNumber}
                        formField={
                            <GenericTextField
                                textTitle="phoneNumber"
                                inputType="number"
                                inputValue={phoneNumber}
                                handleOnChange={setPhoneNumber}
                                errors={errors}
                                errorValue={phoneNumber}
                                placeHolder={phoneNumber}
                            />
                        }
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Email"}
                        amlNumber={email}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Date joined"}
                        amlNumber={formatDate(dateJoined)}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Nationality"}
                        amlNumber={nationality}
                    />

                    <AmlBoard
                        editable={editable}
                        classes={classes}
                        amlTitle={"Occupation"}
                        amlNumber={occupation}
                        formField={
                            <GenericTextField
                                textTitle="occupation"
                                inputValue={occupation}
                                handleOnChange={setOccupation}
                                errors={errors}
                                errorValue={occupation}
                                placeHolder={occupation}
                            />
                        }
                    />

                    <AmlBoard
                        classes={classes}
                        amlTitle={"Risk profile"}
                        amlNumber={riskProfile}
                    />

                    <AmlBoard
                        editable={editable}
                        classes={classes}
                        amlTitle={"Address"}
                        amlNumber={address}
                        formField={
                            <GenericTextField
                                textTitle="address"
                                inputValue={address}
                                handleOnChange={setAddress}
                                errors={errors}
                                errorValue={address}
                                placeHolder={address}
                            />
                        }
                    />

                    <AmlBoard
                        classes={classes}
                        amlTitle={"Postal code"}
                        amlNumber={postalCode}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"City"}
                        amlNumber={city}
                    />
                    <AmlBoard
                        classes={classes}
                        amlTitle={"Country of Residence"}
                        amlNumber={country}
                    />
                </form>
            </Box>

            <Box component="div" className={classes.saveBtn}>
                <GenericButton
                    isDisabled={!editable}
                    clickAction={onSubmit}
                    btnWidth={63}
                    btnHeight={39}
                    center="center"
                    buttonName={
                        saveLoader ? (
                            <CircularProgressBar
                                newWidth="15px"
                                newHeight="15px"
                            />
                        ) : (
                            "save"
                        )
                    }
                />
            </Box>

            <Box component="div" className={classes.remark}>
                <Typography variant="h5">Remarks</Typography>

                <Typography component="p">Previous remarks go here</Typography>

                <GenericTextField
                    textTitle="Remarks"
                    inputValue={remarks}
                    handleOnChange={setRemarks}
                    errors={errors}
                    errorValue={remarks}
                    placeHolder="Remarks"
                    isMultiline={true}
                    mnRows={15}
                    isReadOnly={!editable}
                />
            </Box>
        </>
    );
};

PersonalDetails.propTypes = {
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired,
    setCustomerStatus: PropTypes.func.isRequired,
    updateCustomerProfile: PropTypes.func.isRequired,
};

export default connect(undefined, {
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
    setCustomerStatus,
    updateCustomerProfile,
})(PersonalDetails);
