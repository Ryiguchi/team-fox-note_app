"use strict";
import View from "./View.js";
import noteView from "./noteView.js";
import toolbarView from "./toolbarView.js";
import previewView from "./previewView.js";

export class WelcomeView extends View {
  _welcomePopUp = document.querySelector(".welcome-pop-up");
  _btnCloseWelcomeScreen = document.querySelector(".welcome-close-btn");
  toggleWelcome() {
    this._welcomePopUp.classList.toggle("hidden");
    noteView.noteSection.classList.toggle("hidden");
    toolbarView.toolbar.classList.toggle("hidden");
    previewView.previewSectionAll.classList.toggle("hidden");
    noteView.stickyBox.classList.toggle("hidden");
  }

  addHandlerCloseWelcomeScreen(handler) {
    this._btnCloseWelcomeScreen.addEventListener("click", () => {
      this.toggleWelcome();
      handler();
    });
  }
}

export default new WelcomeView();
