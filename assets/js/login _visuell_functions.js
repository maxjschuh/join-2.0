//Other functions

/**
 * This function will set and reset the tick in the "Remember me" box
 */
function setTick() {

    if (!tickCount) rememberMe = true;
    else rememberMe = false;

    toggleElements(['tick'], 'd-none', !rememberMe);
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
function screenSmallerThan900Px() {
    return window.innerWidth <= 900;
}


/**
 * This function is switching the image next to the password inputfield onkeyup
 */
function switchPasswordPicture() {
    const passwordInput = document.getElementById("password");

    if (!passwordInput.value) {
        toggleElements(['lock'], 'd-none', false);
        toggleElements(['showPassword', 'hidePassword'], 'd-none', true);
        return;

    }
    toggleElements(['lock'], 'd-none', true);

    if (passwordInput.type === "password") {
        showAndHideElements(['hidePassword'], ['lock', 'showPassword']);

    } else {
        showAndHideElements(['showPassword'], ['lock', 'hidePassword']);
    }
}


/**
 * This function is used to switch the password inputfield image onclick
 */


function togglePasswordVisibility() {

    let passwordInput = document.getElementById("password");
    let bool;

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        bool = false;

    } else {

        passwordInput.type = "password";
        bool = true;
    }

    toggleElements(['showPassword'], 'd-none', bool);
    toggleElements(['hidePassword'], 'd-none', !bool);
}


/**
 * This function is used to change the border of the parent-element of the inputfield
 * @param {string} event the active event
 * @returns if the event target is not "input", the event type is not "focus" or "blur"
 */
function activeInputfield(event) {

    const activeInput = event.target;
    let style;

    if (activeInput.tagName !== "INPUT") return;

    if (event.type === "focus") style = "border: 1px solid #29ABE2;";

    else if (event.type === "blur") style = "";

    else return;

    const activeInputfieldId = activeInput.id;
    document.getElementById(activeInputfieldId).parentNode.style = style;
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
 * This function waits till the animation is done and shows then the login windows
 */
function waitForAnimation() {

    let timeout;

    if (screenSmallerThan900Px()) { // Der Code für den Fall, dass die Bildschirmbreite kleiner oder gleich 900px ist

        showAndHideElements(['mobileStartScreen'], ['loginContainer']);

        setTimeout(() => {
            toggleElements(['mobileStartScreen'], 'd-none', true);
            setInlineStyle(['joinPic'], 'display: block');
        }, 0); //300

        timeout = 1300;

    } else timeout = 1000; // Der Code für den Fall, dass die Bildschirmbreite größer als 900px ist

    setTimeout(() => {

        toggleElements(['loginContainer', 'signUp'], 'd-none', false);
    }, 0);
}


/**
 * Will start an animation for the element with the id that is passed as parameter.
 * @param {string} id of html element
 */
function playAnimation(id) {

    toggleElements([id], 'd-none', false);

    setTimeout(() => {

        toggleElements([id], 'd-none', true); // Lets the EmailSent-Container vanish after 3 seconds
    }, 1000);
}

//Eventlistener

document.addEventListener("focus", activeInputfield, true); // gets the inputfield which is in focus
document.addEventListener("blur", activeInputfield, true); // get the inputfield which looses the focus
window.addEventListener('resize', handleResize); // checks if the screen is resizing