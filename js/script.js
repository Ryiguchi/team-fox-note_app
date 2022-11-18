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

// State = data representing the current state of the app
let state = {
  curNote: {
    tags: [],
    id: null,
  },
  firstLogIn: true,
  savedNotes: [],
};
let listen = true;

// FUNCTIONS ///////////////////////////

const wait = function (handler, sec) {
  setTimeout(handler, sec * 1000);
};

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
  return JSON.parse(localStorage.getItem("state"));
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
  const index = state.savedNotes.findIndex(
    (note) => note.id === state.curNote.id
  );

  index === -1 ? saveNewNote(delta) : updateNote(delta, index);
};

const updateNote = function (delta, i) {
  state.savedNotes[i].delta = delta;
  setLocalStorage(state);
};

const saveNewNote = function (delta) {
  state.curNote.date = getDate();
  state.curNote.id = createID();
  state.curNote.delta = delta;
  createSavedNote();
  setLocalStorage(state);
};

// create a deep copy of the current Note
const createSavedNote = function () {
  const tempNote = {
    date: state.curNote.date,
    id: state.curNote.id,
    delta: state.curNote.delta,
    tags: [...state.curNote.tags],
  };
  state.savedNotes.push(tempNote);
};

const getDate = function () {
  return new Date().toString().slice(4, 15);
};

const createID = function () {
  return Date.now().toString().slice(5);
};

const clearCurID = function () {
  state.curNote.id = createID();
};

const updateState = function (data) {
  const { firstLogIn, savedNotes } = data;
  state.firstLogIn = firstLogIn;
  state.savedNotes = [...savedNotes];
};

/**
 * Anything in here will be executed when the page loads
 * @author Ryan Iguchi
 */
const init = function () {
  const data = getLocalStorage();
  updateState(data);
  if (data === null || state.firstLogIn === true) toggleWelcome();
};

init();

// EVENT HANDLERS //////////////////////////

btnCloseWelcome.addEventListener("click", (e) => {
  state.firstLogIn = false;
  setLocalStorage(state);
  toggleWelcome();
});

saveBtn.addEventListener("click", saveNote);

// quill.on("text-change", () => {
//   if(!listen) return
//   wait(saveNote, 2);
//   listen = false;
// });

btnNewNote.addEventListener("click", () => {
  clearCurID();
  quill.setContents([{ insert: "\n" }]);
});
