import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import GenericTableHeader from "../../../components/admin-dashboard/GenericTableHeader";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import GenericPopUp from "../../../components/admin-dashboard/GenericPopUp";
import { TrashCanOutline, Plus, CloseCircleOutline } from "mdi-material-ui";
import {
    addAdminBankAccount,
    getAllFXBAccounts,
    deleteAdminBankAccount,
} from "../../../actions/wallets";
import { validateIban } from "../../../actions/bankAccounts";
import CircularProgressBar from "../../../components/admin-dashboard/CircularProgressBar";
import {
    CLEAR_WALLET_MSG,
    GET_ERRORS,
    CLEAR_ERROR_MSG,
} from "../../../actions/types";
import isEmpty from "../../../utils/isEmpty";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#F8F9FA",
        paddingLeft: 30,
        paddingTop: 20,
        height: "100vh",

        "& h2": {
            fontSize: 19,
            fontWeight: "bold",
        },
        position: "relative",
    },

    table: {
        width: "60%",
        // height: 300,
        borderRadius: 10,
        backgroundColor: "white",
        boxShadow: "1px 1px 1px 1px #c7c7c7",
        margin: "0 auto",
        marginTop: 30,
    },

    tableBody: {
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr 1.5fr 1fr .5fr",

        "& span": {
            fontSize: 13,
            padding: "11px 15px",
            borderBottom: "1px solid #c7c7c7",
        },
    },

    icon: {
        textAlign: "center",
    },

    addBtn: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 100,
        marginRight: 10,
        paddingBottom: 11,
    },

    header: {
        paddingLeft: 40,
    },

    formGroup: {
        display: "grid",
        paddingLeft: 40,
        gridTemplateColumns: "350px",
        marginBottom: "30px",
        gap: 20,
        marginTop: 35,
    },

    btn: {
        paddingLeft: 40,
    },
}));

