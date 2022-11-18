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
const btnShowBookmarks = document.querySelector(".ph-star-fill");

// State = data representing the current state of the app
let state = {
  curNote: {
    tags: [],
    id: null,
    bookmarked: false,
  },
  firstLogIn: true,
  savedNotes: [],
  preview: "saved",
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
  const index = getNoteIndexByID(state.curNote.id);

  index === -1 ? saveNewNote(delta) : updateNote(delta, index);
};

const getNoteIndexByID = function (id) {
  return state.savedNotes.findIndex((note) => note.id === id);
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
  console.log(state);
};

// create a deep copy of the current Note
const createSavedNote = function () {
  const title = state.curNote.delta.ops[0].insert.slice(0, 30);
  const preview = `${state.curNote.delta.ops[0].insert.slice(0, 145)}...`;
  const tempNote = {
    title: title,
    preview: preview,
    date: state.curNote.date,
    id: state.curNote.id,
    delta: state.curNote.delta,
    tags: [...state.curNote.tags],
  };
  state.savedNotes.push(tempNote);
  previewRender(state.savedNotes);
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
  if (!data) return;
  const { firstLogIn, savedNotes } = data;
  state.firstLogIn = firstLogIn;
  state.savedNotes = [...savedNotes];
};

const previewRender = function (notesArr) {
  previewSection.innerHTML = "";
  let markup = "";
  notesArr.forEach((note) => {
    markup += `
      <div class="note-preview" data-id="${note.id}">
        <div class="note-preview--date">${note.date}</div>
        <i class="ph-tag-fill icon-preview icon"></i>
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

/**
 * Anything in here will be executed when the page loads
 * @author Ryan Iguchi
 */
const init = function () {
  const data = getLocalStorage();
  updateState(data);
  previewRender(state.savedNotes);
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

previewSection.addEventListener("click", (e) => {
  console.log("click");
  const noteID = e.target.closest(".note-preview").dataset.id;
  console.log(noteID);
  if (e.target.classList.contains("star-icon-preview")) toggleBookmark(noteID);
});

btnShowBookmarks.addEventListener("click", (e) => {
  const bookmarkedNotes = state.savedNotes.filter(
    (note) => note.bookmarked === true
  );
  console.log(state);
  if (state.preview !== "bookmarks") {
    previewRender(bookmarkedNotes);
    state.preview = "bookmarks";
  } else {
    previewRender(state.savedNotes);
    state.preview = "saved";
  }
});
