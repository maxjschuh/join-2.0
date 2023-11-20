//Other functions

/**
 * This function will set and reset the tick in the "Remember me" box
 */
function setTick() {
    if (!tickCount) {
        document.getElementById('tick').classList.remove('d-none');
        rememberMe = true;
    }
    else {
        document.getElementById('tick').classList.add('d-none');
        rememberMe = false;
    }
    tickCount++;
    if (tickCount >= 2) tickCount = 0;
}


/**
 * This function is used to fill in the login data if the remember me tick is set
 */
function fillInData() {
    document.getElementById('email').value = currentEmail;
    document.getElementById('password').value = currentPassword;
    setTick();
}


/**
 * This function is used to check the width of the screen
 * 
 * @returns it returns true when the screen is smaller than 900px
 */
function checkScreenSize() {
    return window.innerWidth <= 900;
}


/**
 * This function is switching the image next to the passwort inputfield onkeyup
 */
function switchPasswordPicture() {
    const passwordInput = document.getElementById("password");

    if (!passwordInput.value) {
        toggleElements(['lock'], 'd-none', false);
        toggleElements(['showPassword', 'hidePassword'], 'd-none', true);

    } else {

        if (passwordInput.type == "password") {
            toggleElements(['lock', 'showPassword'], 'd-none', true);
            toggleElements(['hidePassword'], 'd-none', false);

        } else {
            toggleElements(['lock', 'hidePassword'], 'd-none', true);
            toggleElements(['showPassword'], 'd-none', false);
        }
    }
}


/**
 * This function is used to switch the password inputfield image onclick
 */
function showPassword1() {
    let passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        document.getElementById('showPassword').classList.remove('d-none');
        document.getElementById('hidePassword').classList.add('d-none');

    } else {
        passwordInput.type = "password";
        document.getElementById('showPassword').classList.add('d-none');
        document.getElementById('hidePassword').classList.remove('d-none');
    }
}


/**
 * This function is used to change the border of the parent-element of the inputfield
 * 
 * @param {string} event This is the active event
 */
function activeInputfield(event) {
    // Hole das aktuell aktive Element
    const activeInput = event.target;

    // Überprüfe, ob das aktive Element ein Input-Feld ist
    if (activeInput.tagName === "INPUT") {
        if (event.type === "focus") {
            // Das Input-Feld hat den Fokus erhalten
            const activeInputfieldId = activeInput.id;
            document.getElementById(activeInputfieldId).parentNode.style = "border: 1px solid #29ABE2;";
        } else if (event.type === "blur") {
            // Das Input-Feld hat den Fokus verloren
            const activeInputfieldId = activeInput.id;
            document.getElementById(activeInputfieldId).parentNode.style = "";
        }
    }
}


/**
 * This function is used to restart the animation when the screen is resized
 */
function handleResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth == 900) waitForAnimation();
}


/**
 * This function is used to disable a button after clicking it
 * 
 * @param {string} buttonId The id of the button which will be disabled
 */
function disableButton(buttonId) {
    let button = document.getElementById(buttonId);

    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
    }, 2000);
}

//HTML functions

/**
 * This function will open the window to register a user
 */
function openRegister() {

    toggleElements(['signUp', 'loginContainer', 'resetPwContainer'], 'd-none', true);
    toggleElements(['signUpContainer'], 'd-none', false);
}


/**
 * This function will open the window to login
 */
function openLogin() {

    toggleElements(['signUp', 'loginContainer'], 'd-none', false);
    toggleElements(['signUpContainer', 'resetPwContainer', 'forgotPwContainer'], 'd-none', true);
}


/**
 * This function will open the window to request a passwort change
 */
function openForgotPw() {

    toggleElements(['signUp', 'loginContainer', 'resetPwContainer', 'signUpContainer'], 'd-none', true);
    toggleElements(['forgotPwContainer'], 'd-none', false);
}


/**
 * This function will open the window to change the password
 */
function openResetPw() {
    
    toggleElements(['signUp', 'loginContainer', 'forgotPwContainer', 'signUpContainer'], 'd-none', true);
    toggleElements(['resetPwContainer'], 'd-none', false);
}


/**
 * This function waits till the animation is done and shows then the login windows
 */
function waitForAnimation() {
    if (checkScreenSize()) {
        // Der Code für den Fall, dass die Bildschirmbreite kleiner oder gleich 900px ist

        toggleElements(['mobileStartScreen'], 'd-none', false);
        toggleElements(['loginContainer', 'signUp'], 'd-none', true);

        setTimeout(() => { document.getElementById('mobileStartScreen').classList.add('d-none'); document.getElementById('joinPic').style = 'display: block'; }, 300);
        setTimeout(() => { document.getElementById('loginContainer').classList.remove('d-none'); document.getElementById('signUp').classList.remove('d-none'); }, 1300);
    }
    else {
        // Der Code für den Fall, dass die Bildschirmbreite größer als 900px ist
        setTimeout(() => { document.getElementById('loginContainer').classList.remove('d-none'); document.getElementById('signUp').classList.remove('d-none'); }, 1000);
    }
}


/**
 * Will start the animation that the email was sent
 */
function emailSentAnimation() {
    document.getElementById('emailSent').classList.remove('d-none');
    setTimeout(() => { document.getElementById('emailSent').classList.add('d-none'); }, 1000); // Lets the EmailSent-Container vanish after 3 seconds
}


/**
 * Will start the animation that an account has been created
 */
function accountCreatedAnimation() {
    document.getElementById('accountCreated').classList.remove('d-none');
    setTimeout(() => { document.getElementById('accountCreated').classList.add('d-none'); }, 1000); // Lets the EmailSent-Container vanish after 3 seconds
}

//Eventlistener

document.addEventListener("focus", activeInputfield, true); // gets the inputfield which is in focus
document.addEventListener("blur", activeInputfield, true); // get the inputfield which looses the focus
window.addEventListener('resize', handleResize); // checks if the screen is resizing