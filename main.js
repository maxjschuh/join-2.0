let database = {};
let data = [];
let loggedInUser = {
    email: undefined,
    firstname: undefined,
    rememberMe: false,
    password: undefined
};
let formValid = false;

const STORAGE_TOKEN = 'ZMJ47U2DC30BKGMR7L4WEJ23CI92P62X9O7JLEOF';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const INPUT_ALERTS = {
    "firstname": {
        regex: /[^a-zA-Z\-.\s]/,
        alertMessage: 'Allowed characters: a-z, A-Z, - , . ,[space]'
    },
    "lastname": {
        regex: /[^a-zA-Z\-.\s]/,
        alertMessage: 'Allowed characters: a-z, A-Z, - , . ,[space]'
    },
    "signUpEmail": {
        regex: /[$"'`´\s\\]/,
        alertMessage: 'Contains forbidden characters'
    },
    "signUpPassword": {
        regex: /[$"'`´\s\\]/,
        alertMessage: 'Contains forbidden characters'
    },
    "newContactFirstName": {
        regex: /[^a-zA-Z\-.\s]/,
        alertMessage: 'Allowed characters: a-z, A-Z, - , . ,[space]'
    },
    "newContactLastName": {
        regex: /[^a-zA-Z\-.\s]/,
        alertMessage: 'Allowed characters: a-z, A-Z, - , . ,[space]'
    },
    "newContactEmail": {
        regex: /[$"'`´\s\\]/,
        alertMessage: 'Contains forbidden characters'
    },
    "newContactPhone": {
        regex: /[^0-9\-\+\/\s]/,
        alertMessage: 'Allowed characters: 0-9, - , + , / , [space]'
    },
    "editFirstName": {
        regex: /[^a-zA-Z\-.\s]/,
        alertMessage: 'Allowed characters: a-z, A-Z, - , . ,[space]'
    },
    "editLastName": {
        regex: /[^a-zA-Z\-.\s]/,
        alertMessage: 'Allowed characters: a-z, A-Z, - , . ,[space]'
    },
    "editEmail": {
        regex: /[$"'`´\s\\]/,
        alertMessage: 'Contains forbidden characters'
    },
    "editPhone": {
        regex: /[^0-9\-\+\/\s]/,
        alertMessage: 'Allowed characters: 0-9, - , + , / , [space]'
    },
    "newPassword": {
        regex: /[$"'`´\s\\]/,
        alertMessage: 'Contains forbidden characters'
    },
}


/**
 * General onload function for all subpages.
 */
async function init() {
    includeUser();
    redirectFromPrivatePages();
    await includeHTML();
    await getItem('database');
    sideMenuColor();
    showInitialsOnTopBar();
    userMenuEventListener()
}


/**
 * This function function stringifies a JSON and posts it to the server.
 * @param {string} key name of the key
 * @param {object} value the JSON to upload
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };

    const response = await fetch(STORAGE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload).replaceAll(`'`, `$`)
    });

    if (!response.ok) showErrorMessage();
}


/**
 * Fetches a JSON and parses it.
 * @param {string} key name of the item to be downloaded
 */
async function getItem(key) {

    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;

    const response = await fetch(url);
    const responseBody = await response.json();

    if (!response.ok) showErrorMessage();

    const responseBodyValidated = responseBody.data.value.replace(/'/g, '"').replaceAll(`$`, `'`);
    database = JSON.parse(responseBodyValidated);
}


/**
 * This function gets the data from the localstorage.
 * @param {string} key - Name of the item you want to download. 
 * @returns {object} It returns the JSON from the localstorage.
 */
function getItemLocalStorage(key) {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
}


/**
 * This function will get the email of the logged in user from the link of the page.
 */
function includeUser() {

    const localStorageData = getItemLocalStorage('loggedInUser');

    if (localStorageData) loggedInUser = localStorageData;
}


/**
 * This function renders the initials in the circle of the topbar.
 */
function showInitialsOnTopBar() {

    if (!loggedInUser.email) return;

    initialLetters = (loggedInUser.firstname.charAt(0) + loggedInUser.lastname.charAt(0)).toUpperCase();

    const topbarCircle = document.getElementById('loggedInUserInitials');
    topbarCircle.innerHTML = initialLetters;

    for (let i = 0; i < database.contacts.length; i++) {
        const contact = database.contacts[i];

        if (contact.email === loggedInUser.email) {
            topbarCircle.style.color = contact.color;
            return;
        }
    }
}


/**
 * This function monitors where was clicked and shows or hides the user menu.
 * @param {object} e - The e parameter contains information about the position of the click,
 * the item clicked, or other properties of the event.
 */
function userMenuEventListener() {
    window.onclick = function (e) {
        let bool;

        if (window.location.pathname !== '/login.html') {

            if (!e.target.matches('.user-menu', '.user-initials', '#navID') &&
                !document.getElementById('userMenu').classList.contains('d-none')) bool = true;

            else if (e.target.matches('.user-initials')) bool = false;

            else return;

            toggleElements(['userMenu'], 'd-none', bool);
        }
    }
}


/**
 * This function checks whether a string contains { } [ ].
 * @param {string} input - Text from an input field.
 * @returns {boolean} true if the string contains brackets
 */
function containsBrackets(input) {
    return /[{}[\]"]/.test(input);
}


/**
 * This function logs the user out.
 */
function logOut() {
    if (!loggedInUser.rememberMe) localStorage.clear();
    window.location.replace('./login.html')
}


/**
 * Tests if the user tries to acces a page for which a login is necessary. If so, it redirects the browser to the login page.
 * @returns if the user accesses a public page
 */
function redirectFromPrivatePages() {

    const publicPages = ["help.html", "legal-notice.html", "login.html"];
    const currentPage = window.location.pathname.split("/").pop();
    const previousPage = document.referrer;
    const host = window.location.hostname;

    if (publicPages.includes(currentPage)) return;

    if (loggedInUser.email && previousPage.includes(host)) return;

    window.location.replace("./login.html");
}


/**
 * Toggles the classes of the elements with the ids that are passed as parameter.
 * @param {Array} ids of html elements
 * @param {string} clss class to add or remove
 * @param {boolean} direction_of_operation true for adding the class, false for removing it, undefined for toggling it
 */
function toggleElements(ids, clss, direction_of_operation) {

    ids.forEach(id => document.getElementById(id).classList.toggle(clss, direction_of_operation));
}


/**
 * This function creates random colors.
 * @returns {string} random rgb color.
 */
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}


/**
 * Sets the inline style of the elements with the ids that are passed as parameter to to the passed string.
 * @param {Array} ids array of html ids
 * @param {string} inline_style that should be set for the elements
 */
function setInlineStyle(ids, inline_style) {

    ids.forEach((id) => {
        document.getElementById(id).style = inline_style;
    });
}


/**
 * Sets the value property of the html elements with the passed ids to an empty string.
 * @param {Array} ids html ids
 */
function resetValue(ids) {

    ids.forEach(id => {
        document.getElementById(id).value = '';
    });
}


/**
 * Sets the inner html of the elements with the passed ids to an empty string.
 * @param {Array} ids html ids
 */
function emptyInnerHTML(ids) {

    ids.forEach(id => {
        document.getElementById(id).innerHTML = '';
    });
}


/**
 * Sets the inner html of the passed ids to the passed value.
 * @param {Array} ids ids of the html elements to be set
 * @param {string} content text to be set as inner html
 */
function setInnerHTML(ids, content) {

    ids.forEach(id => {
        document.getElementById(id).innerHTML = content;
    });
}


/**
 * Shows or hides the elements whose ids are passed as parameter by adding or removing the class "d-none".
 * @param {Array} idsToShow elements that will be shown
 * @param {Array} idsToHide elements that will be hidden
 */
function showAndHideElements(idsToShow, idsToHide) {

    if (idsToShow) toggleElements(idsToShow, 'd-none', false);

    if (idsToHide) toggleElements(idsToHide, 'd-none', true);
}



/**
 * Function for showing an alert in case the client did not receive an answer from the server.
 */
function showErrorMessage() {

    alert('The Join Server is not responding. Please try again later.');
}


/**
 * Validates the input by testing it with the regex pattern provided in the INPUT_ALERTS JSON.
 * @param {string} inputId id of the input whose value should be validated
 */
function validateInput(inputId) {

    const inputValue = document.getElementById(inputId).value.trim();
    const alert = document.getElementById(inputId + 'Alert');
    const regex = INPUT_ALERTS[inputId].regex;
    const alertMessage = INPUT_ALERTS[inputId].alertMessage;

    if (regex.test(inputValue)) {

        formValid = false;
        alert.innerHTML = alertMessage;

    } else alert.innerHTML = '';
}


/**
 * For easier use in functions, the date needs to be saved in the database in the format yyyy-mm-dd. This function provides the date this format.
 * @param {string} inputId input from where the value should be used
 * @returns {string} date in format yyyy-mm-dd 
 */
function provideDateInDatabaseFormat(inputId) {

    const dateInput = document.getElementById(inputId);

    const [day, month, year] = dateInput.value.trim().split("-");
    return `${year}-${month}-${day}`;
}


/**
 * For display in the UI the provided date (format: yyyy-mm-dd) is returned in the format dd-mm-yyy.
 */
function provideDateInInterfaceFormat(yyyy_mm_dd) {

    const [year, month, day] = yyyy_mm_dd.split("-");
    return `${day}-${month}-${year}`;
}