const columns = [
    // { id: 'id', label: ''},
    {
        id: "institution",
        label: "Institution",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "account name",
        label: "Account name",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "account acct",
        label: "Account number",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "balance",
        label: "Balance",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "actions",
        label: "Actions",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const gridColumns = "1fr 1.4fr 1.5fr 1fr .5fr";

const FXBAccounts = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { customerId } = useSelector((state) => state.admin);
    const { msg, account } = useSelector((state) => state.bankAccounts);
    const { bank } = useSelector(
        (state) => state.bankAccounts.accountValidation
    );
    const errors = useSelector((state) => state.errors);

    const [loading, setLoading] = useState(false);
    const [addAcct, setAddAcct] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [iban, setIban] = useState("");
    const [newAccount, setAccount] = useState({
        accountName: "",
        currency: "",
        bankName: "",
        nickName: "FXB",
        accountNumber: "",
        adminId: customerId,
        bic: "",
    });

    const { accountName, accountNumber, bankName, currency, bic } = newAccount;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        if (
            accountNumber.length >= 15 &&
            name !== "accountNumber" &&
            bankName === ""
        ) {
            setIban(accountNumber);
        }
        setAccount((accts) => ({ ...accts, [name]: value }));
        // if (name === 'accountNumber') {
        //   setAccount((accts) => ({ ...accts, [name]: value.trim().length % 4 === 0 ? value + ' ' : value }))
        // } else {
        //   setAccount((accts) => ({ ...accts, [name]: value}))
        // }
    };

    const submit = () => {
        setLoading(true);
        setAccount({});
        dispatch(addAdminBankAccount(newAccount));
    };

    const closePopUp = useCallback(() => {
        setAccount({
            accountName: "",
            currency: "",
            bankName: "",
            nickName: "FXB",
            accountNumber: "",
            adminId: customerId,
            bic: "",
        });
        setLoading(false);
        setAddAcct(false);
    }, [customerId]);

    useEffect(() => {
        if (iban) {
            dispatch(validateIban(iban));
        }
    }, [dispatch, iban]);

    useEffect(() => {
        if (iban) {
            setAccount((accts) => ({
                ...accts,
                bankName: bank.bank_name,
                bic: bank.bic,
            }));
        }
    }, [bank, iban]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            dispatch({
                type: GET_ERRORS,
                payload: {},
            });
        }
    }, [errors, dispatch]);

    useEffect(() => {
        return () => {
            dispatch({
                type: CLEAR_ERROR_MSG,
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // console.log("test");
        dispatch(getAllFXBAccounts());
    }, [dispatch, loading]);

    useEffect(() => {
        if (!isEmpty(account?.result)) {
            setAccounts(account?.result);
        }
    }, [account]);

    useEffect(() => {
        if (!!msg) {
            setLoading(false);
            setAddAcct(false);
            dispatch({
                type: CLEAR_WALLET_MSG,
            });
        }
    }, [msg, dispatch]);

    const delAccount = (id) => {
        setAccounts(() => accounts.filter((a) => a.id !== id));
        dispatch(deleteAdminBankAccount(id));
    };

    // console.log(account);

    return (
        <>
            <Box
                component="div"
                className={clsx(
                    classes.root,
                    "animate__animated animate__fadeInLeft"
                )}
            >
                <Typography variant="h2">FXBLOOMS Bank Accounts</Typography>
                <Box component="div" className={classes.table}>
                    <GenericTableHeader
                        columns={columns}
                        gridColumns={gridColumns}
                        headerPadding="11px 15px"
                    />
                    {accounts &&
                        accounts.map((acct, i) => (
                            <Box
                                component="div"
                                className={classes.tableBody}
                                key={i}
                            >
                                <Typography component="span">
                                    {acct.bankName}
                                </Typography>
                                <Typography component="span">
                                    {acct.accountName}
                                </Typography>
                                <Typography component="span">
                                    {acct.accountNumber}
                                </Typography>
                                <Typography component="span">
                                    {currency?.value}
                                </Typography>
                                <Typography
                                    onClick={() => delAccount(acct.id)}
                                    className={classes.icon}
                                    component="span"
                                >
                                    <TrashCanOutline />
                                </Typography>
                            </Box>
                        ))}

                    <Box component="div" className={classes.addBtn}>
                        <GenericButton
                            clickAction={() => setAddAcct(true)}
                            fontsize="15px"
                            buttonName="Add account"
                            bxShadw="none"
                        >
                            <Plus
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    color: "green",
                                }}
                            />
                        </GenericButton>
                    </Box>

                    {!!addAcct ? (
                        <GenericPopUp component="div" containerHeight="70vh">
                            <Box component="div" className={classes.header}>
                                <Typography
                                    variant="h6"
                                    className={classes.headTitle}
                                >
                                    Add Account
                                </Typography>
                                <CloseCircleOutline
                                    onClick={() => closePopUp()}
                                    style={{
                                        cursor: "pointer",
                                        position: "absolute",
                                        top: "1.5%",
                                        right: "2%",
                                    }}
                                />
                            </Box>
                            <Box component="div" className={classes.formGroup}>
                                <TextField
                                    autoFocus={true}
                                    name="accountNumber"
                                    variant="outlined"
                                    onChange={handleOnChange}
                                    value={accountNumber ?? ""}
                                    label="ISBAN"
                                    size="medium"
                                />
                                <TextField
                                    name="accountName"
                                    variant="outlined"
                                    onChange={handleOnChange}
                                    value={accountName ?? ""}
                                    label="Account Name"
                                    size="medium"
                                />
                                <TextField
                                    name="bankName"
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                    value={bankName ?? ""}
                                    label="Bank Name"
                                    size="medium"
                                />
                                <TextField
                                    name="bic"
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                    value={bic ?? ""}
                                    label="BIC"
                                    size="medium"
                                />
                                <FormControl
                                    sx={{ m: 1, minWidth: 120 }}
                                    size="medium"
                                    variant="outlined"
                                >
                                    <InputLabel id="demo-select-small">
                                        Currency
                                    </InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        value={currency}
                                        defaultValue=""
                                        name="currency"
                                        label="Currency"
                                        onChange={handleOnChange}
                                    >
                                        <MenuItem disabled value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem disabled value="USD">
                                            USD
                                        </MenuItem>
                                        <MenuItem value="EUR">EUR</MenuItem>
                                        <MenuItem value="NGN">NGN</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box component="div" className={classes.btn}>
                                <GenericButton
                                    center={true}
                                    btnWidth="83px"
                                    btnHeight="40px"
                                    textalign="center"
                                    clickAction={() => submit()}
                                    fontColor="white"
                                    fontsize="15px"
                                    bxShadw="none"
                                    bgColor="#1E6262"
                                    buttonName={
                                        loading ? (
                                            <CircularProgressBar
                                                iconColor="white"
                                                newWidth="15px"
                                                newHeight="15px"
                                            />
                                        ) : (
                                            "Add"
                                        )
                                    }
                                >
                                    {loading ? (
                                        ""
                                    ) : (
                                        <Plus
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                color: "white",
                                                textAlign: "center",
                                            }}
                                        />
                                    )}
                                </GenericButton>
                            </Box>
                        </GenericPopUp>
                    ) : (
                        ""
                    )}
                    {/* {
              data && data.map((bank, i) => (
                <Box component="div">
                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.institution}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.account}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.number}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    { bank.balance}
                  </Typography>

                  <Typography component="span" key={i} className={classes.tableCell} variant="subtitle1">
                    ...
                  </Typography>
                </Box>
              ))
          } */}
                </Box>

                {/* {
          add ? 
        } */}
            </Box>
        </>
    );
};

export default FXBAccounts;
