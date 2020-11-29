var SuggestEditsButton = document.getElementsByClassName("suggest-edits-button")[0];
SuggestEditsButton.addEventListener("click", updateForm);

function updateForm(event)
{
  {{this.TechSkills}}: row.querySelector("input[name=Techskills]").value,
  {{this.Coursework}}: row.querySelector("input[name=Coursework]").value,
  {{this.Industry}}: row.querySelector("input[name=Industry]").value,
  
}
  
let tagify = new Tagify(document.querySelector("#foobar"))
