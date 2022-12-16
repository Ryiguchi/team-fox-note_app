"use strict";

import previewView from "./views/previewView.js";
import sidebarView from "./views/sidebarView.js";
import noteView from "./views/noteView.js";
import toolbarView from "./views/toolbarView.js";
import mobileView from "./views/mobileView.js";
import settingsView from "./views/settingsView.js";
import welcomeView from "./views/welcomeView.js";
import { AUTOSAVE_SEC } from "./config.js";
import * as model from "./model.js";
import { letterTemplate, recipeTemplate, resumeTemplate } from "./templates.js";
import { fontArray } from "./init.js";
// counter for the timer of time spent.
let timeSpent = 0;
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
  toolbarView.renderTagList(settingsView.myTagsList, model.state.userTags);
  toolbarView.renderTagList(noteView.tagListTitleAll, model.state.userTags);
  sidebarView.renderTagList(tagListFilter, model.state.userTags);
}

// WELCOME VIEW /////////////////////////////////

const controlWelcomeScreen = function () {
  model.toggleStateWelcomeScreen();
  model.setLocalStorage(model.state);
  if (screen.width <= 600) previewView.togglePreviewSection();
  if (screen.width <= 450) mobileView.displayMobileView();
};

// SIDEBAR VIEW ////////////////////////////////

const controlSidebarCaret = function (e) {
  if (
    e.target.classList.contains("ph-caret-double-right") &&
    screen.width <= 600
  ) {
    noteView.noteCreationSection.classList.add("hidden");
    if (screen.width <= 450)
      sidebarView.overlaySidebar.classList.remove("hidden");
  }
  if (e.target.classList.contains("ph-caret-double-left"))
    noteView.noteCreationSection.classList.remove("hidden");

  previewView.togglePreviewSection(model.state);
};

// PREVIEW VIEW ///////////////////////////////

const controlRenderNote = function (id) {
  const index = model.getNoteIndexByID(id);
  const note = model.state.savedNotes[index];
  noteView.renderNote(note, quill);
  toolbarView.updateCurrentNoteBookmark(note);
  model.moveNoteToFront(index, note);
};

const controlPreviewSection = function (e) {
  // return if clicked on search field, header, or empty spacae, or filter
  if (
    e.target.classList.contains("searchNotesInput") ||
    e.target.classList.contains("preview-section-header") ||
    e.target.classList.contains("notes-preview-section")
  )
    return;

  const noteID = e.target.closest(".note-preview").dataset.id;

  // if clicked on the star
  if (e.target.classList.contains("star-icon-preview")) {
    model.toggleBookmarkState(noteID);
    previewView.renderPreview(
      model.state.currentPreview,
      model.state.currentPreviewTitle
    );
    model.setLocalStorage(model.state);
    // toggle ph-star-fill on toolbar if the active note is bookmarked.
    model.state.savedNotes[0].bookmarked
      ? toolbarView.toggleStarHeaderToolbar("add")
      : toolbarView.toggleStarHeaderToolbar("remove");
  }

  if (e.target.classList.contains("ph-trash-bold")) {
    // if clicked on delete note button
    if (!confirm("Are you sure you want to delete this note?")) return;
    model.deleteNoteFromState(noteID);
    previewView.renderPreview(
      model.state.currentPreview,
      model.state.currentPreviewTitle
    );

    if (model.state.savedNotes.length >= 1) {
      controlRenderNote(model.state.savedNotes[0].id);
      model.saveNote(quill.getContents(), noteView.inputTitle.value);
    }
    if (model.state.savedNotes < 1) noteView.createNewNote();
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
    controlRenderNote(noteID);
    if (screen.width <= 600) previewView.togglePreviewSection();
    if (screen.width <= 450) sidebarView.toggleSidebar();
  }
};

const controlFilterMenu = function (e) {
  const filterType = e.target.closest("li").dataset.type;
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

const controlFilterByTag = function (e) {
  const chosenTag = e.target
    .closest(".tag-selection")
    .dataset.tag.replaceAll("_", " ");

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

const controlSearchNotesInputKeydown = function (e) {
  if (e.key === "Enter") previewView.setPreviewHeadingToKeyword();
};

// SETTINGS VIEW /////////////////////////////////
// opens settings menu
const controlBtnSettings = function () {
  settingsView.toggleSettings(model.state);
};

const controlSettingsItemClick = function (e) {
  if (!e.target.closest(".settings-item")) return;
  const list = e.target.closest(".settings-item").dataset.list;
  settingsView.toggleStatisticsList(list);
  if (list === "tags") settingsView.customTagInputFocus();
  if (list === "fonts") settingsView.googleFontsInputFocus();
};

const controlStatsListMenu = function (e) {
  // Toggle words counter and stats section container.
  if (
    e.target
      .closest(".settings-submenu-item")
      .classList.contains("settings-submenu-item-word-count")
  ) {
    settingsView.toggleWordCount();
    settingsView.setCounterText();
  }

  if (e.target.classList.contains("settings-submenu-item-overall-statistics")) {
    if (screen.width <= 600) settingsView.toggleSettings(model.state);
    settingsView.togglePopup();
    settingsView.setPopupSize();
    const data = model.getGraphData();
    // Create the graph using the Chart.js library
    const ctx = settingsView.graph.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: data,
    });
  }
};

