import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { WITHDRAWALS } from "../../routes";

const PaymentRoute = ({ children }) => {
  const location = useLocation();
  const { authorizeRequest } = useSelector((state) => state.wallets);
  return !!authorizeRequest ? (
    children
  ) : (
    <Navigate to={WITHDRAWALS} state={{ from: location }} replace />
  );
};

export default PaymentRoute;
