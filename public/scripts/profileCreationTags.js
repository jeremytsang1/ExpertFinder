function profileCreationTagsMain() {
  const INPUT_ID_PREFIX = "profile-creation-";
  const INDUSTRY = "Industry";
  const SKILLS = "TechSkills";
  const COURSEWORK = "Coursework";
  const CATEGORIES = [INDUSTRY, SKILLS, COURSEWORK];

  let inputs = gatherInputs();
  let tagifies = initializeTagifies(inputs);

  // --------------------------------------------------------------------------
  // Helper functions (keep nested as not to pollute namespace).

  function gatherInputs() {
    let inputs = new Map();

    CATEGORIES.forEach(cat => {
      input = document.querySelector(`#${INPUT_ID_PREFIX}${cat.toLowerCase()}`);
      inputs.set(cat, input);
    });
    return inputs;
  }

  function initializeTagifies(inputs) {
    let tagifies = new Map();

    inputs.forEach((val, key, map) => {
      tagifies.set(key, new Tagify(val));
    });
    return tagifies;
  }
}

profileCreationTagsMain();
