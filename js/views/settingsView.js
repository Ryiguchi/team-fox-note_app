"use strict";
import View from "./View.js";
import noteView from "./noteView.js";
import previewView from "./previewView.js";
import sidebarView from "./sidebarView.js";

export class SettingsView extends View {
  settingsSection = document.querySelector(".settings-section");
  themeSelect = document.querySelector(".themeSelect");
  themeStylesLink = document.querySelector("#themeStylesLink");
  themeTitle = document.querySelector(".current-theme-title");
  _btnSettings = document.querySelector(".settings-icon-sidebar");
  _btnCloseSettings = document.querySelector(".close-settings-icon");
  statsListMenu = document.querySelector(".stats-list-sidebar");
  wordCountToggleIcons = document.querySelectorAll(".word-count-toggle");
  popup = document.querySelector(".popup");
  graph = document.getElementById("graph");
  closeGraph = document.querySelector(".closeGraph");
  settingsItemTheme = document.querySelector(".settings-item-theme");
  settingsItemStats = document.querySelector(".settings-list-stats");
  statsListMenu = document.querySelector(".stats-list-sidebar");
  wordCountBtn = document.querySelector(".word-count-box");

  toggleSettings(state) {
    console.log("3");
    this.settingsSection.classList.toggle("hidden");
    if (
      screen.width > 600 &&
      !this.settingsSection.classList.contains("hidden")
    )
      previewView.previewSectionAll.classList.add("hidden");
    else if (
      screen.width > 600 &&
      state.previewSectionOpen === true &&
      previewView.previewSectionAll.classList.contains("hidden")
    )
      previewView.previewSectionAll.classList.remove("hidden");
    else if (
      screen.width <= 600 &&
      !this.settingsSection.classList.contains("hidden")
    ) {
      noteView.noteCreationSection.classList.add("hidden");
      previewView.previewSectionAll.classList.add("hidden");
    } else if (
      screen.width <= 600 &&
      this.settingsSection.classList.contains("hidden")
    ) {
      noteView.noteCreationSection.classList.remove("hidden");
      previewView.previewSectionAll.classList.add("hidden");
      sidebarView.overlaySidebar.classList.add("hidden");
    }
    document
      .querySelectorAll(".settings-menu")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(".settings-section .ph-caret-down-bold")
      .forEach((el) => el.classList.remove("hidden"));
    document
      .querySelectorAll(".settings-section .ph-caret-up-bold")
      .forEach((el) => el.classList.add("hidden"));
  }

  toggleStatisticsList(list) {
    document.querySelector(`.${list}-list-sidebar`).classList.toggle("hidden");
    document
      .querySelectorAll(`.settings-${list}-menu-caret`)
      .forEach((el) => el.classList.toggle("hidden"));
  }

  /** Dropdown menu for the theme selections.
   * @author Revan Toma
   */
  initThemeSelector(themes) {
    this.themeStylesLink.setAttribute("href", `themes/${themes}.css`);
    // Set menu selection to current theme
    const themeUppercase = themes.charAt(0).toUpperCase() + themes.slice(1);
    this.themeTitle.textContent = `Theme: ${themeUppercase}`;
  }

  getNoteIndexByID(id) {
    return state.savedNotes.findIndex((note) => note.id === id);
  }

  toggleWordCount() {
    this.wordCountBtn.classList.toggle("hidden");
    this.wordCountToggleIcons.forEach((el) => {
      el.classList.toggle("hidden");
    });
  }

  setCounterText() {
    const textArea = noteView.editor.innerText;
    noteView.counterText.textContent = `${noteView.countWords(textArea)}`;
  }

  setPopupSize() {
    this.popup.style.width = `${window.innerWidth * 0.5}px`;
    this.popup.style.height = `${window.innerWidth * 0.5}px`;
  }

  togglePopup() {
    this.popup.classList.toggle("hidden");
    noteView.noteCreationSection.classList.toggle("hidden");
  }

  // HANDLERS

  addHandlerBtnSettings(handler) {
    [this._btnSettings, this._btnCloseSettings].forEach((el) => {
      el.addEventListener("click", handler);
    });
  }

  addHandlerSettingsItem(handler) {
    this.settingsItemTheme.addEventListener("click", () => handler("themes"));
    this.settingsItemStats.addEventListener("click", () => handler("stats"));
  }

  addHandlerThemeSelect(handler) {
    this.themeSelect.addEventListener("click", handler);
  }

  addHandlerStatsListMenu(handler) {
    this.statsListMenu.addEventListener("click", handler);
  }

  addHandlerCloseGraph() {
    this.closeGraph.addEventListener("click", this.togglePopup);
  }
}

export default new SettingsView();
