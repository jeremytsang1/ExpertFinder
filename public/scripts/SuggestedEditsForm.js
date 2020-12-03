var SuggestEditsButton = document.getElementsByClassName("suggest-edits-button")[0];
SuggestEditsButton.addEventListener("click", updateForm);

function updateForm(event) {
    let tagify = new Tagify(document.querySelector("#edit"));
    // {
    //     {{this.TechSkills}}: document.querySelectorAll("input[value=Techskills]").value,
    //     {{this.Coursework}}: document.querySelectorAll("input[value=Coursework]").value,
    //     {{this.Industry}}: document.querySelectorAll("input[value=Industry]").value,
    // }
}

function createTagifyObjectForSuggestedEditsForm(inputTag, suggestionAry) {
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

function setReadOnly(input, toBeReadOnly) {
    tags = input.parentElement.querySelector("tags");

    // simple toggling
    if (typeof(toBeReadOnly) !== 'boolean') {
        tags.toggleAttributes('readonly');
        return;
    }

    // setting
    if (toBeReadOnly) {
        tags.setAttribute('readonly', 'readonly');
    } else {
        tags.removeAttribute('readonly');
    }
}

function prepareInputs() {
    // Assumes tagifyClientRequest.js is executed before this file to get tag
    // completions.
    makeTagifyUsingBackendData(createTagifyObjectForSuggestedEditsForm);

    inputs = Array.from(document.querySelectorAll('tagify-fields input'));
    inputs.forEach(input => setReadOnly(input, true));
}


prepareInputs();
