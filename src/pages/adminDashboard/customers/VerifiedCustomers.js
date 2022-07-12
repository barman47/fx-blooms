import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { USER_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";

const VerifiedCustomers = ({
    getNewCustomers,
    handleClick,
    viewCustomerProfile,
    loading,
}) => {
    const verifiedCustomers = useSelector(
        (state) => state.customers?.confirmed?.items
    );
    return (
        <>
            <GenericTableBody
                loading={loading}
                data={verifiedCustomers}
                columnList={USER_COLUMNS}
                handleClick={handleClick}
                viewCustomerProfile={viewCustomerProfile}
            />
        </>
    );
};

VerifiedCustomers.propTypes = {
    loading: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired,
};

export default VerifiedCustomers;
