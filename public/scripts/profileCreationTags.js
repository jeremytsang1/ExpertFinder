function profileCreationTagsMain() {
  const INPUT_ID_PREFIX = "profile-creation-";
  const INDUSTRY = "Industry";
  const SKILLS = "TechSkills";
  const COURSEWORK = "Coursework";
  const CATEGORIES = [INDUSTRY, SKILLS, COURSEWORK];
  const URL = "/suggestions";
  const CATEGORIES_KEY = "Categories";
  const INPUTS = gatherInputs();

  getSuggestionsFromServer();

  // --------------------------------------------------------------------------
  // Helper functions (keep nested to keep namespace clean)

  function gatherInputs() {
    const inputs = new Map();

    CATEGORIES.forEach(cat => {
      input = document.querySelector(`#${INPUT_ID_PREFIX}${cat.toLowerCase()}`);
      inputs.set(cat, input);
    });
    return inputs;
  }

  function getSuggestionsFromServer() {
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
    const tagifies = new Map();

    CATEGORIES.forEach(cat => {  // Fill the map.
      tagify = createTagify(cat, suggestions);
      tagifies.set(cat, tagify);
    });
  }

  function handleFailedRequest(req) {
    console.log("Could not get suggestions!");
  }

  function createTagify(cat, suggestions) {
    // Taken from Official tagify repo:
    // https://github.com/yairEO/tagify/blob/bd4cb069b1cacb6b8bdd34457de5f86752015a9c/index.html#L1456
    return new Tagify(INPUTS.get(cat), {
      whitelist: suggestions[cat].sort(),
      dropdown: {
        maxItems: 20,           // <- mixumum allowed rendered suggestions
        classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
        enabled: 0,             // <- show suggestions on focus
        closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
      }
    });
  }
}

profileCreationTagsMain();
