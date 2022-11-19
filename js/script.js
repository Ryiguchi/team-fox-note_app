"use strict";

const toolbarOptions = [
  [{ font: [] }],
  [{ size: ["small", "medium", "large", "huge"] }],
  [{ color: [] }, { background: [] }],
  ["bold", "italic", "underline"],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["code-block"],
  ["link", "image", "video"],
  ["clean"],
];

let quill = new Quill("#note-textarea", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

// SELECTORS
const toolbar = document.querySelector(".ql-toolbar");
const btnCloseWelcome = document.querySelector(".welcome-close-btn");
const btnNewNote = document.querySelector(".icon-plus");
const welcomePopUp = document.querySelector(".welcome-pop-up");
const saveBtn = document.querySelector(".icon-save");
const noteTextarea = document.querySelector("#note-textarea");
const previewSection = document.querySelector(".notes-preview-section");
const btnBookmarksActive = document.querySelector(".ph-star-fill");
const btnBookmarksNotActive = document.querySelector(".ph-star");
const starContainer = document.querySelector(".star-container");

// State = data representing the current state of the app
let state = {
  curNote: {
    tags: [],
    id: null,
    bookmarked: false,
  },
  savedNotes: [],
  previewType: "allSaved",
};

// FUNCTIONS ///////////////////////////

// const wait = function (handler, sec) {
//   setTimeout(handler, sec * 1000);
// };

/**
 *
 * @param {Object | Object[]} data The state to be saved for the user (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 */
const setLocalStorage = function (data) {
  localStorage.setItem("state", JSON.stringify(state));
};

/**
 *
 * @returns {Object | Object[]} The users saved settings (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 */
const getLocalStorage = function () {
  const savedState = _.cloneDeep(JSON.parse(localStorage.getItem("state")));
  savedState.curNote = {};
  return savedState;
};

/**
 * Shows or hides the Welcome screen
 * @author Ryan Iguchi
 */
const toggleWelcome = function () {
  welcomePopUp.classList.toggle("hidden");
  toolbar.classList.toggle("hidden");
};

const saveNote = function () {
  const delta = quill.getContents();
  const index = getNoteIndexByID(state.curNote.id);

  index === -1 ? saveNewNote(delta) : updateNote(delta, index);
};

const getNoteIndexByID = function (id) {
  return state.savedNotes.findIndex((note) => note.id === id);
};

const saveNewNote = function (delta) {
  setNewNotePrperties(delta);
  state.savedNotes.unshift(_.cloneDeep(state.curNote));
  previewRender(state.savedNotes);
  setLocalStorage(state);
};

// create a deep copy of the current Note
const setNewNotePrperties = function (delta) {
  state.curNote.date = getDate();
  state.curNote.id = createID();
  state.curNote.delta = delta;
  state.curNote.title = state.curNote.delta.ops[0].insert.slice(0, 30);
  state.curNote.preview = `${state.curNote.delta.ops[0].insert.slice(
    0,
    150
  )}...`;
};

const updateNote = function (delta, i) {
  state.savedNotes[i].delta = delta;
  setLocalStorage(state);
};

const getDate = function () {
  return new Date().toString().slice(4, 15);
};

const createID = function () {
  return Date.now().toString().slice(5);
};

const updateState = function (newState) {
  if (!newState) return;
  state = _.cloneDeep(newState);
};

const previewRender = function (notesArr) {
  previewSection.innerHTML = "";
  let markup = "";
  notesArr.forEach((note) => {
    markup += `
      <div class="note-preview" data-id="${note.id}">
        <div class="note-preview--date">${note.date}</div>
        <i class="ph-tag-fill tag-icon-preview icon-preview icon"></i>
        ${
          note.bookmarked
            ? '<i class="ph-star-fill star-icon-preview icon-preview icon"></i>'
            : '<i class="ph-star star-icon-preview icon-preview icon"></i>'
        }
        <div class="note-preview--title">${note.title}</div>
        <p class="note-preview--text">${note.preview}</p>
      </div>
    `;
  });
  previewSection.insertAdjacentHTML("afterbegin", markup);
};

const toggleBookmark = function (id) {
  const note = state.savedNotes[getNoteIndexByID(id)];
  note.bookmarked = note.bookmarked ? false : true;
  previewRender(state.savedNotes);
  setLocalStorage();
};

const renderNote = function (id) {
  const note = state.savedNotes[getNoteIndexByID(id)];
  quill.setContents(note.delta.ops);
  state.curNote = _.cloneDeep(note);
};

const toggleStarHeader = function () {
  btnBookmarksNotActive.classList.toggle("hidden");
  btnBookmarksActive.classList.toggle("hidden");
};

/**
 * Anything in here will be executed when the page loads
 * @author Ryan Iguchi
 */
const init = function () {
  const savedState = getLocalStorage();
  if (!savedState) toggleWelcome();
  updateState(savedState);
  previewRender(state.savedNotes);
};

init();

// EVENT HANDLERS //////////////////////////

btnCloseWelcome.addEventListener("click", (e) => {
  setLocalStorage(state);
  toggleWelcome();
});

saveBtn.addEventListener("click", saveNote);

btnNewNote.addEventListener("click", () => {
  saveNote();
  state.curNote.id = createID();
  quill.setContents([{ insert: "\n" }]);
});

previewSection.addEventListener("click", (e) => {
  const noteID = e.target.closest(".note-preview").dataset.id;
  if (e.target.classList.contains("star-icon-preview")) toggleBookmark(noteID);
  if (!e.target.classList.contains("star-icon-preview", "tag-icon-preview"))
    renderNote(noteID);
});

starContainer.addEventListener("click", (e) => {
  const bookmarkedNotes = state.savedNotes.filter(
    (note) => note.bookmarked === true
  );
  console.log(state);
  if (state.preview !== "bookmarks") {
    previewRender(bookmarkedNotes);
    state.preview = "bookmarks";
    toggleStarHeader();
  } else {
    previewRender(state.savedNotes);
    state.preview = "saved";
    toggleStarHeader();
  }
});
