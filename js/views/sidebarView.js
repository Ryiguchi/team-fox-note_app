"use strict";
import View from "./View.js";

class SidebarView extends View {
  btnCaretLeftSidebar = document.querySelector(".ph-caret-double-left");
  btnCaretRightSidebar = document.querySelector(".ph-caret-double-right");
  sidebar = document.querySelector(".side-header");
  overlaySidebar = document.querySelector(".overlay-sidebar");
  tagListSidebar = document.querySelector(".tag-list-sidebar");
  btnCaretSidebar = document.querySelector(".caret-contanier");

  toggleSidebar() {
    this.sidebar.classList.toggle("hidden");
    this.overlaySidebar.classList.toggle("hidden");
  }

  // HANDLERS

  addHandlerSidebarCaret(handler) {
    this.btnCaretSidebar.addEventListener("click", handler);
  }
}

export default new SidebarView();
