let firstLetters = [];
let contacts;
let users;

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
 * Resets the contact buttons in the contact list to their default state (unselected):
 */
function resetListButtons() {

    let ids = [];

    for (let i = 0; i < database.contacts.length; i++) {
        const id = `userSmall-${i}`;
        ids.push(id);
    }

    toggleElements(ids, 'change-background-color', false);
}


/**
 * Shows or hides the mobile view.
 * @param {boolean} direction_of_operation true for showing, false for hiding
 */
function changeMobileView(direction_of_operation) {

    if (!direction_of_operation) resetListButtons();

    document.getElementById('contact-left-arrow').classList.toggle('visibility', direction_of_operation);
    toggleElements(['contacts-container'], 'd-flex', true);

    try {

        ids = ['mobile-contact-button-container', 'contact-list', 'contact-edit', 'contact-trash']
        toggleElements(ids, 'd-none', direction_of_operation);

        ids = ['edit-contact-icon', 'trash-icon', 'contact-kanban']
        toggleElements(ids, 'd-none', !direction_of_operation);

    } catch { }
}


/**
 * This function opens the add new contact overlay form.
 */
function openNewContactForm() {

    toggleElements(['newContact'], 'd-none', false);

    setTimeout(() => {

        toggleElements(['contactOverlayBoxAdd'], 'contact-overlay-box-animate', true);
    }, 10);
}


/**
 * This function closes the add new contact form.
 */
function closeContactOverlay() {

    resetValue([
        'newContactFirstName',
        'newContactLastName',
        'newContactEmail',
        'newContactPhone',
        'newContactFirstNameAlert',
        'newContactLastNameAlert',
        'newContactEmailAlert',
        'newContactPhoneAlert'
    ]);

    toggleElements(['contactOverlayBoxAdd'], 'contact-overlay-box-animate', false);

    setTimeout(() => {

        toggleElements(['newContact'], 'd-none', true);
    }, 500);
}


/**
 * Onclick function that submits the changes that have been made in the edit contact form. The input values are validated. If they are ok, the edited contacted data is saved, otherwise alerts are shown.
 * @param {number} i index of the contact that has been edited in the database.contacts
 */
async function submitEditContactForm(i) {

    const inputIds = ['editFirstName', 'editLastName', 'editEmail', 'editPhone'];
    formValid = true;

    inputIds.forEach(inputId => {

        validateInput(inputId);
    });

    checkIfEmailAlreadyExists('editEmail', contacts[i].email);

    if (formValid) await saveEditedUser(i);
}


/**
 * This functions shows and saves the edited user information 
 * @param {number} i - index of the database.contacts array
 */
async function saveEditedUser(i) {

    const contactToEdit = contacts[i];
    contactToEdit.firstname = document.getElementById('editFirstName').value.trim();
    contactToEdit.lastname = document.getElementById('editLastName').value.trim();
    contactToEdit.email = document.getElementById('editEmail').value.trim();
    contactToEdit.phone = document.getElementById('editPhone').value.trim();

    await setItem('database', database);

    closeOverlayEdit();
    openContactDetails(i);
    loadContacts();
}


/**
 * Onclick function that submits the inputs that have been made in the new contact form. The input values are validated. If they are ok, a new contact with the inputted data is created, otherwise alerts are shown.
 */
function submitNewContactForm() {
    const inputIds = ['newContactFirstName', 'newContactLastName', 'newContactEmail', 'newContactPhone'];
    formValid = true;

    inputIds.forEach(inputId => {

        validateInput(inputId);
    });

    checkIfEmailAlreadyExists('newContactEmail');

    if (formValid) addContact();
}


/**
 * Checks if a email that the user has entered in the edit- or new-contact form is already in use by a contact.
 * @param {string} inputId id of the input element where the email to check has been entered
 * @param {string} currentEmail of the contact that is being edited
 * @returns if the email of a existing contact has not been changed by the user
 */
function checkIfEmailAlreadyExists(inputId, currentEmail) {

    const newContactEmail = document.getElementById(inputId).value.trim();
    const alert = document.getElementById(inputId + 'Alert');

    if (currentEmail === newContactEmail) return;

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact.email === newContactEmail) {
            formValid = false;
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

    if (window.location.pathname === '/contacts.html') loadContacts();
}


/**
 * This function gets the data from the add contact input fields
 * @returns {object} the name, email address and phone number from the input fields
 */
function getContactData() {
    const firstName = document.getElementById('newContactFirstName').value.trim();
    const lastName = document.getElementById('newContactLastName').value.trim();
    const email = document.getElementById('newContactEmail').value.trim();
    const phone = document.getElementById('newContactPhone').value.trim();

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
 * This function opens the edit contact form
 * @param {number} i - index of the database.contacts array 
 */
function editContact(i) {

    const contactToEdit = contacts[i];

    toggleElements(['editContact'], 'd-none', false);

    document.getElementById('editContactForm').onsubmit = () => {
        submitEditContactForm(i);
        return false;
    };
    document.getElementById('contact-delete-button').onclick = () => { deleteContact(i); };

    document.getElementById('editFirstName').value = contactToEdit.firstname;
    document.getElementById('editLastName').value = contactToEdit.lastname;
    document.getElementById('editEmail').value = contactToEdit.email;
    document.getElementById('editPhone').value = contactToEdit.phone;
    document.getElementById('contact-initials').style = `background-color:${contactToEdit.color}`;

    document.getElementById('contact-initials').innerHTML =
        (contactToEdit.firstname.charAt(0) + contactToEdit.lastname.charAt(0)).toUpperCase();

    setTimeout(() => {
        toggleElements(['contactOverlayBoxEdit'], 'contact-overlay-box-animate', true);
    }, 20);
}


/**
 * This function closes the edit contact form.
 */
function closeOverlayEdit() {

    toggleElements(['contactOverlayBoxEdit'], 'contact-overlay-box-animate', false);
    setTimeout(() => {

        toggleElements(['editContact'], 'd-none', true);
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

    database.tasks.forEach(task => {

        const assignedIndex = task.assigned_to.indexOf(contactToDelete.email);
        if (assignedIndex !== -1) task.assigned_to.splice(assignedIndex, 1);
    });
}