class TagifyBackend {
  static getTagsAsArray(tagifyInputValues) {
    let formAry = (tagifyInputValues !== "") ? JSON.parse(tagifyInputValues) : null;
    return (Array.isArray(formAry)) ? formAry.map(elt => elt['value']) : [];
  }
}

module.exports = {
  TagifyBackend
};
