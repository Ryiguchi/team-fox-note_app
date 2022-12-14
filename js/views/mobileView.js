"use strict";
import View from "./View.js";
import sidebarView from "./sidebarView.js";
import toolbarView from "./toolbarView.js";
import previewView from "./previewView.js";
import settingsView from "./settingsView.js";
import noteView from "./noteView.js";

export class MobileView extends View {
  mobileHeader = document.querySelector(".mobile-header");
  burger = document.querySelector(".ph-list");
  btnCaretToolbarContainer = document.querySelector(".caret-container-toolbar");
  caretsMobileToolbar = document.querySelectorAll(".caret-mobile-toolbar");
  caretDownMobile = document.querySelector(".caret-down-mobile");
  caretUpMobile = document.querySelector(".caret-up-mobile");

  displayMobileView() {
    sidebarView.overlaySidebar.classList.remove("hidden");
    this.mobileHeader.classList.remove("hidden");
    toolbarView.toolbar.classList.add("hidden");
  }

  closeWelcomeScreenMobile() {
    this.mobileHeader.classList.remove("hidden");
    toolbarView.toolbar.classList.toggle("hidden");
  }

  displayMobileView() {
    this.mobileHeader.classList.remove("hidden");
    sidebarView.sidebar.classList.add("hidden");
    previewView.previewSectionAll.classList.add("hidden");
    toolbarView.toolbar.classList.add("hidden");
    settingsView.settingsSection.classList.add("hidden");
    noteView.noteCreationSection.classList.remove("hidden");
    this.caretDownMobile.classList.remove("hidden");
    this.caretUpMobile.classList.add("hidden");
    sidebarView.overlaySidebar.classList.add("hidden");
  }

  openSidebar() {}

  displayTabView() {
    this.mobileHeader.classList.add("hidden");
    sidebarView.sidebar.classList.remove("hidden");
    previewView.previewSectionAll.classList.add("hidden");
    toolbarView.toolbar.classList.remove("hidden");
  }

  displayDesktopView() {
    this.mobileHeader.classList.add("hidden");
    sidebarView.sidebar.classList.remove("hidden");
    previewView.previewSectionAll.classList.remove("hidden");
    toolbarView.toolbar.classList.remove("hidden");
  }

  // HANDLERS

  addHandlerToggleMobileSidebar(handler) {
    [this.burger, sidebarView.overlaySidebar].forEach((el) => {
      el.addEventListener("click", handler);
    });
  }

  addHandlerBtnCaretToolbarContainer(handler) {
    this.btnCaretToolbarContainer.addEventListener("click", handler);
  }

  addHandlerWindowResize(handler) {
    window.addEventListener("resize", handler);
  }
}

export default new MobileView();
