import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { USER_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";

const NoProfileCustomers = ({ handleClick, viewCustomerProfile, loading }) => {
    const noProfileCustomers = useSelector(
        (state) => state.customers?.noProfile?.items
    );

    return (
        <>
            <GenericTableBody
                loading={loading}
                data={noProfileCustomers}
                columnList={USER_COLUMNS}
                handleClick={handleClick}
                viewCustomerProfile={viewCustomerProfile}
            />
        </>
    );
};

NoProfileCustomers.propTypes = {
    loading: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    viewCustomerProfile: PropTypes.func.isRequired,
};

export default NoProfileCustomers;
