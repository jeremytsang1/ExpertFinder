function makeTagifyUsingBackendData(fcnThatCreatesATagifyObject) {
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
    inputTags.forEach(inputTag => fcnThatCreatesATagifyObject(inputTag, suggestions[inputTag.name]));
  }

  function handleFailedRequest(req) {
    console.log("Could not get suggestions!");
    // Print contents of the server's error handler
    // for example res.status(500).contentType("text/plain").end(messageToSendToClient);
    // messageToSentToClient would req.response
    console.log(`req.response: ${req.response}`);
  }
}
