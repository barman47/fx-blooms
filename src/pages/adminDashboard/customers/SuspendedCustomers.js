import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { USER_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";

const SuspendedCustomers = ({ handleClick, viewCustomerProfile, loading }) => {
    const suspendedCustomers = useSelector(
        (state) => state.customers?.suspended?.items
    );

    return (
        <>
            <GenericTableBody
                loading={loading}
                data={suspendedCustomers}
                columnList={USER_COLUMNS}
                handleClick={handleClick}
                viewCustomerProfile={viewCustomerProfile}
            />
        </>
    );
};

SuspendedCustomers.propTypes = {
    loading: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired,
};

export default SuspendedCustomers;
