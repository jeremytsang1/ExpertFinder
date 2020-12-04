function profileCreationFormMain() {
  const CANCEL_BUTTON = document.querySelector("button.cancel");

  CANCEL_BUTTON.addEventListener("click", (event) => {
    window.location.href = "/";
    event.preventDefault();
  });

  // ASSUMPTION: tagifyClientRequest.js was run in a <script> tag before this file
  makeTagifyUsingBackendData(makeTagifyForCreateProfile); // from tagifyClientRequest.js

  // ----------------------------------------------------------------------------
  /**
   * ASSUMPTION: tagify.min.js was run in a <script> before this file and
   * tagify.css is linked in the handlebars template (possibly passed through
   * context).
   * @param {object} inputTag - <input> element to Tagify.
   * @param {[string]} suggestionAry - Array of possible tag completions.
   * @return {object} new Tagify object.
   */
  function makeTagifyForCreateProfile(inputTag, suggestionAry) {
    // Taken from Official tagify repo:
    // https://github.com/yairEO/tagify/blob/bd4cb069b1cacb6b8bdd34457de5f86752015a9c/index.html#L1456
    return new Tagify(inputTag, {
      whitelist: suggestionAry.sort(),
      dropdown: {
        maxItems: 20,           // <- mixumum allowed rendered suggestions
        classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
        enabled: 0,             // <- show suggestions on focus
        closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
      }
    });
  }
}

profileCreationFormMain();
