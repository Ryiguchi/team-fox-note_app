"use strict";
const googleFontsLink = document.querySelector(".google-fonts-link");
const fontsStylesheet = document.querySelector(".font-stylesheet");
const fontList = document.querySelector(".font-list-toolbar");

const state = JSON.parse(localStorage.getItem("state"));

console.log(state);
export const fontArray = state?.fonts;
const loadFont = function (font) {
  const capitalize = function (str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const hyphenate = function (str) {
    return str.split(" ").join("-");
  };

  const setGoogleFontsLink = function (font) {
    const fontUppercase = capitalize(font);
    let href = googleFontsLink.getAttribute("href");
    href = `${href.slice(0, -12)}family=${fontUppercase}:wght@500&display=swap`;
    googleFontsLink.setAttribute("href", href);
  };

  const setFontsStylesheet = function (font) {
    const style = `
    #toolbar-container .ql-font span[data-label="${capitalize(font)}"]::before {
      font-family: "${capitalize(font)}";
    }
    .ql-font-${hyphenate(font)} {
      font-family: "${capitalize(font)}";
    }
  `;
    fontsStylesheet.insertAdjacentHTML("afterbegin", style);
  };

  const setFontList = function (font) {
    const html = `<option value="${hyphenate(font)}">${capitalize(
      font
    )}</option>`;
    fontList.insertAdjacentHTML("beforeend", html);
  };

  setGoogleFontsLink(font);
  setFontsStylesheet(font);
  setFontList(font);
};
if (state) state.fonts.forEach((font) => loadFont(font));
