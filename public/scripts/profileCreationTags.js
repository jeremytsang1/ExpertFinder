function profileCreationTagsMain() {
  const URL = "/suggestions";
  const CATEGORIES = [
    new ProfileCreationTagifyCategory("industry", "Industry"),
    new ProfileCreationTagifyCategory("tech-skills", "TechSkills"),
    new ProfileCreationTagifyCategory("coursework", "Coursework"),
  ];
  const CATEGORIES_KEY = "Categories";

  getSuggestionsFromServer();

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

    CATEGORIES.forEach(cat => {
      cat.createTagify(suggestions[cat.dbName])
    });
  }

  function handleFailedRequest(req) {
    console.log("Could not get suggestions!");
  }
}

profileCreationTagsMain();
