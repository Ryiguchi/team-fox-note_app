"use strict";

// For the Quill library
let quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: "#toolbar",
  },
  placeholder: "Start typing here ...",
});

// SELECTORS ////////////////////////////////////
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
const phStarIconToolbar = document.querySelector("#custom-button .ph-star");
const phStarIconToolbarActive = document.querySelector(
  "#custom-button .ph-star-fill"
);
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
const btnCaretSidebar = document.querySelector(".caret-contanier");
const btnCaretLeftSidebar = document.querySelector(".ph-caret-double-left");
const btnCaretRightSidebar = document.querySelector(".ph-caret-double-right");
const customTagInputEl = document.querySelector(".custom-tag-list-item");
const customTagEl = document.querySelector(".tag-custom");
const customTagBtn = document.querySelector(".custom-tag-btn");
const customTagInput = document.querySelector(".input-custom-tag");
const overlay = document.querySelector(".overlay");
const inputTitle = document.querySelector(".input-title");
const addNewNoteBtn = document.querySelector(".icon-plus");
const customSelect = document.querySelector(".custom-select");

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

// const wait = function (handler, sec) {
//   setTimeout(handler, sec * 1000);
// };

// LOCAL STORAGE /////////////////////////////////////////
/**
 * This function saves data to Local Storage
 * @param {Object | Object[]} data Pass in the state object to be saved for the user (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 * @
 */
const setLocalStorage = function (data) {
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

/**
 *  This function takes a note object that already has DELTA data and creates a preview of the text. If the note doesn't have a title then one will be created. If it does have a title then the title will be preserved.
 * @param {Object} note - the note object with DELTA data
 */
const saveNoteData = function (note) {
  if (inputTitle.value === "Untitled note") console.log("hi");
  note.title = note.delta.ops[0].insert.slice(0, 25);
  if (inputTitle.value !== "Untitled note") {
    note.title = inputTitle.value;
  }
  note.preview = note.delta.ops[0].insert.slice(0, 150);
  note.saved = true;
};

/**
 * This function takes the content of the current note and updates the content and title in the 'state'.
 */
const updateNote = function () {
  state.savedNotes[0].delta = quill.getContents();
  state.savedNotes[0].title = inputTitle.value;
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

/**
 *  this function toggles the 'bookmarked' value of the passed in note when the user presses the star icon
 * @param {Number} id the ID number of the note
 */
const toggleBookmark = function (id) {
  const note = state.savedNotes[getNoteIndexByID(id)];
  note.bookmarked = note.bookmarked ? false : true;
  renderPreview(state.savedNotes, "My Notes");
  setLocalStorage();
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
  const index = getNoteIndexByID(id);
  const note = state.savedNotes[index];
  quill.setContents(note.delta.ops);
  setTitle(note);
  updateTagListToolbar(note);
  state.savedNotes.splice(index, 1);
  state.savedNotes.unshift(note);
};

/**
 * This function toggles the star icon in the sidebar between filled and not filled
 */
const toggleStarHeader = function () {
  btnBookmarksNotActive.classList.toggle("hidden");
  btnBookmarksActive.classList.toggle("hidden");
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
  previewSection.classList.toggle("hidden");
  btnCaretLeftSidebar.classList.toggle("hidden");
  btnCaretRightSidebar.classList.toggle("hidden");
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
  if (!savedState) toggleWelcome();
  if (savedState) {
    updateState(savedState);
    renderPreview(state.savedNotes, "My Notes");
  }
  renderTagList(tagListSidebar);
  renderTagList(tagListToolbar);
  createNewNote();
  initThemeSelector();
};

/**
 * Shows or hides the Welcome screen
 * @author Ryan Iguchi
 */
const toggleWelcome = function () {
  welcomePopUp.classList.toggle("hidden");
  toolbar.classList.toggle("hidden");
  noteSection.classList.toggle("hidden");
  previewSection.classList.toggle("hidden");
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
    /**
     * @author Aman
     */
    // save note onClick tags
    saveNote();
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
  /**
   * @author alexander
   */
  // 4.clear input field, switch back to the "custom" label.
  customTagInput.value = "";
  toggleCustomTagListItems();
  saveNote();
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

/**
 * marks the input field so you can write your title.
 * @author Aman Said
 */
inputTitle.addEventListener("focus", () => {
  inputTitle.select();
});

btnCaretSidebar.addEventListener("click", () => {
  togglePreviewSection();
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
  themeSelect.addEventListener("change", () => {
    activateTheme(themeSelect.value);
  });

  // Set menu selection to current theme
  themeSelect.value = state.themes;
  activateTheme(state.themes);
}
