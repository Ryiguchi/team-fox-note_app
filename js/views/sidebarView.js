"use strict";
import View from "./View.js";

class SidebarView extends View {
  #burger = document.querySelector(".ph-list");
  toolbar = document.querySelector("#toolbar");
  #btnCaretToolbarContainer = document.querySelector(
    ".caret-container-toolbar"
  );
  #caretsMobileToolbar = document.querySelectorAll(".caret-mobile-toolbar");
  #btnSettings = document.querySelector(".settings-icon-sidebar");
  sidebar = document.querySelector(".side-header");
  overlaySidebar = document.querySelector(".overlay-sidebar");
  mobileHeader = document.querySelector(".mobile-header"); // event delegation
  caretDownMobile = document.querySelector(".caret-down-mobile");
  caretUpMobile = document.querySelector(".caret-up-mobile");

  constructor() {
    super();
    this.#addHandlerBtnCaretToolbarContainer();
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("hidden");
    this.overlaySidebar.classList.toggle("hidden");
  }

  // HANDLERS

  addHandlerNotebookIcon(handler) {
    this.sidebar.addEventListener("click", (e) => {
      if (!e.target.classList.contains("ph-notebook")) return;

      if (screen.width <= 450) this.overlaySidebar.classList.remove("hidden");
      handler();
    });
  }

  addHandlerToggleSidebar(handler) {
    [this.#burger, this.overlaySidebar].forEach((el) => {
      el.addEventListener("click", () => {
        const open = this.sidebar.classList.contains("hidden") ? false : true;
        this.toggleSidebar();
        handler(open);
      });
    });
  }

  addHandlerToggleSettingsSection(handler) {
    this.#btnSettings.addEventListener("click", handler);
  }

  #addHandlerBtnCaretToolbarContainer() {
    this.#btnCaretToolbarContainer.addEventListener("click", () => {
      this.toolbar.classList.toggle("hidden");
      this.#caretsMobileToolbar.forEach((icon) =>
        icon.classList.toggle("hidden")
      );
    });
  }
}

export default new SidebarView();
