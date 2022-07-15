import { CUSTOMERS } from "../routes";

const navigateToProfile = (navigate, customerId) => {
    navigate(`${CUSTOMERS}/${customerId}`, { replace: true });
};

export default navigateToProfile;
