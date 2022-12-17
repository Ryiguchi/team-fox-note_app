"use strict";

import previewView from "./views/previewView.js";
import sidebarView from "./views/sidebarView.js";
import noteView from "./views/noteView.js";
import settingsView from "./views/settingsView.js";
import welcomeView from "./views/welcomeView.js";
import { AUTOSAVE_SEC } from "./config.js";
import * as model from "./model.js";
import { letterTemplate, recipeTemplate, resumeTemplate } from "./templates.js";
import { fontArray } from "./init.js";
import titleView from "./views/titleView.js";
// counter for the timer of time spent.
let saveTimeoutId;
// For the markdown Export
const turndownService = new TurndownService();
// For the Quill library

const hyphenate = function (str) {
  return str.split(" ").join("-");
};
const fontArrayHyphen = fontArray?.map((font) => hyphenate(font));

if (fontArrayHyphen) {
  let Font = Quill.import("formats/font");
  Font.whitelist = [
    "inconsolata",
    "roboto",
    "mirza",
    "poppins",
    ...fontArrayHyphen,
  ];
  Quill.register(Font, true);
}

let quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: "#toolbar",
  },
  placeholder: "Start typing here ...",
});

function renderAllTagLists() {
  const tagListFilter = document.querySelector(".tag-list-filter");
  settingsView.renderTagList(model.state.userTags);
  titleView.renderTagMenu(model.state.userTags);
  sidebarView.renderTagList(tagListFilter, model.state.userTags);
}

// UI STATES

const displayMobileView = function () {
  sidebarView.mobileHeader.classList.remove("hidden");
  sidebarView.sidebar.classList.add("hidden");
  previewView.previewSectionAll.classList.add("hidden");
  sidebarView.toolbar.classList.add("hidden");
  settingsView.settingsSection.classList.add("hidden");
  noteView.noteCreationSection.classList.remove("hidden");
  sidebarView.caretDownMobile.classList.remove("hidden");
  sidebarView.caretUpMobile.classList.add("hidden");
  sidebarView.overlaySidebar.classList.add("hidden");
};

// WELCOME VIEW /////////////////////////////////
function toggleWelcome() {
  noteView.noteCreationSection.classList.toggle("hidden");
  sidebarView.toolbar.classList.toggle("hidden");
  previewView.previewSectionAll.classList.toggle("hidden");
  noteView.stickyBox.classList.toggle("hidden");
  welcomeView.togglePopup();
  if (screen.width <= 450) sidebarView.sidebar.classList.add("hidden");
}

const controlWelcomeScreen = function () {
  model.toggleStateWelcomeScreen();
  model.setLocalStorage(model.state);
  toggleWelcome();
  if (screen.width <= 600) previewView.togglePreviewSection();
  if (screen.width <= 450) displayMobileView();
};

// SIDEBAR VIEW ////////////////////////////////

const controlNotebookIcon = function () {
  const action = previewView.previewSectionAll.classList.contains("hidden")
    ? "open"
    : "close";

  // Mobile
  if (screen.width <= 450 && action === "close") sidebarView.toggleSidebar();

  // Tab
  if (screen.width <= 600) {
    action === "close"
      ? noteView.noteCreationSection.classList.remove("hidden")
      : noteView.noteCreationSection.classList.add("hidden");
  }

  previewView.togglePreviewSection(model.state);

  model.state.previewSectionOpen =
    previewView.previewSectionAll.classList.contains("hidden") ? false : true;
};

const controlToggleSidebar = function (open) {
  if (open === true) {
    previewView.previewSectionAll.classList.add("hidden");
  }
  if (open === false) {
    previewView.previewSectionAll.classList.remove("hidden");
    previewView.renderPreview(
      model.state.currentPreview,
      model.state.currentPreviewTitle
    );
  }
};

const controlRenderNote = function (id) {
  const index = model.getNoteIndexByID(id);
  const note = model.state.savedNotes[index];
  model.setDisplayingOnNote(index);
  noteView.renderNote(note, quill);
  titleView.updateCurrentNoteBookmark(note);
  model.moveNoteToFront(index, note);
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
};

const controlDeleteNote = function (id) {
  model.deleteNoteFromState(id);
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );

  if (model.state.savedNotes.length >= 1) {
    controlRenderNote(model.state.savedNotes[0].id);
    model.saveNote(quill.getContents(), noteView.inputTitle.value);
  }
  if (model.state.savedNotes < 1) noteView.createNewNote(quill);
};

const controlToggleBookmark = function (id) {
  model.toggleBookmarkState(id);
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
  model.setLocalStorage(model.state);
  model.state.savedNotes[0].bookmarked
    ? titleView.toggleStar("add")
    : titleView.toggleStar("remove");
};

