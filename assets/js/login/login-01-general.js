let rememberMeTickSet = false;
let changePasswordEmail;
let currentPassword;
let rememberMe = false;
let users;


/**
 * This function will initialize the page
 */
async function initLogin() {
    includeUser();
    checkForRunningSession();
    await getItem('database');
    users = database.users;
    getDataLocalStorage();
    checkForChangePassword();
    addEventListeners();
}





/**
 * This function is used to get the data from the local storage
 */
function getDataLocalStorage() {
    const localStorageData = getItemLocalStorage('loggedInUser');

    if (localStorageData) {
        currentEmail = localStorageData.email;
        currentPassword = localStorageData.password;
        currentRememberMe = localStorageData.remember;

    } else return;

    if (currentRememberMe) fillInData();
}


/**
 * This function will check if there is a request for a password change
 */
function checkForChangePassword() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    changePasswordEmail = urlParams.get('email');
    if (!changePasswordEmail) waitForAnimation();

    else showAndHideElements(['resetPwContainer'], ['loginContainer']);
}


/**
 * This function will log in the user
 * @param {string} email This is the email from the user which wants to login
 * @param {string} username This is the username of the user which wants to login
 */
function login(email, username) {
    const password = document.getElementById('password').value;

    const localStorageData = { email: email, username: username, remember: rememberMe, password: password };
    setItemLocalStorage('loggedInUser', localStorageData);

    window.location.href = './summary.html';
}


/**
 * This function will login the user as a guest
 */
function guestLogin() {
    const email = 'guest@mail.com';
    const username = 'Guest';
    login(email, username);
}


/**
 * This function will check if the email or the password is correct
 * 
 * @returns The function will stop if logged in succesfully
 */
function checkLogin() {
    const emailLogIn = document.getElementById('email').value;
    const passwordLogIn = document.getElementById('password').value;

    users.forEach(user => {

        if (emailLogIn == user.email && passwordLogIn == user.password) {

            login(user.email, user.username);
            return;
        }

    });

    setInlineStyle(['wrongPassword'], 'color: red');
    setInlineStyle(['passwordContainer', 'emailContainer'], 'border: 1px solid red');
}


/**
 * This function will save the value in the local storage for the log in
 * 
 * @param {string} key This is the key for the local storage
 * @param {string} value This is the value for the local storage
 */
function setItemLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


/**
 * This function will set and reset the tick in the "Remember me" box
 */
function toggleRememberMeTick() {

    rememberMeTickSet = !rememberMeTickSet;
    rememberMe = rememberMeTickSet;

    toggleElements(['tick'], 'd-none', rememberMeTickSet);
}


/**
 * This function is used to fill in the login data if the remember me tick is set
 */
function fillInData() {
    document.getElementById('email').value = currentEmail;
    document.getElementById('password').value = currentPassword;
    toggleRememberMeTick();
}


function resetInputs() {

    resetValue(["email", "password", "username", "signUpEmail", "signUpPassword", "forgotPwEmail", "newPassword"]);

    ['password', 'signUpPassword', 'newPassword'].forEach(id => {
        document.getElementById(id).type = "password";
        showAndHideElements(['lock-' + id], ['hide-' + id, 'show-' + id]);
    });
}


/**
 * This function is used to check the width of the screen
 * 
 * @returns it returns true when the screen is smaller than 900px
 */
function screenSmallerThan900Px() {
    return window.innerWidth <= 900;
}



/**
 * Restarts the logo animation when the screen is resized.
 */
function handleResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth == 900) waitForAnimation();
}



function addEventListeners() {

    document.addEventListener("focus", activeInputfield, true); // gets the inputfield which is in focus
    document.addEventListener("blur", activeInputfield, true); // get the inputfield which looses the focus
    window.addEventListener('resize', handleResize); // checks if the screen is resizing
}