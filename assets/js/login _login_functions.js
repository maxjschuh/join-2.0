// Global variables

let tickCount = 0;
let changePasswordEmail;
let currentPassword;
let rememberMe = false;

//Init functions

/**
 * This function will initialize the page
 */
function initLogin() {
    getData();
    getDataLocalStorage();
    checkForChangePassword();
}


/**
 * This function will get the data from the backend
 */
async function getData() {
    await getItem('database');
    users = database.users;
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

        if (currentRememberMe) fillInData();
    }
}


/**
 * This function will check if there is a request for a password change
 */
function checkForChangePassword() {
    // URL-Parameter auslesen
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    changePasswordEmail = urlParams.get('email');
    if (!changePasswordEmail) waitForAnimation(); //Checks if there is a variable in the link

    else showAndHideElements(['resetPwContainer'], ['signUp', 'loginContainer', 'forgotPwContainer', 'signUpContainer']);
}

//Login functions

/**
 * This function will log in the user
 * 
 * @param {string} email This is the email from the user which wants to login
 * @param {string} username This is the username of the user which wants to login
 */
function login(email, username) {
    const password = document.getElementById('password').value;

    const localStorageData = { email: email, username: username, remember: rememberMe, password: password };

    setItemLocalStorage('loggedInUser', localStorageData);

    // Zur neuen URL weiterleiten
    window.location.href = 'summary.html';
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
    setInlineStyle(['passwordContainer'], 'border: 1px solid red');
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

//Sign up functions

/**
 * This function will push the data in the database
 * 
 * @param {string} account This is the data of the account which will be pushed
 * @param {string} contact This is the data of the contact which will be pushed
 */
function signUpUser(account, contact) {
    database.users.push(account);
    database.contacts.push(contact);
    setItem('database', database);
    playAnimation('accountCreated');
    resetValue(['username', 'signUpEmail', 'signUpPassword']);

    setTimeout(() => {
        login(account.email, account.username);
    }, 2000);

}


/**
 * This function will set up the data to be pushed
 * 
 * @returns If the user already exists, the function will be stopped at that point
 */
function accountData() {
    const usernameSignUp = document.getElementById('username').value;
    const emailSignUp = document.getElementById('signUpEmail').value;
    const passwordSignUp = document.getElementById('signUpPassword').value;

    setInlineStyle(['usernameTaken', 'usernameContainer'], '');

    if (!checkIfUserExists(usernameSignUp, emailSignUp)) return;

    const account = {
        "username": usernameSignUp,
        "email": emailSignUp,
        "password": passwordSignUp
    };

    const contact = splitName(usernameSignUp, emailSignUp);

    signUpUser(account, contact);
}


/**
 * This function is used to split up the username into a firstname and a lastname
 * 
 * @param {string} usernameSignUp Username from the inputfield
 * @param {string} emailSignUp Email from the inputfield
 * @returns {object} user contact
 */
function splitName(usernameSignUp, emailSignUp) {
    const fullName = usernameSignUp.split(' ');
    const firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
    let lastName = '';

    if (fullName.length > 1) lastName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1);

    return {
        "firstname": firstName,
        "lastname": lastName,
        "email": emailSignUp,
        "phone": "",
        "color": generateRandomColor()
    };
}


/**
 * This function will check if the username or the email is already in use
 * 
 * @param {string} usernameSignUp This is the username to sign up
 * @param {string} emailSignUp This is the email to sign up
 * @returns {boolean} It returns "false" if the email or the username already exists and "true" if they doesn´t exists
 */
function checkIfUserExists(usernameSignUp, emailSignUp) {
    for (let i = 0; i < users.length; i++) {

        if (usernameSignUp == users[i]['username']) {
            document.getElementById('usernameTaken').style = 'color: red';
            document.getElementById('usernameContainer').style = 'border: 1px solid red';
            return false;
        }

        if (emailSignUp == users[i]['email']) {
            document.getElementById('emailTaken').style = 'color: red';
            document.getElementById('emailSignUpContainer').style = 'border: 1px solid red';
            return false;
        }
    }
    return true;
}


