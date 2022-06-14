import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Box,
    TablePagination,
    Typography,
    MenuItem,
    FormControlLabel,
    Slider,
    Checkbox,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import { CLEAR_ALL_CUSTOMERS, SET_CUSTOMER } from '../../../actions/types';
import GenericTableHeader from "../../../components/admin-dashboard/GenericTableHeader";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import DepositAndWithdrawalTable from "../../../components/admin-dashboard/DepositTable";
// import { ADMIN_FILTERS } from '../../../utils/constants';
import {
    Filter,
    ArrowTopRight,
    CloseCircleOutline,
    CheckboxMarkedCircleOutline,
} from "mdi-material-ui";
import CircularProgressBar from "../../../components/admin-dashboard/CircularProgressBar";
import WithdrawalCard from "../../../components/admin-dashboard/WithdrawalCard";
import {
    getAllWithdrawalReqs,
    getAllFXBAccounts,
    autoBatch,
    getBatchById,
    authorizeWithdrawal,
} from "../../../actions/wallets";
import { getInstitutions } from "../../../actions/institutions";
import clsx from "clsx";
// import { SET_BATCH_ID } from '../../../actions/types';
import isEmpty from "../../../utils/isEmpty";
import {
    SET_INSTITUTION_ID,
    // AUTHORIZE_WITHDRAWAL,
    CLEAR_WITHDRAWAL_REQUESTS,
    CLEAR_ERROR_MSG,
} from "../../../actions/types";
import formatDate from "../../../utils/formatDate";
import { PAYMENT_TYPE, PAYMENT_STATUS } from "../../../utils/constants";
import {
    ADMIN_AUTH_TOKEN,
    ADMIN_INFO,
    AUTH_TOKEN,
} from "../../../utils/constants";
import Toast from "../../../components/common/Toast";
import modifyAmount from "../../../utils/modifyAmount";

