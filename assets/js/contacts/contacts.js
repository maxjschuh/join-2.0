let firstLetters = [];
let contacts;
let users;
let guestAccountEmail = 'guest@mail.com';
const ALLOWED_CHARACTERS = /^[\w\s@.-]+$/; //Matches one or more word characters (alphanumeric + underscore), spaces, "@" symbol, "-", and ".".
let contactFormValid = false;

/**
 * This onload-function starts the most important functions.
 */
async function initContact() {
    await init();
    contacts = database.contacts;
    users = database.users;
    firstLetters = []
    loadContacts();
}


/**
 * This function gets the first letter of a name and puts it in alphabetical order.
 */
function loadContacts() {

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const firstLetter = contact.firstname.charAt(0).toLowerCase();

        if (!firstLetters.includes(firstLetter)) firstLetters.push(firstLetter);
    }
    firstLetters.sort();
    renderContactList();
}


/**
 * This function renders the capital letter as alphabetical category of the contact list
 */
function renderContactList() {

    emptyInnerHTML(['contact-list']);
    const contactList = document.getElementById('contact-list');

    firstLetters.forEach(firstLetter => {

        contactList.innerHTML += templateContactListFirstLetterSeparator(firstLetter);
        renderContactsWithFirstLetter(firstLetter, contactList);
    });
}


/**
 * Renders the contact entries in the contact list for a specific first letter that is passed as parameter.
 * @param {string} firstLetter of the contact's firstname which should be rendered
 * @param {object} contactList the html element, where the contacts should be rendered
 */
function renderContactsWithFirstLetter(firstLetter, contactList) {

    contacts.forEach((contact, index) => {

        if (contact.email === guestAccountEmail) return;

        const contactFirstLetter = contact.firstname.charAt(0).toLowerCase();

        if (contactFirstLetter === firstLetter) contactList.innerHTML += templateContactListEntry(contact, index);
    });
}


/**
 * This function changes the color of a user in the contact list when clicked on.
 */
function changeContactColor() {
    const elements = document.querySelectorAll(".contact-list-box");

    elements.forEach(element => element.classList.remove('change-background-color'));
}


/**
 * This function shows the contact details of a selected user
 * @param {number} i  - index of the database.contacts array
 */
function openContactDetails(i) {
    changeContactColor();

    const id = `userSmall-${i}`;
    toggleElements([id], 'change-background-color', true);

    const showDetails = document.getElementById('selectedContact');
    showDetails.innerHTML = templateContactDetails(i);

    if (window.matchMedia('screen and (max-width: 900px)').matches) changeMobileView(true);
}


/**
 * Shows or hides the mobile view.
 * @param {boolean} direction_of_operation true for showing, false for hiding
 */
function changeMobileView(direction_of_operation) {

    document.getElementById('contact-left-arrow').classList.toggle('visibility', direction_of_operation);

    let ids = ['contacts-container', 'contact-kanban', 'headline', 'selectedContact'];
    toggleElements(ids, 'show-contact-selection-overlay', direction_of_operation);

    ids = ['contact-list', 'contact-edit', 'contact-trash', 'mobile-contact-button-container']
    toggleElements(ids, 'd-none', direction_of_operation);

    ids = ['edit-contact-icon', 'trash-icon', 'contact-kanban']
    toggleElements(ids, 'd-none', !direction_of_operation);
}


/**
 * This function opens the add new contact overlay form.
 */
function openNewContactForm() {

    toggleElements(['overlaySection'], 'd-none', false);

    toggleElements(['contactOverlayBoxAdd'], 'contact-overlay-box-animate', true);
}


function validateInput(inputId) {

    const inputValue = document.getElementById(inputId).value;
    const alert = document.getElementById(inputId + 'Alert');

    if (ALLOWED_CHARACTERS.test(inputValue) || !inputValue) {
        alert.innerHTML = '';
    } else {
        contactFormValid = false;
        alert.innerHTML = 'Allowed characters: a-z, A-Z, 0-9, - , _ , @, [space]';
    }

}


function validateNewContactForm() {

    const inputFields = [
        { value: document.getElementById('newContactFirstName').value, alertId: 'firstNameAlert' },
        { value: document.getElementById('newContactLastName').value, alertId: 'lastNameAlert' },
        { value: document.getElementById('newContactEmail').value, alertId: 'emailAlert' },
        { value: document.getElementById('newContactPhone').value, alertId: 'phoneAlert' }
    ];

    inputFields.forEach((inputField) => {

        if (allowedCharacters.test(inputField.value)) return;

        toggleElements([inputField.alertId], 'd-none', false);

    });
}

function submitEditContactForm(currentEmail) {

    const inputIds = ['editFirstName', 'editLastName', 'editEmail', 'editPhone'];
    contactFormValid = true;

    inputIds.forEach(inputId => {

        validateInput(inputId);
    });

    checkIfEmailAlreadyExists('newContactEmail', currentEmail);

    if (contactFormValid) saveEditedUser();
}

