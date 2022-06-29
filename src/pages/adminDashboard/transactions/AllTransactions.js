import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TRANSACTION_COLUMNS } from '../../../utils/constants';
import TransactionTable from '../../../components/admin-dashboard/TransactionTable'
import PropTypes from 'prop-types';


const gridColumns = '1fr 1fr 1fr 1fr 1fr .8fr 1fr .6fr';

const AllTransaction = ({ loadingTransactions, viewRow }) => {

  const { transactions: { items } } = useSelector(state => state.transactions)

  return useMemo(() => (
    <>
        <TransactionTable 
        viewCustomerProfile={viewRow} 
        loading={loadingTransactions} 
        gridColumns={gridColumns} 
        data={items} 
        viewMore={true} 
        columnList={TRANSACTION_COLUMNS} 
        />
    </>), [loadingTransactions, viewRow, items]
  )
}

AllTransaction.propTypes = {
  viewRow: PropTypes.func.isRequired,
  loadingTransactions: PropTypes.bool.isRequired,
};

export default AllTransaction;


