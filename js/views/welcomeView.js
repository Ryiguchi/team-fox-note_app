"use strict";
import View from "./View.js";
class WelcomeView extends View {
  #welcomePopUp = document.querySelector(".welcome-pop-up");
  #btnCloseWelcomeScreen = document.querySelector(".welcome-close-btn");

  addHandlerCloseWelcomeScreen(handler) {
    this.#btnCloseWelcomeScreen.addEventListener("click", () => {
      this.#welcomePopUp.classList.add("hidden");
      handler();
    });
  }
}

export default new WelcomeView();
