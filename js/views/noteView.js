"use strict";
import View from "./View.js";
import toolbarView from "./toolbarView.js";

export class NoteView extends View {
  noteCreationSection = document.querySelector(".note-creation-section");
  stickyBox = document.querySelector(".sticky-box");
  counterText = document.querySelector("#counter");
  _btnNewNote = document.querySelector(".icon-plus");
  _templateModal = document.querySelector(".templateModal");
  inputTitle = document.querySelector(".input-title");
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

  // METHODS
  setTitle(note) {
    this.inputTitle.value = note.title;
  }

  renderNote(note, quill) {
    this.noteCreationSection.classList.remove("hidden");
    quill.setContents(note.delta.ops);
    this.setTitle(note);
    // toolbarView.updateTagListToolbar(note);
    this.renderTagList(this.tagListTitle, note.tags);
  }

  createNewNote(quill) {
    // display empty page
    quill.setContents([{ insert: "\n" }]);
    this.renderTagList(this.tagListTitle);
    this.inputTitle.value = "Untitled note";
  }

  countWords(str) {
    const arr = str.split(" ");
    return arr.filter((word) => word !== "").length;
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

  addHandlerInputTitleFocus() {
    this.inputTitle.addEventListener("focus", () => {
      this.inputTitle.select();
    });
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

  addHandlerRemoveTagIcon(handler) {
    this.tagListTitle.addEventListener("click", handler);
  }

  addHandlerTagIconsTitleList(handler) {
    this.tagSelectionTitleSection.addEventListener("click", handler);
  }
}

export default new NoteView();
