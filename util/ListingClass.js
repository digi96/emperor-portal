class ListingClass {
  constructor(id, tokenType, tokenId, seller, price, emperor) {
    this.id = id;
    this.tokenType = tokenType;
    this.tokenId = tokenId;
    this.seller = seller;
    this.price = price;
    this.emperor = emperor;
  }

  get type() {
    return 'Listing';
  }

  static ListingFactory(
    listingId,
    tokenType,
    tokenId,
    sellerAddress,
    price,
    emperor
  ) {
    var tokenTypeDesc = '';
    if (tokenType == 0) {
      tokenTypeDesc = 'ERC721';
    } else {
      tokenTypeDesc = 'ERC1155';
    }

    let listingInstance = new ListingClass(
      listingId,
      tokenTypeDesc,
      tokenId,
      sellerAddress,
      price,
      emperor
    );

    return listingInstance;
  }
}

export default ListingClass;
