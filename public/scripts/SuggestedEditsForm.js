var SuggestEditsButton = document.getElementsByClassName("suggest-edits-button")[0];
SuggestEditsButton.addEventListener("click", updateForm);

function updateForm(event)
{
  /* This wouldn't work cause the value isn't an input?
  {{this.TechSkills}}: row.querySelector("input[name=Techskills]").value,
  {{this.Coursework}}: row.querySelector("input[name=Coursework]").value,
  {{Industry.Industry}}: row.querySelector("input[name=Industry]").value,
  /*
}
