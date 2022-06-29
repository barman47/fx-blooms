import { useMemo } from "react";
import { useSelector } from "react-redux";
import { LISTING_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";
import PropTypes from "prop-types";

const gridColumns = ".3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr";

const ActiveListings = ({ viewRow, loadingListings }) => {
    const listings = useSelector(
        (state) => state.listings?.activeListings?.items
    );

    const openListingsMemo = useMemo(
        () => (
            <>
                <GenericTableBody
                    viewCustomerProfile={viewRow}
                    loading={loadingListings}
                    gridColumns={gridColumns}
                    addColumn={true}
                    data={listings}
                    viewMore={true}
                    columnList={LISTING_COLUMNS}
                />
            </>
        ),
        [viewRow, loadingListings, listings]
    );

    return openListingsMemo;
};

ActiveListings.propTypes = {
    viewRow: PropTypes.func.isRequired,
    loadingListings: PropTypes.bool.isRequired,
};

export default ActiveListings;
