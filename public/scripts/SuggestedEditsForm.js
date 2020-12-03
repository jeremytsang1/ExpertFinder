var SuggestEditsButton = document.getElementsByClassName("suggest-edits-button")[0];
// SuggestEditsButton.addEventListener("click", updateForm);

function updateForm(event) {
    let tagify = new Tagify(document.querySelector("#edit"));
    // {
    //     {{this.TechSkills}}: document.querySelectorAll("input[value=Techskills]").value,
    //     {{this.Coursework}}: document.querySelectorAll("input[value=Coursework]").value,
    //     {{this.Industry}}: document.querySelectorAll("input[value=Industry]").value,
    // }
}

function createTagifyObjectForSuggestedEditsForm(input, suggestionAry) {
    // Taken from Official tagify repo:
    // https://github.com/yairEO/tagify/blob/bd4cb069b1cacb6b8bdd34457de5f86752015a9c/index.html#L1456
    const tagify = new Tagify(input, {
        whitelist: suggestionAry.sort(),
        dropdown: {
            maxItems: 20,           // <- mixumum allowed rendered suggestions
            classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
            enabled: 0,             // <- show suggestions on focus
            closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
        }
    });
    setReadOnly(input, true);
    setupButtons(input);
    return tagify;
}

function setupButtons(input) {
    const editsButton = input.parentElement.querySelector("button");
    const expertId = input.getAttribute('data-id');
    const modalFooterButtonsDiv = getModalSubmitButton(input);
    const dismissButton = modalFooterButtonsDiv.querySelector('button[data-dismiss]');

    editsButton.addEventListener('click', event => {
        configureEditsButton(input, editsButton);
        // modalCollapseButton.removeAttribute('data-dismiss');
        // modalCollapseButton.setAttribute('type', 'submit');

        const submitButton = getSubmitButton(modalFooterButtonsDiv);
        configureModalFooterButtons(submitButton, dismissButton)
    });

    dismissButton.addEventListener('click', event => {
        // resetModal(expertId);
    });
}

function getSubmitButton(divToAttachTo) {
    const firstChild = divToAttachTo.firstElementChild;
    let submitButton = null;
    if (firstChild.getAttribute('type') == 'submit') {
        submitButton = firstChild;
    } else { // create the submit button
        submitButton = document.createElement('button');
        divToAttachTo.prepend(submitButton);
    }
    return submitButton;
}

function configureModalFooterButtons(submitButton, dismissButton) {
    submitButton.className = "btn btn-primary";
    submitButton.setAttribute("type", "submit");
    submitButton.textContent = "Submit Suggestions"

    toggleDismissButton(dismissButton, true);
}

function toggleDismissButton(dismissButton, appearAsDismiss) {
    if (appearAsDismiss) {
        dismissButton.classList.remove('btn-primary');
        dismissButton.classList.add('btn-secondary');
        dismissButton.textContent = "Discard Suggestions";
    } else {
        dismissButton.classList.remove('btn-secondary');
        dismissButton.classList.add('btn-primary');
        dismissButton.textContent = "OK, got it!";
    }
}


function configureEditsButton(input, editsButton) {
    const readOnly = setReadOnly(input);
    if (readOnly) editsButton.textContent = "Edit";
    else editsButton.textContent = "Finish";
}

function getModalSubmitButton(input) {
    const expertId = input.getAttribute('data-id');
    const modal = document.querySelector(`#exampleModalCenter${expertId}`);
    return modal.querySelector('.modal-footer div.col');
}


function setReadOnly(input, toBeReadOnly) {
    const tags = input.parentElement.querySelector("tags");

    // simple toggling
    if (typeof(toBeReadOnly) !== 'boolean') {
        tags.toggleAttribute('readonly');
        return tags.hasAttribute('readonly');
    }

    // setting
    if (toBeReadOnly) {
        tags.setAttribute('readonly', 'readonly');
        return true;
    } else {
        tags.removeAttribute('readonly');
        return false;
    }
}

function prepareInputs() {
    // Assumes tagifyClientRequest.js is executed before this file to get tag
    // completions.
    makeTagifyUsingBackendData(createTagifyObjectForSuggestedEditsForm);
}

prepareInputs();
