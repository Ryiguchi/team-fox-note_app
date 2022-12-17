"use strict";

class PreviewView {
  previewSectionAll = document.querySelector(".preview-section");
  #previewSection = document.querySelector(".notes-preview-section");
  #filterMenuMain = document.querySelector(".filter-menu");
  #filterCaretsIcons = document.querySelectorAll(".filter-carets");
  #overlayFilter = document.querySelector(".overlay-filter");
  #overlayFilterTags = document.querySelector(".overlay-filter-tags");
  #overlayFilterKeyword = document.querySelector(".overlay-filter-keyword");
  #previewSectionHeader = document.querySelector(".preview-section-header");
  #searchNotesInput = document.querySelector(".searchNotesInput");
  #tagMenuSidebar = document.querySelector(".tag-selection-container-sidebar");

  constructor() {
    this.#addHandlerFilterBtn();
    this.#addHandlerOverlayFilter();
    this.#addHandlerOverlayFilterTags();
    this.#addHandlerSearchNotesInputKeydown();
  }

  toggleWelcomePreviewView() {
    this.previewSectionAll.classList.toggle("hidden");
    if (screen.width <= 600) this.previewSectionAll.classList.add("hidden");
  }

  changePreviewSectionHeaderText(text) {
    this.#previewSectionHeader.innerHTML = text;
  }

