import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { USER_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";

const RejectedCustomers = ({ handleClick, viewCustomerProfile, loading }) => {
    const rejectedCustomers = useSelector(
        (state) => state.customers.rejected.items
    );

    return (
        <>
            <GenericTableBody
                loading={loading}
                data={rejectedCustomers}
                columnList={USER_COLUMNS}
                handleClick={handleClick}
                viewCustomerProfile={viewCustomerProfile}
            />
        </>
    );
};

RejectedCustomers.propTypes = {
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default RejectedCustomers;