const useStyles = makeStyles((theme) => ({
    root: {
        // padding: [[theme.spacing(2), theme.spacing(3)]],
        paddingRight: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(12),

        [theme.breakpoints.down("sm")]: {
            padding: [
                [
                    theme.spacing(1),
                    theme.spacing(2),
                    theme.spacing(5),
                    theme.spacing(2),
                ],
            ],
        },

        "& h6": {
            fontWeight: 600,
        },
        backgroundColor: "#F7F8F9",
        position: "relative",

        height: "100%",
    },

    title: {
        fontWeight: 600,
    },

    table: {
        borderRadius: theme.spacing(1),
        boxShadow: "3px 2px 3px white",
        border: "1px solid white",
        backgroundColor: "#FEFEFE",
        paddingBottom: "50px",
    },

    exportBox: {
        position: "absolute",
        top: 47,
        right: 1,
        borderRadius: 5,
        boxShadow: "1px 1px 1px 1.5px #c7c7c7",
        display: "flex",
        flexDirection: "column",

        "& span": {
            fontSize: ".9vw",
            backgroundColor: "white",
            padding: "10px 20px",
            width: "6vw",

            "&:hover": {
                backgroundColor: "#1E6262",
                color: "white",
            },
        },
    },

    filterBoxContainer: {
        position: "absolute",
        top: 50,
        right: 0,
        zIndex: 1000,
        // width: '100%',
        height: "100%",
    },

    filterBoxContent: {
        width: 400,
        // height: 200,
        backgroundColor: "white",
        borderRadius: 10,
        boxShadow: "1px 1px 1px 1.3px #c7c7c7",
    },

    filterBoxHeader: {
        display: "grid",
        gridTemplateColumns: "1fr 0px",
        padding: ".7rem 1.5rem",
        borderBottom: "1px solid #CBCBCB",
        alignItems: "center",

        "& span": {
            fontSize: "1rem",
            cursor: "pointer",
        },
    },

    filterBoxMain: {
        // padding: '1rem 1.5rem',
    },

    filterContentDate: {
        marginTop: ".6rem",
        // marginBottom: '1.5rem',
        padding: "1rem 1.5rem",

        "& label": {
            display: "flex",
            flexDirection: "column",
            gap: 10,

            fontSize: "1rem",

            "& input": {
                height: 30,
                borderRadius: 5,
                outline: "none",
                border: "1px solid #C4C4C4",
                padding: 5,
            },
        },
    },

    filterTransactionType: {
        display: "grid",
        gridTemplateColumns: "1fr",
        padding: "1rem 1.5rem",
        gap: ".5rem",

        // marginBottom: '1.5rem'
    },

    filterAmount: {
        padding: "1rem 1.5rem",
        borderBottom: "1px solid #C4C4C4",
    },

    amountRange: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
    },

    filterButton: {
        display: "flex",
        gap: 15,
        justifyContent: "flex-end",
        marginRight: 10,
        padding: "1.5rem 1.5rem",
    },

    btnIcon: {
        width: 15,
        height: 15,
    },

    withdrawalScreen: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(1px)",
        width: "100%",
        height: "100%",
        top: 0,
        right: 0,
        zIndex: 1000,
        // transform: 'translate(0, 84px)'
    },

    withdrawalContainer: {
        backgroundColor: "white",
        width: "60%",
        height: "75vh",
        margin: "2rem 17vw 0 auto",
        borderRadius: 10,
        paddingTop: 30,
    },

    withdrawHeader: {
        // paddingLeft: 40,
        // borderBottom: '1px solid #C4C4C4',
        // paddingBottom: 10,

        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
    },

    formGrp: {
        display: "grid",
        paddingLeft: 40,
        gridTemplateColumns: "350px",
        marginBottom: "50px",
        gap: 40,
        marginTop: 70,
    },

    btn: {
        marginLeft: 40,
    },

    headerNumber: {
        borderRadius: "50%",
        backgroundColor: "#C4C4C4",
        color: "white",
        padding: 2,
        display: "inline-block",
        width: 20,
        height: 20,
        textAlign: "center",
    },

    headerTitle: {
        display: "grid",
        gridTemplateColumns: "max-content max-content",
        alignItems: "center",
        gap: 15,
        color: "#C4C4C4",

        borderBottom: "1px solid #C4C4C4",
        paddingBottom: 10,
        cursor: "pointer",

        "&:first-child": {
            paddingLeft: 40,
        },
    },

    headerNumberActive: {
        backgroundColor: "#1E6262",
    },

    headerTitleActive: {
        color: "black",
        borderBottom: "1px solid #1E6262",
    },

    withdrawalTable: {
        width: "100%",
        // height: 300,
        marginTop: 30,
        borderRadius: 10,
        // backgroundColor: 'white',
        // boxShadow: '1px 1px 1px 1px #c7c7c7',
    },

    withdrawalTableBody: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr .5fr .5fr 1fr",

        "& span": {
            fontSize: 13,
            padding: "11px 15px",
            borderBottom: "1px solid #c7c7c7",
        },
    },

    status: {
        color: "white",
        fontSize: "12px !important",
        borderRadius: theme.spacing(0.8),
        backgroundColor: "#C4C4C4",
        padding: "3px 5px",
        width: "max-content",
        fontWeight: "500 !important",
    },

    authorize: {
        display: "grid",
        paddingLeft: 40,
        gridTemplateColumns: "350px",
        marginBottom: "20px",
        gap: 20,
        marginTop: "15px",
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

    selected: {
        borderBottom: "2px solid #1E6262",
        fontWeight: 600,
        fontSize: "1.4vw",
    },

    pageList: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
    },
}));

