import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { batch, connect, useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import {
    Box,
    Divider,
    Grid,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import {
    getCustomers,
    getNewCustomers,
    getRejectedCustomers,
    getSuspendedCustomers,
    getVerifiedCustomers,
    getCustomersWithoutProfile,
    // fetchStart,
    setCustomerStatus,
} from "../../../actions/customer";
import { getStats, exportAllUserRecords } from "../../../actions/admin";
import {
    CLEAR_CUSTOMER_STATUS_MSG,
    SET_CATEGORY,
    SET_CUSTOMER,
    CLEAR_ERROR_MSG,
} from "../../../actions/types";

import { COLORS, CUSTOMER_CATEGORY } from "../../../utils/constants";
import { CUSTOMERS } from "../../../routes";

import AllCustomers from "./AllCustomers";
import NoProfileCustomers from "./NoProfileCustomers";
import SuspendedCustomers from "./SuspendedCustomers";
import RejectedCustomers from "./RejectedCustomers";
import VerifiedCustomers from "./VerifiedCustomers";
import SuccessModal from "../../../components/common/SuccessModal";
import isEmpty from "../../../utils/isEmpty";
import GenericTableHeader from "../../../components/admin-dashboard/GenericTableHeader";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import { ArrowTopRight } from "mdi-material-ui";
import { exportRecords } from "../../../utils/exportRecords";
import ExportAllLoader from "../../../components/admin-dashboard/ExportAllLoader";

const useStyles = makeStyles((theme) => ({
    root: {
        // padding: theme.spacing(0, 3),
        backgroundColor: "white",
        paddingRight: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingTop: theme.spacing(9),
        paddingBottom: theme.spacing(12),
        position: "relative",
    },

    exportLoader: {
        position: "fixed",
        top: 0,
        right: "-5%",
        zIndex: 1000,
        backdropFilter: "blur(3px)",
        // backgroundColor: 'rgba(0,0,0,0.3)',
        width: "100%",
        height: "100vh",
        transform: "translate(0, 84px)",

        display: "flex",
        justifyContent: "center",
        // alignItems: 'center'
    },

    exportBox: {
        position: "absolute",
        top: 47,
        right: 1,
        borderRadius: 5,
        boxShadow: "1px 1px 1px 1.3px #c7c7c7",
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

    title: {
        fontWeight: 600,
        fontSize: theme.spacing(3),
    },

    link: {
        color: theme.palette.primary.main,
        cursor: "pointer",
    },

    filterContainer: {
        display: "flex",
        gap: theme.spacing(2),
        // gridTemplateColumns: '.13fr .13fr .13fr .13fr .15fr',
        // gap: theme.spacing(4),
        marginTop: theme.spacing(3),
        borderBottom: "1px solid #E3E8EE",
        width: "90%",
    },

    filter: {
        // backgroundColor: COLORS.lightTeal,
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        // padding: theme.spacing(1),
        width: "max-content",
        // gap: theme.spacing(1),
        color: "#697386",
        padding: "5px",
        gap: "10px",

        "& span": {
            fontWeight: "600",
        },

        "& span:nth-child(2)": {
            color: "#1E625E",
            backgroundColor: "#AEC7C0",
            padding: "0px 5px",
            textAlign: "center",
            lineHeight: "1 !important",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: theme.spacing(1),
        },

        "&:not(:first-child) span": {},
    },

    active: {
        borderBottom: "2px solid #1E6262",
    },

    table: {
        marginTop: theme.spacing(2),
    },

    tableHeader: {
        display: "grid",
        gridTemplateColumns: "0.2fr 1.5fr 1.5fr 2fr 1fr 0.5fr 0.8fr 0.5fr",
    },

    content: {
        display: "grid",
        gridTemplateColumns: "1fr",
    },

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: "pointer",
    },

    pagination: {
        backgroundColor: COLORS.lightTeal,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        borderLeft: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
    },

    menu: {
        backgroundColor: "white",
        border: `none`,
        borderRadius: theme.spacing(1.9),
        marginRight: "10px",
        cursor: "pointer",
        // left: '1695px !important',

        "& ul": {
            padding: "0",
        },

        "& li": {
            padding: theme.spacing(2),
            paddingLeft: theme.spacing(2.5),
        },
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
    { id: "", label: "", minWidth: 10 },
    { id: "firstName", label: "First Name", minWidth: 100 },
    {
        id: "lastName",
        label: "Last Name",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "email",
        label: "Email Address",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "username",
        label: "Username",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "status",
        label: "Status",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "riskProfile",
        label: "Risk Profile",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "actions",
        label: "Actions",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const gridColumns =
    "minmax(0, 0.15fr) repeat(2, minmax(0, 1fr)) repeat(2, minmax(0, 1.2fr)) .8fr 1fr 0.3fr";
const pages = [20, 50, 75, 100];

const Customers = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { admin } = useSelector((state) => state);
    const {
        confirmed,
        customer,
        customers,
        msg,
        noProfile,
        pending,
        rejected,
        suspended,
        isLoading,
    } = useSelector((state) => state.customers);
    const {
        // totalCustomersAwaitingApproval,
        totalApprovedCustomers,
        totalCustomers,
        totalRejectedCustomers,
        totalSuspendedCustomers,
        totalCustomersWithNoProfile,
    } = useSelector((state) => state.stats);
    // const [ isDisabled, setDisabled ] = useState(true)

    // const { isMenuOpen } = useSelector(state => state.admin);

    const {
        ALL_CUSTOMERS,
        CONFIRMED,
        NO_PROFILE,
        PENDING,
        REJECTED,
        SUSPENDED,
    } = CUSTOMER_CATEGORY;

    // const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
    const [customerCount, setCustomerCount] = useState(0);
    const [error, setError] = useState("");
    // eslint-disable-next-line
    const [filter, setFilter] = useState(ALL_CUSTOMERS);
    const [anchorEl, setAnchorEl] = useState(null);
    // const [pageNumberList, setPageNumberList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [customerStatus, setStatus] = useState(customer.customerStatus);
    // const paginationRange  = usePagination({pageNumber, currentPage, siblingCount, pageSize})
    const [openXport, closeXport] = useState(false);
    const [exportAllLoader, setExportAllLoader] = useState(false);

    // const [lastPage, setLastPage] = useState(pageNumberList?.length);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        getCustomers,
        getNewCustomers,
        getCustomersWithoutProfile,
        getSuspendedCustomers,
        getVerifiedCustomers,
        getRejectedCustomers,
        getStats,
        setCustomerStatus,
        handleSetTitle,
    } = props;

    const successModal = useRef();

    // const handlePageNUmberList = useCallback(() => {
    //     const pageNumArr = [];
    //     setLastPage(customerCount);
    //     if (customerCount >= 1) {
    //         for (let i = 1; i <= customerCount; i++) {
    //             pageNumArr.push(i);
    //         }
    //     }
    //     setPageNumberList(pageNumArr);
    // }, [customerCount]);

    // const onNextPage = () => {
    //     setCurrentPage(currentPage + 1);
    // };

    // const onPrevPage = () => {
    //     setCurrentPage(currentPage - 1);
    // };

    // useEffect(() => {
    //     dispatch(fetchStart());
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [filter]);

    useEffect(() => {
        handleSetTitle("Customers");
        if (isEmpty(noProfile)) {
            getCustomersWithoutProfile({
                pageNumber: 1,
                pageSize: rowsPerPage,
            });
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!customerStatus || anchorEl) {
            setStatus(customer.customerStatus);
        }
    }, [customer.customerStatus, customerStatus, anchorEl]);

    useEffect(() => {
        return () => {
            dispatch({
                type: CLEAR_ERROR_MSG,
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getStats();

        if (filter === CONFIRMED && confirmed.items?.length > 0) {
            return;
        }

        if (filter === ALL_CUSTOMERS && customers.items?.length > 0) {
            return;
        }

        if (filter === REJECTED && rejected.items?.length > 0) {
            return;
        }

        if (filter === SUSPENDED && suspended.items?.length > 0) {
            return;
        }

        if (filter === NO_PROFILE && noProfile.items?.length > 0) {
            return;
        }
    }, [
        confirmed.items,
        customers.items,
        noProfile.items,
        pending.items,
        rejected.items,
        suspended.items,
        getStats,
        ALL_CUSTOMERS,
        CONFIRMED,
        NO_PROFILE,
        SUSPENDED,
        REJECTED,
        filter,
    ]);

    useEffect(() => {
        if (msg && customer) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [customer, msg]);

    const dismissAction = () => {
        batch(() => {
            dispatch({
                type: SET_CUSTOMER,
                payload: {},
            });
            dispatch({
                type: CLEAR_CUSTOMER_STATUS_MSG,
            });
        });
    };

    // const handleLoading = useCallback(() => {})

    const getCount = useCallback(() => {
        switch (filter) {
            case CONFIRMED:
                setCurrentPage(confirmed.currentPageNumber);
                setCustomerCount(confirmed.totalPageCount || 0);
                break;

            case PENDING:
                setCurrentPage(pending.currentPageNumber);
                setCustomerCount(pending.totalPageCount || 0);
                break;

            case REJECTED:
                setCurrentPage(rejected.currentPageNumber);
                setCustomerCount(rejected.totalPageCount || 0);
                break;

            case SUSPENDED:
                setCurrentPage(suspended.currentPageNumber);
                setCustomerCount(suspended.totalPageCount || 0);
                break;

            case NO_PROFILE:
                setCurrentPage(noProfile.currentPageNumber);
                setCustomerCount(noProfile.totalPageCount || 0);
                break;

            case ALL_CUSTOMERS:
                setCurrentPage(customers.currentPageNumber);
                setCustomerCount(customers.totalPageCount || 0);
                break;

            default:
                setCustomerCount(0);
                break;
        }
    }, [
        filter,
        ALL_CUSTOMERS,
        CONFIRMED,
        PENDING,
        REJECTED,
        SUSPENDED,
        NO_PROFILE,
        customers,
        confirmed,
        pending,
        rejected,
        suspended,
        noProfile,
    ]);

    // const getMore = useCallback(() => {
    //     setLoading(true);
    //     switch (filter) {
    //         case CONFIRMED:
    //             if (confirmed.hasNext) {
    //                 getVerifiedCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: confirmed.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //         case PENDING:
    //             if (pending.hasNext) {
    //                 getNewCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: pending.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //         case REJECTED:
    //             if (rejected.hasNext) {
    //                 getRejectedCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: rejected.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //             case SUSPENDED:
    //                 getSuspendedCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: suspended.currentPageNumber + 1
    //                 });
    //                 break;

    //         case NO_PROFILE:
    //             getCustomersWithoutProfile({
    //                 pageSize: rowsPerPage,
    //                 pageNumber: noProfile.currentPageNumber + 1
    //             });
    //             break;

    //         case ALL_CUSTOMERS:
    //             if (customers.hasNext) {
    //                 getCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: customers.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //         default:
    //             setLoading(false);
    //             break;
    //     }
    // }, [ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED, confirmed.currentPageNumber, confirmed.hasNext, customers.currentPageNumber, customers.hasNext, filter, getCustomers, getCustomersWithoutProfile, getNewCustomers, getRejectedCustomers, getSuspendedCustomers, getVerifiedCustomers, noProfile.currentPageNumber, pending.currentPageNumber, pending.hasNext, rejected.currentPageNumber, rejected.hasNext, rowsPerPage, suspended.currentPageNumber]);

    useEffect(() => {
        switch (filter) {
            case CONFIRMED:
                getVerifiedCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage,
                });
                break;

            case PENDING:
                getNewCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage,
                });
                break;

            case REJECTED:
                getRejectedCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage,
                });
                break;

            case SUSPENDED:
                getSuspendedCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage,
                });
                break;

            case NO_PROFILE:
                getCustomersWithoutProfile({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage,
                });
                break;

            case ALL_CUSTOMERS:
                getCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage,
                });
                break;
            default:
                break;
        }
        // handlePageNUmberList();
    }, [
        ALL_CUSTOMERS,
        CONFIRMED,
        NO_PROFILE,
        PENDING,
        REJECTED,
        SUSPENDED,
        filter,
        getCustomers,
        getCustomersWithoutProfile,
        getNewCustomers,
        getRejectedCustomers,
        getSuspendedCustomers,
        getVerifiedCustomers,
        rowsPerPage,
        currentPage,
    ]);

    // Get customers when page number changes
    // useEffect(() => {
    //     if (currentPage > 0) {
    //         fetchStart();
    //     }
    // }, [fetchStart, currentPage]);

    useEffect(() => {
        getCount();
    }, [filter, getCount]);

    const handleSetFilter = (filter) => {
        setFilter(filter);
        setRowsPerPage(pages[0]);
        dispatch({
            type: SET_CATEGORY,
            payload: filter,
        });
    };

    const downloadRecords = () => {
        let data = [];
        switch (filter) {
            case CONFIRMED:
                data = [...confirmed.items];
                break;

            case SUSPENDED:
                data = [...suspended.items];
                break;

            case PENDING:
                data = [...pending.items];
                break;

            case NO_PROFILE:
                data = [...noProfile.items];
                break;

            case REJECTED:
                data = [...rejected.items];
                break;

            case ALL_CUSTOMERS:
                data = [...customers.items];
                break;

            default:
                break;
        }

        if (exportRecords(data, admin, filter)?.errors) {
            return;
        }
    };

    const downloadAll = async () => {
        setExportAllLoader(true);
        await exportAllUserRecords(admin);
        setExportAllLoader(false);
    };

    const viewDetails = () => {
        handleClose();
        // handleSetTitle('User Details');
        navigate(`${CUSTOMERS}/${customer.id}`);
    };

    const editProfile = () => {
        handleClose();
        navigate(`${CUSTOMERS}/${customer.id}`, { editProfile: true });
    };

    const contact = () => {
        handleClose();
    };

    const suspend = (e) => {
        handleClose();
        if (customerStatus !== SUSPENDED && customerStatus === CONFIRMED) {
            setCustomerStatus({
                customerID: customer.id,
                newStatus: SUSPENDED,
                currentStatus: filter,
            });
            setCurrentPage(currentPage);
        }
    };

    const confirmCustomer = () => {
        handleClose();
        if (customerStatus !== CONFIRMED && customerStatus === SUSPENDED) {
            setCustomerStatus({
                customerID: customer.id,
                newStatus: CONFIRMED,
                currentStatus: filter,
            });
        } // setErrors({})
    };

    const changeRiskProfile = () => {
        handleClose();
    };

    const viewCustomerProfile = (customer) => {
        dispatch({
            type: SET_CUSTOMER,
            payload: customer,
        });
        navigate(`${CUSTOMERS}/${customer.id}`);
    };

    return (
        <>
            {error && (
                <Alert
                    severity="warning"
                    onClose={() => {
                        setError("");
                    }}
                    // action={
                    //     <Button color="inherit" size="small">
                    //     UNDO
                    //     </Button>
                    // }
                >
                    {error}
                </Alert>
            )}
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section
                className={clsx(
                    classes.root,
                    "animate__animated animate__fadeInLeft"
                )}
            >
                <Grid container direction="row" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body1" className={classes.title}>
                            All Users
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                position: "relative",
                                flexDirection: "row",
                                gap: "10px",
                            }}
                        >
                            <GenericButton
                                buttonName="Export"
                                clickAction={() => closeXport(!openXport)}
                            >
                                <ArrowTopRight />
                                {openXport ? (
                                    <Box
                                        className={classes.exportBox}
                                        component="span"
                                    >
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
                        </Box>
                    </Grid>
                </Grid>
                <Box component="section" className={classes.filterContainer}>
                    <div
                        className={clsx(
                            classes.filter,
                            filter === ALL_CUSTOMERS && classes.active
                        )}
                        onClick={() => handleSetFilter(ALL_CUSTOMERS)}
                    >
                        <Typography variant="subtitle2" component="span">
                            All
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalCustomers}
                        </Typography>
                    </div>
                    <div
                        style={{ color: "#1E6262" }}
                        className={clsx(
                            classes.filter,
                            filter === CONFIRMED && classes.active
                        )}
                        onClick={() => handleSetFilter(CONFIRMED)}
                    >
                        <Typography variant="subtitle2" component="span">
                            Verified
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalApprovedCustomers}
                        </Typography>
                    </div>
                    <div
                        className={clsx(
                            classes.filter,
                            filter === REJECTED && classes.active
                        )}
                        onClick={() => handleSetFilter(REJECTED)}
                    >
                        <Typography variant="subtitle2" component="span">
                            Rejected
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalRejectedCustomers}
                        </Typography>
                    </div>
                    <div
                        className={clsx(
                            classes.filter,
                            filter === SUSPENDED && classes.active
                        )}
                        onClick={() => handleSetFilter(SUSPENDED)}
                    >
                        <Typography variant="subtitle2" component="span">
                            Suspended
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalSuspendedCustomers}
                        </Typography>
                    </div>
                    <div
                        className={clsx(
                            classes.filter,
                            filter === NO_PROFILE && classes.active
                        )}
                        onClick={() => handleSetFilter(NO_PROFILE)}
                    >
                        <Typography variant="subtitle2" component="span">
                            No Profile
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalCustomersWithNoProfile}
                        </Typography>
                    </div>
                </Box>
                {/* <Paper> */}
                <Box component="div" className={classes.table}>
                    <GenericTableHeader
                        columns={columns}
                        gridColumns={gridColumns}
                    />
                    {filter === NO_PROFILE && (
                        <NoProfileCustomers
                            handleClick={handleClick}
                            handleSetTitle={handleSetTitle}
                            loading={isLoading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    )}
                    {filter === SUSPENDED && (
                        <SuspendedCustomers
                            handleClick={handleClick}
                            handleSetTitle={handleSetTitle}
                            loading={isLoading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    )}
                    {filter === CONFIRMED && (
                        <VerifiedCustomers
                            handleClick={handleClick}
                            handleSetTitle={handleSetTitle}
                            loading={isLoading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    )}
                    {filter === REJECTED && (
                        <RejectedCustomers
                            handleClick={handleClick}
                            handleSetTitle={handleSetTitle}
                            loading={isLoading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    )}
                    {filter === ALL_CUSTOMERS && (
                        <AllCustomers
                            handleClick={handleClick}
                            handleSetTitle={handleSetTitle}
                            loading={isLoading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    )}
                </Box>

                <Menu
                    id="customer-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    classes={{ paper: classes.menu }}
                    disableScrollLock={true}
                >
                    <MenuItem onClick={viewDetails}>View Details</MenuItem>
                    <Divider />
                    <MenuItem onClick={editProfile}>Edit Profile</MenuItem>
                    <Divider />
                    <MenuItem onClick={contact}>Contact</MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() =>
                            customerStatus === CONFIRMED
                                ? suspend()
                                : confirmCustomer()
                        }
                        disabled={
                            customerStatus === REJECTED ||
                            customerStatus === "NO_PROFILE"
                        }
                    >
                        {customerStatus === SUSPENDED ? "UnSuspend" : "Suspend"}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={changeRiskProfile}>
                        Change Risk Profile
                    </MenuItem>
                </Menu>

                {!!isLoading ? (
                    ""
                ) : (
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            marginTop: "60px",
                            width: "100%",
                        }}
                    >
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                            }}
                        >
                            <Pagination
                                count={customerCount ?? 0}
                                page={currentPage ?? 0}
                                onChange={(event, value) =>
                                    setCurrentPage(value)
                                }
                            />
                        </Box>
                    </Box>
                )}

                {exportAllLoader ? (
                    <ExportAllLoader loader={exportAllLoader} />
                ) : (
                    ""
                )}
            </section>
        </>
    );
};

Customers.propTypes = {
    getCustomers: PropTypes.func.isRequired,
    getCustomersWithoutProfile: PropTypes.func.isRequired,
    getSuspendedCustomers: PropTypes.func.isRequired,
    getStats: PropTypes.func.isRequired,
    getNewCustomers: PropTypes.func.isRequired,
    getRejectedCustomers: PropTypes.func.isRequired,
    getVerifiedCustomers: PropTypes.func.isRequired,
    setCustomerStatus: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired,
};

export default connect(undefined, {
    getCustomers,
    getCustomersWithoutProfile,
    getSuspendedCustomers,
    getNewCustomers,
    getRejectedCustomers,
    getVerifiedCustomers,
    getStats,
    setCustomerStatus,
})(Customers);