const controlDisplayNote = function (id) {
  controlRenderNote(id);
  if (screen.width <= 600) previewView.togglePreviewSection();
  if (screen.width <= 450) sidebarView.toggleSidebar();
};

const controlFilterMenu = function (filterType) {
  if (filterType === "all") previewView.displayAllNotes(model.state);
  if (filterType === "starred") previewView.displayStarredNotes(model.state);
  if (filterType === "tag") previewView.displayTagSelection();
  if (filterType === "keyword")
    previewView.displaySearchNotesInput(model.state);
  if (filterType === "ascending")
    previewView.displayByDate("ascending", model.state);
  if (filterType === "descending")
    previewView.displayByDate("descending", model.state);
};

const controlFilterByTag = function (chosenTag) {
  if (chosenTag === "tags") {
    const allNotesWithTags = model.state.savedNotes.filter(
      (note) => note.tags.length > 0
    );
    previewView.renderPreview(allNotesWithTags, "All Notes with Tags");
    model.setCurrentPreviewToState(allNotesWithTags, "All Notes with Tags");
  }

  if (chosenTag !== "tags") {
    const notesWithChosenTag = model.state.savedNotes.filter((note) =>
      note.tags.includes(chosenTag)
    );
    const tag = `Tag: ${chosenTag.replaceAll("_", " ")}`;
    previewView.renderPreview(notesWithChosenTag, tag);
    model.setCurrentPreviewToState(notesWithChosenTag, tag);
  }
};

const controlOverlayFilterKeyword = function () {
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
};

const controlSearchNotesInput = function () {
  return model.state.savedNotes.filter((note) =>
    model
      .getPreview(note)
      .toLowerCase()
      .includes(previewView.getSearchNotesInput())
  );
};

// SETTINGS VIEW /////////////////////////////////
// opens settings menu
const controlToggleSettings = function () {
  const action = settingsView.settingsSection.classList.contains("hidden")
    ? "open"
    : "close";
  const preview = model.state.previewSectionOpen ? "open" : "closed";

  if (action === "open") previewView.previewSectionAll.classList.add("hidden");

  if (action === "open" && screen.width <= 600)
    noteView.noteCreationSection.classList.add("hidden");

  if (action === "close" && screen.width > 600 && preview === "open")
    previewView.previewSectionAll.classList.remove("hidden");

  if (action === "close" && screen.width <= 600)
    noteView.noteCreationSection.classList.remove("hidden");

  if (action === "close" && screen.width <= 450) sidebarView.toggleSidebar();

  settingsView.toggleSettingsSection();
};

const controlToggleWordCount = function () {
  noteView.setCounterText();
};

function togglePopup() {
  settingsView.popup.classList.toggle("hidden");
  noteView.noteCreationSection.classList.toggle("hidden");
}

const controlOverallStatistics = function () {
  if (screen.width <= 600) settingsView.toggleSettings(model.state);
  const data = model.getGraphData();
  togglePopup();
  settingsView.renderChart(data);
};

const controlCloseGraph = function () {
  togglePopup();
};

const controlAddFont = function (font) {
  if (!model.fontData.items.map((item) => item.family).includes(font)) {
    settingsView.fontsInput.value = "- Font not found -";
    return;
  }
  this.fontsInput.value = "";
  model.addCustomFontToState(font);
  model.setLocalStorage(model.state);
  location.reload();
};

const controlRemoveFont = function (font) {
  model.removeCustomFontToState(font);
  model.setLocalStorage(model.state);
  location.reload();
};

const controlAddCustomTag = function (customTag) {
  if (screen.width <= 600) {
    displayMobileView();
  }

  // 1. add tag to state
  if (model.state.userTags.includes(customTag)) return;
  model.addCustomTagToState(customTag);
  // 2 rerender tag lists
  model.toggleTagToNote(customTag);
  renderAllTagLists();
  model.setLocalStorage(model.state);
  controlRenderNote(model.state.savedNotes[0].id);
};

const controlRemoveTagFromState = function (tag) {
  model.removeTagFromState(tag);
  model.removeTagFromNotes(tag);
  renderAllTagLists();
  noteView.renderNote(model.state.savedNotes[0], quill);
  model.setLocalStorage(model.state);
};

// TOOLBAR VIEW //////////////////////////////////

const controlToggleTitleBookmark = function () {
  model.toggleNoteBookmarkInState(model.state.savedNotes[0]);
  model.saveNote(quill.getContents(), noteView.inputTitle.value);
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
};

// NOTE VIEW //////////////////////////////////////

const controlMarkdown = function (action, editorValue) {
  if (action === "export") {
    quill.setContents([{ insert: turndownService.turndown(editorValue) }]);
    model.saveNote(quill.getContents(), noteView.inputTitle.value);
  }

  if (action === "import") {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(editorValue);
    quill.setContents([{ insert: html }]);
    model.saveNote(quill.getContents());
  }
};

