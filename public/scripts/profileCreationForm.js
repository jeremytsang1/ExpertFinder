function profileCreationFormMain() {
  const CANCEL_BUTTON = document.querySelector("button.cancel");

  CANCEL_BUTTON.addEventListener("click", (event) => {
    window.location.href = "/";
    event.preventDefault();
  });
}

profileCreationFormMain();
