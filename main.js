const STORAGE_TOKEN = 'ZMJ47U2DC30BKGMR7L4WEJ23CI92P62X9O7JLEOF';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


let database = {};
let data = [];
let currentEmail;
let currentUsername;
let remember;

let databaseJSON = {
    "contacts": [
        {
            "firstname": "Anton",
            "lastname": "Mayer",
            "email": "antom@mail.com",
            "phone": "+491111111111",
            "color": "rgb(135, 206, 250)"
        },
        {
            "firstname": "Tanja",
            "lastname": "Wolf",
            "email": "wolf@mail.com",
            "phone": "+492222222222",
            "color": "rgb(144, 238, 144)"
        },
        {
            "firstname": "Sofia",
            "lastname": "Müller",
            "email": "sofiam@mail.com",
            "phone": "+493333333333",
            "color": "rgb(255, 192, 203)"
        },
        {
            "firstname": "Herbert",
            "lastname": "Braun",
            "email": "hbraun@mail.com",
            "phone": "+494444444444",
            "color": "rgb(255, 165, 0)"
        },
        {
            "firstname": "David",
            "lastname": "Eisenberg",
            "email": "daveis@mail.com",
            "phone": "+495555555555",
            "color": "rgb(255, 0, 0)"
        },
        {
            "firstname": "Benedikt",
            "lastname": "Ziegler",
            "email": "ziegel@mail.com",
            "phone": "+496666666666",
            "color": "rgb(0, 255, 0)"
        },
        {
            "firstname": "Marcel",
            "lastname": "Bauer",
            "email": "mbauer@mail.com",
            "phone": "+497777777777",
            "color": "rgb(0, 0, 255)"
        },
        {
            "firstname": "Guest",
            "lastname": "User",
            "email": "guest@mail.com",
            "phone": "+498888888888",
            "color": "rgb(141, 218, 80)"
        },
        {
            "firstname": "Peter",
            "lastname": "Hofer",
            "email": "peter@mail.com",
            "phone": "",
            "color": "rgb(204, 108, 46)"
        }
    ],
    "categories": [
        {
            "name": "Design",
            "color": "rgb(239, 132, 41)"
        },
        {
            "name": "Sales",
            "color": "rgb(236, 126, 250)"
        },
        {
            "name": "Backoffice",
            "color": "rgb(100, 210, 193)"
        },
        {
            "name": "Marketing",
            "color": "rgb(18, 58, 248)"
        },
        {
            "name": "Media",
            "color": "rgb(247, 202, 57)"
        }
    ],
    "tasks": [
        {
            "title": "Website redesign",
            "description": "Modify the contents of the main website. Adjust the UI to the company's brand design. Check responsive",
            "category": "Design",
            "assigned_to": [
                "antom@mail.com",
                "wolf@mail.com",
                "ziegel@mail.com"
            ],
            "due_date": "2023-12-23",
            "prio": "low",
            "subtasks": {
                "name": [
                    "Modify contents",
                    "Create new icons",
                    "Revise the homepage responsively"
                ],
                "status": [
                    "false",
                    "false",
                    "false"
                ]
            },
            "progress": "todo"
        },
        {
            "title": "Call potencial clients",
            "description": "Make the product presentation to prospective buyers",
            "category": "Sales",
            "assigned_to": [
                "daveis@mail.com",
                "wolf@mail.com",
                "sofiam@mail.com"
            ],
            "due_date": "2024-01-28",
            "prio": "high",
            "subtasks": {
                "name": [],
                "status": []
            },
            "progress": "todo"
        },
        {
            "title": "Accounting invoices",
            "description": "Write open invoices for customer",
            "category": "Backoffice",
            "assigned_to": [
                "hbraun@mail.com"
            ],
            "due_date": "2024-02-13",
            "prio": "medium",
            "subtasks": {
                "name": [],
                "status": []
            },
            "progress": "todo"
        },
        {
            "title": "Social media strategy",
            "description": "Develop an ad campaign for brand positioning",
            "category": "Marketing",
            "assigned_to": [
                "sofiam@mail.com",
                "mbauer@mail.com"
            ],
            "due_date": "2023-03-02",
            "prio": "low",
            "subtasks": {
                "name": [
                    "Design an ad",
                    "Calculate the costs",
                    "Created accounts for all common social media platforms"
                ],
                "status": [
                    "false",
                    "false",
                    "false"
                ]
            },
            "progress": "todo"
        },
        {
            "title": "Video cut",
            "description": "Edit the new company video",
            "category": "Media",
            "assigned_to": [
                "wolf@mail.com"
            ],
            "due_date": "2023-04-02",
            "prio": "medium",
            "subtasks": {
                "name": [],
                "status": []
            },
            "progress": "todo"
        }
    ],
    "users": [
        {
            "firstname": "Guest",
            "lastname": "User",
            "email": "guest@mail.com",
            "password": "12345678"
        }
    ]
}


