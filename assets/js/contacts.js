let firstLetters = [];

/**
 * This onload-function starts the most important functions.
 */
async function initContact() {
    await init();
    contacts = database.contacts;
    users = database.users;
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
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    renderContactList(firstLetters);
}


/**
 * This function renders the capital letter as alphabetical category of the contact list
 * @param {string} firstLetters - The first letter of contact['firstname'].
 */
function renderContactList(firstLetters) {

    const contactList = document.getElementById('contact-list');

    firstLetters.forEach(firstLetter => {

        contactList.innerHTML += templateContactFirstLetters(firstLetter);
        renderFirstLetter(firstLetter);

    });
}


/**
 * Uses the first letter, then creates a small user entry in the contact list
 * @param {string} firstLetter - The first letter of contact['firstname'].
 */
function renderFirstLetter(firstLetter) {
    for (let i = 0; i < contacts.length; i++) {
        const userData = contacts[i];
        const contactFirstLetter = userData.firstname.charAt(0).toLowerCase();

        if (contactFirstLetter === firstLetter) {
            let contactList = document.getElementById('contact-list');
            contactList.innerHTML += templateContactList(userData, i);
        }
    }
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
    let newContact = document.getElementById('overlaySection');
    newContact.innerHTML = templateAddContactOverlay();

    setTimeout(() => {

        toggleElements(['contactOverlayBoxAdd'], 'contact-overlay-box-animate', true);
    }, 10);
}


/**
 * This function checks if all input fields are filled in.
 * @returns {boolean} false if the form is invalid, true if the form is valid
 */
function validateForm() {

    let form_complete = true;

    const inputFields = [
        { value: document.getElementById("newContactName").value, alertId: 'nameAlert' },
        { value: document.getElementById("newContactEmail").value, alertId: 'emailAlert' },
        { value: document.getElementById("newContactPhone").value, alertId: 'phoneAlert' }];

    inputFields.forEach((inputField) => {

        if (inputField.value) return;

        showAlert(inputField.alertId);
        form_complete = false;
    });

    return form_complete;
}


/**
 * Shows an alert for the input field that is passed as parameter.
 * @param {string} id of the empty input field
 */
function showAlert(id) {

    toggleElements([id], 'noAlert', false);
    toggleElements([id], 'alert', true);
}


/**
 * This function gets the data from the add contact input fields
 * @returns the name, email address and phone number from the input fields
 */
function getContactData() {
    const name = document.getElementById('newContactName').value;
    const email = document.getElementById('newContactEmail').value;
    const phone = document.getElementById('newContactPhone').value;

    return { name, email, phone };
}


/**
 * This function adds a new contact to contacts object and saves it in the remote storage.
 */
async function addContact() {
    const { name, email, phone } = getContactData();
    const { firstName, lastName } = getFirstAndLastName(name);
    addContactToContacts(firstName, lastName, email, phone, generateRandomColor());

    await setItem('database', database);
    resetForm(name, email, phone);
    disableButton();
    userCreatedSuccess();
    closeContactOverlay();

    if (window.location.pathname == '/contacts.html') loadContacts();
}


/**
 * This function adds a new contact with it's object information to the array contacts
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string} email 
 * @param {number} phone 
 * @param {string} initialColor 
 */
function addContactToContacts(firstName, lastName, email, phone, initialColor) {
    contacts.push({
        "firstname": `${firstName}`,
        "lastname": `${lastName}`,
        "email": `${email}`,
        "phone": `${phone}`,
        "color": `${initialColor}`
    });
}


/**
 * This function splits the name from the input field and extracts first and last name
 * @param {string} fullName from the name input field
 * @returns firstName, lastName 
 */
function getFirstAndLastName(fullName) {
    const fullNameArray = fullName.split(' ');
    const firstName = fullNameArray[0].charAt(0).toUpperCase() + fullNameArray[0].slice(1);
    let lastName = '';

    if (fullNameArray.length > 1) lastName = fullNameArray[1].charAt(0).toUpperCase() + fullNameArray[1].slice(1);
    return { firstName, lastName };
}


/**
 * This function empties the input fields of the add contact form.
 * @param {object} name 
 * @param {object} email 
 * @param {object} phone 
 */
function resetForm(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
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
    deleteContatctsFromTask(toDelete);
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

        emptyInnerHTML(['overlaySection']);
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
function deleteContatctsFromTask(contactToDelete) {
    const toDelete = contactToDelete.firstname + ' ' + contactToDelete.lastname;
    database.tasks.forEach(task => {
        const assignedIndex = task.assigned_to.indexOf(toDelete);
        if (assignedIndex !== -1) task.assigned_to.splice(assignedIndex, 1);
    });
}