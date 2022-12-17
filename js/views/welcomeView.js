"use strict";
import View from "./View.js";
class WelcomeView extends View {
  #welcomePopUp = document.querySelector(".welcome-pop-up");
  #btnCloseWelcomeScreen = document.querySelector(".welcome-close-btn");

  togglePopup() {
    this.#welcomePopUp.classList.toggle("hidden");
  }

  addHandlerCloseWelcomeScreen(handler) {
    this.#btnCloseWelcomeScreen.addEventListener("click", handler);
  }
}

export default new WelcomeView();
