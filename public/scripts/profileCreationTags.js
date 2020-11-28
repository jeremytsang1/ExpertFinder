function profileCreationTagsMain(createTagify) {
  const URL = "/suggestions";
  const CATEGORIES_KEY = "Categories";

  // ASSUMPTION: <input> `name` attributes must be identical to the FIELDS in
  // getSuggestions() from database/db_interface.js
  const inputTags = document.querySelectorAll(".tagify-fields input");

  getSuggestionsFromServerAndCreateTagifyElements();

  // ----------------------------------------------------------------------------
  // Make a GET request to get the auto-complete suggestions for each field.

  function getSuggestionsFromServerAndCreateTagifyElements() {
    const req = new XMLHttpRequest();

    req.open("GET", URL, true);

    registerSuggestionsCallback(req);

    req.send(null);
  }

  function registerSuggestionsCallback(req) {
    req.addEventListener("load", () => {
      if (req.status >= 200 && req.status < 400) handleSuccessfulRequest(req);
      else handleFailedRequest(req);
    });
  }

  function handleSuccessfulRequest(req) {
    const res = JSON.parse(req.responseText);
    const suggestions = res[CATEGORIES_KEY];
    inputTags.forEach(inputTag => createTagify(inputTag, suggestions[inputTag.name]));
  }

  function handleFailedRequest(req) {
    console.log("Could not get suggestions!");
    // Print contents of the server's error handler
    // for example res.status(500).contentType("text/plain").end(messageToSendToClient);
    // messageToSentToClient would req.response
    console.log(`req.response: ${req.response}`);
  }
}

function createTagifyForCreateProfile(inputTag, suggestionAry) {
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
profileCreationTagsMain(createTagifyForCreateProfile);
