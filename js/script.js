"use strict";

import { letterTemplate, recipeTemplate, resumeTemplate } from "./templates.js";

// counter for the timer of time spent.
let timeSpent = 0;
// For the markdown Export
const turndownService = new TurndownService();
// For the Quill library
let quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: "#toolbar",
  },
  placeholder: "Start typing here ...",
  // container: "#counter",
  // unit: "word",
});

// SELECTORS ////////////////////////////////////
const btnCloseWelcomeScreen = document.querySelector(".welcome-close-btn");
const welcomePopUp = document.querySelector(".welcome-pop-up");
const overlaySidebar = document.querySelector(".overlay-sidebar");

// SIDEBAR
const sidebar = document.querySelector(".side-header");
const btnCaretSidebar = document.querySelector(".caret-contanier");
const btnCaretLeftSidebar = document.querySelector(".ph-caret-double-left");
const btnCaretRightSidebar = document.querySelector(".ph-caret-double-right");
const btnNewNote = document.querySelector(".icon-plus");
const btnSave = document.querySelector(".icon-save");
const btnSettings = document.querySelector(".settings-icon-sidebar");

// MOBILE HEADER
const mobileHeader = document.querySelector(".mobile-header");
const burger = document.querySelector(".ph-list");
const btnCaretToolbarContainer = document.querySelector(
  ".caret-container-toolbar"
);
const caretsMobileToolbar = document.querySelectorAll(".caret-mobile-toolbar");

// SETTINGS SECTION
const settingsSection = document.querySelector(".settings-section");
const btnCloseSettings = document.querySelector(".close-settings-icon");
const settingsItemTheme = document.querySelector(".settings-item-theme");
const themeTitle = document.querySelector(".current-theme-title");
const settingsMenus = document.querySelectorAll(".settings-menu");
const settingsMenuCaretsDown = document.querySelectorAll(
  ".settings-section .ph-caret-down-bold"
);
const settingsMenuCaretsUp = document.querySelectorAll(
  ".settings-section .ph-caret-up-bold"
);
const settingsItemStats = document.querySelector(".settings-list-stats");
const statsListMenu = document.querySelector(".stats-list-sidebar");
const wordCountToggleIcons = document.querySelectorAll(".word-count-toggle");

// PREVIEW SECTION
const previewSectionAll = document.querySelector(".preview-section");
const previewSection = document.querySelector(".notes-preview-section");
const previewSectionHeader = document.querySelector(".preview-section-header");
const selectFilter = document.querySelector(".filter-select");
const filterMenuMain = document.querySelector(".filter-menu");
const btnBookmarksActive = document.querySelector(".ph-star-fill");
const btnBookmarksNotActive = document.querySelector(".ph-star");
const tagMenuSidebar = document.querySelector(
  ".tag-selection-container-sidebar"
);
const tagListSidebar = document.querySelector(".tag-list-sidebar");

// NOTE CREATION SECTION
const noteCreationSection = document.querySelector(".note-creation-section");
const noteSection = document.querySelector(".note-container");
const editor = document.querySelector("#editor");
const inputTitle = document.querySelector(".input-title");

// TOOLBAR
const markdownExport = document.querySelector(".markdownExport");
const markdownImport = document.querySelector(".markdownImport");
const toolbar = document.querySelector("#toolbar");
const bookmarkToolbar = document.querySelector(".bookmark-toolbar");
const btnBookMarkActiveToolbar = document.querySelector(
  ".ph-star.icon-toolbar"
);
const btnBookMarkNotActiveToolbar = document.querySelector(
  ".ph-star-fill.icon-toolbar"
);
const btnTagToolbar = document.querySelector(".tag-icon-toolbar");
const tagMenuToolbar = document.querySelector(
  ".tag-selection-container-toolbar"
);
const tagListToolbar = document.querySelector(".tag-list-toolbar");
const customTagInputEl = document.querySelector(".custom-tag-list-item");
const customTagEl = document.querySelector(".tag-custom");
const customTagBtn = document.querySelector(".custom-tag-btn");
const customTagInput = document.querySelector(".input-custom-tag");
const overlay = document.querySelector(".overlay");
const searchNotesInput = document.querySelector(".searchNotesInput");
const wordCountBtn = document.querySelector(".countSpan");
const templateModal = document.querySelector(".templateModal");
const autosaveMsgEl = document.querySelector(".autosave-msg");

