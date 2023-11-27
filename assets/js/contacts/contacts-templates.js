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
    let userDetails = contacts[i];
    return /*html*/`
        <div class="contact-card">
            <div class="contact-card-container">
                <div class="contact-user-initiale" style="background-color:${userDetails['color']}">
                    ${userDetails['firstname'].charAt(0).toUpperCase()}${userDetails['lastname'].charAt(0).toUpperCase()} </div>
                <div>
                    <div class="contact-member">${userDetails['firstname']} ${userDetails['lastname']}</div>
                    <div class="editorial">
                        <div class="contact-edit" id="contact-edit" onclick="editContact(${i})">
                            <div><img src="./assets/img/contact_edit_new.png" alt="" class="contact-edit-pen">Edit</div>
                        </div>
                        <div class="contact-edit" id="contact-trash" onclick="deleteContact(${i})">
                            <img class="delete-icon" id="delete-icon" src="./assets/img/contacts_trash.png" alt="">Delete
                        </div>
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
            <img class="trash-icon d-none" id="trash-icon" src="./assets/img/contact_delete_button.png" alt=""
                onclick="changeMobileView(false), deleteContact(${i})">
            <img class="edit-contact-icon d-none" id="edit-contact-icon" onclick="editContact(${i})"
                src="./assets/img/contact_edit_small.png" alt="">
        </div>
        </div> 
    `;
}


/**
 * 
 * @param {number} i - index of the database.contacts array
 * @param {object} editDetails - shows the selected user details for editing
 * @returns {string} the HMTL code of the edit contact form
 */
function templateContactOverlayEdit(i, editDetails) {
    return /*html*/ `
<div class="contact-overlay-container">
    <div class="contact-overlay-box" id="contactOverlayBoxEdit">
        <div class="contact-overlay-container-section">
            <div class="contact-overlay-section">
                <div onclick="closeOverlayEdit()" class="close-form-mobile"><img
                        src="./assets/img/contact_close_mobile.png" class="cursor-pointer" alt=""></div>
                <div class="overlay-text-container">
                    <img class="contact-overlay-logo" src="./assets/img/join_small.png" alt="">
                    <div class="contact-overlay-headline">Edit contact</div>
                    <div class="contact-overlay-divider"></div>
                </div>
            </div>
            <div class="contact-overlay-form-section">
                <div onclick="closeOverlayEdit()" class="close-form"><img src="./assets/img/contact_close_form.png" class="cursor-pointer"
                        alt=""></div>
                <div class="contact-overlay-form-box">

                    <div class="contact-initials" style="background-color:${editDetails['color']}">
                        ${editDetails['firstname'].charAt(0).toUpperCase()}${editDetails['lastname'].charAt(0).toUpperCase()}
                    </div>

                    <form class="contact-form-container">
                        <input class="contact-overlay-name" required type="text" id="editName" style="color: rgb(0,0,0)"
                            value="${editDetails['firstname']} ${editDetails['lastname']}">
                        <input class="contact-overlay-email" required type="email" id="editEmail"
                            style="color: rgb(0,0,0)" value="${editDetails['email']}">
                        <input class="contact-overlay-phone" required type="tel" id="editPhone"
                            style="color: rgb(0,0,0)" value="${editDetails['phone']}">
                    </form>
                </div>
                <div class="contact-overlay-buttons">
                    <button class="contact-delete-button" onclick="deleteContact(${i})">
                        <div>Delete</div>
                    </button>
                    <button onclick="saveEditedUser(${i})" class="contact-save-button">
                        <div>Save</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
}
