import { useEffect, useState } from 'react';
import { getOpenListings } from '../util/interact';

const ListingsTemp = ({ listings }) => {
  const [saleListings, setSaleListings] = useState();

  useEffect(() => {
    setSaleListings(listings);
  }, [listings]);

  return (
    <div className="container">
      <div className="card-columns">
        {saleListings && saleListings.length > 0 ? (
          saleListings.map((saleListing, i) => (
            <div className="card" key={i}>
              <img
                src={saleListing.emperor.imageUrl}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{saleListing.emperor.name}</h5>
                <p className="card-text">Listing Id: {saleListing.id}</p>
                <p className="card-text">Token Id: {saleListing.tokenId}</p>
                <p className="card-text">Price: {saleListing.price}</p>
                <p className="card-text">Listing Type: N/A</p>
                <p className="card-text text-truncate">
                  {saleListing.emperor.description}
                </p>
                <a href="#" className="card-link">
                  More
                </a>
              </div>
            </div>
          ))
        ) : (
          <div>No Listings Available</div>
        )}
      </div>
    </div>
  );
};

export default ListingsTemp;

export async function getServerSideProps() {
  const openListings = await getOpenListings();
  //const data = await response.json();
  return {
    props: {
      listings: openListings,
    },
  };
}
