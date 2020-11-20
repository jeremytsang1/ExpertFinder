function profileCreationFormMain() {
  const REGISTER_BUTTON = document.querySelector("button.submit");
  const CANCEL_BUTTON = document.querySelector("button.cancel");

  CANCEL_BUTTON.addEventListener("click", () => window.location.href = "/");

}

profileCreationFormMain();
