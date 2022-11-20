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
const toolbar = document.querySelector("#toolbar");
const noteSection = document.querySelector(".note-container");
const btnCloseWelcomeScreen = document.querySelector(".welcome-close-btn");
const btnNewNote = document.querySelector(".icon-plus");
const welcomePopUp = document.querySelector(".welcome-pop-up");
const btnSave = document.querySelector(".icon-save");
const noteTextarea = document.querySelector("#note-textarea");
const previewSection = document.querySelector(".notes-preview-section");
const btnBookmarksActive = document.querySelector(".ph-star-fill");
const btnBookmarksNotActive = document.querySelector(".ph-star");
const btnStar = document.querySelector(".star-container");
const btnTagToolbar = document.querySelector(".tag-icon-toolbar");
const tagMenuToolbar = document.querySelector(
  ".tag-selection-container-toolbar"
);
const tagMenuSidebar = document.querySelector(
  ".tag-selection-container-sidebar"
);
const tagListSidebar = document.querySelector(".tag-list-sidebar");
const tagListToolbar = document.querySelector(".tag-list-toolbar");
const btnTagSidebar = document.querySelector(".icon-side-bar-tag-fill");
const customTagInputEl = document.querySelector(".custom-tag-list-item");
const customTagEl = document.querySelector(".tag-custom");
const customTagBtn = document.querySelector(".custom-tag-btn");
const customTagInput = document.querySelector(".input-custom-tag");
const overlay = document.querySelector(".overlay");
const inputTitle = document.querySelector(".input-title");

// State = data representing the current state of the app
let state = {
  savedNotes: [],
  userTags: ["Personal", "Work", "Important"],
  previewType: "allSaved",
};
// ////////////////////////////////////////
// FUNCTIONS //////////////////////////////
///////////////////////////////////////////

// const wait = function (handler, sec) {
//   setTimeout(handler, sec * 1000);
// };

// LOCAL STORAGE /////////////////////////////////////////
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
  return _.cloneDeep(JSON.parse(localStorage.getItem("state")));
};

// SAVING NEW NOTES AND UPDATING EXISTING NOTES ///////////////
const saveNote = function () {
  const note = state.savedNotes[0];
  note.delta = quill.getContents();
  // if there isn't any content yet, then doesn't save
  if (note.delta.ops[0].insert === "\n") return;
  // if the note has been saved before, updates the savedNote
  if (note.saved) updateNote();
  // if the note has never been saved and has content, then saves content and renders note in preview section
  if (!note.saved) {
    saveNoteData(note);
  }
  // setTitle(note);
  renderPreview(state.savedNotes, "My Notes");
  setLocalStorage(state);
};

const saveNoteData = function (note) {
  if (inputTitle.value === "Untitled note") console.log("hi");
  note.title = note.delta.ops[0].insert.slice(0, 25);
  if (inputTitle.value !== "Untitled note") {
    console.log("bye");
    note.title = inputTitle.value;
  }
  note.preview = note.delta.ops[0].insert.slice(0, 150);
  note.saved = true;
};

const updateNote = function () {
  state.savedNotes[0].delta = quill.getContents();
  state.savedNotes[0].title = inputTitle.value;
};
// CREATING A NEW NOTE /////////////////////////////

const createNewNote = function () {
  // display empty page
  quill.setContents([{ insert: "\n" }]);
  resetTagList();
  inputTitle.value = "Untitled note";
  // give the new note some initial values
  const newNote = initNoteValues();
  state.savedNotes.unshift(newNote);
};

// hides all acitve tags
const resetTagList = function () {
  document
    .querySelectorAll(".tag-icon-tag-menu-fill")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".tag-icon-tag-menu-line")
    .forEach((el) => el.classList.remove("hidden"));
};

const initNoteValues = function () {
  const newNote = {
    date: getDate(),
    id: createID(),
    tags: [],
    bookmarked: false,
    saved: false,
    title: "Untitled note",
  };
  return newNote;
};

const getDate = function () {
  return new Date().toString().slice(4, 15);
};