// Reset password functions

/**
 * This function checks if the email exists. If the Email exist it will start other functions to send the mail to reset the password
 * 
 * @returns the function will stop if the email does not exist
 */
function emailSent() {
    const forgotPwEmail = document.getElementById('forgotPwEmail').value; // Email from the inputfield to reset the password

    if (!getUsername(forgotPwEmail)) { // Checks if the email exists
        document.getElementById('emailDoesntExist').style = 'color: red';
        document.getElementById('forgotPwEmailContainer').style = 'border: 1px solid red';
        return;
    }

    sentMailToPhp(forgotPwEmail);
    activatePhp();
    playAnimation('emailSent');
}


/**
 * This function is used to get the username through the email
 * 
 * @param {string} forgotPwEmail This is the email from where we get the username
 * @returns The username will be returned, if the email does not exists it will return "false"
 */
function getUsername(forgotPwEmail) {

    for (let i = 0; i < users.length; i++) {

        if (users[i]['email'] == forgotPwEmail) return users[i]['username'];
    }
    return false;
}


/**
 * This function will set link which includes the email to reset the password
 * 
 * @param {string} forgotPwEmail The Email from which the password should be changed
 * @returns {string} It returns the Link which includes the email to reset the password
 */
function getForgotPwLink(forgotPwEmail) {

    return 'https://mjschuh.com/join/login.html?email=' + encodeURIComponent(forgotPwEmail);
}


/**
 * This function will send the username, the email and the link to the Php-Script
 * 
 * @param {string} forgotPwEmail The Email from which the password should be changed
 */
function sentMailToPhp(forgotPwEmail) {  // Email wird das Php skript übergeben
    const username = getUsername(forgotPwEmail);
    const link = getForgotPwLink(forgotPwEmail);
    const mail = forgotPwEmail;

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) console.log("E-Mail gesendet"); // Erfolgreiche Antwort vom Server erhalten
    }

    xmlhttp.open("POST", "send_mail.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    const paramsUsername = "username=" + encodeURIComponent(username);
    const paramsLink = "&link=" + encodeURIComponent(link);
    const paramsMail = "&email=" + encodeURIComponent(mail);

    xmlhttp.send(paramsUsername + paramsLink + paramsMail);
}


/**
 * This function will activate the Php-Script to send the mail
 */
function activatePhp() { //Php skript wird ausgeführt
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            // Erfolgreiche Antwort vom Server erhalten
            console.log(this.responseText);
        }
    }
    xmlhttp.open("GET", "send_mail.php", true);
    xmlhttp.send();
}


/**
 * This function will start the functions to reset the password.
 */
function passwordReset() {

    if (checkNewPassword()) {

        changePassword();
        document.getElementById('resetPassword').classList.remove('d-none');

        setTimeout(() => {
            document.getElementById('resetPassword').classList.add('d-none');
        }, 1000); // Lets the EmailSent-Container vanish after 3 seconds

        showAndHideElements(['signUp', 'loginContainer'], ['signUpContainer', 'resetPwContainer', 'forgotPwContainer']);

    } else {
        document.getElementById('passwordDontMatch').style = 'color: red';
        document.getElementById('confirmedPasswordContainer').style = 'border: 1px solid red';
    }
}


/**
 *  This function changes the password.
 */
function changePassword() {
    const newPassword = document.getElementById('newPassword').value;

    users.forEach(user => {

        if (changePasswordEmail == user.email) user.password = newPassword;
    });
}


/**
 * This function checks if the new password and and the confirmed password matches.
 * 
 * @returns {boolean} Returns true if the passwords match and false if they don´t match
 */
function checkNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmedPassword = document.getElementById('confirmedPassword').value;

    return newPassword == confirmedPassword;
}