"use strict";
import View from "./View.js";

export class ToolbarView extends View {
  toolbar = document.querySelector("#toolbar");
  tagListToolbar = document.querySelector(".tag-list-toolbar");
  _btnBookMarkActiveToolbar = document.querySelector(".ph-star.icon-toolbar");
  _btnBookMarkNotActiveToolbar = document.querySelector(
    ".ph-star-fill.icon-toolbar"
  );
  _bookmarkToolbar = document.querySelector(".bookmark-toolbar");
  btnTagToolbar = document.querySelector(".tag-icon-toolbar");
  tagMenuToolbar = document.querySelector(".tag-selection-container-toolbar");
  _customTagInputEl = document.querySelector(".custom-tag-list-item");
  _customTagEl = document.querySelector(".tag-custom");
  customTagBtn = document.querySelector(".custom-tag-btn");
  customTagInput = document.querySelector(".input-custom-tag");
  // _userFontInput = document.querySelector(".custom-font-input");
  // _userFontContainer = document.querySelector(".custom-font-container");
  // _userFontBtn = document.querySelector(".custom-font-btn");
  // _userFontOkBtn = document.querySelector(".custom-font-ok-btn");

  /**
   *  This function hides all of the filled tag icons and shows all of the unfilled tag icons     in the toolbar list
   */
  resetTagList() {
    document
      .querySelectorAll(".tag-icon-tag-menu-fill")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(".tag-icon-tag-menu-line")
      .forEach((el) => el.classList.remove("hidden"));
  }

  /**
   * This function takes the currently diplayed note's list of tags and displays them in the tag list in the toolbar.  It will first reset all of the tags.
   * @param {Object} note Object for the currently displayed note
   */
  updateTagListToolbar(note) {
    this.resetTagList();
    note.tags.forEach((tag) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      document
        .querySelectorAll(`.tag-icon-tag-menu-${newTag}`)
        .forEach((icon) => icon.classList.toggle("hidden"));
    });
  }

  toggleStarHeaderToolbar() {
    this._btnBookMarkNotActiveToolbar.classList.toggle("hidden");
    this._btnBookMarkActiveToolbar.classList.toggle("hidden");
  }

  addStarHeaderToolbar() {
    this._btnBookMarkNotActiveToolbar.classList.remove("hidden");
    this._btnBookMarkActiveToolbar.classList.add("hidden");
  }

  removeStarHeaderToolbar() {
    this._btnBookMarkNotActiveToolbar.classList.add("hidden");
    this._btnBookMarkActiveToolbar.classList.remove("hidden");
  }

  toggleCustomTagListItems() {
    this._customTagInputEl.classList.toggle("hidden");
    this._customTagEl.classList.toggle("hidden");
  }

  // toggleCustomFont() {
  //   this._userFontContainer.classList.toggle("hidden");
  //   this._userFontInput.value = "";
  // }

  // HANDLERS

  addHandlerBookmarkToolbar(handler) {
    this._bookmarkToolbar.addEventListener("click", handler);
  }

  addHandlerBtnTagToolbar(handler) {
    this.btnTagToolbar.addEventListener("click", handler);
  }

  addHandlerTagMenuToolbar(handler) {
    this.tagMenuToolbar.addEventListener("click", handler);
  }

  addHandlerCustomTagBtn(handler) {
    this.customTagBtn.addEventListener("click", handler);
  }

  // addHandlerCustomFontBtn() {
  //   this._userFontBtn.addEventListener("click", () => {
  //     this._userFontContainer.classList.toggle("hidden");
  //   });
  // }

  // addHandlerCustomFontInput(handler) {
  //   this._userFontInput.addEventListener("keydown", handler);
  // }
}

export default new ToolbarView();
