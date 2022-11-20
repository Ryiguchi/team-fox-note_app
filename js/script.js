"use strict";

// const toolbarOptions = [
//   [{ font: [] }],
//   [{ size: ["small", "medium", "large", "huge"] }],
//   [{ color: [] }, { background: [] }],
//   ["bold", "italic", "underline"],
//   [{ align: [] }],
//   [{ list: "ordered" }, { list: "bullet" }],
//   ["code-block"],
//   ["link", "image", "video"],
//   ["clean"],
// ];

let quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: "#toolbar",
  },
  placeholder: "Start typing here ...",
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
const btnTagToolbar = document.querySelector(".tag-icon-toolbar");
const tagMenu = document.querySelector(".tag-selection-container");
const customTag = document.querySelector(".tag-custom");

// State = data representing the current state of the app
let state = {
  savedNotes: [],
  userTags: ["Personal", "Work", "Important"],
  previewType: "allSaved",
};
console.log(state);
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
  // savedState.curNote = {};
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
  if (!state.savedNotes[0].saved) {
    saveNoteData(state.savedNotes[0]);
    renderPreview(state.savedNotes);
    setLocalStorage(state);
  }
  if (state.savedNotes[0].saved) updateNote();
};

const saveNoteData = function (note) {
  note.delta = quill.getContents();
  if (!note.delta) return;
  note.title = note.delta.ops[0].insert.slice(0, 30);
  note.preview = note.delta.ops[0].insert.slice(0, 150);
  note.saved = true;
};

const updateNote = function () {
  state.savedNotes[0].delta = quill.getContents();
  setLocalStorage(state);
  console.log(state);
};

const getDate = function () {
  return new Date().toString().slice(4, 15);
};

const createID = function () {
  return Date.now().toString().slice(5);
};

const updateState = function (newState) {
  state = _.cloneDeep(newState);
};

const renderPreview = function (notesArr) {
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

// const renderToolbar = function () {
// const markup = "";
// state.userTags.forEach((tag) => {
//   html += `
//       <li class="tag-selection" data-tag="${tag}">${tag}</li>
//   `;
// });
// }

const toggleBookmark = function (id) {
  const note = state.savedNotes[getNoteIndexByID(id)];
  note.bookmarked = note.bookmarked ? false : true;
  previewRender(state.savedNotes);
  setLocalStorage();
};

const getNoteIndexByID = function (id) {
  return state.savedNotes.findIndex((note) => note.id === id);
};

const renderNote = function (id) {
  const index = getNoteIndexByID(id);
  const note = state.savedNotes[index];
  quill.setContents(note.delta.ops);
  updateTagListToolbar(note);
  state.savedNotes.splice(index, 1);
  state.savedNotes.unshift(note);
};

const updateTagListToolbar = function (note) {
  note.tags.forEach((tag) => {
    console.log("hi");
    document
      .querySelectorAll(`.tag-icon-tag-menu-${tag}`)
      .forEach((icon) => icon.classList.toggle("hidden"));
  });
};
const toggleStarHeader = function () {
  btnBookmarksNotActive.classList.toggle("hidden");
  btnBookmarksActive.classList.toggle("hidden");
};

// const toggleTagMenu = function () {
//   tagMenu.classList.toggle("hidden");
// };

// const toggleTagToNote = function (tag) {
//   const tags = state.savedNotes[0].tags;
//   tags.includes(tag)
//     ? tags.splice(
//         tags.findIndex((t) => t === tag),
//         1
//       )
//     : tags.push(tag);
//   console.log(state.savedNotes[0]);
// };

// const toggleActiveTag = function (el) {
//   const [...children] = el.closest(".tag-selection").children;
//   console.log(children);
//   children.forEach((el) => el.classList.toggle("hidden"));
//   // el.(".ph-tag-fill").classList.toggle("hidden");
//   // el.closest(".ph-tag").classList.toggle("hidden");
// };

const createNewNote = function () {
  quill.setContents([{ insert: "\n" }]);
  // document.querySelectorAll(".tag-icon-tag-menu-fill").classList.add("hidden");
  // document
  //   .querySelectorAll(".tag-icon-tag-menu-line")
  //   .classList.remove("hidden");
  const newNote = initNoteValues();
  state.savedNotes.unshift(newNote);
};

const initNoteValues = function () {
  const newNote = {
    date: getDate(),
    id: createID(),
    tags: [],
    bookmarked: false,
    saved: false,
  };
  return newNote;
};

const renderToolbar = function (parEl) {
  let markup = "";
  state.userTags.forEach((tag) => {
    markup += `
      <li class="tag-selection" data-tag="${tag.toLowerCase()}">
        <i class="ph-tag-fill tag-icon-tag-menu tag-icon-tag-menu-fill tag-icon-tag-menu-${tag.toLowerCase()} icon hidden"></i>
        <i class="ph-tag tag-icon-tag-menu tag-icon-tag-menu-line tag-icon-tag-menu-${tag.toLowerCase()} icon "></i>
        ${tag}
      </li>
  `;
  });
  parEl.insertAdjacentHTML("afterend", markup);
};
/**
 * Anything in here will be executed when the page loads
 * @author Ryan Iguchi
 */
const init = function () {
  const savedState = getLocalStorage();
  if (!savedState) toggleWelcome();
  if (savedState) {
    updateState(savedState);
    renderPreview(state.savedNotes);
  }
  renderToolbar(customTag);
  createNewNote();
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
  createNewNote();
});

previewSection.addEventListener("click", (e) => {
  const noteID = e.target.closest(".note-preview").dataset.id;
  if (e.target.classList.contains("star-icon-preview")) toggleBookmark(noteID);
  if (!e.target.classList.contains("star-icon-preview", "tag-icon-preview"))
    renderNote(noteID);
  console.log(state);
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

btnTagToolbar.addEventListener("click", (e) => {
  if (e.target.classList.contains("tag-icon-toolbar")) toggleTagMenu();
});

// tagMenu.addEventListener("click", (e) => {
//   const chosenTag = e.target.closest(".tag-selection").dataset.tag;
//   toggleTagToNote(chosenTag);
//   toggleActiveTag(e.target);
// });