  renderPreview(notesArr, listType = "All Notes") {
    this.changePreviewSectionHeaderText(listType);
    let markup = "";

    this.#previewSection.innerHTML = "";

    notesArr
      .filter((note) => note.delta)
      .forEach((note) => {
        markup += `
     
      <div class="note-preview ${
        note.displaying ? "current-note" : ""
      }" data-id="${note.id}" >
       

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
    this.#previewSection.append(this.#searchNotesInput);
    this.#previewSection.insertAdjacentHTML("afterbegin", markup);

    // this.highlightNotes();
  }

  closeFilterList() {
    this.#previewSection.classList.remove("hidden");
    this.#filterMenuMain.classList.add("hidden");
    this.#overlayFilter.classList.add("hidden");
    this.#previewSectionHeader.classList.toggle("hidden");
    this.#filterCaretsIcons.forEach((el) => el.classList.toggle("hidden"));
  }

  displayAllNotes(state) {
    this.renderPreview(state.savedNotes);
    state.currentPreview = state.savedNotes;
    state.currentPreviewTitle = "All Notes";
    this.closeFilterList();
    this.#previewSectionHeader.classList.remove("hidden");
  }

  displayStarredNotes(state) {
    const bookmarkedNotes = state.savedNotes.filter(
      (note) => note.bookmarked === true
    );
    this.renderPreview(bookmarkedNotes, "Starred Notes");
    state.currentPreview = bookmarkedNotes;
    state.currentPreviewTitle = "Starred Notes";
    this.closeFilterList();
    this.#previewSectionHeader.classList.remove("hidden");
  }

  displayTagSelection() {
    this.#overlayFilter.classList.add("hidden");
    this.#overlayFilterTags.classList.remove("hidden");
    this.#tagMenuSidebar.classList.toggle("hidden");
    this.#previewSectionHeader.classList.add("hidden");
    this.#filterMenuMain.classList.add("hidden");
  }

  displaySearchNotesInput(state) {
    this.#overlayFilter.classList.add("hidden");
    this.#overlayFilterKeyword.classList.remove("hidden");
    this.#searchNotesInput.classList.remove("hidden");
    this.#previewSectionHeader.classList.add("hidden");
    this.#previewSection.classList.remove("hidden");
    this.renderPreview(state.savedNotes);
    this.#filterMenuMain.classList.add("hidden");
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
    this.#previewSectionHeader.classList.remove("hidden");
  }

  getSearchNotesInput() {
    return this.#searchNotesInput.value.toLowerCase();
  }

  setPreviewHeadingToKeyword() {
    const keyword = this.#searchNotesInput.value;
    this.#searchNotesInput.value = "";
    this.#searchNotesInput.classList.add("hidden");
    this.changePreviewSectionHeaderText(`Keyword: ${keyword}`);
    this.#previewSectionHeader.classList.remove("hidden");
  }

  // HANDLERS

  addHandlerDeleteNote(handler) {
    this.previewSectionAll.addEventListener("click", (e) => {
      if (!e.target.classList.contains("ph-trash-bold")) return;
      const noteID = e.target.closest(".note-preview").dataset.id;
      if (!confirm("Are you sure you want to delete this note?")) return;
      handler(noteID);
    });
  }

  addHandlerToggleBookmark(handler) {
    this.previewSectionAll.addEventListener("click", (e) => {
      if (!e.target.classList.contains("star-icon-preview")) return;
      const noteID = e.target.closest(".note-preview").dataset.id;
      handler(noteID);
    });
  }

  addHandlerDisplayNote(handler) {
    this.previewSectionAll.addEventListener("click", (e) => {
      if (
        !e.target.closest(".note-preview") ||
        e.target.classList.contains("star-icon-preview") ||
        e.target.classList.contains("ph-trash-bold") ||
        e.target.classList.contains("ph-tag-fill")
      )
        return;

      const noteID = e.target.closest(".note-preview").dataset.id;
      handler(noteID);
    });
  }

  #addHandlerFilterBtn() {
    this.previewSectionAll.addEventListener("click", (e) => {
      if (!e.target.closest(".filter-select")) return;
      this.#overlayFilter.classList.toggle("hidden");
      this.#filterMenuMain.classList.toggle("hidden");
      this.#filterCaretsIcons.forEach((el) => el.classList.toggle("hidden"));
      this.#previewSection.classList.toggle("hidden");
      this.#previewSectionHeader.classList.toggle("hidden");
      this.#searchNotesInput.classList.add("hidden");
      this.#searchNotesInput.value = "";
    });
  }

  addHandlerFilterMenuMain(handler) {
    this.previewSectionAll.addEventListener("click", (e) => {
      const filterType = e.target.closest("li")?.dataset.type;
      if (!filterType) return;

      handler(filterType);
    });
  }

  addHandlerFilterByTag(handler) {
    this.previewSectionAll.addEventListener("click", (e) => {
      const chosenTag = e.target
        .closest(".tag-selection")
        ?.dataset.tag.replaceAll("_", " ");
      if (!chosenTag) return;

      this.#overlayFilterTags.classList.add("hidden");
      handler(chosenTag);
      this.#tagMenuSidebar.classList.toggle("hidden");
      this.#previewSectionHeader.classList.remove("hidden");
      this.#previewSection.classList.remove("hidden");
    });
  }

  #addHandlerOverlayFilter() {
    this.#overlayFilter.addEventListener(
      "click",
      this.closeFilterList.bind(this)
    );
  }

  #addHandlerOverlayFilterTags() {
    this.#overlayFilterTags.addEventListener("click", () => {
      this.#tagMenuSidebar.classList.add("hidden");
      this.#previewSectionHeader.classList.remove("hidden");
      this.#previewSection.classList.remove("hidden");
      this.#overlayFilterTags.classList.add("hidden");
    });
  }

  addHandlerOverlayFilterKeyword(handler) {
    this.#overlayFilterKeyword.addEventListener("click", () => {
      this.#overlayFilterKeyword.classList.add("hidden");
      this.#searchNotesInput.classList.add("hidden");
      this.#previewSectionHeader.classList.remove("hidden");
      handler();
    });
  }

  addHandlerSearchNotesInput(handler) {
    this.#searchNotesInput.addEventListener("input", () => {
      this.renderPreview(handler());
      this.#searchNotesInput.focus();
    });
  }

  #addHandlerSearchNotesInputKeydown(handler) {
    this.#searchNotesInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.setPreviewHeadingToKeyword();
    });
  }
}

export default new PreviewView();
