import { useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";
import { LISTING_COLUMNS } from "../../../utils/constants";

// const gridColumns = ".3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr";

const RemovedListings = ({ viewRow, loadingListings, navigateToProfile }) => {
    const removedListings = useSelector(
        (state) => state.listings.deletedListings.items
    );

    const removedListingsMemo = useMemo(
        () => (
            <>
                <GenericTableBody
                    viewCustomerProfile={viewRow}
                    loading={loadingListings}
                    profileNavigate={navigateToProfile}
                    // gridColumns={gridColumns}
                    addColumn={true}
                    data={removedListings}
                    viewMore={true}
                    columnList={LISTING_COLUMNS}
                />
            </>
        ),
        [viewRow, removedListings, loadingListings, navigateToProfile]
    );

    return removedListingsMemo;
};

RemovedListings.propTypes = {
    viewRow: PropTypes.func.isRequired,
    loadingListings: PropTypes.bool.isRequired,
};

export default RemovedListings;
