import { useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { USER_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";

const AllCustomers = ({ handleClick, viewCustomerProfile, loading }) => {
    const customers = useSelector((state) => state.customers?.customers?.items);

    return useMemo(
        () => (
            <>
                <GenericTableBody
                    loading={loading}
                    data={customers}
                    columnList={USER_COLUMNS}
                    handleClick={handleClick}
                    viewCustomerProfile={viewCustomerProfile}
                />
            </>
        ),
        [loading, viewCustomerProfile, handleClick, customers]
    );
};

AllCustomers.propTypes = {
    loading: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired,
};

export default AllCustomers;
