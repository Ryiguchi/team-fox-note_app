"use strict";

class SidebarView {
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
    this.#addHandlerBtnCaretToolbarContainer();
  }

  toggleWelcomeSidebarView() {
    this.toolbar.classList.toggle("hidden");
    if (screen.width <= 450) this.sidebar.classList.add("hidden");
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("hidden");
    this.overlaySidebar.classList.toggle("hidden");
  }

  renderTagList(parEl, tags) {
    parEl.innerHTML = "";
    let markup = "";
    tags?.forEach((tag) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      markup += `
       
        <li class="tag-selection tag-selection-${newTag} tag-selection-filter" data-tag="${newTag}"
        >
          ${tag}       
        </li>
      `;
    });

    parEl.insertAdjacentHTML("beforeend", markup);
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