const controlThemeSelect = function (e) {
  const theme = e.target.dataset.theme;
  settingsView.initThemeSelector(theme);
};

const controlFontSelect = function (e) {
  if (e.key === "Enter") {
    const font = settingsView.getCustomFontValue();
    settingsView.fontsInput.value = "";
    model.addCustomFontToState(font);
    model.setLocalStorage(model.state);
    location.reload();
  }
};

const controlRemoveFont = function (e) {
  const font = e.target.closest(".my-fonts-list-item").dataset.font;
  model.removeCustomFontToState(font);
  model.setLocalStorage(model.state);
  location.reload();
};

const controlEnterCustomTag = function (e) {
  if (e.key === "Enter") {
    const customTag = settingsView.customTagInput.value;
    if (!customTag || customTag === "") {
      return;
    }
    settingsView.customTagInput.value = "";

    // 1. add tag to state
    if (model.state.userTags.includes(customTag)) return;
    model.addCustomTagToState(customTag);
    // 2 rerender tag lists
    model.toggleTagToNote(customTag);
    renderAllTagLists();
    // toolbarView.renderTagList(noteView.tagListTitleAll, model.state.userTags);
    // const tagListFilter = document.querySelector(".tag-list-filter");
    // sidebarView.renderTagList(tagListFilter, model.state.userTags);
    model.setLocalStorage(model.state);
    controlRenderNote(model.state.savedNotes[0].id);
  }
};

const controlRemoveTagFromState = function (e) {
  if (!e.target.classList.contains("remove-font-btn-settings")) return;
  const tag = e.target.closest(".tag-selection").dataset.tag;
  model.removeTagFromState(tag);
  model.removeTagFromNotes(tag);
  renderAllTagLists();
  noteView.renderNote(model.state.savedNotes[0], quill);
  model.setLocalStorage(model.state);
};

// TOOLBAR VIEW //////////////////////////////////

const controlBookmarkToolbar = function (e) {
  model.toggleNoteBookmarkInState(model.state.savedNotes[0]);
  model.saveNote(quill.getContents(), noteView.inputTitle.value);
  toolbarView.toggleStarHeaderToolbar();
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
};

const controlbtnTagToolbar = function (e) {
  if (e.target.classList.contains("tag-icon-toolbar")) {
    toolbarView.toggleTagMenuNoteTitle();
  }
};

// NOTE VIEW //////////////////////////////////////

const controlMarkdownExport = function () {
  const editorValue = noteView.getEditorText();
  quill.setContents([{ insert: turndownService.turndown(editorValue) }]);
  model.saveNote(quill.getContents(), noteView.inputTitle.value);
};

const controlMarkdownImport = function () {
  const editorValue = noteView.getEditorText();
  const converter = new showdown.Converter();
  const html = converter.makeHtml(editorValue);
  quill.setContents([{ insert: html }]);
  model.saveNote(quill.getContents());
};

function addRemoveTagFromNote(tag) {
  model.toggleTagToNote(tag);
  noteView.renderNoteTags(model.state.savedNotes[0].tags);
  previewView.renderPreview(
    model.state.currentPreview,
    model.state.currentPreviewTitle
  );
}

const controlRemoveTagIcon = function (e) {
  if (e.target.classList.contains("remove-tag-icon")) {
    const tag = e.target.closest(".tag-selection").dataset.tag;
    addRemoveTagFromNote(tag);
  }
};

const controlTagIconsTitleList = function (e) {
  const tag = e.target.closest(".tag-selection").dataset.tag;
  if (tag === "custom") {
    noteView.toggleOverlay();
    toolbarView.toggleTagMenuNoteTitle();
    settingsView.toggleSettings(model.state);
    settingsView.toggleStatisticsList("tags", "remove");
    settingsView.customTagInputFocus();
    return;
  }
  addRemoveTagFromNote(tag);
  toolbarView.toggleTagMenuNoteTitle();
};

