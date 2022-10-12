class EmperorClass {
  constructor(id, name, imageUrl, description) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  get type() {
    return 'Emperor';
  }

  static EmperorFactory(tokenId, title, imageUrl, description) {
    let emperorInstance = new EmperorClass(
      tokenId,
      title,
      imageUrl,
      description
    );

    return emperorInstance;
  }
}

export default EmperorClass;
