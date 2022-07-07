import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { connect, useDispatch, useSelector, batch } from "react-redux";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import clsx from "clsx";

import {
    AppBar,
    Avatar,
    Box,
    Drawer,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Toolbar,
    Typography,
    TextField,
    // Accordion,
    // AccordionSummary,
    // AccordionDetails
} from "@material-ui/core";

import {
    AccountMultiple,
    AlertOutline,
    BagChecked,
    BellAlertOutline,
    CogOutline,
    CurrencyCny,
    ViewDashboard,
    ChevronLeft,
    ChevronRight,
    CashMinus,
    Headset,
    History,
    CashMultiple,
    Magnify,
    Logout,
    BankOutline,
} from "mdi-material-ui";
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import logo from "../../assets/img/logowhite.svg";
import avatar from "../../assets/img/avatar.jpg";
import {
    getStats,
    logout,
    searchForCustomer,
    searchForListings,
} from "../../actions/admin";
import {
    getCustomers,
    getResidencePermitValidationResponse,
    getIdCardValidationResponse,
} from "../../actions/customer";
import {
    COLORS,
    DRAWER_WIDTH as drawerWidth,
    LOGOUT,
} from "../../utils/constants";
import isEmpty from "../../utils/isEmpty";

import SessionModal from "./SessionModal";
// import Spinner from '../../components/common/Spinner';

import {
    ADMIN_HOME,
    CUSTOMERS,
    LISTINGS,
    TRANSACTION_LISTS,
    DEPOSITS,
    WITHDRAWALS,
    HISTORY,
    SUPPORT,
    RISK_PROFILE,
    FXBACCOUNTS,
} from "../../routes";
import { SET_CATEGORY, SET_CUSTOMER } from "../../actions/types";
import AccordionSearch from "../../components/admin-dashboard/AccordionSearch";
// import CircularProgressBar from '../../components/admin-dashboard/CircularProgressBar'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#ECF1F1",
        position: "relative",

        [theme.breakpoints.down("md")]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        },

        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
    },

    content: {
        // border: '1px solid red',
        flexGrow: 1,
        marginLeft: theme.spacing(9) + 1,
        marginTop: theme.spacing(10.13),
        zIndex: "997",
        width: `calc(100% - ${theme.spacing(9) + 1}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down("sm")]: {
            marginLeft: "0 !important",
            height: "100vh !important",
            width: "100% !important",
        },
    },

    contentShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    },

    appBar: {
        backgroundColor: "#ffffff",
        borderBottom: `1px solid ${COLORS.borderColor}`,
        zIndex: 999,
        marginLeft: theme.spacing(9) + 1,
        width: `calc(100% - ${theme.spacing(7) + 1}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down("sm")]: {
            marginLeft: "0 !important",
            width: "100% !important",
        },
    },

    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    appBarContent: {
        // border: '1px solid red',
        display: "grid",
        gridTemplateColumns: "4fr 0.9fr",
        alignItems: "center",
    },

    formContainer: {
        display: "flex",
        flexDirection: "row",
        // justifyContent: 'space-between',
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
    },

    searchField: {
        // paddingBottom: theme.spacing(0.1),
        // paddingTop: theme.spacing(0.1),
        padding: theme.spacing(1.3, 3),
        outline: "none",
        border: "1px solid #E2E8F0",
        backgroundColor: "white",
        borderRadius: "20px",
        width: "20rem",
    },

    headerLinks: {
        display: "grid",
        gridTemplateColumns: "0.5fr 0.5fr",
        listStyleType: "none",
        alignItems: "center",
        gap: theme.spacing(1),

        "& li": {
            textAlign: "center",
        },
    },

    avatarContainer: {
        alignSelf: "stretch",
        borderLeft: `1px solid ${COLORS.borderColor}`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        backgroundColor: "#F8F9FA",
        paddingLeft: theme.spacing(3),
    },

    adminName: {
        color: "#6D6E6E",
        fontWeight: 500,
        fontSize: "0.9vw",
    },

    drawer: {
        flexShrink: 0,
        whiteSpace: "nowrap",
        width: drawerWidth,

        [theme.breakpoints.down("md")]: {
            display: "none",
        },
    },

    paper: {
        backgroundColor: theme.palette.primary.main,
        borderTopRightRadius: "0",
        overflowX: "hidden",
        boxSizing: "border-box",
        paddingRight: theme.spacing(2),
    },

    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1,
        },
    },

    logo: {
        width: "100%",
    },

    collapseIcon: {
        color: COLORS.offWhite,
    },

    expandIcon: {
        color: COLORS.offWhite,
    },

    toolbar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: [[theme.spacing(2), theme.spacing(2), 0, theme.spacing(2)]],
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },

    collapsedToolbar: {
        justifyContent: "center",
    },

    admin: {
        color: COLORS.offWhite,
        position: "relative",
        top: -25,
        left: 52,
    },

    links: {
        marginTop: theme.spacing(2.5),
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },

    linkItem: {
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        color: COLORS.offWhite,
        marginBottom: theme.spacing(1),

        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.58)",
        },
    },

    bottomItem: {
        marginTop: "auto",
    },

    activeLink: {
        backgroundColor: "rgba(255, 255, 255, 0.58)",
    },

    icon: {
        color: COLORS.offWhite,
    },

    searchBarContainer: {
        position: "fixed",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,0,0.3)",
        top: 0,
        right: 0,
        zIndex: 1000,
        width: "100%",
        height: "100vh",
        transform: "translate(0, 84px)",
    },

    searchBarResult: {
        backgroundColor: "white",
        width: "50%",
        height: "80vh",
        marginLeft: "auto",
        borderRadius: "3px",
        marginTop: ".6rem",
        // paddingTop: '3rem',
        // paddingLeft: '1.5rem',
        padding: "3rem 1.5rem 1rem 1.5rem",
        overflowY: "scroll",
    },

    accordion: {
        boxShadow: "none",
    },

    accordionSummary: {
        backgroundColor: "#F7F7F9",

        "&.Mui-expanded": {
            minHeight: "48px",
            // maxHeight: '55px'
            // backgroundColor: '#a5a5a5',
        },
    },
}));

