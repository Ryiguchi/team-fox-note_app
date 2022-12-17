"use strict";
import View from "./View.js";
class NoteView extends View {
  noteCreationSection = document.querySelector(".note-creation-section");
  stickyBox = document.querySelector(".sticky-box");
  counterText = document.querySelector("#counter");
  _btnNewNote = document.querySelector(".icon-plus");
  _templateModal = document.querySelector(".templateModal");
  inputTitle = document.querySelector(".input-title"); //moved to title
  counterText = document.querySelector("#counter");
  editor = document.querySelector("#editor");
  savedDiskIcon = document.querySelector(".saved-note-icon");
  spinner = document.querySelector(".spinner");
  autosaveMsgEl = document.querySelector(".autosave-msg");
  markdownExport = document.querySelector(".markdownExport");
  markdownImport = document.querySelector(".markdownImport");
  tagListTitle = document.querySelector(".tag-list-title");
  tagListTitleAll = document.querySelector(".tag-list-title-all");
  tagSelectionTitleSection = document.querySelector(
    ".tag-selection-container-title"
  );
  noteInfoBox = document.querySelector(".info-box");

  // METHODS

  renderNoteTags(tags) {
    ///moved to title
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

  #setTitle(note) {
    this.inputTitle.value = note.title;
  }

  renderNote(note, quill) {
    this.noteCreationSection.classList.remove("hidden");
    quill.setContents(note.delta.ops);
    this.#setTitle(note);
    this.renderNoteTags(note.tags);
  }

  createNewNote(quill) {
    // display empty page
    quill.setContents([{ insert: "\n" }]);
    this.renderNoteTags();
    this.inputTitle.value = "Untitled note";
  }

  countWords(str) {
    const arr = str.split(" ");
    return arr.filter((word) => word !== "").length;
  }

  setCounterText() {
    const textArea = this.editor.innerText;
    this.counterText.textContent = `${this.countWords(textArea)}`;
  }

  getEditorText() {
    return this.editor.innerText;
  }

  _toggleSpinner() {
    this.savedDiskIcon.classList.toggle("hidden");
    this.spinner.classList.toggle("hidden");
  }

  changeAutoSaveMessage(message) {
    this.autosaveMsgEl.textContent = message;
    this.autosaveMsgEl.classList.toggle("autosave-msg-saving");
    this._toggleSpinner();
    if (message === "saving") {
      this.savedDiskIcon.classList.add("hidden");
      this.spinner.classList.remove("hidden");
    }
    if (message === "saved") {
      this.savedDiskIcon.classList.remove("hidden");
      this.spinner.classList.add("hidden");
    }
  }

  // Handlers
  addHandlerOpenNewNote(handler) {
    this._btnNewNote.addEventListener("click", () => {
      this._templateModal.classList.toggle("hidden");
    });
  }

  addHandlerEditor() {
    this.editor.addEventListener("input", () => {
      const textArea = this.editor.innerText;
      this.counterText.textContent = `${this.countWords(textArea)}`;
    });
  }

  addHandlerOverlay(handler) {
    this.overlay.addEventListener("click", handler);
  }

  addHandlerMarkdownExport(handler) {
    this.markdownExport.addEventListener("click", handler);
  }

  addHandlerMarkdownImport(handler) {
    this.markdownImport.addEventListener("click", handler);
  }

  addHandlerAutosave(handler) {
    [this.editor, this.inputTitle].forEach((el) =>
      el.addEventListener("keydown", handler)
    );
  }

  addHandlerUnload(handler) {
    window.addEventListener("beforeunload", handler);
  }

  addHandlerTemplateModal(handler) {
    this._templateModal.addEventListener("click", (e) => {
      handler(e);
      this._templateModal.classList.toggle("hidden", { passive: true });
    });
  }

  // addHandlerRemoveTagIcon(handler) {
  //   this.noteInfoBox.addEventListener("click", handler);
  // }

  addHandlerTagIconsTitleList(handler) {
    this.tagSelectionTitleSection.addEventListener("click", handler);
  }
}

export default new NoteView();
