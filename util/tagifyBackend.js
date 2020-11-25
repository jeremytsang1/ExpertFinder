class TagifyBackend {
  static getTagsAsArray(tagifyInputValues) {
    let formAry = (tagifyInputValues !== "") ? JSON.parse(tagifyInputValues) : null;
    if (Array.isArray(formAry)) return formAry.map(elt => elt['value']);
    else {
      console.log("WARNING: In TagifyBackend.getTags(), `tagifyInputValues` was ",
                  "not an array after parsing.");
      return [];
    }
  }
}

module.exports = {
  TagifyBackend
};
