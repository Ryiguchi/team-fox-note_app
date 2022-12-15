import { fontData } from "./model.js";
("use strict");
const googleFontsLink = document.querySelector(".google-fonts-link");
const fontsStylesheet = document.querySelector(".font-stylesheet");
const fontList = document.querySelector(".font-list-toolbar");

const state = JSON.parse(localStorage.getItem("state"));
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

  const addPlus = function (str) {
    return str.replace(" ", "+");
  };

  const setGoogleFontsLink = function (font) {
    let fontString = addPlus(capitalize(font));
    const fontObj = fontData.items.find((obj) => obj.family === font);

    if (fontObj.variants.includes("italic") && fontObj.variants.includes("700"))
      fontString += ":ital,wght@0,400;0,700;1,400";
    if (
      fontObj.variants.includes("italic") &&
      !fontObj.variants.includes("700")
    )
      fontString += ":ital@0;1";
    if (
      !fontObj.variants.includes("italic") &&
      fontObj.variants.includes("700")
    )
      fontString += ":wght@400;700";

    let href = googleFontsLink.getAttribute("href");
    href = `${href.slice(0, -12)}family=${fontString}&display=swap`;
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
if (state && state.fonts.length > 0)
  state.fonts.forEach((font) => loadFont(font));
