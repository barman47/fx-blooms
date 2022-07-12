import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { USER_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";

const PendingCustomers = ({ handleClick, viewCustomerProfile, loading }) => {
    const pendingCustomers = useSelector(
        (state) => state.customers?.pending?.items
    );

    return (
        <>
            <GenericTableBody
                loading={loading}
                data={pendingCustomers}
                columnList={USER_COLUMNS}
                handleClick={handleClick}
                viewCustomerProfile={viewCustomerProfile}
            />
        </>
    );
};

PendingCustomers.propTypes = {
    loading: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired,
};

export default PendingCustomers;
