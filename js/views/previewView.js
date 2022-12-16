"use strict";
import View from "./View.js";
import settingsView from "./settingsView.js";
import sidebarView from "./sidebarView.js";
import noteView from "./noteView.js";

export class PreviewView extends View {
  previewSectionAll = document.querySelector(".preview-section");
  previewSection = document.querySelector(".notes-preview-section");
  filterMenuMain = document.querySelector(".filter-menu");
  filterCaretsIcons = document.querySelectorAll(".filter-carets");
  overlayFilter = document.querySelector(".overlay-filter");
  overlayFilterTags = document.querySelector(".overlay-filter-tags");
  overlayFilterKeyword = document.querySelector(".overlay-filter-keyword");
  previewSectionHeader = document.querySelector(".preview-section-header");
  searchNotesInput = document.querySelector(".searchNotesInput");
  tagMenuSidebar = document.querySelector(".tag-selection-container-sidebar");
  selectFilter = document.querySelector(".filter-select");

  togglePreviewSection(state) {
    if (
      this.previewSectionAll.classList.contains("hidden") &&
      !settingsView.settingsSection.classList.contains("hidden")
    )
      settingsView.toggleSettings(state);
    this.previewSectionAll.classList.toggle("hidden");
    sidebarView.btnCaretLeftSidebar.classList.toggle("hidden");
    sidebarView.btnCaretRightSidebar.classList.toggle("hidden");
  }

  changePreviewSectionHeaderText(text) {
    this.previewSectionHeader.innerHTML = text;
  }

  /** Function to highlight notes.
   * @author Revan
   */
  highlightNotes() {
    let notesHighlight = [...document.body.querySelectorAll(".note-preview")];
    notesHighlight.forEach((el) =>
      el.addEventListener("click", (e) => {
        [...el.parentElement.children].forEach((sib) => {
          sib.classList.remove("note-Highlights"),
            el.classList.add("note-Highlights");
          noteView.counterText.textContent = "";
        });
      })
    );
  }

  renderPreview(notesArr, listType = "All Notes") {
    const noteCreationSectionHeight = noteView.noteCreationSection.offsetHeight;
    this.previewSectionAll.style.height = `${noteCreationSectionHeight}px`;
    this.changePreviewSectionHeaderText(listType);
    let markup = "";

    this.previewSection.innerHTML = "";

    notesArr
      .filter((note) => note.delta)
      .forEach((note) => {
        markup += `
     
      <div class="note-preview" data-id="${note.id}">
       

        <div class="note-preview--date">${note.date}</div>
        <i class="ph-trash-bold icon-preview icon"></i>
        ${
          note.tags.length > 0
            ? '<i class="ph-tag-fill tag-icon-preview icon-preview icon"></i>'
            : ""
        }
        ${
          note.bookmarked
            ? '<i class="ph-star-fill star-icon-preview icon-preview icon"></i>'
            : '<i class="ph-star star-icon-preview icon-preview icon"></i>'
        }        
        <div class="note-preview--title">${note.title.slice(0, 20)}</div>
        <p class="note-preview--text">${note.preview} </p>    
        </div>
        
        `;
      });
    this.previewSection.append(this.searchNotesInput);
    this.previewSection.insertAdjacentHTML("afterbegin", markup);
    this.highlightNotes();
  }

  closeFilterList() {
    this.previewSection.classList.remove("hidden");
    this.filterMenuMain.classList.add("hidden");
    this.overlayFilter.classList.add("hidden");
    this.previewSectionHeader.classList.toggle("hidden");
    this.filterCaretsIcons.forEach((el) => el.classList.toggle("hidden"));
  }

  displayAllNotes(state) {
    this.renderPreview(state.savedNotes);
    state.currentPreview = state.savedNotes;
    state.currentPreviewTitle = "All Notes";
    this.closeFilterList();
    this.previewSectionHeader.classList.remove("hidden");
  }

  displayStarredNotes(state) {
    const bookmarkedNotes = state.savedNotes.filter(
      (note) => note.bookmarked === true
    );
    this.renderPreview(bookmarkedNotes, "Starred Notes");
    state.currentPreview = bookmarkedNotes;
    state.currentPreviewTitle = "Starred Notes";
    this.closeFilterList();
    this.previewSectionHeader.classList.remove("hidden");
  }

