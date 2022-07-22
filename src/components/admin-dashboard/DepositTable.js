import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Box,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TextClamp from "react-string-clamp";
import { DotsHorizontal } from "mdi-material-ui";
import { SET_CUSTOMER } from "../../actions/types";
// import { CUSTOMER_CATEGORY } from '../../utils/constants';
// import getTime from '../../utils/getTime'
import { PAYMENT_TYPE, PAYMENT_STATUS } from "../../utils/constants";
import handleStatusStyle from "../../utils/statusDisplay";
import formatDate from "../../utils/formatDate";
import CircularProgressBar from "./CircularProgressBar";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    tableBodyRow: {
        display: "grid",
        borderBottom: "1px solid #E8E8E8",
        alignItems: "center",
        cursor: "pointer",
        paddingLeft: "15px",
        paddingRight: "15px",
        gap: 10,

        "& span": {
            fontWeight: "300",
            paddingTop: theme.spacing(0.8),
            paddingBottom: theme.spacing(0.8),
            // fontSize: 13,
            fontStretch: "50%",
        },
    },

    status: {
        color: "white",
        fontSize: "12px !important",
        borderRadius: theme.spacing(0.8),
        backgroundColor: "#C4C4C4",
        padding: "3px 5px",
        width: "fit-content",
        fontWeight: "500 !important",
    },

    verified: {
        backgroundColor: "#DDF2E5",
        color: "#48BB78",
    },

    pending: {
        backgroundColor: "#FFF5CE",
        color: "#FBBC05",
    },

    suspended: {
        backgroundColor: "#FFCECE",
        color: "#FF0000",
    },

    noShow: {
        display: "none",
    },
}));
const { WITHDRAWAL, FUND } = PAYMENT_TYPE;
const { IN_PROGRESS, FAILED, COMPLETED, PENDING } = PAYMENT_STATUS;

const DepositAndWithdrawalTable = ({
    data,
    handleClick,
    otherRows,
    displayChck = true,
    loading,
    gridColumns = "1fr 1fr .7fr 1fr 1fr 0.5fr",
    handleBatch,
    handleCheckError,
    fontsize = 13,
    checkList,
}) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    // const { fourthRow, fifthRow, sixthRow } = otherRows
    const [check] = useState({});

    const handleButtonClick = (customer, e) => {
        // console.log("mennnuuu");
        e.preventDefault();
        e.stopPropagation();

        dispatch({
            type: SET_CUSTOMER,
            payload: customer,
        });
        handleClick(e);
    };

    const handlePaymentStatus = (num, type = "T") => {
        switch (num) {
            case 1:
                return type === "S" ? PENDING : FUND;
            case 2:
                return type === "S" ? COMPLETED : WITHDRAWAL;
            case 3:
                return FAILED;
            case 4:
                return IN_PROGRESS;
            default:
                return;
        }
    };

    const handleCheckBox = (e, customer) => {
        e.preventDefault();
        e.stopPropagation();
        // const { checked } = e.target;
        if (customer.paymentStatus === 2) {
            handleCheckError();
            return;
        }

        handleBatch(customer.id);
    };

    return (
        <>
            {loading ? (
                <CircularProgressBar
                    newWidth="40px"
                    newHeight="40px"
                    topMargin="50px"
                />
            ) : (
                data &&
                data.map((customer, i) => (
                    <Box
                        sx={{
                            gridTemplateColumns: gridColumns,
                            "& span": { fontSize: `${fontsize}px` },
                        }}
                        component="div"
                        className={classes.tableBodyRow}
                        key={i}
                    >
                        <Typography
                            // onClick={() => handleBatch(customer.id)}
                            component="span"
                            className={clsx(
                                classes.tableCell,
                                !displayChck && classes.noShow
                            )}
                            variant="subtitle1"
                        >
                            <FormControlLabel
                                // onClick={(e) => handleCheckBox(i, e, customer)}
                                control={
                                    <Checkbox
                                        name="checked"
                                        onChange={(e) =>
                                            handleCheckBox(e, customer)
                                        }
                                        checked={
                                            customer.paymentStatus === 2
                                                ? false
                                                : check[i]
                                        }
                                        className={classes.tableCell}
                                        color="primary"
                                        disableFocusRipple
                                        disableTouchRipple
                                        disableRipple
                                    />
                                }
                            />
                        </Typography>

                        <Typography
                            style={{ textTransform: "capitalize" }}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            <TextClamp
                                text={customer.customerFullName ?? ""}
                                lines={1}
                            />
                        </Typography>

                        <Typography
                            style={{ textTransform: "capitalize" }}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {customer.account ?? ""}
                        </Typography>

                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {customer.amount ?? ""}
                        </Typography>

                        <Typography
                            component="span"
                            className={clsx(
                                classes.tableCell,
                                classes.status,
                                handleStatusStyle(
                                    handlePaymentStatus(
                                        customer.paymentStatus,
                                        "S"
                                    ),
                                    classes
                                )
                            )}
                            variant="subtitle1"
                        >
                            {customer.paymentStatus
                                ? handlePaymentStatus(
                                      customer.paymentStatus,
                                      "S"
                                  )
                                : ""}
                        </Typography>

                        {/* <Typography
                            component="span"
                            className={clsx(
                                classes.tableCell
                                // classes.status
                                // handleStatusStyle(
                                //   handlePaymentStatus(customer.paymentType),
                                //   classes
                                // )
                            )}
                            variant="subtitle1"
                        >
                            {customer.paymentType
                                ? handlePaymentStatus(customer.paymentType)
                                : ""}
                        </Typography> */}

                        <Typography
                            component="span"
                            className={clsx(classes.tableCell)}
                            variant="subtitle1"
                        >
                            {formatDate(customer.dateCreated)}
                        </Typography>

                        <Typography
                            component="span"
                            className={clsx(
                                classes.tableCell,
                                displayChck && classes.noShow
                            )}
                            variant="subtitle1"
                        >
                            <IconButton
                                variant="text"
                                size="small"
                                className={classes.button}
                                aria-controls="customer-menu"
                                aria-haspopup="true"
                                onClick={(e) => handleButtonClick(customer, e)}
                                disableRipple
                            >
                                <DotsHorizontal />
                            </IconButton>
                        </Typography>
                    </Box>
                ))
            )}
        </>
    );
};

export default DepositAndWithdrawalTable;