function addRemoveTagFromNote(tag) {
  model.toggleTagToNote(tag);
  titleView.renderNoteTags(model.state.savedNotes[0].tags);
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
}

const controlTagMenuCustom = function () {
  settingsView.toggleSettings(model.state);
  settingsView.toggleStatisticsList("tags", "remove");
  settingsView.customTagInputFocus();
  if (screen.width <= 600) mobileView.toggleSidebar("open");
};

const controlAutosave = function () {
  // clear the timeout as the user is typing/editing
  if (saveTimeoutId) window.clearTimeout(saveTimeoutId);
  // here we are storing the timeout id again
  saveTimeoutId = window.setTimeout(() => {
    noteView.changeAutoSaveMessage("Saving");
    noteView.autosaveMsgEl.classList.remove("autosave-msg-saving");
    model.saveNote(quill.getContents(), noteView.inputTitle.value);
    previewView.renderPreview(model.state.savedNotes);
    noteView.autosaveMsgEl.classList.add("autosave-msg-saving");
    setTimeout(() => {
      noteView.changeAutoSaveMessage("Saved");
    }, AUTOSAVE_SEC * 1000); // message setTimeout
  }, AUTOSAVE_SEC * 1000); // saveTimeoutId timeout
};

const controlTemplateModal = function (template) {
  if (template === "resume") quill.setContents(resumeTemplate);

  if (template === "recipe") quill.setContents(recipeTemplate);

  if (template === "letter") quill.setContents(letterTemplate);

  if (template === "empty") {
    titleView.toggleStar("remove");
    titleView.inputTitle.value = "";
    quill.setContents();
    model.addNewNoteToState();
  }
  model.removeDisplayingOnNotes();
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
};

// MOBILE VIEW ////////////////////////////////////

// INITIALIZATION ///////////////////

const init = function () {
  // Welcome screen
  if (model.state.welcomeScreen) toggleWelcome();

  // Different layouts for different screen sizes
  if (!model.state.welcomeScreen && screen.width <= 600) {
    previewView.togglePreviewSection();
    model.state.previewSectionOpen = false;
  }

  if (!model.state.welcomeScreen && screen.width <= 450) displayMobileView();

  // Setting the initial state
  previewView.renderPreview(model.state.savedNotes, "All Notes");
  if (model.state.savedNotes[0]?.delta)
    controlRenderNote(model.state.savedNotes[0].id);
  if (!model.state.savedNotes[0]) {
    noteView.createNewNote(quill);
    model.addNewNoteToState();
  }

  renderAllTagLists();
  settingsView.renderFontsList(model.fontData.items.map((item) => item.family));
  settingsView.renderMyFontsList(model.state.fonts.sort());
  model.setPreviewSectionState(screen.width);
  model.setLocalStorage(model.state);

  // HANDLERS

  welcomeView.addHandlerCloseWelcomeScreen(controlWelcomeScreen);

  sidebarView.addHandlerNotebookIcon(controlNotebookIcon);
  sidebarView.addHandlerToggleSidebar(controlToggleSidebar);
  sidebarView.addHandlerToggleSettingsSection(controlToggleSettings);

  previewView.addHandlerDeleteNote(controlDeleteNote);
  previewView.addHandlerToggleBookmark(controlToggleBookmark);
  previewView.addHandlerDisplayNote(controlDisplayNote);
  previewView.addHandlerFilterMenuMain(controlFilterMenu);
  previewView.addHandlerFilterByTag(controlFilterByTag);
  previewView.addHandlerOverlayFilterKeyword(controlOverlayFilterKeyword);
  previewView.addHandlerSearchNotesInput(controlSearchNotesInput);

  settingsView.addHandlerBtnCloseSettings(controlToggleSettings);
  settingsView.addHandlerToggleWordCount(controlToggleWordCount);
  settingsView.addHandlerOverallStatistics(controlOverallStatistics);
  settingsView.addHandlerCloseGraph(controlCloseGraph);
  settingsView.addHandlerAddCustomTag(controlAddCustomTag);
  settingsView.addHandlerRemoveTagFromState(controlRemoveTagFromState);
  settingsView.addHandlerAddFont(controlAddFont);
  settingsView.addHandlerRemoveFont(controlRemoveFont);

  titleView.addHandlerToggleBookmark(controlToggleTitleBookmark);
  titleView.addHandlerTagMenuCustom(controlTagMenuCustom);
  titleView.addHandlerTagMenuItems(addRemoveTagFromNote);
  titleView.addHandlerRemoveTag(addRemoveTagFromNote);

  noteView.addHandlerTemplateModal(controlTemplateModal);
  noteView.addHandlerMarkdown(controlMarkdown);
  noteView.addHandlerAutosave(controlAutosave);
};

init();
