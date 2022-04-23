import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LISTING_COLUMNS } from '../../../utils/constants';
import { getAllListings } from '../../../actions/adminListings'
import { getCustomers } from '../../../actions/customer'
import GenericTableBody from '../../../components/admin-dashboard/GenericTableBody'
import { getNewCustomers } from '../../../actions/customer';



const gridColumns = '.2fr 1fr 1fr .8fr .5fr .8fr .5fr 1fr .3fr';

const AllTransactions = ({ handleClick, }) => {
  const dispatch = useDispatch()

//   const pages = [10, 25, 100]

//   const { listings: { listings } } = useSelector(state => state)
const verifiedCustomers = useSelector(state => state.customers?.confirmed?.items);


//   const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
//   const [page, setPage] = useState(0);

//   console.log('ITEMS', items)
//   console.log('listings', listings)
  
  useEffect(() => {
    // dispatch(getAllListings())
    dispatch(getNewCustomers())
  }, [dispatch])


  useEffect(() => {
    dispatch(getCustomers({
        pageNumber: 1,
        pageSize: 15
    }))

    // console.log('listings', items)
  }, [dispatch])
    


  return (
    <>
        <GenericTableBody gridColumns={gridColumns} addColumn={true} data={verifiedCustomers} handleClick={handleClick} columnList={LISTING_COLUMNS} />
    </>
  )
}

export default AllTransactions


