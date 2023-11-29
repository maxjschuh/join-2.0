let rememberMeTickSet = false;
let changePasswordEmail;
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
    fillInData();
    checkForChangePassword();
    addEventListeners();
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
 * @param {number} userIndex index of the user to login in the database.users array
 */
function login(userIndex) {
    const user = database.users[userIndex];

    const localStorageData = { email: user.email, firstname: user.firstname, remember: rememberMe, password: user.password };
    setItemLocalStorage('loggedInUser', localStorageData);

    // window.location.href = './summary.html';
}


/**
 * This function will check if the email or the password is correct
 * @returns The function will stop if logged in succesfully
 */
function checkLogin() {
    const emailLogIn = document.getElementById('email').value;
    const passwordLogIn = document.getElementById('password').value;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (emailLogIn === user.email && passwordLogIn === user.password) {
    
            login(i);
            return;
        }       
    }

    toggleElements(['wrongPassword'], 'd-none', false);
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

    if (loggedInUser.remember) {

        document.getElementById('email').value = loggedInUser.email;
        document.getElementById('password').value = loggedInUser.password;
        toggleRememberMeTick();
    }

}


function resetInputs() {

    resetValue(["firstname", "lastname", "email", "password", "signUpEmail", "signUpPassword", "forgotPwEmail", "newPassword"]);

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

    // document.addEventListener("focus", activeInputfield, true); // gets the inputfield which is in focus
    // document.addEventListener("blur", activeInputfield, true); // get the inputfield which looses the focus
    // window.addEventListener('resize', handleResize); // checks if the screen is resizing
}