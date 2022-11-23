import { useState, useCallback, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
    Box,
    // Button,
    // Divider,
    Typography,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import clsx from 'clsx';
import _ from "lodash";

import { ID_STATUS_CATEGORY } from "../../../utils/constants";
import {
    approveIdCard,
    approveResidencePermit,
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
} from "../../../actions/customer";
// import isEmpty from '../../../utils/isEmpty';

// import Spinner from '../../../components/common/Spinner';
// import Toast from '../../../components/common/Toast';
import AmlBoard from "../../../components/admin-dashboard/AmlBoard";
import Status from "../../../components/admin-dashboard/Status";
import CircularProgressBar from "../../../components/admin-dashboard/CircularProgressBar";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
// import { IdCard } from 'mdi-material-ui';
// import { CheckDecagram } from 'mdi-material-ui';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: [[theme.spacing(2), theme.spacing(5)]],
        boxShadow: "1px 1px 3px #dbdddd",

        [theme.breakpoints.down("md")]: {
            paddingBottom: theme.spacing(4),
        },
    },

    //NEW STYLE
    header: {
        display: "grid",
        gridTemplateColumns: "1fr",
    },

    idHeader: {
        color: "#5D6060",
    },

    approveId: {
        justifySelf: "center",
        fontSize: "1vw",
        marginTop: theme.spacing(2),
    },

    // idDetails: {
    //     display: 'grid',
    //     gridTemplateColumns: '1fr 1fr',
    // },

    amlTable: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        marginBottom: theme.spacing(0.9),
        justifyContent: "space-between",
    },

    amlTitle: {
        fontSize: "1vw",
        fontWeight: "350 !important",
    },

    amlNumber: {
        fontWeight: "500 !important",
        justifySelf: "flex-end",
        fontSize: "1vw",

        "& p:first-child": {
            fontWeight: "600 !important",
        },
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

    menu: {
        backgroundColor: "white",
        border: `none`,
        borderRadius: theme.spacing(1.5),
        marginRight: "10px",
        cursor: "pointer",
        // left: '675px !important',
        top: "212px !important",
        // width: '175px !important',

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
}));

const IdentityDetails = ({
    approveIdCard,
    approveResidencePermit,
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
}) => {
    const classes = useStyles();
    // const dispatch = useDispatch();
    const {
        customer,
        idCheckData,
        profileCheckData,
        isLoadingIdData,
        isLoadingApproveId,
    } = useSelector((state) => state.customers);
    // const errorsState = useSelector(state => state.errors);
    const { DECLINED, ACCEPTED } = ID_STATUS_CATEGORY;
    // const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // eslint-disable-next-line
    // const [errors, setErrors] = useState({});

    // const toast = useRef();

    const handleStatus = useCallback(
        (status) => {
            switch (status) {
                case ACCEPTED:
                    return classes.verified;
                //   case PENDING:
                //     return classes.pending
                case DECLINED:
                    return classes.rejected;
                //   case SUSPENDED:
                //     return classes.suspended
                default:
                    return;
            }
        },
        [ACCEPTED, DECLINED, classes.verified, classes.rejected]
    );

    // const { APPROVED } = ID_STATUS;

    useEffect(() => {
        if (!idCheckData) {
            getIdCardValidationResponse(customer.id);
        }

        if (!profileCheckData) {
            getResidencePermitValidationResponse(customer.id);
        }
        // eslint-disable-next-line
    }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleApproveId = () => {
        // setLoading(true);
        handleClose();
        approveIdCard(customer.id);
    };

    // const handleApproveResidencePermit = () => {
    //     // setLoading(true);
    //     handleClose();
    //     approveResidencePermit(customer.id);
    // };

    // const onSubmit = (e) => {
    //     e.preventDefault();
    // };

    return (
        <>
            {/* {!isEmpty(errorsState) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ''}
                    type="error"
                />
            } */}
            {/* {loading && <Spinner />} */}
            <Box component="section" className={classes.root}>
                <Box component="div" className={classes.header}>
                    <Typography variant="h6" className={classes.idHeader}>
                        Identification details
                    </Typography>

                    <Typography component="div" className={classes.approveId}>
                        {!isLoadingIdData &&
                        _.isEmpty(idCheckData ?? profileCheckData) ? (
                            ""
                        ) : (
                            <GenericButton
                                className={classes.approveId}
                                clickAction={handleMenu}
                                fontsize="1vw"
                                buttonName={
                                    isLoadingApproveId ? (
                                        <CircularProgressBar
                                            newWidth="20px"
                                            newHeight="20px"
                                        />
                                    ) : (
                                        "APPROVE ID"
                                    )
                                }
                                fontColor="white"
                                bgColor="#1E6262"
                                textColor="white"
                                btnWidth={107.14}
                                btnHeight={32.48}
                            />
                        )}
                    </Typography>

                    <Menu
                        id="customer-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        classes={{ paper: classes.menu }}
                        disableScrollLock={true}
                    >
                        <MenuItem onClick={handleApproveId}>Approve</MenuItem>
                        <MenuItem disabled={true} onClick={handleApproveId}>
                            Need Review
                        </MenuItem>
                        <MenuItem disabled={true} onClick={handleApproveId}>
                            Reject
                        </MenuItem>
                    </Menu>
                </Box>

                {isLoadingIdData ? (
                    <CircularProgressBar
                        topMargin="15px"
                        newWidth="25px"
                        newHeight="25px"
                    />
                ) : !isLoadingIdData &&
                  _.isEmpty(profileCheckData) &&
                  _.isEmpty(idCheckData) ? (
                    <Typography
                        className="animate__animated animate__shakeX"
                        style={{ textAlign: "center " }}
                        variant="h6"
                    >
                        NO DATA FOUND
                    </Typography>
                ) : (
                    <Box component="div" className={classes.idDetails}>
                        <AmlBoard
                            classes={classes}
                            amlTitle={"Status"}
                            amlNumber={
                                <Status
                                    extraStyles={handleStatus(
                                        idCheckData?.status ??
                                            profileCheckData?.status
                                    )}
                                    statusName={
                                        idCheckData?.status.toUpperCase() ??
                                        profileCheckData?.status?.toUpperCase()
                                    }
                                />
                            }
                        />
                        <AmlBoard
                            classes={classes}
                            amlTitle={"Document Type"}
                            amlNumber={
                                idCheckData?.documentType ??
                                profileCheckData?.documentType
                            }
                        />
                        <AmlBoard
                            classes={classes}
                            amlTitle={"Document Number"}
                            amlNumber={
                                idCheckData?.documentNumber ??
                                profileCheckData?.documentNumber
                            }
                        />
                        <AmlBoard
                            classes={classes}
                            amlTitle={"Issue Country"}
                            amlNumber={
                                idCheckData?.issueCountry ??
                                profileCheckData?.issueCountry
                            }
                        />
                        <AmlBoard
                            classes={classes}
                            amlTitle={"Date of Issue"}
                            amlNumber={
                                idCheckData?.dateOfIssue ??
                                profileCheckData?.dateOfIssue
                            }
                        />
                        <AmlBoard
                            classes={classes}
                            amlTitle={"Date of Expiry"}
                            amlNumber={
                                idCheckData?.expiryDate ??
                                profileCheckData?.expiryDate
                            }
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

IdentityDetails.propTypes = {
    approveIdCard: PropTypes.func.isRequired,
    approveResidencePermit: PropTypes.func.isRequired,
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired,
};

export default connect(undefined, {
    approveIdCard,
    approveResidencePermit,
    getIdCardValidationResponse,
    getResidencePermitValidationResponse,
})(IdentityDetails);
