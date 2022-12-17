"use strict";
import View from "./View.js";
class NoteView extends View {
  noteCreationSection = document.querySelector(".note-creation-section");
  // #btnNewNote = document.querySelector(".icon-plus");
  #templateModal = document.querySelector(".templateModal");
  #editor = document.querySelector("#editor");
  stickyBox = document.querySelector(".sticky-box");
  counterText = document.querySelector("#counter");
  inputTitle = document.querySelector(".input-title"); //moved to title
  #savedDiskIcon = document.querySelector(".saved-note-icon");
  #spinner = document.querySelector(".spinner");
  autosaveMsgEl = document.querySelector(".autosave-msg");
  #markdownExport = document.querySelector(".markdownExport");
  #markdownImport = document.querySelector(".markdownImport");

  constructor() {
    super();
    this.#addHandlerOpenNewNote();
    this.#addHandlerEditor();
  }

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

  #countWords(str) {
    const arr = str.split(" ");
    return arr.filter((word) => word !== "").length;
  }

  setCounterText() {
    const textArea = this.#editor.innerText;
    this.counterText.textContent = `${this.#countWords(textArea)}`;
  }

  #getEditorText() {
    return this.#editor.innerText;
  }

  #toggleSpinner() {
    this.#savedDiskIcon.classList.toggle("hidden");
    this.#spinner.classList.toggle("hidden");
  }

  changeAutoSaveMessage(message) {
    this.autosaveMsgEl.textContent = message;
    this.autosaveMsgEl.classList.toggle("autosave-msg-saving");
    this.#toggleSpinner();
    if (message === "saving") {
      this.#savedDiskIcon.classList.add("hidden");
      this.#spinner.classList.remove("hidden");
    }
    if (message === "saved") {
      this.#savedDiskIcon.classList.remove("hidden");
      this.#spinner.classList.add("hidden");
    }
  }

  // Handlers
  #addHandlerOpenNewNote() {
    this.noteCreationSection.addEventListener("click", (e) => {
      if (!e.target.closest(".icon-plus")) return;
      this.#templateModal.classList.toggle("hidden");
    });
  }

  addHandlerTemplateModal(handler) {
    this.#templateModal.addEventListener("click", (e) => {
      const template = e.target.closest(".template")?.dataset.template;
      if (!template) return;

      handler(template);
      this.#templateModal.classList.toggle("hidden", { passive: true });
    });
  }

  #addHandlerEditor() {
    this.#editor.addEventListener("input", () => {
      this.setCounterText();
    });
  }

  // addHandlerOverlay(handler) {
  //   this.overlay.addEventListener("click", handler);
  // }

  addHandlerMarkdown(handler) {
    [this.#markdownExport, this.#markdownImport].forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const action = e.target
          .closest(".markdown-btn")
          ?.classList.contains("markdownImport")
          ? "import"
          : "export";
        if (!action) return;

        const editorValue = this.#getEditorText();
        handler(action, editorValue);
      })
    );
  }

  addHandlerAutosave(handler) {
    [this.#editor, this.inputTitle].forEach((el) =>
      el.addEventListener("keydown", handler)
    );
  }
}

export default new NoteView();
