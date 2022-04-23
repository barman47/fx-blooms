import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Checkbox,
    FormControlLabel,
    IconButton, 
    TableCell, 
    TableRow, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DotsHorizontal } from 'mdi-material-ui';
import TextClamp from 'react-string-clamp';

import { getCustomersWithoutProfile } from '../../../actions/customer';
import { SET_CUSTOMER } from '../../../actions/types';
import { COLORS, USER_COLUMNS } from '../../../utils/constants';
import GenericTableBody from '../../../components/admin-dashboard/GenericTableBody'

const useStyles = makeStyles(theme => ({
    customer: {
        background: 'transparent',
        display: 'grid',
        gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1fr 0.5fr 0.7fr 0.5fr',
        alignItems: 'center',

        '&:last-child': {
            borderBottom: 'none'
        }
    },

    text: {
        color: COLORS.offBlack,
        fontWeight: 400,
        padding: theme.spacing(1),

        [theme.breakpoints.down('md')]: {
            fontSize: theme.spacing(1.2)
        },

        [theme.breakpoints.down('md')]: {
            fontSize: theme.spacing(0.7)
        }
    },

    item: {
        border: 'none',
        marginBottom: 0
    },
    
    button: {
        justifySelf: 'center'
    },

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: 'pointer'
    },
}));

const NoProfileCustomers = ({ getCustomersWithoutProfile, handleClick, viewCustomerProfile, filter }) => {

    const noProfileCustomers = useSelector(state => state.customers?.noProfile?.items);

    // useEffect(() => {
    //     // handleSetTitle('Verified Customers');
    //     getCustomersWithoutProfile({
    //         pageNumber: 1,
    //         pageSize: 25
    //     });
    //     // eslint-disable-next-line
    // }, []);

    return (
        <>
            <GenericTableBody data={noProfileCustomers} columnList={USER_COLUMNS} handleClick={handleClick} viewCustomerProfile={viewCustomerProfile}  />
            
            {/* {noProfileCustomers && noProfileCustomers.map((customer) => (
                <TableRow role="checkbox" tabIndex={-1} key={customer.id} className={classes.customer} hover>
                    <TableCell className={classes.item}>
                        <FormControlLabel control={<Checkbox name="checked" color="primary" disableFocusRipple disableTouchRipple disableRipple />} />    
                    </TableCell>
                    <TableCell className={classes.item} style={{ cursor: 'pointer' }} onClick={() => viewCustomerProfile(customer)}><TextClamp text={customer.firstName || ''} lines={1} className={classes.text} /></TableCell>
                    <TableCell className={classes.item} style={{ cursor: 'pointer' }} onClick={() => viewCustomerProfile(customer)}><TextClamp text={customer.lastName || ''} lines={1} className={classes.text} /></TableCell>
                    <TableCell className={classes.item} style={{ cursor: 'pointer' }} onClick={() => viewCustomerProfile(customer)}><TextClamp text={customer.email || ''} lines={1} className={classes.text} /></TableCell>
                    <TableCell className={classes.item} style={{ cursor: 'pointer' }} onClick={() => viewCustomerProfile(customer)}><TextClamp text={customer.userName || ''} lines={1} className={classes.text} /></TableCell>
                    <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer.customerStatus}</Typography></TableCell>
                    <TableCell className={classes.item}><Typography variant="subtitle2" component="span" className={classes.text}>{customer?.riskProfile}</Typography></TableCell>
                    <TableCell className={classes.item} style={{ justifySelf: 'stretch' }}>
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
                    </TableCell>
                </TableRow>
            ))} */}
        </>
    );
};

NoProfileCustomers.propTypes = {
    getCustomersWithoutProfile: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired
};

export default connect(undefined, { getCustomersWithoutProfile })(NoProfileCustomers);