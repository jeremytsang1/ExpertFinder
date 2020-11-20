const INPUT_ID_PREFIX = "profile-creation-";
const INDUSTRY = "Industry";
const SKILLS = "TechSkills";
const COURSEWORK = "Coursework";
const CATEGORIES = [INDUSTRY, SKILLS, COURSEWORK];

let inputs = new Map();
let tagifies = new Map();

CATEGORIES.forEach(cat => {
  input = document.querySelector(`#${INPUT_ID_PREFIX}${cat.toLowerCase()}`);
  inputs.set(cat, input);
  tagifies.set(cat, new Tagify(input));
});
