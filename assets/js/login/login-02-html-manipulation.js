/**
 * Changes the icon in the passwort input field, that is passed as parameter, according to its current value and type
 * @param {string} passwordId id of the specific input element whose icon should be set
 * @returns when the input field is empty
 */
function switchPasswordPicture(passwordId) {

    const input = document.getElementById(passwordId);

    if (!input.value) {
        showAndHideElements(['lock-' + passwordId], ['show-' + passwordId, 'hide-' + passwordId]);
        return;
    }

    toggleElements(['lock-' + passwordId], 'd-none', true);

    if (input.type === "password") showAndHideElements(['hide-' + passwordId], ['show-' + passwordId]);

    else showAndHideElements(['show-' + passwordId], ['hide-' + passwordId]);
}


/**
 * Shows the password as plain text or dots.
 * @param {string} passwordId id of the specific input element whose value should be displayed
 */
function togglePasswordVisibility(passwordId) {
    const input = document.getElementById(passwordId);

    if (input.type === "password") input.type = "text";

    else input.type = "password";
        
    switchPasswordPicture(passwordId);
}


/**
 * This function is used to change the border of the parent-element of the inputfield.
 * @param {object} event the active event
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
 * This function is used to disable a button after clicking it
 * @param {string} buttonId The id of the button which will be disabled
 */
function disableButton(buttonId) {
    let button = document.getElementById(buttonId);

    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
    }, 2000);
}


/**
 * This function waits till the animation is done and shows then the login windows
 */
function waitForAnimation() {

    let timeout;

    if (screenSmallerThan900Px()) {

        showAndHideElements(['mobileStartScreen'], ['loginContainer']);

        setTimeout(() => {
            toggleElements(['mobileStartScreen'], 'd-none', true);
            setInlineStyle(['joinPic'], 'display: block');
        }, 300);

        timeout = 1300;

    } else timeout = 1000;

    setTimeout(() => {

        toggleElements(['loginContainer', 'signUp'], 'd-none', false);
    }, timeout);
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