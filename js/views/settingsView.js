"use strict";
class SettingsView {
  settingsSection = document.querySelector(".settings-section");
  #settingsMenus = document.querySelectorAll(".settings-menu");
  #caretsDownSettingsection = document.querySelectorAll(
    ".settings-section .ph-caret-down-bold"
  );
  #caretsUpSettingsection = document.querySelectorAll(
    ".settings-section .ph-caret-up-bold"
  );
  #btnCloseSettings = document.querySelector(".close-settings-icon");
  #closeGraph = document.querySelector(".closeGraph");
  #themeStylesLink = document.querySelector("#themeStylesLink");
  #themeTitle = document.querySelector(".current-theme-title");
  #statsListMenu = document.querySelector(".stats-list-sidebar");
  #wordCountToggleIcons = document.querySelectorAll(".word-count-toggle");
  popup = document.querySelector(".popup");
  #graph = document.getElementById("graph");
  #wordCountBtn = document.querySelector(".word-count-box");
  #fontsDataList = document.querySelector(".fonts-search-list");
  fontsInput = document.querySelector(".search-fonts-input");
  #myFontsList = document.querySelector(".my-fonts-list");
  #myTagsList = document.querySelector(".tag-list-sidebar");
  #customTagInput = document.querySelector(".custom-tag-input");

  constructor() {
    this.#addHandlerSettingsItem();
    this.#addHandlerThemeSelect();
  }

  toggleSettingsSection() {
    this.settingsSection.classList.toggle("hidden");
    this.#settingsMenus.forEach((el) => el.classList.add("hidden"));
    this.#caretsDownSettingsection.forEach((el) =>
      el.classList.remove("hidden")
    );
    this.#caretsUpSettingsection.forEach((el) => el.classList.add("hidden"));
  }

  renderTagList(tags) {
    this.#myTagsList.innerHTML = "";
    let markup = "";
    tags?.forEach((tag, i) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      markup += `
        <li class="tag-selection tag-selection-${newTag} tag-selection-settings" data-tag="${newTag}"
        >
          ${tag}
          <i class="ph-minus-circle-bold remove-font-btn-settings icon"></i>
        </li>
      `;
    });
    this.#myTagsList.insertAdjacentHTML("beforeend", markup);
  }

  renderFontsList(fonts) {
    let html = "";
    fonts.forEach((font) => {
      html += `
        <option value="${font}">${font}</option>  
      `;
    });
    this.#fontsDataList.insertAdjacentHTML("beforeend", html);
  }

  renderMyFontsList(myFonts) {
    let html = "";
    myFonts.forEach((font) => {
      html += `
        <li class="my-fonts-list-item" data-font="${font}">
        ${font}
        <i class="ph-minus-circle-bold remove-font-btn icon"></i>
        </li>
      `;
    });
    this.#myFontsList.insertAdjacentHTML("beforeend", html);
  }

  toggleSettings(state) {
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

  customTagInputFocus() {
    this.#customTagInput.focus();
    this.#customTagInput.value = "";
  }

  googleFontsInputFocus() {
    this.fontsInput.value = "";
    this.fontsInput.focus();
  }

  toggleStatisticsList(list, action = "toggle") {
    document
      .querySelectorAll(`.settings-${list}-menu-caret`)
      .forEach((el) => el.classList.toggle("hidden"));
    if (action === "toggle")
      document
        .querySelector(`.${list}-list-sidebar`)
        .classList.toggle("hidden");
    if (action === "remove")
      document
        .querySelector(`.${list}-list-sidebar`)
        .classList.remove("hidden");
    if (action === "add")
      document.querySelector(`.${list}-list-sidebar`).classList.add("hidden");
  }

  #initThemeSelector(themes) {
    this.#themeStylesLink.setAttribute("href", `themes/${themes}.css`);
    // Set menu selection to current theme
    const themeUppercase = themes.charAt(0).toUpperCase() + themes.slice(1);
    this.#themeTitle.textContent = `Theme: ${themeUppercase}`;
  }

  renderChart(data) {
    const ctx = this.#graph.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: data,
    });
  }

  #toggleWordCount() {
    this.#wordCountBtn.classList.toggle("hidden");
    this.#wordCountToggleIcons.forEach((el) => {
      el.classList.toggle("hidden");
    });
  }

  #setPopupSize() {
    this.popup.style.width = `${window.innerWidth * 0.5}px`;
    this.popup.style.height = `${window.innerWidth * 0.5}px`;
  }

  #getCustomFontValue() {
    return this.fontsInput.value;
  }

  toggleSettingsSection() {
    this.settingsSection.classList.toggle("hidden");
  }

  // HANDLERS

  addHandlerBtnCloseSettings(handler) {
    this.#btnCloseSettings.addEventListener("click", handler);
  }

  #addHandlerSettingsItem() {
    this.settingsSection.addEventListener("click", (e) => {
      const list = e.target.closest(".settings-item")?.dataset.list;
      if (!list) return;
      this.toggleStatisticsList(list);
      if (list === "tags") this.customTagInputFocus();
      if (list === "fonts") this.googleFontsInputFocus();
    });
  }

  #addHandlerThemeSelect() {
    this.settingsSection.addEventListener("click", (e) => {
      const theme = e.target.dataset.theme;
      if (!theme) return;

      this.#initThemeSelector(theme);
    });
  }

  addHandlerToggleWordCount(handler) {
    this.settingsSection.addEventListener("click", (e) => {
      if (
        !e.target
          .closest(".settings-submenu-item")
          ?.classList.contains("settings-submenu-item-word-count")
      )
        return;

      this.#toggleWordCount();
      handler();
    });
  }

  addHandlerOverallStatistics(handler) {
    this.#statsListMenu.addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("settings-submenu-item-overall-statistics")
      )
        return;

      this.#setPopupSize();
      handler();
    });
  }

  addHandlerCloseGraph(handler) {
    this.#closeGraph.addEventListener("click", handler);
  }

  addHandlerAddCustomTag(handler) {
    this.#customTagInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const customTag = this.#customTagInput.value;
      if (!customTag || customTag === "") return;

      this.#customTagInput.value = "";
      handler(customTag);
    });
  }

  addHandlerRemoveTagFromState(handler) {
    this.settingsSection.addEventListener("click", (e) => {
      const tag = e.target.closest(".tag-selection")?.dataset.tag;
      if (!tag || !e.target.classList.contains("remove-font-btn-settings"))
        return;
      handler(tag);
    });
  }

  addHandlerAddFont(handler) {
    this.fontsInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      const font = this.#getCustomFontValue();
      handler(font);
    });
  }

  addHandlerRemoveFont(handler) {
    const s = document.querySelectorAll(".remove-font-btn");
    removeFontBtns.forEach((el) => el.addEventListener("click", handler));
  }

  addHandlerRemoveFont(handler) {
    this.settingsSection.addEventListener("click", (e) => {
      if (!e.target.classList.contains("remove-font-btn")) return;
      const font = e.target.closest(".my-fonts-list-item").dataset.font;
      handler(font);
    });
  }
}

export default new SettingsView();
