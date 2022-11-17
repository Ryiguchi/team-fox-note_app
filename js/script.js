"use strict";

// SELECTORS
const btnCloseWelcome = document.querySelector(".welcome-close-btn");
const welcomePopUp = document.querySelector(".welcome-pop-up");

// State = data representing the current state of the app
const state = {
  firstLogIn: true,
};

/**
 *
 * @param {Object | Object[]} data The state to be saved for the user (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 */
const setLocalStorage = function (data) {
  localStorage.setItem("state", JSON.stringify(state));
};

/**
 *
 * @returns {Object | Object[]} The users saved settings (e.g. bookmarks, tags, etc.)
 * @author Ryan Iguchi
 */
const getLocalStorage = function () {
  return JSON.parse(localStorage.getItem("state"));
};

/**
 * Shows or hides the Welcome screen
 * @author Ryan Iguchi
 */
const toggleWelcome = function () {
  welcomePopUp.classList.toggle("hidden");
};

/**
 * Anything in here will be executed when the page loads
 * @author Ryan Iguchi
 */
const init = function () {
  const data = getLocalStorage();
  if (data === null || data.firstLogIn === true) toggleWelcome();
};

init();

// EVENT HANDLERS

btnCloseWelcome.addEventListener("click", (e) => {
  state.firstLogIn = false;
  setLocalStorage(state);
  toggleWelcome();
});
