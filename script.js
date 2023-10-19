const STORAGE_TOKEN = 'T3ZM12M138IJKXCYJV1DA8PMVRJBHNPB4BD5OV43';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


let database = [];
let data = [];
let currentEmail;
let currentUsername;
let remember;


let databaseJSON = {
    "contacts": [
        {
            "firstname": "Anton",
            "lastname": "Mayer",
            "email": "antom@gmail.com",
            "phone": "+491111111111",
            "color": "rgb(135, 206, 250)"
        },
        {
            "firstname": "Tanja",
            "lastname": "Wolf",
            "email": "wolf@gmail.com",
            "phone": "+492222222222",
            "color": "rgb(144, 238, 144)"
        },
        {
            "firstname": "Sofia",
            "lastname": "Müller",
            "email": "sofiam@gmail.com",
            "phone": "+493333333333",
            "color": "rgb(255, 192, 203)"
        },
        {
            "firstname": "Herbert",
            "lastname": "Braun",
            "email": "hbraun@gmail.com",
            "phone": "+494444444444",
            "color": "rgb(255, 165, 0)"
        },
        {
            "firstname": "David",
            "lastname": "Eisenberg",
            "email": "daveis@gmail.com",
            "phone": "+495555555555",
            "color": "rgb(255, 0, 0)"
        },
        {
            "firstname": "Benedikt",
            "lastname": "Ziegler",
            "email": "ziegel@gmail.com",
            "phone": "+496666666666",
            "color": "rgb(0, 255, 0)"
        },
        {
            "firstname": "Marcel",
            "lastname": "Bauer",
            "email": "mbauer@gmail.com",
            "phone": "+497777777777",
            "color": "rgb(0, 0, 255)"
        },
        {
            "firstname": "Guest",
            "lastname": "",
            "email": "guest@mail.com",
            "phone": "",
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
            "assigned_to": ["Anton Mayer", "Tanja Wolf", "Benedikt Ziegler"],
            "due_date": "2023-08-23",
            "prio": "low",
            "subtasks": {
                "name": ["Modify contents", "Create new icons", "Revise the homepage responsively"],
                "status": ["false", "false", "false"]
            },
            "progress": "todo"
        },
        {
            "title": "Call potencial clients",
            "description": "Make the product presentation to prospective buyers",
            "category": "Sales",
            "assigned_to": ["David Eisenberg", "Tanja Wolf", "Sofia Müller"],
            "due_date": "2023-06-28",
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
            "assigned_to": ["Herbert Braun"],
            "due_date": "2023-02-13",
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
            "assigned_to": ["Sofia Müller", "Marcel Bauer"],
            "due_date": "2023-03-02",
            "prio": "low",
            "subtasks": {
                "name": ["Design an ad", "Calculate the costs", "Created accounts for all common social media platforms"],
                "status": ["false", "false", "false"]
            },
            "progress": "todo"
        },
        {
            "title": "Video cut",
            "description": "Edit the new company video",
            "category": "Media",
            "assigned_to": ["Tanja Wolf"],
            "due_date": "2023-03-02",
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
            "username": "Guest",
            "email": "guest@mail.com",
            "password": "12345678"
        },
        {
            "username": "Peter",
            "email": "peter@mail.com",
            "password": "12345678"
        }
    ]
}


/**
 * General onload function for all subpages.
 */
async function init() {
    includeUser();
    checkForLogin();
    await includeHTML();
    await getItem('database');
    sideMenuColor();
    showInitialsOnTopBar();
    userMenuEventListener()
}


/**
 * This function fetches a JSON and uploads it.
 * @param {string} key - The name of the key.
 * @param {boolean} value - JSON array.
 * @returns - Status
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload).replaceAll(`'`, `$`) })
        .then(res => res.json());
}


/**
 * This function downloads a JSON and parses it.
 * @param {string} key - Name of the item you want to download.
 * @returns - JSON array, database.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json())
        .then(value => {
            data = value.data.value;
            dataJSON = data.replace(/'/g, '"').replaceAll(`$`, `'`);
            database = JSON.parse(dataJSON);
        }).catch(err => {
            console.log(err);
        });
}


/**
 * This function gets the data from the localstorage.
 * @param {string} key - Name of the item you want to download. 
 * @returns It returns the JSON from the localstorage.
 */
function getItemLocalStorage(key) {
    let value = localStorage.getItem(key);
    return JSON.parse(value);
}


/**
 * This function will get the email of the logged in user from the link of the page.
 */
function includeUser() {
    let localStorageData = getItemLocalStorage('loggedInUser');
    if (localStorageData !== null) {
        currentEmail = localStorageData['email'];
        currentUsername = localStorageData['username'];
        remember = localStorageData['remember'];
    }
}


/**
 * This function renders the initials in the circle of the topbar.
 */
function showInitialsOnTopBar() {
    loggedInUserName = searchContactInfo(false, 'firstname', currentEmail, 'email', 'contacts') + ' ' + searchContactInfo(false, 'lastname', currentEmail, 'email', 'contacts');
    initialLetters = loggedInUserName
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
    let topbarCircle = document.getElementById('loggedInUserInitials');
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
 * @returns - The information you're looking for.
 */
function searchContactInfo(index, yoursearchResult, keyword, searchFilter, searchPath) {
    for (let i = 0; i < database[searchPath].length; i++) {
        currentSearch = database[searchPath][i];
        if (keyword == database[searchPath][i][searchFilter]) {
            if (index) {
                return database[searchPath].indexOf(currentSearch);
            } else {
                return currentSearch[yoursearchResult];
            }
        }
    }
}


/**
 * This function monitors where was clicked and shows or hides the user menu.
 * @param {boolean} e - The e parameter contains information about the position of the click,
 * the item clicked, or other properties of the event.
 */
function userMenuEventListener() {
    window.onclick = function (e) {
        if (window.location.pathname !== '/login.html') {
            if (!e.target.matches('.user-menu', '.user-initials', '#navID') &&
                !document.getElementById('userMenu').classList.contains('d-none')) {
                document.getElementById('userMenu').classList.add('d-none');
            } else if (e.target.matches('.user-initials')) {
                document.getElementById('userMenu').classList.remove('d-none');
            }
        }
    }
}


/**
 * This function checks whether a string contains { } [ ].
 * @param {string} input - Text from an input field.
 * @returns true or false.
             */
function containsBrackets(input) {
    return /[{}[\]"]/.test(input);
}


/**
 * This function logs the user out.
 */
function logOut() {
    if (!remember) {
        localStorage.clear();
    }
    window.location.replace('login.html')
}


/**
 * This function checks whether you come from an external website.
 */
function checkForLogin() {
    var previousPage = document.referrer;
    var pageURL = window.location.hostname;
    if (previousPage.search(pageURL) == -1 || currentEmail == undefined) {
        window.location.replace('login.html')
    }
}