function submitNewContactForm() {
    const inputIds = ['newContactFirstName', 'newContactLastName', 'newContactEmail', 'newContactPhone'];
    contactFormValid = true;

    inputIds.forEach(inputId => {

        validateInput(inputId);
    });

    checkIfEmailAlreadyExists('newContactEmail');

    if (contactFormValid) addContact();
}

function checkIfEmailAlreadyExists(inputId, currentEmail) {

    const newContactEmail = document.getElementById(inputId).value;
    const alert = document.getElementById(inputId + 'Alert');

    if (currentEmail === newContactEmail) return;

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact.email === newContactEmail) {
            contactFormValid = false;
            alert.innerHTML = 'E-mail already in use!';
            return;
        }
    }
}





/**
 * This function adds a new contact to contacts object and saves it in the remote storage.
 */
async function addContact() {

    const { firstName, lastName, email, phone } = getContactData();
    addContactToContacts(firstName, lastName, email, phone, generateRandomColor());

    await setItem('database', database);
    resetValue(['newContactFirstName', 'newContactLastName', 'newContactEmail', 'newContactPhone']);

    disableButton();
    userCreatedSuccess();
    closeContactOverlay();

    // if (window.location.pathname === '/join/contacts.html') loadContacts();
}


/**
 * This function gets the data from the add contact input fields
 * @returns the name, email address and phone number from the input fields
 */
function getContactData() {
    const firstName = document.getElementById('newContactFirstName').value;
    const lastName = document.getElementById('newContactLastName').value;
    const email = document.getElementById('newContactEmail').value;
    const phone = document.getElementById('newContactPhone').value;

    return { firstName, lastName, email, phone };
}


/**
 * This function adds a new contact with it's object information to the array contacts
 * @param {string} firstname 
 * @param {string} lastname 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} color 
 */
function addContactToContacts(firstname, lastname, email, phone, color) {
    const contact = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        color: color
    }
    contacts.push(contact);
}


/**
 * This function disables the hover effect and the onclick on the add new contact button.
 */
function disableButton() {
    document.getElementById('create-contact').removeAttribute("onclick");

    if (window.location.pathname == '/contacts.html') {

        toggleElements(['user-contact-button'], 'button-hover:hover', false);
    }
}


/**
 * This function creates the popup window after a new contact was created successfully.
 */
function userCreatedSuccess() {
    const popup = document.createElement('div');
    popup.classList.add('popup-contact-created');
    popup.innerHTML = /*html*/ `<p>Contact successfully created</p>`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}


/**
 * This function deletes a selected contact and saves the new status in the remote storage
 * @param {number} i - index of the database.contacts array
 */
async function deleteContact(i) {
    const toDelete = contacts[i];
    deleteContactsFromTask(toDelete);
    contacts.splice(i, 1);
    await setItem('database', database);

    if (document.getElementById("contactOverlayBoxEdit")) closeOverlayEdit();
    await initContact();
    updateContactSelection();
}


/**
 * This function closes the add new contact form.
 */
function closeContactOverlay() {

    toggleElements(['contactOverlayBoxAdd'], 'contact-overlay-box-animate', false);

    setTimeout(() => {

        toggleElements(['overlaySection'], 'd-none', true);
    }, 300);
}


/**
 * This function opens the edit contact form
 * @param {number} i - index of the database.contacts array 
 */
function editContact(i) {
    const editDetails = contacts[i];
    document.getElementById('editContact').innerHTML = templateContactOverlayEdit(i, editDetails);
    setTimeout(() => {

        toggleElements(['contactOverlayBoxEdit'], 'contact-overlay-box-animate', true);
    }, 20);
}


/**
 * This functions shows and saves the edited user information 
 * @param {number} i - index of the database.contacts array
 */
async function saveEditedUser(i) {
    const name = document.getElementById('editName').value;
    const { firstName, lastName } = getFirstAndLastName(name);
    contacts[i]['firstname'] = firstName;
    contacts[i]['lastname'] = lastName;
    contacts[i]['email'] = document.getElementById('editEmail').value;
    contacts[i]['phone'] = document.getElementById('editPhone').value;

    await setItem('database', database);

    closeOverlayEdit();
    openContactDetails(i);
    loadContacts();
}


/**
 * This function closes the edit contact form.
 */
function closeOverlayEdit() {

    toggleElements(['contactOverlayBoxEdit'], 'contact-overlay-box-animate', false);
    setTimeout(() => {
        document.getElementById('editContact').innerHTML = '';
    }, 350);
}


/**
 * This function updates the contact list after a contact was deleted.
 */
function updateContactSelection() {
    let selectedContact = document.getElementById('selectedContact');
    selectedContact.innerHTML = '';

    loadContacts();
}


/**
 * This function deletes a user contact from a task and from the database
 * @param {string} contactToDelete - the contact to be deleted
 */
function deleteContactsFromTask(contactToDelete) {
    const toDelete = contactToDelete.firstname + ' ' + contactToDelete.lastname;
    database.tasks.forEach(task => {
        const assignedIndex = task.assigned_to.indexOf(toDelete);
        if (assignedIndex !== -1) task.assigned_to.splice(assignedIndex, 1);
    });
}