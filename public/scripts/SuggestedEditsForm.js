var SuggestEditsButton = document.getElementsByClassName("suggest-edits-button")[0];
SuggestEditsButton.addEventListener("click", updateForm);

function updateForm(event)
{
    let tagify = new Tagify(document.querySelector("#edit"))
{
  {{this.TechSkills}}: document.querySelectorAll("input[value=Techskills]").value,
  {{this.Coursework}}: document.querySelectorAll("input[value=Coursework]").value,
  {{this.Industry}}: document.querySelectorAll("input[value=Industry]").value,
}
}

