"use strict";
class TitleView {
  #titleContainer = document.querySelector(".title-container");
  #bookmarkFillIcon = document.querySelector(".ph-star-fill-toolbar");
  #bookmarkEmptyIcon = document.querySelector(".ph-star-toolbar");
  #tagMenuContainer = document.querySelector(".tag-selection-container-title");
  #tagMenu = document.querySelector(".tag-list-title-all");
  inputTitle = document.querySelector(".input-title");
  #overlay = document.querySelector(".overlay");

  constructor() {
    this.#addHandlerToggleTagMenu();
    this.#addHandlerInputTitleFocus();
    this.#addHandlerOverlay();
  }

  // METHODS

  renderTagMenu(tags) {
    this.#tagMenu.innerHTML = "";
    let markup = "";
    tags?.forEach((tag, i) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      markup += `
        <li class="tag-selection tag-selection-${newTag} tag-selection-title-list" data-tag="${newTag}">
          <i class="ph-tag-fill tag-icon-tag-menu tag-icon-tag-menu-fill 
          tag-icon-tag-menu-${newTag} icon hidden"></i>
          <i class="ph-tag tag-icon-tag-menu tag-icon-tag-menu-line 
          tag-icon-tag-menu-${newTag} icon "></i>              
          ${tag}         
        </li>
      `;
    });
    this.#tagMenu.insertAdjacentHTML("beforeend", markup);
  }

  renderNoteTags(tags) {
    const tagMenuTitleContainer = document.querySelector(
      ".tag-menu-title-container"
    );
    this.removeAllSiblingsAfter(tagMenuTitleContainer);
    let markup = "";
    tags?.forEach((tag, i) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      markup += `           
        <div class="tag-selection-title-container">
          <div class="triangle-left"></div>
          <li class="tag-selection tag-selection-${newTag} tag-selection-title" data-tag="${newTag}">
            ${tag}
            <i class="ph-x remove-tag-icon icon" data-tag="${tag}"></i><i class="ph-circle-fill tag-hole"></i>
          </li>
        </div>
      `;
    });
    tagMenuTitleContainer.insertAdjacentHTML("afterend", markup);
  }

  toggleStar(action = "toggle") {
    if (action === "add") {
      this.#bookmarkEmptyIcon.classList.add("hidden");
      this.#bookmarkFillIcon.classList.remove("hidden");
    }
    if (action === "remove") {
      this.#bookmarkEmptyIcon.classList.remove("hidden");
      this.#bookmarkFillIcon.classList.add("hidden");
    }
    if (action === "toggle") {
      this.#bookmarkEmptyIcon.classList.toggle("hidden");
      this.#bookmarkFillIcon.classList.toggle("hidden");
    }
  }

  #toggleTagMenu() {
    this.#tagMenuContainer.classList.toggle("hidden");
    this.#toggleOverlay();
  }

  updateCurrentNoteBookmark(note) {
    note.bookmarked ? this.toggleStar("add") : this.toggleStar("remove");
  }

  #toggleOverlay() {
    this.#overlay.classList.toggle("hidden");
  }

  // HANDLERS

  #addHandlerOverlay() {
    this.#overlay.addEventListener("click", () => {
      this.#tagMenuContainer.classList.add("hidden");
      this.#overlay.classList.add("hidden");
    });
  }

  addHandlerToggleBookmark(handler) {
    this.#titleContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("bookmark-icon-title")) {
        this.toggleStar();
        handler();
      }
    });
  }

  #addHandlerToggleTagMenu() {
    this.#titleContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("tag-icon-toolbar")) {
        this.#toggleTagMenu();
      }
    });
  }

  addHandlerTagMenuCustom(handler) {
    this.#titleContainer.addEventListener("click", (e) => {
      const tag = e.target.closest(".tag-selection-title-list")?.dataset.tag;
      if (!tag || tag !== "custom") return;
      this.#toggleOverlay();
      this.#toggleTagMenu();
      handler();
    });
  }

  addHandlerTagMenuItems(handler) {
    this.#titleContainer.addEventListener("click", (e) => {
      const tag = e.target.closest(".tag-selection-title-list")?.dataset.tag;
      if (!tag || tag === "custom") return;

      this.#toggleTagMenu();
      handler(tag);
    });
  }

  addHandlerRemoveTag(handler) {
    this.#titleContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-tag-icon")) {
        const tag = e.target.closest(".tag-selection").dataset.tag;
        handler(tag);
      }
    });
  }

  #addHandlerInputTitleFocus() {
    this.inputTitle.addEventListener("focus", () => {
      this.inputTitle.select();
    });
  }
}

export default new TitleView();