/**
 * General onload function for all subpages.
 */
async function init() {
    includeUser();
    checkForRunningSession();
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

    if (!response.ok) showErrorMessage(response);
}


/**
 * Fetches a JSON and parses it.
 * @param {string} key name of the item to be downloaded
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;

    try {
        const response = await fetch(url);
        const responseBody = await response.json();

        const responseBodyValidated = responseBody.data.value.replace(/'/g, '"').replaceAll(`$`, `'`);
        database = JSON.parse(responseBodyValidated);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
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

    if (localStorageData) {
        currentEmail = localStorageData.email;
        currentUsername = localStorageData.username;
        remember = localStorageData.remember;
    }
}

// function showInitialsOnTopBar() {

//     const index = currentUsername.indexOf(' ');


//     if (index !== -1) {


//     }
// }

/**
 * This function renders the initials in the circle of the topbar.
 */
function showInitialsOnTopBar() {

    loggedInUserName = `${searchContactInfo(false, 'firstname', currentEmail, 'email', 'contacts')} ${searchContactInfo(false, 'lastname', currentEmail, 'email', 'contacts')}`;
    initialLetters = loggedInUserName
        .split(' ')
        .map(word => word.charAt(0))
        .join('');

    const topbarCircle = document.getElementById('loggedInUserInitials');
    topbarCircle.innerHTML = `${initialLetters}`;
    topbarCircle.style.color = `${searchContactInfo(false, 'color', currentEmail, 'email', 'contacts')}`;
}


/**
 * This function is for searching information based on different keywords.
 * @param {boolean} index - You are looking for the index of an object = true. For everything else false
 * @param {string} yoursearchResult - The information you are looking for. (color, contact, firstname, lastname, email,...). If the index is searched, just enter a placeholder here.
 * @param {string} keyword - The keyword you use to search for the information. (an e-mail address, a first name, a surname, ...)
 * @param {string} searchFilter - The searchFilter is related to the keyword. if you search with an email address of a contact, the search filter must be email.
 * @param {string} searchPath - The place where to search. There are only 4 possibilities. (categories, contacts, tasks, users)
 * @returns {*} - The information you're looking for.
 */
function searchContactInfo(index, yoursearchResult, keyword, searchFilter, searchPath) {

    for (let i = 0; i < database[searchPath].length; i++) {
        currentSearch = database[searchPath][i];

        const condition = keyword == database[searchPath][i][searchFilter];

        if (condition && index) return database[searchPath].indexOf(currentSearch);

        else if (condition) currentSearch[yoursearchResult];
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
 * @returns {boolean} true or false.
             */
function containsBrackets(input) {
    return /[{}[\]"]/.test(input);
}


/**
 * This function logs the user out.
 */
function logOut() {
    if (!remember) localStorage.clear();
    window.location.replace('login.html')
}



function checkForRunningSession() {

    const page = window.location.pathname.split("/").pop();

    if (currentEmail && page === "login.html") window.location.replace("./summary.html");

    if (currentEmail) return;

    if (page === "help.html" || page === "legal-notice.html" || page === "login.html") return;

    else window.location.replace("./login.html");
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
 * Shows or hides the elements whose ids are passed as parameter by adding or removing the class "d-none".
 * @param {Array} idsToShow elements that will be shown
 * @param {Array} idsToHide elements that will be hidden
 */
function showAndHideElements(idsToShow, idsToHide) {

    if (idsToShow) toggleElements(idsToShow, 'd-none', false);

    if (idsToHide) toggleElements(idsToHide, 'd-none', true);
}




function showErrorMessage(error) {

    alert('The Join Server is not responding. Please try again later.');
    if (error) console.log('For Developers: ', error);
}