// /////////////////////////////////BUG//////////////////////////////
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

const controlTemplateModal = function (e) {
  if (e.target.classList.contains("template-resume"))
    quill.setContents(resumeTemplate);

  if (e.target.classList.contains("template-recipe"))
    quill.setContents(recipeTemplate);

  if (e.target.classList.contains("template-letter"))
    quill.setContents(letterTemplate);

  if (e.target.classList.contains("template-empty")) {
    toolbarView.toggleStarHeaderToolbar("remove");
    noteView.createNewNote(quill);
    model.addNewNoteToState();
  }
};

const controlOverlay = function () {
  toolbarView.tagMenuToolbar.classList.add("hidden");
  noteView.overlay.classList.add("hidden");
};

// MOBILE VIEW ////////////////////////////////////

const controlToggleMobileSidebar = function () {
  sidebarView.sidebar.classList.contains("hidden")
    ? sidebarView.toggleSidebar()
    : mobileView.displayMobileView();
};

const controlBtnCaretToolbarContainer = function () {
  toolbarView.toolbar.classList.toggle("hidden");
  mobileView.caretsMobileToolbar.forEach((icon) =>
    icon.classList.toggle("hidden")
  );
};

// const controlWindowResize = function () {
//   if (screen.width <= 600 && screen.width > 450) {
//     mobileView.displayTabView();
//   }

//   if (screen.width <= 450) {
//     mobileView.displayMobileView();
//   }

//   if (screen.width > 600) {
//     mobileView.displayDesktopView();
//   }
// };

// INITIALIZATION ///////////////////

const init = function () {
  // Welcome screen
  if (model.state.welcomeScreen && screen.width <= 450) {
    welcomeView.toggleWelcome();
  }

  if (model.state.welcomeScreen && screen.width > 450)
    welcomeView.toggleWelcome();

  // Different layouts for different screen sizes
  if (!model.state.welcomeScreen && screen.width <= 600) {
    previewView.togglePreviewSection();
    model.togglePreviewSectionOpenState();
  }

  if (!model.state.welcomeScreen && screen.width <= 450)
    mobileView.displayMobileView();

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

  sidebarView.addHandlerSidebarCaret(controlSidebarCaret);

  previewView.addHandlerPreviewSection(controlPreviewSection);
  previewView.addHandlerFilterBtn();
  previewView.addHandlerFilterMenuMain(controlFilterMenu);
  previewView.addHandlerFilterByTag(controlFilterByTag);
  previewView.addHandlerOverlayFilter();
  previewView.addHandlerOverlayFilterTags();
  previewView.addHandlerOverlayFilterKeyword(controlOverlayFilterKeyword);
  previewView.addHandlerSearchNotesInput(controlSearchNotesInput);
  previewView.addHandlerSearchNotesInputKeydown(controlSearchNotesInputKeydown);

  settingsView.addHandlerBtnSettings(controlBtnSettings);
  settingsView.addHandlerSettingsItem(controlSettingsItemClick);
  settingsView.addHandlerStatsListMenu(controlStatsListMenu);
  settingsView.addHandlerCloseGraph();
  settingsView.addHandlerThemeSelect(controlThemeSelect);
  settingsView.addHandlerFontSelect(controlFontSelect);
  settingsView.addHandlerRemoveFont(controlRemoveFont);
  settingsView.addHandlerEnterCustomTag(controlEnterCustomTag);
  settingsView.addHandlerRemoveTagFromState(controlRemoveTagFromState);

  toolbarView.addHandlerBookmarkToolbar(controlBookmarkToolbar);
  toolbarView.addHandlerBtnTagToolbar(controlbtnTagToolbar);

  noteView.addHandlerOpenNewNote();
  noteView.addHandlerEditor();
  noteView.addHandlerInputTitleFocus();
  noteView.addHandlerRemoveTagIcon(controlRemoveTagIcon);
  noteView.addHandlerTagIconsTitleList(controlTagIconsTitleList);
  noteView.addHandlerMarkdownExport(controlMarkdownExport);
  noteView.addHandlerMarkdownImport(controlMarkdownImport);
  noteView.addHandlerAutosave(controlAutosave);
  noteView.addHandlerTemplateModal(controlTemplateModal);
  noteView.addHandlerOverlay(controlOverlay);

  mobileView.addHandlerToggleMobileSidebar(controlToggleMobileSidebar);
  mobileView.addHandlerBtnCaretToolbarContainer(
    controlBtnCaretToolbarContainer
  );
  // mobileView.addHandlerWindowResize(controlWindowResize);
};

init();
