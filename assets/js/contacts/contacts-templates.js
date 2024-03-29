/**
 * @param {string} firstLetter 
 * @returns {string} the HTML content of the alphabetical category of the contact list
 */
 function templateContactListFirstLetterSeparator(firstLetter) {
    return /*html*/`
    <div id="contact-list-letter">
        <div class="contact-letter" id="contact-index">${firstLetter.toUpperCase()}</div>
    </div>`;
}


/**
 * @param {object} userData - the contact to be rendered in the template
 * @param {number} i - index of the database.contacts array
 * @returns {string} the HTML code of the overview user data in the contact list 
 */
function templateContactListEntry(userData, i) {
    return /*html*/`
        <div class="contact-list-box" id="userSmall-${i}" onclick="openContactDetails(${i})">
            <div>
                <div style="background-color:${userData['color']}"  class="contact-initials-small" id="listIcon"> ${userData['firstname'].charAt(0).toUpperCase()}${userData['lastname'].charAt(0).toUpperCase()} </div>
            </div>
            <div>
                <div class="contact-list-name">${userData['firstname']} ${userData['lastname']}</div>
                <a class="contact-phone-email-field" href="mailto:${userData['email']}">${userData['email']}</a>
            </div>
        </div>
    `;
}


/**
 * @param {number} i - index of the database.contacts array
 * @returns {string} the HTML code of the selected user details
 */
function templateContactDetails(i) {
    const userDetails = contacts[i];
    return /*html*/`
        <div class="contact-card">
            <div class="contact-card-container">
                <div class="contact-user-initiale" style="background-color:${userDetails['color']}">
                    ${userDetails['firstname'].charAt(0).toUpperCase()}${userDetails['lastname'].charAt(0).toUpperCase()} </div>
                <div>
                    <div class="contact-member">${userDetails['firstname']} ${userDetails['lastname']}</div>
                    <div class="editorial">

                        ${templateDetailButtons(i)}
                    </div>
                </div>
            </div>
        </div>
        <div class="contact-info-box">
            <div class="contact-info">Contact information</div>
        </div>
        <div>
            <div class="contact-info-details">Email </div>
            <a class="contact-phone-email-field" href="mailto:${userDetails['email']}">${userDetails['email']}</a>
        </div>
        <div>
            <div class="contact-info-details2">Phone</div>
            <a class="contact-phone-email-field" href="tel:${userDetails.phone}">${userDetails.phone}</a>
        </div>
        
        <div class="contact-info-buttons" id="contact-info-buttons">
            <img class="trash-icon d-none" id="trash-icon" src="./assets/img/contact_delete_button.png" alt="x icon"
                onclick="changeMobileView(false), deleteContact(${i})">
            <img class="edit-contact-icon d-none" id="edit-contact-icon" onclick="editContact(${i})"
                src="./assets/img/contact_edit_small.png" alt="pen icon">
        </div>
        </div> 
    `;
}


/**
 * Template for the edit- and delete-buttons in the contacts detail view.
 * @param {number} i index of the contact to render in the database.contacts
 * @returns {string} empty string, if the guest user contact is rendered, to prevent its deletion; else html template for edit- and delete-buttons.
 */
function templateDetailButtons(i) {

    const indexOfGuestUserContact = 0;

    if (i === indexOfGuestUserContact) return '';

    else return /*html*/ `
        <div class="contact-edit" id="contact-edit" onclick="editContact(${i})">
            <div><img src="./assets/img/contact_edit_new.png" alt="new contact icon" class="contact-edit-pen">Edit</div>
        </div>
        <div class="contact-edit" id="contact-trash" onclick="deleteContact(${i})">
            <img class="delete-icon" id="delete-icon" src="./assets/img/contacts_trash.png" alt="recycle bin icon">Delete
        </div>
    `;
}