const createID = function () {
  return Date.now().toString().slice(5);
};

const setTitle = function (note) {
  inputTitle.value = note.title;
};

// ///////////////////////////////////////////////
const updateState = function (newState) {
  state = _.cloneDeep(newState);
};

const renderPreview = function (notesArr, listType) {
  let markup = "";
  previewSection.innerHTML = "";
  markup = `
    <div class="preview-section-header">
    ${listType}</div>
    
    `;
  notesArr
    .filter((note) => note.delta)
    .forEach((note) => {
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
  renderPreview(state.savedNotes, "My Notes");
  setLocalStorage();
};

const getNoteIndexByID = function (id) {
  return state.savedNotes.findIndex((note) => note.id === id);
};

// DISPLAY SELECTED NOTE //////////////////////////////
const renderNote = function (id) {
  const index = getNoteIndexByID(id);
  const note = state.savedNotes[index];
  quill.setContents(note.delta.ops);
  setTitle(note);
  updateTagListToolbar(note);
  state.savedNotes.splice(index, 1);
  state.savedNotes.unshift(note);
};

const toggleStarHeader = function () {
  btnBookmarksNotActive.classList.toggle("hidden");
  btnBookmarksActive.classList.toggle("hidden");
};

// TAGS //////////////////////////////////////////

const updateTagListToolbar = function (note) {
  resetTagList();
  note.tags.forEach((tag) => {
    const newTag = tag.replaceAll(/\s+/g, "_");
    document
      .querySelectorAll(`.tag-icon-tag-menu-${newTag}`)
      .forEach((icon) => icon.classList.toggle("hidden"));
  });
};

const toggleTagToNote = function (tag) {
  const tags = state.savedNotes[0].tags;
  tags.includes(tag)
    ? tags.splice(
        tags.findIndex((t) => t === tag),
        1
      )
    : tags.push(tag);
};

const toggleActiveTag = function (el) {
  const [...children] = el.closest(".tag-selection").children;
  children.forEach((el) => el.classList.toggle("hidden"));
};

const toggleNewTagToolbar = function (tag) {
  document
    .querySelectorAll(`.tag-icon-tag-menu-${tag}`)
    .forEach((el) => el.classList.toggle("hidden"));
};

const toggleCustomTagListItems = function () {
  customTagInputEl.classList.toggle("hidden");
  customTagEl.classList.toggle("hidden");
};

const renderTagList = function (parEl) {
  parEl.innerHTML = "";
  let markup = "";
  state.userTags.forEach((tag) => {
    const newTag = tag.replaceAll(/\s+/g, "_");
    markup += `
      <li class="tag-selection tag-selection-${newTag}" data-tag="${newTag}">
        ${
          parEl === tagListToolbar
            ? `<i class="ph-tag-fill tag-icon-tag-menu tag-icon-tag-menu-fill tag-icon-tag-menu-${newTag} icon hidden"></i>
          <i class="ph-tag tag-icon-tag-menu tag-icon-tag-menu-line tag-icon-tag-menu-${newTag} icon "></i>`
            : ""
        }
        ${tag}
      </li>
  `;
  });
  parEl.insertAdjacentHTML("beforeend", markup);
};

// INITIALIZES WHEN PAGE LOADS //////////////////////
/**
 * Anything in here will be executed when the page loads
 * @author Ryan Iguchi
 */
const init = function () {
  const savedState = getLocalStorage();
  if (!savedState) toggleWelcome();
  if (savedState) {
    updateState(savedState);
    renderPreview(state.savedNotes, "My Notes");
  }
  renderTagList(tagListSidebar);
  renderTagList(tagListToolbar);
  createNewNote();
};

/**
 * Shows or hides the Welcome screen
 * @author Ryan Iguchi
 */
const toggleWelcome = function () {
  welcomePopUp.classList.toggle("hidden");
  toolbar.classList.toggle("hidden");
  noteSection.classList.toggle("hidden");
};

init();

////////////////////////////////////////////
// EVENT HANDLERS //////////////////////////
////////////////////////////////////////////

btnCloseWelcomeScreen.addEventListener("click", (e) => {
  setLocalStorage(state);
  toggleWelcome();
});

btnSave.addEventListener("click", saveNote);

btnNewNote.addEventListener("click", () => {
  saveNote();
  // if the current note is empty, then do nothing
  if (state.savedNotes[0].delta.ops[0].insert === "\n") return;
  createNewNote();
});

previewSection.addEventListener("click", (e) => {
  // return if clicked on an empty space
  if (e.target.classList.contains("notes-preview-section")) return;

  // if clicked on the star icon (bookmark)
  const noteID = e.target.closest(".note-preview").dataset.id;
  if (e.target.classList.contains("star-icon-preview")) toggleBookmark(noteID);
  // If clicked on a note to display
  if (!e.target.classList.contains("star-icon-preview", "tag-icon-preview"))
    renderNote(noteID);
});

btnStar.addEventListener("click", (e) => {
  const bookmarkedNotes = state.savedNotes.filter(
    (note) => note.bookmarked === true
  );
  if (state.preview !== "bookmarks") {
    renderPreview(bookmarkedNotes, "Starred Notes");
    state.preview = "bookmarks";
    toggleStarHeader();
  } else {
    renderPreview(state.savedNotes, "My Notes");
    state.preview = "saved";
    toggleStarHeader();
  }
});

btnTagToolbar.addEventListener("click", (e) => {
  if (e.target.classList.contains("tag-icon-toolbar")) {
    tagMenuToolbar.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
});

tagMenuToolbar.addEventListener("click", (e) => {
  if (e.target.classList.contains("custom-tag-input-el")) return;
  const chosenTag = e.target.closest(".tag-selection")?.dataset.tag;
  if (chosenTag !== "custom") {
    toggleTagToNote(chosenTag);
    toggleActiveTag(e.target);
    setLocalStorage(state);
  }
  if (chosenTag === "custom") {
    toggleCustomTagListItems();
  }
});

btnTagSidebar.addEventListener("click", (e) => {
  tagMenuSidebar.classList.toggle("hidden");
  overlay.classList.remove("hidden");
});

tagMenuSidebar.addEventListener("click", (e) => {
  saveNote();
  const chosenTag = e.target
    .closest(".tag-selection")
    .dataset.tag.replaceAll("_", " ");
  if (chosenTag === "all") renderPreview(state.savedNotes, "My Notes");
  if (chosenTag === "tags")
    renderPreview(
      state.savedNotes.filter((note) => note.tags.length > 0),
      "Tagged Notes"
    );
  if (chosenTag !== "all" && chosenTag !== "tags") {
    const notesWithChosenTag = state.savedNotes.filter((note) =>
      note.tags.includes(chosenTag)
    );
    if (state.preview === "bookmarks") toggleStarHeader();
    renderPreview(notesWithChosenTag, `Tag: ${chosenTag.replaceAll("_", " ")}`);
    state.preview = "tags";
  }
  tagMenuSidebar.classList.toggle("hidden");
});

customTagBtn.addEventListener("click", (e) => {
  const newTag = customTagInput.value;
  // 1. add tag to state
  if (state.userTags.includes(newTag)) return;
  state.userTags.push(newTag);
  // 2 rerender tag lists
  toggleTagToNote(newTag);
  renderTagList(tagListSidebar);
  renderTagList(tagListToolbar);
  //  3. add tag to note
  updateTagListToolbar(state.savedNotes[0]);
  setLocalStorage(state);
});

overlay.addEventListener("click", (e) => {
  tagMenuToolbar.classList.add("hidden");
  tagMenuSidebar.classList.add("hidden");
  overlay.classList.add("hidden");
});

inputTitle.addEventListener("keydown", (key) => {
  if (key.key === "Enter") {
    const title = inputTitle.value;
    state.savedNotes[0].title = title;
    renderPreview(state.savedNotes, "My Notes");
  }
});