const columns = [
    {
        id: "id",
        label: "",
        maxWidth: 10,
    },
    {
        id: "name",
        label: "Name",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "account",
        label: "Account",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "amount",
        label: "Amount",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "paymentstatus",
        label: "Payment Status",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "paymenttype",
        label: "Payment Type",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "date",
        label: "Date",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const withdrawalColumns = [
    {
        id: "fullname",
        label: "Full name",
        format: (value) => value.toLocaleString("en-US"),
    },
    // {
    //   id: 'institutionId',
    //   label: 'Institution ID',
    //   format: (value) => value.toLocaleString('en-US'),
    // },
    {
        id: "reference",
        label: "Reference",
        format: (value) => value.toLocaleString("en-US"),
    },
    // {
    //   id: 'walletId',
    //   label: 'Wallet ID',
    //   format: (value) => value.toLocaleString('en-US'),
    // },
    {
        id: "account",
        label: "Account",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "amount",
        label: "Amount",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "payment status",
        label: "Payment status",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "date",
        label: "Date",
        format: (value) => value.toLocaleString("en-US"),
    },
];

// const pages = [10, 25, 50, 100]

const { WITHDRAWAL, FUND } = PAYMENT_TYPE;
const { IN_PROGRESS, FAILED, COMPLETED, PENDING } = PAYMENT_STATUS;

const gridColumns = ".3fr 1.5fr 1.2fr .7fr 1fr 1fr 1fr";
// const withdrawalGridCol = "1fr 1fr 1fr 1fr 1fr .5fr .5fr 1fr"
const pages = [15, 50, 75, 100];

function valuetext(value) {
    // console.log('valueText', value)
    return `${value}°C`;
}

const Withdrawals = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const [openFilterBx, setOpenFilterBx] = useState(false);
    const [openXport, closeXport] = useState(false);
    const [value, setValue] = useState([1, 70]);

    const [withdrawalScreen, setWithdrawalScreen] = useState(false);
    const [screen, setScreen] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(false);

    const [rowsPerPage] = useState(pages[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumberList, setPageNumberList] = useState([]);
    const [lastPage, setLastPage] = useState(pageNumberList?.length);
    const [pageCount, setPageCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingReqs, setLoadingReqs] = useState(false);
    const [batchList, setBatchList] = useState([]);
    const [page, setPage] = useState(0);
    const [tableRowsPerPage, setTableRowsPerPage] = useState(10);
    // const [inst, setInst] = useState('')
    const [checkBxErrMsg, setCheckBxErrMsg] = useState("");
    const [totalWithdrawal, setTotalWithdrawal] = useState(0);

    const [requests, setRequests] = useState({
        requestNumber: "",
        institutions: "",
    });

    const { items, totalPageCount } = useSelector(
        (state) => state.wallets.transactions
    );
    const { account } = useSelector((state) => state.bankAccounts);
    const {
        withdrawalRequests,
        batchId,
        institutionId,
        authorizeRequest,
        withdrawalSuccess,
    } = useSelector((state) => state.wallets);
    const allInstitutions = useSelector((state) => state.institutions);
    const admin = useSelector((state) => state.admin);
    const { msg } = useSelector((state) => state.errors);

    const [isMan, setIsMan] = useState(false);

    const { requestNumber, institutions } = requests;
    const ref = useRef();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setTableRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setRequests({ ...requests, [name]: value });
    };

    const batchRequest = () => {
        setScreen(false);
        setLoadingReqs(true);
        if (isMan) {
            dispatch(autoBatch(0, batchList));
        } else {
            const { requestNumber } = requests;
            dispatch(autoBatch(requestNumber));
        }
    };

    useEffect(() => {
        // console.log(items);
        if (!isEmpty(items)) {
            const total = items
                .filter((wd) => wd.paymentStatus === 2)
                .reduce((acc, curr) => +acc + +curr.amount, 0);
            setTotalWithdrawal(+total);
        }
    }, [items]);

    useEffect(() => {
        if (!!batchId) {
            // console.log("vbatchId");
            dispatch(getBatchById(batchId));
        }
    }, [batchId, dispatch]);

    useEffect(() => {
        if (!!batchId && !isEmpty(withdrawalRequests)) {
            dispatch(getInstitutions("ADMIN"));
            // dispatch({
            //   type: SET_BATCH_ID,
            //   payload: null
            // })
        }
    }, [withdrawalRequests, dispatch, batchId]);

    useEffect(() => {
        if (
            !!batchId &&
            isEmpty(withdrawalRequests) &&
            withdrawalRequests !== null
        ) {
            setLoadingReqs(false);
        }
    }, [batchId, withdrawalRequests]);

    useEffect(() => {
        if (!!batchId && !isEmpty(allInstitutions)) {
            setLoadingReqs(false);
            const institution = allInstitutions.data.find((ins) =>
                ins.name.includes(institutions)
            );
            dispatch({
                type: SET_INSTITUTION_ID,
                payload: institution?.id,
            });
        }
    }, [allInstitutions, dispatch, institutions, batchId]);

    const handlePageNUmberList = useCallback(() => {
        const pageNumArr = [];
        if (pageCount >= 1) {
            for (let i = 1; i <= pageCount; i++) {
                pageNumArr.push(i);
            }
        }
        setPageNumberList(pageNumArr);
        setLastPage(pageCount);
    }, [pageCount]);

    useEffect(() => {
        if (isEmpty(account.result)) {
            dispatch(getAllFXBAccounts());
        }
    }, [dispatch, account]);

    useEffect(() => {
        if (!!items) {
            setLoading(false);
            handlePageNUmberList();
        }
    }, [items, handlePageNUmberList]);

    useEffect(() => {
        setLoading(true);
        dispatch(
            getAllWithdrawalReqs({
                pageSize: rowsPerPage,
                pageNumber: currentPage,
            })
        );

        setPageCount(totalPageCount || 0);
    }, [rowsPerPage, currentPage, dispatch, totalPageCount]);

    const onNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const onPrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const downloadAll = async () => {
        // await exportAllUserRecords(admin)
    };

    const downloadRecords = () => {
        // let data = []
        // switch (tab) {
        //     case ALL_LISTINGS:
        //         data = [...listings];
        //         break;
        //     case ALL_OPEN:
        //         data = [...activeListings];
        //         break;
        //     case ALL_COMPLETED:
        //         data = [...finalisedListings];
        //         break;
        //     case ALL_NEGOTIATIONS:
        //         data = [...inProgressListings];
        //         break;
        //     case ALL_DELETED:
        //         data = [...deletedListings];
        //         break;
        //     default:
        //         break;
        // }
        // if (exportRecords(data, admin, tab)?.errors) {
        //     return
        // }
    };

    const handleBatchError = () => {
        ref.current?.handleClick();
        setCheckBxErrMsg(
            "Can't add a request with a status of complete or in-progress"
        );
    };

    const manBatch = (cus) => {
        // console.log(cus);
        setBatchList((values) => handleBatchFilter(cus, values));
    };

    const handleBatchFilter = (cus, values) => {
        if (values?.some((a) => a === cus)) {
            return [...values?.filter((a) => a !== cus)];
        }
        return [...values, cus];
    };

    const openManualScreen = () => {
        console.log(batchList);
        if (isEmpty(batchList)) {
            setCheckBxErrMsg("Add a request");
            ref.current.handleClick();
            return;
        }
        setIsMan(true);
        setScreen(true);
        setRequests({ requestNumber: "", institutions: "" });
        setWithdrawalScreen(!withdrawalScreen);
        setRequests({ requestNumber: batchList?.length });
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

    const authorize = () => {
        dispatch(
            authorizeWithdrawal({
                paymentBatchId: batchId,
                institutionId,
            })
        );
        setLoadingAuth(true);
        setLoadingReqs(true);
    };

    useEffect(() => {
        if (!!institutionId && !!msg) {
            setLoadingAuth(false);
            setLoadingReqs(false);
        }
    }, [institutionId, msg]);

    useEffect(() => {
        if (!isEmpty(authorizeRequest) && loadingAuth) {
            console.log(authorizeRequest);
            localStorage.setItem(
                ADMIN_AUTH_TOKEN,
                sessionStorage.getItem(AUTH_TOKEN)
            );
            localStorage.setItem(ADMIN_INFO, admin);
            window.open(authorizeRequest.authorisationUrl, "_blank");
            setLoadingAuth(false);
        }
    }, [authorizeRequest, admin, loadingAuth]);

    // useEffect(() => {
    //   if (
    //     !loadingAuth &&
    //     !isEmpty(authorizeRequest) &&
    //     authorizeRequest !== null
    //   ) {
    //     dispatch({
    //       type: AUTHORIZE_WITHDRAWAL,
    //       payload: {},
    //     });
    //   }
    // }, [dispatch, loadingAuth, authorizeRequest]);

    useEffect(() => {
        if (!loadingAuth && !isEmpty(authorizeRequest) && !!withdrawalSuccess) {
            setLoadingReqs(false);
            setWithdrawalScreen(!withdrawalScreen);
            setIsMan(false);
            setScreen(false);
            setLoadingAuth(false);
            setRequests({});
            dispatch({
                type: CLEAR_WITHDRAWAL_REQUESTS,
            });
        }
    }, [
        dispatch,
        loadingAuth,
        authorizeRequest,
        withdrawalSuccess,
        withdrawalScreen,
    ]);

    const clearWithdrawalReqs = () => {
        dispatch({
            type: CLEAR_WITHDRAWAL_REQUESTS,
        });
    };

    const closeWithdrawalScreen = () => {
        setWithdrawalScreen(!withdrawalScreen);
        setIsMan(false);
        setScreen(false);
        setLoadingAuth(false);
        setRequests({});
        clearWithdrawalReqs();
        dispatch({
            type: CLEAR_ERROR_MSG,
        });
    };

    return (
        <>
            <Toast
                ref={ref}
                type="error"
                msg={checkBxErrMsg}
                title="Withdrawal Batch"
            />
            <section
                className={clsx(
                    classes.root,
                    "animate__animated animate__fadeInLeft"
                )}
            >
                <Typography variant="h6">Withdrawals</Typography>
                <WithdrawalCard
                    totalAmount={totalWithdrawal}
                    cardTitle="Total Withdrawal"
                />

                <Box
                    component="div"
                    sx={{
                        display: "flex",
                        position: "relative",
                        gap: "10px",
                        justifyContent: "flex-end",
                        marginTop: 20,
                        marginBottom: 20,
                    }}
                >
                    <GenericButton
                        clickAction={() => openManualScreen()}
                        buttonName="Manual"
                        fontColor="#1E6262"
                        fontsize="15px"
                        bxShadw="none"
                        bdaColor="#1E6262"
                    />
                    <GenericButton
                        clickAction={() =>
                            setWithdrawalScreen(() => {
                                setScreen(true);
                                setIsMan(false);
                                setRequests({
                                    requestNumber: "",
                                    institutions: "",
                                });
                                return !withdrawalScreen;
                            })
                        }
                        buttonName="Auto"
                        fontColor="white"
                        fontsize="15px"
                        bxShadw="none"
                        bgColor="#1E6262"
                    />
                    <GenericButton
                        fontsize="15px"
                        clickAction={() =>
                            setOpenFilterBx(() => {
                                closeXport(false);
                                return !openFilterBx;
                            })
                        }
                        buttonName="Filter"
                    >
                        <Filter className={classes.btnIcon} />
                    </GenericButton>
                    <GenericButton
                        fontsize="15px"
                        clickAction={() =>
                            closeXport(() => {
                                setOpenFilterBx(false);
                                return !openXport;
                            })
                        }
                        buttonName="Export"
                    >
                        <ArrowTopRight className={classes.btnIcon} />
                        {openXport ? (
                            <Box className={classes.exportBox} component="span">
                                <Typography
                                    onClick={downloadAll}
                                    component="span"
                                >
                                    Export All
                                </Typography>
                                <Typography
                                    onClick={downloadRecords}
                                    component="span"
                                >
                                    Export Page
                                </Typography>
                            </Box>
                        ) : (
                            ""
                        )}
                    </GenericButton>

                    {openFilterBx ? (
                        <Box
                            component="div"
                            className={classes.filterBoxContainer}
                        >
                            <Box
                                component="div"
                                className={classes.filterBoxContent}
                            >
                                <Box
                                    component="div"
                                    className={classes.filterBoxHeader}
                                >
                                    <Typography component="h6" variant="h6">
                                        Filter
                                    </Typography>
                                    <Typography
                                        component="span"
                                        onClick={() => setOpenFilterBx(false)}
                                    >
                                        x
                                    </Typography>
                                </Box>
                                <Box
                                    component="div"
                                    className={classes.filterBoxMain}
                                >
                                    <Box
                                        component="div"
                                        className={classes.filterContentDate}
                                    >
                                        <label>
                                            Date
                                            <input type="date" />
                                        </label>
                                    </Box>

                                    <Box
                                        component="div"
                                        className={
                                            classes.filterTransactionType
                                        }
                                    >
                                        <Typography variant="body1">
                                            Transaction Type
                                        </Typography>
                                        <Box
                                            component="div"
                                            className={
                                                classes.checkBoxContainer
                                            }
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox defaultChecked />
                                                }
                                                label="Wallet Transfer"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label="Deposit"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox defaultChecked />
                                                }
                                                label="Direct Transfer"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label="Withdrawal"
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        component="div"
                                        className={classes.filterAmount}
                                    >
                                        <Typography variant="body1">
                                            Amount
                                        </Typography>
                                        <Box
                                            component="span"
                                            className={classes.amountRange}
                                        >
                                            <Typography>$1</Typography>
                                            <Typography>-</Typography>
                                            <Typography>$1</Typography>
                                            <Typography>-</Typography>
                                            <Typography>$1</Typography>
                                            <Typography>-</Typography>
                                            <Typography>$1</Typography>
                                        </Box>
                                        <Slider
                                            getAriaLabel={() =>
                                                "Temperature range"
                                            }
                                            value={value}
                                            onChange={handleChange}
                                            valueLabelDisplay="auto"
                                            getAriaValueText={valuetext}
                                        />
                                    </Box>

                                    <Box
                                        component="div"
                                        className={classes.filterButton}
                                    >
                                        <GenericButton
                                            clickAction={() =>
                                                setOpenFilterBx(false)
                                            }
                                            bdaColor="#1E6262"
                                            bxShadw="none"
                                            fontColor="#1E6262"
                                            buttonName="Cancel"
                                        />
                                        <GenericButton
                                            bdaColor="#1E6262"
                                            bxShadw="none"
                                            fontColor="white"
                                            bgColor="#1E6262"
                                            buttonName="Apply filter"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        ""
                    )}
                    {/* <Menu
                id="customer-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: classes.menu }}
                disableScrollLock={ true }
                >
                    <MenuItem onClick={viewDetails}>Filter by staus</MenuItem>
                </Menu> */}
                </Box>

                <Box component="div" className={classes.table}>
                    <GenericTableHeader
                        columns={columns}
                        gridColumns={gridColumns}
                        headerPadding="11px 15px"
                    />
                    <DepositAndWithdrawalTable
                        handleBatch={manBatch}
                        gridColumns={gridColumns}
                        loading={loading}
                        data={items}
                        handleCheckError={handleBatchError}
                    />
                </Box>

                {loading ? (
                    ""
                ) : (
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "60px",
                            width: "100%",
                            backgroundColor: "#F7F8F9",
                        }}
                    >
                        <Box component="div" sx={{ alignSelf: "flex-start" }}>
                            {/* <Typography component="span">{'20'} account.results</Typography> */}
                        </Box>

                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                                backgroundColor: "#F7F8F9",
                            }}
                        >
                            <Box
                                component="div"
                                sx={{ display: "flex", gap: "15px" }}
                            >
                                <GenericButton
                                    clickAction={onPrevPage}
                                    isDisabled={currentPage === 1}
                                    buttonName="Previous"
                                />
                                <GenericButton
                                    clickAction={onNextPage}
                                    isDisabled={currentPage === lastPage}
                                    buttonName="Next"
                                />
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                }}
                            >
                                {pageNumberList &&
                                    pageNumberList.map((pageNUmber, i) => (
                                        <Typography
                                            className={clsx(
                                                classes.pageList,
                                                pageNUmber === currentPage &&
                                                    classes.selected
                                            )}
                                            onClick={() =>
                                                setCurrentPage(pageNUmber)
                                            }
                                            variant="subtitle2"
                                            key={i}
                                        >
                                            {pageNUmber}
                                        </Typography>
                                    ))}
                            </Box>
                        </Box>
                    </Box>
                )}

                {withdrawalScreen ? (
                    <Box
                        component="div"
                        className={clsx(classes.withdrawalScreen)}
                    >
                        <Box
                            component="div"
                            className={clsx(
                                classes.withdrawalContainer,
                                // withdrawalAnime,
                                {
                                    "animate__animated animate__zoomOut":
                                        !withdrawalScreen,
                                    "animate__animated animate__zoomIn":
                                        withdrawalScreen,
                                }
                            )}
                        >
                            {!!withdrawalSuccess ? (
                                ""
                            ) : (
                                <Box
                                    component="div"
                                    className={classes.withdrawHeader}
                                >
                                    <Typography
                                        onClick={() =>
                                            setScreen(() => {
                                                clearWithdrawalReqs();
                                                return true;
                                            })
                                        }
                                        className={clsx(
                                            classes.headerTitle,
                                            screen && classes.headerTitleActive
                                        )}
                                        variant="h6"
                                    >
                                        <Typography
                                            component="span"
                                            className={clsx(
                                                classes.headerNumber,
                                                screen &&
                                                    classes.headerNumberActive
                                            )}
                                        >
                                            1
                                        </Typography>{" "}
                                        Withdrawal Request
                                    </Typography>
                                    <Typography
                                        className={clsx(
                                            classes.headerTitle,
                                            !screen && classes.headerTitleActive
                                        )}
                                        variant="h6"
                                    >
                                        <Typography
                                            component="span"
                                            className={clsx(
                                                classes.headerNumber,
                                                !screen &&
                                                    classes.headerNumberActive
                                            )}
                                        >
                                            2
                                        </Typography>
                                        Payment Authorization
                                    </Typography>
                                    <CloseCircleOutline
                                        onClick={() => closeWithdrawalScreen()}
                                        style={{
                                            cursor: "pointer",
                                            position: "absolute",
                                            top: -15,
                                            right: 14,
                                        }}
                                    />
                                </Box>
                            )}

                            {screen ? (
                                <>
                                    <Box
                                        component="div"
                                        className={classes.formGrp}
                                    >
                                        <TextField
                                            variant="outlined"
                                            id="demo-helper-text-aligned"
                                            label="Number of request"
                                            size="medium"
                                            name="requestNumber"
                                            value={requestNumber ?? 0}
                                            onChange={handleOnChange}
                                            type="number"
                                            InputProps={{
                                                readOnly: isMan,
                                            }}
                                            error={isNaN(requestNumber)}
                                        />
                                        <FormControl
                                            sx={{ m: 1, minWidth: 120 }}
                                            size="medium"
                                            variant="outlined"
                                        >
                                            <InputLabel id="demo-select-small">
                                                Institutions
                                            </InputLabel>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={institutions ?? ""}
                                                defaultValue=""
                                                name="institutions"
                                                label="Age"
                                                onChange={handleOnChange}
                                            >
                                                {account.result &&
                                                    account.result.map(
                                                        (acct, i) => (
                                                            <MenuItem
                                                                key={i}
                                                                value={
                                                                    acct.bankName
                                                                }
                                                            >
                                                                {acct.bankName}
                                                            </MenuItem>
                                                        )
                                                    )}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Button
                                        onClick={() => batchRequest()}
                                        className={classes.btn}
                                        color="primary"
                                        size="medium"
                                        variant="contained"
                                    >
                                        Batch
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {loadingReqs ? (
                                        <CircularProgressBar
                                            topMargin="20px"
                                            newWidth="30px"
                                            newHeight="30px"
                                        />
                                    ) : isEmpty(withdrawalRequests) &&
                                      withdrawalRequests !== null &&
                                      !!batchId ? (
                                        <Box
                                            component="div"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "28%",
                                            }}
                                            className={clsx({
                                                "animate__animated animate__shakeX":
                                                    isEmpty(
                                                        withdrawalRequests
                                                    ) &&
                                                    withdrawalRequests !==
                                                        null &&
                                                    !!batchId,
                                            })}
                                        >
                                            <Typography variant="h6">
                                                No batch Requests
                                            </Typography>
                                            <GenericButton
                                                clickAction={() =>
                                                    closeWithdrawalScreen()
                                                }
                                                buttonName="Exit"
                                                fontColor="white"
                                                fontsize="15px"
                                                bxShadw="none"
                                                bgColor="#1E6262"
                                            />
                                        </Box>
                                    ) : !!withdrawalSuccess ? (
                                        <Typography
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "28%",
                                            }}
                                            align="center"
                                            component="span"
                                            className="animate__animated animate__fadeIn"
                                        >
                                            <CheckboxMarkedCircleOutline
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    color: "green",
                                                }}
                                            />
                                            Success
                                        </Typography>
                                    ) : !!msg && !!institutionId ? (
                                        <Box
                                            component="div"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "28%",
                                            }}
                                            className={clsx({
                                                "animate__animated animate__shakeX":
                                                    !!msg && !!institutionId,
                                            })}
                                        >
                                            <Typography
                                                variant="h6"
                                                color="error"
                                            >
                                                {msg}
                                            </Typography>
                                            <GenericButton
                                                clickAction={() =>
                                                    closeWithdrawalScreen()
                                                }
                                                buttonName="Exit"
                                                fontColor="white"
                                                fontsize="15px"
                                                bxShadw="none"
                                                bgColor="#1E6262"
                                            />
                                        </Box>
                                    ) : (
                                        <>
                                            <TableContainer
                                                style={{
                                                    marginTop: 20,
                                                    height: "53%",
                                                    overflowY: "scroll",
                                                }}
                                            >
                                                <Table aria-label="a dense table">
                                                    <TableHead>
                                                        <TableRow
                                                            style={{
                                                                "& th": {
                                                                    fontWeight:
                                                                        "bold",
                                                                },
                                                            }}
                                                        >
                                                            {withdrawalColumns &&
                                                                withdrawalColumns.map(
                                                                    (req) => (
                                                                        <TableCell
                                                                            key={
                                                                                req.id
                                                                            }
                                                                        >
                                                                            {
                                                                                req.label
                                                                            }
                                                                        </TableCell>
                                                                    )
                                                                )}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {withdrawalRequests &&
                                                            withdrawalRequests.map(
                                                                (wallet, i) => (
                                                                    <TableRow
                                                                        sx={{
                                                                            "&:last-child td, &:last-child th":
                                                                                {
                                                                                    border: 0,
                                                                                },
                                                                        }}
                                                                        key={i}
                                                                    >
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {
                                                                                wallet.customerFullName
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {
                                                                                wallet.bic
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {
                                                                                wallet.account
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {
                                                                                wallet.amount
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {handlePaymentStatus(
                                                                                wallet.paymentStatus,
                                                                                "S"
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {formatDate(
                                                                                wallet.dateCreated
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}

                                                        <TableRow>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell
                                                                colSpan={1}
                                                            >
                                                                Total
                                                            </TableCell>
                                                            <TableCell
                                                                colSpan={1}
                                                                align="center"
                                                            >
                                                                {" "}
                                                                ={" "}
                                                            </TableCell>
                                                            <TableCell>
                                                                {withdrawalRequests &&
                                                                    modifyAmount(
                                                                        withdrawalRequests.reduce(
                                                                            (
                                                                                acc,
                                                                                currValue
                                                                            ) =>
                                                                                +acc +
                                                                                +currValue.amount,
                                                                            0
                                                                        )
                                                                    )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[
                                                    10, 15, 20,
                                                ]}
                                                component="div"
                                                count={
                                                    withdrawalRequests?.length
                                                }
                                                rowsPerPage={tableRowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={
                                                    handleChangeRowsPerPage
                                                }
                                            />

                                            <Box
                                                component="div"
                                                className={classes.authorize}
                                            >
                                                <FormControl
                                                    sx={{ m: 1, minWidth: 120 }}
                                                    size="medium"
                                                    variant="outlined"
                                                >
                                                    <InputLabel id="demo-select-small">
                                                        Institutions
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        defaultValue={
                                                            institutions
                                                        }
                                                        label="Institutions"
                                                        disabled
                                                    >
                                                        {account.result &&
                                                            account.result.map(
                                                                (acct, i) => (
                                                                    <MenuItem
                                                                        key={i}
                                                                        value={
                                                                            acct.bankName
                                                                        }
                                                                    >
                                                                        {
                                                                            acct.bankName
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Button
                                                onClick={authorize}
                                                className={classes.btn}
                                                color="primary"
                                                size="medium"
                                                variant="contained"
                                            >
                                                {loadingAuth ? (
                                                    <CircularProgressBar
                                                        newWidth="15px"
                                                        newHeight="15px"
                                                        iconColor="white"
                                                    />
                                                ) : (
                                                    "Authorize"
                                                )}
                                            </Button>
                                        </>
                                    )}

                                    {/* <Box component="div" className={classes.withdrawalTable}>
                      <GenericTableHeader columns={withdrawalColumns} gridColumns={withdrawalGridCol} headerPadding="11px 15px" />
                      <Box component="div" className={classes.withdrawalTableBody}>
                        <Typography component="span">Revolut</Typography>
                        <Typography component="span">FXBLOOMS</Typography>
                        <Typography component="span">1011011011</Typography>
                        <Typography component="span">₤32000</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>

                        <Typography component="span">Revolut</Typography>
                        <Typography component="span">FXBLOOMS</Typography>
                        <Typography component="span">1011011011</Typography>
                        <Typography component="span">₤32000</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                        <Typography className={classes.icon} component="span">Test</Typography>
                      </Box>
                    </Box> */}
                                </>
                            )}
                        </Box>
                    </Box>
                ) : (
                    ""
                )}
            </section>
        </>
    );
};

export default Withdrawals;