const AdminDashboard = ({
    title,
    getCustomers,
    getStats,
    searchForCustomer,
    searchForListings,
    logout,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { admin, customers } = useSelector((state) => state);
    const {
        pageSize,
        customersSearchResult: { items },
    } = useSelector((state) => state.customers);
    const { listingSearchResult } = useSelector((state) => state.listings);

    const [searchText, setSearchText] = useState("");
    const [path, setPath] = useState("");
    // const [loadingText, setLoadingText] = useState('One Moment . . .');
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    // const [errors, setErrors] = useState({});
    // const [listingArr, setListingArr] = useState([]);

    const links = [
        { url: ADMIN_HOME, text: "Dashboard", icon: <ViewDashboard /> },
        { url: CUSTOMERS, text: "Users", icon: <AccountMultiple /> },
        { url: LISTINGS, text: "Listings", icon: <CurrencyCny /> },
        {
            url: TRANSACTION_LISTS,
            text: "Transactions",
            icon: <CashMultiple />,
        },
        { url: DEPOSITS, text: "Deposits", icon: <BagChecked /> },
        { url: WITHDRAWALS, text: "Withdrawals", icon: <CashMinus /> },
        { url: HISTORY, text: "History", icon: <History /> },
        { url: SUPPORT, text: "Support", icon: <Headset /> },
        { url: RISK_PROFILE, text: "Risk Profile", icon: <AlertOutline /> },
    ];

    useEffect(() => {
        checkSession();
        getStats();
        // eslint-disable-next-line
    }, []);

    // Get customers when serach field is cleared
    useEffect(() => {
        if (isEmpty(searchText)) {
            // setLoading(true);
            // setLoadingText('One Moment . . .');
            getCustomers({ pageNumber: 0, pageSize });
        }
    }, [getCustomers, pageSize, searchText]);

    useEffect(() => {
        setPath(location.pathname);
        // Hide search field on a page that isn't the customers page
        if (location.pathname !== CUSTOMERS) {
            dispatch({
                type: SET_CATEGORY,
                payload: null,
            });
        }
    }, [dispatch, location.pathname]);

    useEffect(() => {
        setLoading(false);
    }, [customers]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const checkSession = () => {
        if (sessionStorage.getItem(LOGOUT)) {
            sessionStorage.removeItem(LOGOUT);
            logout(navigate);
        }
    };

    const handleLinkClick = (link) => {
        setSearchText("");
        navigate(link);
    };

    const handleSearch = useCallback(
        (e) => {
            e.preventDefault();
            setSearchText(e.target.value);
            if (isEmpty(searchText)) {
                // return setErrors({ searchText: 'Please enter a search term' });
                // return
            }
            // setLoading(true);
            // setLoadingText('Searching . . .');
            // const test = searchForCustomer({ searchText, pageNumber: 0, pageSize });
            searchForCustomer({ searchText, pageNumber: 0, pageSize });
            if (!isEmpty(items)) {
                // items.map((customer) =>
                console.log(items[0].id);
                searchForListings(items[0]?.id, {
                    pageNumber: 0,
                    pageSize,
                });
                // );
            }
        },
        [searchText, pageSize, searchForCustomer, items, searchForListings]
    );

    const viewCustomerProfile = (customer) => {
        console.log(location);
        // console.log(params);
        batch(() => {
            dispatch(getResidencePermitValidationResponse(customer.id));
            dispatch(getIdCardValidationResponse(customer.id));
            dispatch({
                type: SET_CUSTOMER,
                payload: customer,
            });
        });

        navigate(`${CUSTOMERS}/${customer.id}`, { replace: true });
        setSearchText("");
    };

    const viewCustomerListing = (listing) => {};

    return (
        <>
            <Helmet>
                <title>{`${title} | FXBLOOMS.com`}</title>
            </Helmet>
            <SessionModal />
            {/* {loading && <Spinner text={loadingText} />} */}
            <section className={classes.root}>
                <AppBar
                    position="fixed"
                    color="transparent"
                    elevation={0}
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar disableGutters className={classes.appBarContent}>
                        <Box component="div" className={classes.formContainer}>
                            <form noValidate onSubmit={handleSearch}>
                                <TextField
                                    className={classes.searchField}
                                    type="text"
                                    placeholder="Search . . ."
                                    value={searchText}
                                    onChange={handleSearch}
                                    // helperText={errors.searchText}
                                    // error={errors.searchText ? true : false}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Magnify />
                                            </InputAdornment>
                                        ),
                                        disableUnderline: true,
                                    }}
                                />
                            </form>
                            <Box component="div">
                                <ul className={classes.headerLinks}>
                                    <li>
                                        <IconButton
                                            style={{
                                                color: "#718096",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <CogOutline />
                                        </IconButton>
                                    </li>
                                    <li>
                                        <IconButton
                                            style={{
                                                color: "#718096",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <BellAlertOutline />
                                        </IconButton>
                                    </li>
                                </ul>
                            </Box>
                        </Box>
                        <Box
                            component="div"
                            className={classes.avatarContainer}
                        >
                            <Avatar
                                sx={{ width: 60, height: 60 }}
                                src={avatar}
                                className={classes.avatar}
                            />
                            &nbsp;&nbsp;
                            <Typography
                                variant="body2"
                                component="span"
                                className={classes.adminName}
                            >{`${admin.firstName} ${admin.lastName}`}</Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx(classes.paper, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div
                        className={clsx(classes.toolbar, {
                            [classes.collapsedToolbar]: !open,
                        })}
                    >
                        {open && (
                            <Link to="/">
                                <img
                                    className={classes.logo}
                                    src={logo}
                                    alt="FXBLOOMS Logo"
                                />
                            </Link>
                        )}
                        <IconButton onClick={toggleDrawer}>
                            {!open ? (
                                <Tooltip
                                    title="Expand Navigation"
                                    placement="top"
                                    arrow
                                >
                                    <ChevronRight
                                        className={classes.expandIcon}
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip
                                    title="Collapse Navigation"
                                    placement="top"
                                    arrow
                                >
                                    <ChevronLeft
                                        className={classes.collapseIcon}
                                    />
                                </Tooltip>
                            )}
                        </IconButton>
                    </div>
                    {open && (
                        <Typography
                            variant="body2"
                            component="span"
                            className={classes.admin}
                        >
                            Admin
                        </Typography>
                    )}
                    <List className={classes.links}>
                        {links.map((link, index) => (
                            <ListItem
                                className={clsx(classes.linkItem, {
                                    [classes.activeLink]: path.includes(
                                        `${link.url}`
                                    ),
                                })}
                                key={index}
                                button
                                disableRipple
                                onClick={() => handleLinkClick(link.url)}
                                // disabled={link.url === MAKE_LISTING || link.url === MESSAGES ? true : false}
                            >
                                <ListItemIcon className={classes.icon}>
                                    {link.icon}
                                </ListItemIcon>
                                {open && <ListItemText primary={link.text} />}
                            </ListItem>
                        ))}

                        <ListItem
                            className={clsx(
                                classes.linkItem,
                                classes.bottomItem,
                                {
                                    [classes.activeLink]: path.includes(
                                        `${FXBACCOUNTS}`
                                    ),
                                }
                            )}
                            button
                            disableRipple
                            onClick={() => handleLinkClick(FXBACCOUNTS)}
                        >
                            <ListItemIcon className={classes.icon}>
                                <BankOutline />
                            </ListItemIcon>
                            {open && <ListItemText primary="FXB Accounts" />}
                        </ListItem>
                        <ListItem
                            className={classes.linkItem}
                            button
                            disableRipple
                            onClick={() => logout(navigate)}
                        >
                            {open ? (
                                <ListItemIcon className={classes.icon}>
                                    <Logout />
                                </ListItemIcon>
                            ) : (
                                <Tooltip
                                    title="Log Out"
                                    placement="right"
                                    arrow
                                >
                                    <ListItemIcon className={classes.icon}>
                                        <Logout />
                                    </ListItemIcon>
                                </Tooltip>
                            )}
                            {open && <ListItemText primary="Log out" />}
                        </ListItem>
                    </List>
                </Drawer>
                <div
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <Outlet />
                </div>
                {searchText && searchText.length > 0 ? (
                    <Box
                        component="div"
                        className={classes.searchBarContainer}
                        onClick={() => setSearchText("")}
                    >
                        <Box
                            component="div"
                            className={classes.searchBarResult}
                        >
                            <AccordionSearch
                                viewCustomerProfile={viewCustomerProfile}
                                accordionHeader="Customers"
                                searchText={searchText}
                                data={items}
                                loading={loading}
                            />
                            <AccordionSearch
                                viewCustomerProfile={viewCustomerListing}
                                accordionHeader="Listings"
                                searchText={searchText}
                                data={listingSearchResult}
                                loading={loading}
                            />
                        </Box>
                    </Box>
                ) : (
                    ""
                )}
                {/* {showBottomNavigation && 
                    <Box
                        boxShadow={5}
                        className={classes.bottomBar}
                    >
                        <BottomNavigation
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue)
                            }}
                            showLabels
                        >
                            {mobileLinks.map((item, index) => (
                                <BottomNavigationAction onClick={() => handleLinkClick(item.url)} key={index} label={item.text} icon={item.icon} />
                            ))}
                        </BottomNavigation>
                    </Box>
                } */}
            </section>
        </>
    );
};

AdminDashboard.propTypes = {
    title: PropTypes.string.isRequired,
    getCustomers: PropTypes.func.isRequired,
    getStats: PropTypes.func.isRequired,
    searchForCustomer: PropTypes.func.isRequired,
    searchForListings: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

export default connect(undefined, {
    getCustomers,
    getStats,
    searchForCustomer,
    searchForListings,
    logout,
})(AdminDashboard);