// State = data representing the current state of the app
let state = {
  savedNotes: [],
  userTags: ["Personal", "Work", "Important"],
  previewType: "allSaved",
  themes: "light",
};
// ////////////////////////////////////////
// FUNCTIONS //////////////////////////////
///////////////////////////////////////////

// LOCAL STORAGE /////////////////////////////////////////
/**
 * This function saves data to Local Storage
 * @param {Object | Object[]} data Pass in the state object to be saved for the user (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 * @
 */
const setLocalStorage = function (data) {
  data.savedNotes.forEach((note, i) => {
    if (!note.delta && i !== 0) data.savedNotes.splice(i, 1);
  });
  localStorage.setItem("state", JSON.stringify(state));
};

/**
 * This function gets a deep clone of the saved object in Local Storage
 * @returns {Object | Object[]} The users saved settings (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 */
const getLocalStorage = function () {
  return _.cloneDeep(JSON.parse(localStorage.getItem("state")));
};

// SAVING NEW NOTES AND UPDATING EXISTING NOTES ///////////////
/**
 *  This function saves the current note to the state and Local Storage. If the note doesn't have any content, then it won't save the note.If the note has content but hasn't been saved before, then it will create a title and preview and render the note in the preview section.  If the note has content and has been saved before, it will just update the saved note.
 * @author Ryan Iguchi
 */
const saveNote = function () {
  const note = state.savedNotes[0];
  note.delta = quill.getContents();
  // if there isn't any content yet, then doesn't save
  if (note.delta.ops[0].insert === "\n") return;

  if (inputTitle.value === "Untitled note")
    note.title = note.delta.ops[0].insert;
  if (inputTitle.value !== "Untitled note") note.title = inputTitle.value;
  note.preview = note.delta.ops[0].insert.slice(0, 95);

  setTitle(note);
  renderPreview(state.savedNotes);
  setLocalStorage(state);
};

// CREATING A NEW NOTE /////////////////////////////

/**
 *  This function creates a new note by displaying an empty page, resetting the tag list for the current note, resetting the title, setting initial values of the new note and saving the note to the 'state'
 */
const createNewNote = function () {
  // display empty page
  quill.setContents([{ insert: "\n" }]);
  resetTagList();
  inputTitle.value = "Untitled note";
  // give the new note some initial values
  const newNote = initNoteValues();

  state.savedNotes.unshift(newNote);
};

/**
 *  This function hides all of the filled tag icons and shows all of the unfilled tag icons in the toolbar list
 */
const resetTagList = function () {
  document
    .querySelectorAll(".tag-icon-tag-menu-fill")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".tag-icon-tag-menu-line")
    .forEach((el) => el.classList.remove("hidden"));
};

/**
 * This function creates a new note Object and gives it initial values
 * @returns {Object} returns a new note Object with initial values
 */
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
/**
 *  This function gets the date and creates and returns a usable string for the date
 * @returns {String} returns thte date in 'Mmm dd yyyy' format
 */
const getDate = function () {
  return new Date().toString().slice(4, 15);
};

/**
 *  This function creates a unique 8 digit ID from the current timestamp
 * @returns {number} returns a unique 8 digit ID
 */
const createID = function () {
  return Date.now().toString().slice(5);
};

/**
 * This function sets the title of the passed in note Object to the contents of the title input field
 * @param {Object} note Object that you want to change the title for
 */
const setTitle = function (note) {
  inputTitle.value = note.title;
};

/**
 * This function takes an array of note Objects, which could be all saved notes or a filtered list of notes, and displays them in the note preview section. It also will take the name of the list as a parameter and display it on the top of the section.
 * @param {Array} notesArr Array of note Objects to render previews for
 * @param {String} listType Name of the filtered list to be displayed on the top of the preview section
 */
