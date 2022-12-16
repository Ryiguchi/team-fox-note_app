"use strict";
import noteView from "./noteView.js";
import View from "./View.js";

export class ToolbarView extends View {
  toolbar = document.querySelector("#toolbar");
  tagListToolbar = document.querySelector(".tag-list-toolbar");
  btnBookMarkActiveToolbar = document.querySelector(".ph-star-fill-toolbar");
  btnBookMarkNotActiveToolbar = document.querySelector(".ph-star-toolbar");
  _bookmarkToolbar = document.querySelector(".bookmark-toolbar");
  btnTagToolbar = document.querySelector(".tag-icon-toolbar");
  tagMenuToolbar = document.querySelector(".tag-selection-container-title");
  _customTagInputEl = document.querySelector(".custom-tag-list-item");
  _customTagEl = document.querySelector(".tag-custom");
  customTagBtn = document.querySelector(".custom-tag-btn");
  customTagInput = document.querySelector(".input-custom-tag");

  // API Functions
  updateTagListToolbar(note) {
    this.renderTagList(noteView.tagListTitle, note.tags);
  }

  toggleStarHeaderToolbar(action = "toggle") {
    if (action === "add") {
      this.btnBookMarkNotActiveToolbar.classList.add("hidden");
      this.btnBookMarkActiveToolbar.classList.remove("hidden");
    }
    if (action === "remove") {
      this.btnBookMarkNotActiveToolbar.classList.remove("hidden");
      this.btnBookMarkActiveToolbar.classList.add("hidden");
    }
    if (action === "toggle") {
      this.btnBookMarkNotActiveToolbar.classList.toggle("hidden");
      this.btnBookMarkActiveToolbar.classList.toggle("hidden");
    }
  }

  toggleCustomTagListItems() {
    this._customTagInputEl.classList.toggle("hidden");
    this._customTagEl.classList.toggle("hidden");
  }

  updateCurrentNoteBookmark(note) {
    if (note.bookmarked) this.toggleStarHeaderToolbar("add");
    if (!note.bookmarked) this.toggleStarHeaderToolbar("remove");
  }

  toggleTagMenuNoteTitle() {
    this.tagMenuToolbar.classList.toggle("hidden");
    this.toggleOverlay();
  }

  // HANDLERS

  addHandlerBookmarkToolbar(handler) {
    this._bookmarkToolbar.addEventListener("click", handler);
  }

  addHandlerBtnTagToolbar(handler) {
    this.btnTagToolbar.addEventListener("click", handler);
  }

  // addHandlerCustomTagBtn(handler) {
  //   this.customTagBtn.addEventListener("click", handler);
  // }
}

export default new ToolbarView();
