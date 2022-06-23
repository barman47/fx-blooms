import { useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";
import { LISTING_COLUMNS } from "../../../utils/constants";

const gridColumns = ".3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr";

const CompletedListings = ({ loadingListings, viewRow }) => {
    const listings = useSelector(
        (state) => state.listings?.finalisedListings?.items
    );

    const completedListingsMemo = useMemo(
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

    return completedListingsMemo;
};

CompletedListings.propTypes = {
    viewRow: PropTypes.func.isRequired,
    loadingListings: PropTypes.bool.isRequired,
};

export default CompletedListings;