const renderPreview = function (notesArr, listType = "All Notes") {
  const noteCreationSectionHeight = noteCreationSection.offsetHeight;
  previewSectionAll.style.height = `${noteCreationSectionHeight}px`;
  changePreviewSectionHeaderText(listType);
  let markup = "";

  previewSection.innerHTML = "";

  notesArr
    .filter((note) => note.delta)
    .forEach((note) => {
      markup += `
     
      <div class="note-preview" data-id="${note.id}">
       

        <div class="note-preview--date">${note.date}</div>
        <i class="ph-trash-bold icon-preview icon"></i>
        <i class="ph-tag-fill tag-icon-preview icon-preview icon"></i>
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
  previewSection.append(searchNotesInput);
  previewSection.insertAdjacentHTML("afterbegin", markup);
  highlightNotes();
};

/**
 *  this function toggles the 'bookmarked' value of the passed in note when the user presses the star icon
 * @param {Number} id the ID number of the note
 */
const toggleBookmark = function (id) {
  const note = state.savedNotes[getNoteIndexByID(id)];
  note.bookmarked = note.bookmarked ? false : true;
  renderPreview(state.savedNotes, "All Notes");
  setLocalStorage(state);
};

/**
 * This function returns the index number of a note based off of the passed in ID number
 * @param {Number} id The ID number of the note
 * @returns {Number} returns the index number of the searched for note from the saved notes array
 */
const getNoteIndexByID = function (id) {
  return state.savedNotes.findIndex((note) => note.id === id);
};

// DISPLAY SELECTED NOTE //////////////////////////////
/**
 *  This function finds a note in the saved notes array from the passed in ID and renders it in the note section.  It also will update the tag list to display the notes tags and will move the note to index[0] of the array
 * @param {Number} id the ID number of the note to render
 */
const renderNote = function (id) {
  noteCreationSection.classList.remove("hidden");
  const index = getNoteIndexByID(id);
  const note = state.savedNotes[index];
  quill.setContents(note.delta?.ops);
  setTitle(note);
  updateTagListToolbar(note);
  state.savedNotes.splice(index, 1);
  state.savedNotes.unshift(note);
};

/**
 * This function toggles the star icon in the sidebar between filled and not filled
 */

const toggleStarHeaderToolbar = function () {
  btnBookMarkNotActiveToolbar.classList.toggle("hidden");
  btnBookMarkActiveToolbar.classList.toggle("hidden");
};

// fill out the star on toolbar
const addStarHeaderToolbar = function () {
  btnBookMarkNotActiveToolbar.classList.remove("hidden");
  btnBookMarkActiveToolbar.classList.add("hidden");
};
// outline the star on toolbar
const removeStarHeaderToolbar = function () {
  btnBookMarkNotActiveToolbar.classList.add("hidden");
  btnBookMarkActiveToolbar.classList.remove("hidden");
};

// TAGS //////////////////////////////////////////

/**
 * This function takes the currently diplayed note's list of tags and displays them in the tag list in the toolbar.  It will first reset all of the tags.
 * @param {Object} note Object for the currently displayed note
 */
const updateTagListToolbar = function (note) {
  resetTagList();
  note.tags.forEach((tag) => {
    const newTag = tag.replaceAll(/\s+/g, "_");
    document
      .querySelectorAll(`.tag-icon-tag-menu-${newTag}`)
      .forEach((icon) => icon.classList.toggle("hidden"));
  });
};

/**
 *  This function takes tag and either adds or removes it from the current note based off of if it already exists or not
 * @param {String} tag name of the tag
 */
const toggleTagToNote = function (tag) {
  const tags = state.savedNotes[0].tags;
  tags.includes(tag)
    ? tags.splice(
        tags.findIndex((t) => t === tag),
        1
      )
    : tags.push(tag);
};

/**
 * This function toggles the filled and not filled tag icons in the tag list in the toolbar.
 * @param {Node} el the user clicked element which corresponds to a tag from the tag list
 */
const toggleActiveTag = function (el) {
  const [...children] = el.closest(".tag-selection").children;
  children.forEach((el) => el.classList.toggle("hidden"));
};

/**
 * This function takes the user created tag name and displays it in both tag lists
 * @param {String} tag Name of the new user created tag
 */
const toggleNewTagToolbar = function (tag) {
  document
    .querySelectorAll(`.tag-icon-tag-menu-${tag}`)
    .forEach((el) => el.classList.toggle("hidden"));
};

/**
 * This function toggles between the 'custom ...' list item and the input field in the tag list in the toolbar
 */
const toggleCustomTagListItems = function () {
  customTagInputEl.classList.toggle("hidden");
  customTagEl.classList.toggle("hidden");
};

/**
 * This function takes the parent element of a tag list, creates the markup fo the list and then displays it
 * @param {Node} parEl the parent element of a tag list
 */
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

/**
 * This function hides the save notes on the screen and makes them come back again.
 * Changes the carot icon from closed and open.
 * @author Aman Said
 */
const togglePreviewSection = function () {
  if (
    previewSectionAll.classList.contains("hidden") &&
    !settingsSection.classList.contains("hidden")
  )
    toggleSettings();

  previewSectionAll.classList.toggle("hidden");
  btnCaretLeftSidebar.classList.toggle("hidden");
  btnCaretRightSidebar.classList.toggle("hidden");
  state.previewSectionOpen = !state.previewSectionOpen;
  console.log(state.previewSectionOpen);
};

const toggleSidebar = function () {
  sidebar.classList.toggle("hidden");
  overlaySidebar.classList.toggle("hidden");
};

const toggleMobileToolbar = function () {
  toolbar.classList.toggle("hidden");
  caretsMobileToolbar.forEach((icon) => icon.classList.toggle("hidden"));
};

const displayAllNotes = function () {
  renderPreview(state.savedNotes, "All Notes");
  state.preview = "saved";
  closeFilterList();
  previewSectionHeader.classList.remove("hidden");
};

const displayStarredNotes = function () {
  const bookmarkedNotes = state.savedNotes.filter(
    (note) => note.bookmarked === true
  );
  renderPreview(bookmarkedNotes, "Starred Notes");
  state.preview = "bookmarks";
  closeFilterList();
  previewSectionHeader.classList.remove("hidden");
};

const displayTagSelection = function () {
  tagMenuSidebar.classList.toggle("hidden");
  previewSectionHeader.classList.add("hidden");
  filterMenuMain.classList.add("hidden");
};

const displaySearchNotesInput = function () {
  searchNotesInput.classList.remove("hidden");
  previewSectionHeader.classList.add("hidden");
  previewSection.classList.remove("hidden");
  filterMenuMain.classList.add("hidden");
};

const closeFilterList = function () {
  previewSection.classList.remove("hidden");

  filterMenuMain.classList.add("hidden");
  overlay.classList.add("hidden");
};

const changePreviewSectionHeaderText = function (text) {
  previewSectionHeader.innerHTML = text;
};

const toggleSettings = function () {
  settingsSection.classList.toggle("hidden");
  if (screen.width > 600 && !settingsSection.classList.contains("hidden"))
    previewSectionAll.classList.add("hidden");
  else if (
    screen.width > 600 &&
    state.previewSectionOpen === true &&
    previewSectionAll.classList.contains("hidden")
  )
    previewSectionAll.classList.remove("hidden");
  else if (
    screen.width <= 600 &&
    !settingsSection.classList.contains("hidden")
  ) {
    noteCreationSection.classList.add("hidden");
    previewSectionAll.classList.add("hidden");
  } else if (
    screen.width <= 600 &&
    settingsSection.classList.contains("hidden")
  ) {
    noteCreationSection.classList.remove("hidden");
    previewSectionAll.classList.add("hidden");
  }

  settingsMenus.forEach((el) => el.classList.add("hidden"));
  settingsMenuCaretsDown.forEach((el) => el.classList.remove("hidden"));
  settingsMenuCaretsUp.forEach((el) => el.classList.add("hidden"));
};

const toggleStatisticsList = function (list) {
  document.querySelector(`.${list}-list-sidebar`).classList.toggle("hidden");
  document
    .querySelectorAll(`.settings-${list}-menu-caret`)
    .forEach((el) => el.classList.toggle("hidden"));
};

const displayCurrentTheme = function (theme) {
  themeTitle.textContent = `Theme: ${theme}`;
};

const setPreviewSectionState = function (size) {
  if (size > 600) state.previewSectionOpen = true;
  if (size <= 600) state.previewSectionOpen = false;
};

// INITIALIZES WHEN PAGE LOADS //////////////////////
// ///////////////////////////////////////////////
/**
 * This function takes a 'state' Object and saves a deep clone to the 'state' object variable
 * @param {Object} newState state Object that you want to save
 */
const updateState = function (newState) {
  state = _.cloneDeep(newState);
};

/**
 * This function automatically runs when the page loads.  It first will display the welcome screen if its the first time the user has visited.  Then it will get the state data from Local storage and render the saved notes in the preview section, as well as the tag lists.  Finally, it will create a new note so the user can start writing.
 * @author Ryan Iguchi
 */
const init = function () {
  const savedState = getLocalStorage();
  if (!savedState) {
    toggleWelcome();
    if (screen.width <= 450) toggleSidebar();
  }
  if (savedState) {
    if (screen.width <= 600) togglePreviewSection();
    if (screen.width <= 450) {
      overlaySidebar.classList.remove("hidden");
      mobileHeader.classList.remove("hidden");
      toggleSidebar();
      toolbar.classList.add("hidden");
    }
    updateState(savedState);
    renderPreview(state.savedNotes, "All Notes");
  }
  renderTagList(tagListSidebar);
  renderTagList(tagListToolbar);
  createNewNote();
  initThemeSelector();
  setPreviewSectionState(screen.width);
};
/** Function to count words.
 * @AUTHOR alex och rivan
 */
function countWords(str) {
  const arr = str.split(" ");
  return arr.filter((word) => word !== "").length;
}

/**
 * Shows or hides the Welcome screen
 * @author Ryan Iguchi
 */
const toggleWelcome = function () {
  welcomePopUp.classList.toggle("hidden");
  noteSection.classList.toggle("hidden");
  toolbar.classList.toggle("hidden");
  previewSectionAll.classList.toggle("hidden");
};

init();

////////////////////////////////////////////
// EVENT HANDLERS //////////////////////////
////////////////////////////////////////////

// Word counter.
const counterText = document.querySelector("#counter");

editor.addEventListener("input", () => {
  const textArea = editor.innerText;
  counterText.textContent = `Total Words: ${countWords(textArea)}`;
});

// Markdown export converter
markdownExport.addEventListener("click", () => {
  const editorValue = editor.innerText;
  quill.setContents([{ insert: turndownService.turndown(editorValue) }]);
  saveNote();
});

// Markdown import converter.
markdownImport.addEventListener("click", () => {
  const editorValue = editor.innerText;
  const converter = new showdown.Converter();
  const html = converter.makeHtml(editorValue);
  quill.setContents([{ insert: html }]);
  saveNote();
});

// Bookmark Star on toolbar handler.
bookmarkToolbar.addEventListener("click", (e) => {
  state.savedNotes[0].bookmarked = true;
  setLocalStorage(state);
  saveNote();
  toggleStarHeaderToolbar();
  if (e.target.classList.contains("ph-star-fill")) {
    state.savedNotes[0].bookmarked = false;
    setLocalStorage(state);
    saveNote();
  }
});

btnCloseWelcomeScreen.addEventListener("click", (e) => {
  setLocalStorage(state);
  toggleWelcome();
  if (screen.width <= 600) togglePreviewSection();
  if (screen.width <= 450) {
    mobileHeader.classList.remove("hidden");
    toolbar.classList.toggle("hidden");
  }
});

btnSave.addEventListener("click", saveNote);

btnNewNote.addEventListener("click", () => {
  templateModal.classList.toggle("hidden");
  saveNote();
  removeStarHeaderToolbar();
  // if the current note is empty, then do nothing
  if (state.savedNotes[0].delta.ops[0].insert === "\n") return;
  createNewNote();
  if (screen.width <= 450) toggleSidebar();
});

selectFilter.addEventListener("click", (e) => {
  displayAllNotes();
  overlay.classList.remove("hidden");
  filterMenuMain.classList.toggle("hidden");
  previewSection.classList.toggle("hidden");
  previewSectionHeader.classList.toggle("hidden");
  searchNotesInput.classList.add("hidden");
  searchNotesInput.value = "";
});

filterMenuMain.addEventListener("click", (e) => {
  const filterType = e.target.closest("li").dataset.type;
  if (filterType === "all") displayAllNotes();
  if (filterType === "starred") displayStarredNotes();
  if (filterType === "tag") displayTagSelection();
  if (filterType === "keyword") displaySearchNotesInput();
});

previewSection.addEventListener("click", (e) => {
  // return if clicked on search field, header, or empty spacae, or filter
  if (
    e.target.classList.contains("searchNotesInput") ||
    e.target.classList.contains("preview-section-header") ||
    e.target.classList.contains("notes-preview-section")
  )
    return;

  // if clicked on the star icon (bookmark)
  const noteID = e.target.closest(".note-preview").dataset.id;

  if (e.target.classList.contains("star-icon-preview")) toggleBookmark(noteID);

  // if clicked on delete note button
  if (e.target.classList.contains("ph-trash-bold")) {
    deleteNote(noteID);
    return;
  }

  // If clicked on a note to display
  if (
    !e.target.classList.contains(
      "star-icon-preview",
      "tag-icon-preview",
      "delete-note"
    )
  ) {
    renderNote(noteID);
    if (screen.width <= 600) togglePreviewSection();
    if (screen.width <= 450) toggleSidebar();
  }
  // toggle ph-star-fill on toolbar if the active note is bookmarked.
  state.savedNotes[0].bookmarked
    ? addStarHeaderToolbar()
    : removeStarHeaderToolbar();
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

tagMenuSidebar.addEventListener("click", (e) => {
  overlay.classList.toggle("hidden");
  saveNote();
  const chosenTag = e.target
    .closest(".tag-selection")
    .dataset.tag.replaceAll("_", " ");
  // if (chosenTag === "all") renderPreview(state.savedNotes, "All Notes");
  if (chosenTag === "tags")
    renderPreview(
      state.savedNotes.filter((note) => note.tags.length > 0),
      "All Notes with Tags"
    );

  if (chosenTag !== "tags") {
    const notesWithChosenTag = state.savedNotes.filter((note) =>
      note.tags.includes(chosenTag)
    );
    // if (state.preview === "bookmarks") toggleStarHeader();
    renderPreview(notesWithChosenTag, `Tag: ${chosenTag.replaceAll("_", " ")}`);
    state.preview = "tags";
  }
  tagMenuSidebar.classList.toggle("hidden");
  previewSectionHeader.classList.remove("hidden");
  previewSection.classList.remove("hidden");
});

customTagBtn.addEventListener("click", (e) => {
  const newTag = customTagInput.value;
  if (customTagInput.value === "") {
    return;
  }
  // 1. add tag to state
  if (state.userTags.includes(newTag)) return;
  state.userTags.push(newTag);
  // 2 rerender tag lists
  toggleTagToNote(newTag);
  renderTagList(tagListSidebar);
  renderTagList(tagListToolbar);
  //  3. add tag to note
  updateTagListToolbar(state.savedNotes[0]);
  customTagInput.value = "";
  toggleCustomTagListItems();
  setLocalStorage(state);
});

overlay.addEventListener("click", (e) => {
  tagMenuToolbar.classList.add("hidden");
  tagMenuSidebar.classList.add("hidden");
  overlay.classList.add("hidden");
  closeFilterList();
});

inputTitle.addEventListener("keydown", (key) => {
  if (key.key === "Enter") {
    const title = inputTitle.value;
    state.savedNotes[0].title = title;
    renderPreview(state.savedNotes, "All Notes");
  }
});

/**
 * marks the input field so you can write your title.
 * @author Aman Said
 */
inputTitle.addEventListener("focus", () => {
  inputTitle.select();
});

btnCaretSidebar.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("ph-caret-double-right") &&
    screen.width <= 600
  )
    noteCreationSection.classList.add("hidden");
  if (e.target.classList.contains("ph-caret-double-left"))
    noteCreationSection.classList.remove("hidden");

  togglePreviewSection();
});

[burger, overlaySidebar].forEach((el) => {
  el.addEventListener("click", (e) => {
    toggleSidebar();
    previewSection.classList.add("hidden");
  });
});

btnCaretToolbarContainer.addEventListener("click", (e) => {
  toggleMobileToolbar();
});

[btnSettings, btnCloseSettings].forEach((el) => {
  el.addEventListener("click", (e) => {
    toggleSettings();
  });
});

settingsItemTheme.addEventListener("click", (e) => {
  toggleStatisticsList("themes");
});

settingsItemStats.addEventListener("click", (e) => {
  toggleStatisticsList("stats");
});

/** Dropdown menu for the theme selections.
 * @author Revan Toma
 */
function initThemeSelector() {
  const themeSelect = document.querySelector(".themeSelect");
  const themeStylesLink = document.querySelector("#themeStylesLink");

  function activateTheme(themeName) {
    themeStylesLink.setAttribute("href", `themes/${themeName}.css`);
    state.themes = themeName;
    setLocalStorage(state);
  }

  // Listen for change and change the theme then save it to localStorage.
  themeSelect.addEventListener("click", (e) => {
    const theme = e.target.dataset.theme;
    activateTheme(theme);
    displayCurrentTheme(e.target.textContent);
  });

  // Set menu selection to current theme
  activateTheme(state.themes);
  const theme = state.themes;
  const themeUppercase = theme.charAt(0).toUpperCase() + theme.slice(1);
  displayCurrentTheme(themeUppercase);
}

/** Function to highlight notes.
 * @author Revan
 */
function highlightNotes() {
  let notesHighlight = [...document.body.querySelectorAll(".note-preview")];
  notesHighlight.forEach((el) =>
    el.addEventListener("click", (e) => {
      [...el.parentElement.children].forEach((sib) => {
        sib.classList.remove("note-Highlights"),
          el.classList.add("note-Highlights");
        counterText.textContent = "";
      });
    })
  );
}

// /**
//  * @author Revan
//  */
// // Function  > search field under "My Notes" on preview section, to search for notes.
function filterNotes() {
  // select all notes in preview note seciton
  const notePreview = document.querySelectorAll(".note-preview");

  // foreach note check and make sure to convert all letters to lower case.
  notePreview.forEach((note) => {
    if (
      note.innerText
        .toLowerCase()
        .includes(searchNotesInput.value.toLowerCase())
    )
      return (note.style.display = "");
    return (note.style.display = "none");
  });
}

searchNotesInput.addEventListener("input", filterNotes);

searchNotesInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const keyword = searchNotesInput.value;
    searchNotesInput.value = "";
    searchNotesInput.classList.add("hidden");
    changePreviewSectionHeaderText(`Keyword: ${keyword}`);
    previewSectionHeader.classList.remove("hidden");
  }
});

/**
 * @author Revan
 */
// AUTOSAVING
const autoSaving = function () {
  let saveTimeoutId;

  const savingMessage = "Saving...";
  const savedMessage = "All changes saved.";

  // select the autosaving messages and set to default
  document
    .querySelectorAll(".autosave-msg")
    .forEach((el) => (el.textContent = savedMessage));

  // select everything on our textarea and add save function on "change"

  editor.addEventListener("keydown", () => {
    // clear the timeout as the user is typing/editing
    if (saveTimeoutId) window.clearTimeout(saveTimeoutId);

    // here we are storing the timeout id again
    saveTimeoutId = window.setTimeout(() => {
      // change the autosave message to show thats its saving
      autosaveMsgEl.classList.add("autosave-msg-saving");
      autosaveMsgEl.textContent = savingMessage;

      // save the changes
      saveNote();

      // change the text of saved message back to default
      autosaveMsgEl.classList.remove("autosave-msg-saving");
      setTimeout(() => {
        autosaveMsgEl.textContent = savedMessage;
      }, 500); // message setTimeout
    }, 500); // saveTimeoutId timeout
  });
};

document.addEventListener("DOMContentLoaded", autoSaving);
let leavePage = false;
let setLeavePage = function () {
  leavePage = true;
};

window.onload = function () {
  window.addEventListener("beforeunload", (e) => {
    if (leavePage) {
      return undefined;
    }
    (e || window.event).returnValue = autoSaving();
  });
};

templateModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("template-empty"));
  if (e.target.classList.contains("template-resume")) {
    quill.setContents(resumeTemplate);
    templateModal.classList.toggle("hidden");
  }

  if (e.target.classList.contains("template-recipe")) {
    quill.setContents(recipeTemplate);
    templateModal.classList.toggle("hidden");
  }
  if (e.target.classList.contains("template-letter")) {
    quill.setContents(letterTemplate);
  }
  templateModal.classList.toggle("hidden", { passive: true });
});

const deleteNote = function (id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  const index = getNoteIndexByID(id);
  state.savedNotes.splice(index, 1);
  setLocalStorage(state);
  // const note = document.querySelector(".note-preview");
  // note.parentNode.removeChild(note);
  renderPreview(state.savedNotes);

  if (state.savedNotes.length >= 1) {
    renderNote(state.savedNotes[0].id);
    saveNote();
  }
  if (state.savedNotes < 1) createNewNote();
};

const overallStats = document.querySelector(
  ".stats-selection-Overall_statistics"
);

statsListMenu.addEventListener("click", (e) => {
  // Toggle words counter and stats section container.
  if (
    e.target
      .closest(".settings-submenu-item")
      .classList.contains("settings-submenu-item-word-count")
  ) {
    wordCountBtn.classList.toggle("hidden");
    wordCountToggleIcons.forEach((el) => {
      el.classList.toggle("hidden");
    });
  }

  if (e.target.classList.contains("settings-submenu-item-overall-statistics")) {
    if (screen.width <= 600) toggleSettings();
    noteCreationSection.classList.add("hidden");

    // Create a new element to hold the pop-up module
    const notePreview = document.querySelectorAll(".note-preview");

    const popup = document.createElement("div");
    const closeGraph = document.createElement("button");
    const container = document.querySelector(".container");

    // Set the pop-up module's class to 'popup' to apply styling
    popup.className = "popup";

    // close button
    closeGraph.className = "closeGraph";
    closeGraph.textContent = "Close";

    // Create the graph element
    const graph = document.createElement("canvas");

    // Set the graph's ID to 'graph'
    graph.id = "graph";

    // Add the graph to the pop-up module
    popup.appendChild(graph);
    popup.appendChild(closeGraph);
    popup.style.width = `${window.innerWidth * 0.5}px`;
    popup.style.height = `${window.innerWidth * 0.5}px`;
    // Add the pop-up module to the page
    container.appendChild(popup);
    // Create the data for the graph
    const data = {
      labels: ["Notes", "Tags", "Hours Spent", "Minutes"],

      datasets: [
        {
          label: "Total Used",
          data: [
            notePreview.length,
            state.userTags.length,
            Math.floor(timeSpent / 3600),
            Math.trunc(Math.floor(timeSpent % 3600) / 60),
          ],
          backgroundColor: ["#ff6384", "#36a2eb", "#4b0082", "#32cd32"],
        },
      ],
    };

    // Create the graph using the Chart.js library
    const ctx = document.getElementById("graph").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: data,
    });
    closeGraph.addEventListener("click", () => {
      popup.remove("hidden");
      noteCreationSection.classList.remove("hidden");
    });
  }
});

if (localStorage.getItem("timeSpent")) {
  timeSpent = localStorage.getItem("timeSpent");
}

function checkTime() {
  timeSpent++;
  localStorage.setItem("timeSpent", timeSpent);
}

setInterval(checkTime, 1000);