  displayTagSelection() {
    this.overlayFilter.classList.add("hidden");
    this.overlayFilterTags.classList.remove("hidden");
    this.tagMenuSidebar.classList.toggle("hidden");
    this.previewSectionHeader.classList.add("hidden");
    this.filterMenuMain.classList.add("hidden");
  }

  displaySearchNotesInput(state) {
    this.overlayFilter.classList.add("hidden");
    this.overlayFilterKeyword.classList.remove("hidden");
    this.searchNotesInput.classList.remove("hidden");
    this.previewSectionHeader.classList.add("hidden");
    this.previewSection.classList.remove("hidden");
    this.renderPreview(state.savedNotes);
    this.filterMenuMain.classList.add("hidden");
  }

  displayByDate(type, state) {
    const filteredNotes = state.savedNotes.sort((a, b) =>
      type === "ascending" ? a.id - b.id : b.id - a.id
    );
    this.renderPreview(
      filteredNotes,
      type === "descending" ? "Date: Descending" : "Date: Ascending"
    );
    state.currentPreview = filteredNotes;
    state.currentPreviewTitle =
      type === "descending" ? "Date: Descending" : "Date: Ascending";
    this.closeFilterList();
    this.previewSectionHeader.classList.remove("hidden");
  }

  getSearchNotesInput() {
    return this.searchNotesInput.value.toLowerCase();
  }

  setPreviewHeadingToKeyword() {
    const keyword = this.searchNotesInput.value;
    this.searchNotesInput.value = "";
    this.searchNotesInput.classList.add("hidden");
    this.changePreviewSectionHeaderText(`Keyword: ${keyword}`);
    this.previewSectionHeader.classList.remove("hidden");
  }

  // _toggleBookmark(id, state) {
  //   renderPreview(state.currentPreview, state.currentPreviewTitle);
  //   setLocalStorage(state);
  // }

  // HANDLERS

  addHandlerPreviewSection(handler) {
    this.previewSection.addEventListener("click", handler);
  }

  addHandlerFilterBtn() {
    this.selectFilter.addEventListener("click", (e) => {
      this.overlayFilter.classList.toggle("hidden");
      this.filterMenuMain.classList.toggle("hidden");
      this.filterCaretsIcons.forEach((el) => el.classList.toggle("hidden"));
      this.previewSection.classList.toggle("hidden");
      this.previewSectionHeader.classList.toggle("hidden");
      this.searchNotesInput.classList.add("hidden");
      this.searchNotesInput.value = "";
    });
  }

  addHandlerFilterMenuMain(handler) {
    this.filterMenuMain.addEventListener("click", handler);
  }

  addHandlerFilterByTag(handler) {
    this.tagMenuSidebar.addEventListener("click", (e) => {
      this.overlayFilterTags.classList.add("hidden");
      handler(e);
      this.tagMenuSidebar.classList.toggle("hidden");
      this.previewSectionHeader.classList.remove("hidden");
      this.previewSection.classList.remove("hidden");
    });
  }

  addHandlerOverlayFilter() {
    this.overlayFilter.addEventListener(
      "click",
      this.closeFilterList.bind(this)
    );
  }

  addHandlerOverlayFilterTags() {
    this.overlayFilterTags.addEventListener("click", () => {
      this.tagMenuSidebar.classList.add("hidden");
      this.previewSectionHeader.classList.remove("hidden");
      this.previewSection.classList.remove("hidden");
      this.overlayFilterTags.classList.add("hidden");
    });
  }

  addHandlerOverlayFilterKeyword(handler) {
    this.overlayFilterKeyword.addEventListener("click", () => {
      this.overlayFilterKeyword.classList.add("hidden");
      this.searchNotesInput.classList.add("hidden");
      this.previewSectionHeader.classList.remove("hidden");
      handler();
    });
  }

  addHandlerSearchNotesInput(handler) {
    this.searchNotesInput.addEventListener("input", () => {
      this.renderPreview(handler());
      this.searchNotesInput.focus();
    });
  }

  addHandlerSearchNotesInputKeydown(handler) {
    this.searchNotesInput.addEventListener("keydown", handler);
  }
}

export default new PreviewView();
