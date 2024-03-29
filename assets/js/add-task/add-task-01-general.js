let collectedContacts = [];
let taskContactList = [];
let contactPosition;
let initials = [];
let selectedCategory;
let prio;
let subtasks = [];
let subtaskStatus = [];
let categories = [];
let category = '';
let tasks = [];
let task = {
    "title": "",
    "description": "",
    "category": "",
    "assigned_to": [],
    "due_date": "",
    "prio": "",
    "subtasks": {
        "name": [],
        "status": []
    },
    "progress": "todo"
};
let newCategory;
let colorForNewCategory;
let colorForNewCategoryID;
let requiredFieldsEmpty = false;


/**
 * This function starts all important functions at onload.
 */
async function initTask() {
    await init();
    tasks = database.tasks;
    categories = database.categories;
    contacts = database.contacts;
    renderCategories();
    renderContacts();
    datePicker();
    renderloggedInUserinContactList();
    startEventListener();
}


/**
 * This function renders the actual user in 'Assigned to'.
 */
function renderloggedInUserinContactList() {
    document.getElementById('loggedInUserAddTask').innerHTML = `
    <div class="dd-placeholder gray-hover" onclick="selectedForTask(contacts[${searchContactwithEmail()}], 'contacts[${searchContactwithEmail()}]')">
        <div>You</div>
        <div class="task-select-box center">
            <div id="contacts[${searchContactwithEmail()}]"></div>
        </div>
    </div>
`
}


/**
 * This function searches for a user with the email address.
 * @returns - Index number
 */
function searchContactwithEmail() {

    for (let i = 0; i < database.contacts.length; i++) {

        const contact = database.contacts[i];
        if (loggedInUser.email == contact.email) return contacts.indexOf(contact);
    }
}


/**
 * This function renders the list of categories.
 */
function renderCategories() {
    categoryContainer = document.getElementById('loadedCategories');
    categoryContainer.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {

        const category = categories[i].name;
        const categoryColor = categories[i].color;

        categoryContainer.innerHTML += /*html*/ `

        <div class="dd-placeholder gray-hover" onclick="selectCategory('${category}', '${categoryColor}')">
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="task-category-color" style="background-color: ${categoryColor}"></div>
            </div>
        </div>`;
    }
}


/**
 * This function renders the list of contacts.
 */
function renderContacts() {
    contactContainer = document.getElementById('loadedContacts');
    contactContainer.innerHTML = '';

    contacts.forEach((contact, i) => {

        if (contact.email === loggedInUser.email) return;

        contactContainer.innerHTML += /*html*/ `

            <div class="dd-placeholder gray-hover" onclick="selectedForTask(contacts[${i}], 'contacts[${i}]')">
                <div>${contact.firstname} ${contact.lastname}</div>
                <div class="task-select-box center">
                    <div id="contacts[${i}]"></div>
                </div>
            </div>
        `;
    });
}


/**
 * In this function, the selected category is rendered using the 2 strings and the drop down menu is closed.
 * @param {string} category - Category that was selected.
 * @param {string} categoryColor - Category color in rgb.
 */
function selectCategory(category, categoryColor) {

    document.getElementById('chosenCategory').innerHTML = /*html*/ `
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="task-category-color" style="background-color: ${categoryColor};"></div>
            </div>
    `;

    selectedCategory = category;
    const classStatus = document.getElementById('category').classList
    if (classStatus.contains('dropdown-category-open')) {
        pullDownMenu('category', 'assignedTo', 'moreCategories', 'moreContacts');
    }
}


/**
 * In this function contacts are pushed into an array.
 * If the contact was already selected and is in the array, it will be deleted from the array.
 * @param {Object} selected - The complete contact information.
 * @param {string} id - ID of the contact's select box.
 */
function selectedForTask(selected, id) {

    if (taskContactList.includes(selected)) {

        removeContactsForTask(selected);
        toggleSelectionPoint(id, false);
        
    } else {
        taskContactList.push(selected);
        toggleSelectionPoint(id, true);
    }
    
    switchContactIcons();
    createInitials();
    renderInitials();
}


/**
 * This function removes a contact form the array.
 * @param {object} selected - Contact to remove.
 */
function removeContactsForTask(selected) {
    const index = taskContactList.indexOf(selected);
    taskContactList.splice(index, 1);
}


/**
 * Toggles a CSS property.
 * @param {string} id ID of the contact's select box
 * @param {boolean} direction_of_operation true for adding the selection point, false for removing it
 */
function toggleSelectionPoint(id, direction_of_operation) {

    document.getElementById(id).classList.toggle('selection-point', direction_of_operation);
}


/**
 * This function creates initials from the first and last name.
 */
function createInitials() {
    initials = [];
    taskContactList.forEach(currentContact => {
        const initial = getFirstLetters(currentContact);
        initials.push(initial);
    });
}


/**
 * This function creates initials from the first and last name.
 * @param {Object} contact - The complete contact information.
 * @returns {string} - The first letter of the first and last name.
 */
function getFirstLetters(contact) {
    const firstLetters = contact.firstname.charAt(0) + contact.lastname.charAt(0);;
    return firstLetters;
}


/**
 * This function removes all selected contacts, initials,
 * closes the drop down menu and re-renders the contacts.
 */
function clearContacts() {
    const classStatus = document.getElementById('assignedTo').classList;
    if (classStatus.contains('dropdown-category-open')) pullDownMenu('assignedTo', 'category', 'moreContacts', 'moreCategories');
    collectedContacts = [];
    taskContactList = [];
    initials = [];
    switchContactIcons('hide');
    renderContacts();
    renderloggedInUserinContactList();
    renderInitials();
}


/**
 * This function closes the drop down menu and hides the icons.
 */
function addContacts() {
    pullDownMenu('assignedTo', 'category', 'moreContacts', 'moreCategories');
    switchContactIcons('hide');
}


/**
 * This function renders the initials.
 */
function renderInitials() {
    initialsContainer = document.getElementById('initialsContainer');
    initialsContainer.innerHTML = '';
    if (taskContactList.length > 0) {
        for (let i = 0; i < initials.length; i++) {
            initialsContainer.innerHTML += /*html*/ `
            <div class="task-initials" style="background-color: ${contactColor(i)}" id="contactInitials${[i]}">${initials[i]}</div>`
        }
    }
}


/**
 * This function returns the color of the contact.
 * @param {number} i - Array position of the contact.
 * @returns  - The color of the contact (rgb).
 */
function contactColor(i) {
    return taskContactList[i].color;
}


/**
 * This function sets the background color for the respective button and sets the priority of the task.
 * @param {string} clicked - The ID of the clicked button.
 * @param {string} img - The ID of the Image from the clicked button.
 */
function priority(clicked, img) {
    resetPrioButton();
    element = document.getElementById(clicked);
    prioImg = document.getElementById(img);
    if (clicked === 'prioHigh') {
        setStyleforPrioButton(element, prioImg);
        element.style.backgroundColor = 'rgb(236, 85, 32)';
        prio = 'high';
    } if (clicked === 'prioMedium') {
        setStyleforPrioButton(element, prioImg);
        element.style.backgroundColor = 'rgb(243, 173, 50)';
        prio = 'medium';
    } if (clicked === 'prioLow') {
        setStyleforPrioButton(element, prioImg);
        element.style.backgroundColor = 'rgb(147, 222, 70)';
        prio = 'low';
    }
}


/**
 * This function sets style elements.
 * @param {boolean} element - ID element prio button.
 * @param {boolean} prioImg - ID element prio IMG.
 */
function setStyleforPrioButton(element, prioImg) {
    element.style.fontWeight = '700';
    element.style.color = 'white';
    prioImg.style.filter = 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(24%) hue-rotate(114deg) brightness(108%) contrast(108%)';
}


/**
 * This function resets the CSS classes and the images to default.
 */
function resetPrioButton() {

    const ids = ['prioHigh', 'prioMedium', 'prioLow', 'prioHighImg', 'prioMediumImg', 'prioLowImg'];

    setInlineStyle(ids, '');
}


/**
 * This function create a subtask. It pushes the input value and status into an array.
 * Renders the subtask and changes the icons.
 */
function addSubtask() {
    const subtaskInput = document.getElementById('subtaskInput').value.trim();
    if (containsBrackets(subtaskInput)) {
        document.getElementById('subTaskReport').innerHTML = 'The following characters are not allowed: { } [ ] "';

    } else if (!subtaskInput) {
        document.getElementById('subTaskReport').innerHTML = 'Empty subtasks are not allowed';

    } else {
        toggleElements(['subTaskReport'], 'd-none', true);
        subtasks.push(subtaskInput);
        subtaskStatus.push('false');
        renderSubtasks();
        switchSubtaskIcons();
        return;
    }
    toggleElements(['subTaskReport'], 'd-none', false);
}


/**
 * This function removes a subtask and subtask status and re-renders the remaining ones.
 * @param {number} i - Index of subtask
 */
function removeSubtask(i) {
    subtasks.splice(i, 1);
    subtaskStatus.splice(i, 1);
    renderSubtasks();
}


/**
 * This function renders the subtasks.
 */
function renderSubtasks() {
    const subtaskContainer = document.getElementById('addedSubtasks');
    subtaskContainer.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {

        subtaskContainer.innerHTML += /*html*/ `
            <div class="sub-task">
                <div>
                    <div onclick="setStatus('selectboxSubtask${i}', ${i})" class="selectbox-subtask pointer">
                        <img class="subtaskDone ${getClass(i)}" id="selectboxSubtask${i}" src="./assets/img/create_subtask.png">
                    </div>
                    <div>${subtasks[i]}</div>
                </div>
                <img class="pointer remove-subtask" src="./assets/img/board/close.svg" onclick="removeSubtask(${i}), ${i}" alt="delete-icon">
            </div>
        `;
    }
}


/**
 * This function checks whether a subtask is done or not and then returns the corresponding value.
 * @param {number} i - Index of the subtask.
 * @returns {string} - CSS class or ''.
 */
function getClass(i) {
    if (subtaskStatus[i] === 'true') return setClass = '';
    else return setClass = 'd-none';
}


/**
 * If a subtask's checkbox is clicked,
 * the CSS class 'd-none' will be removed or added and
 * subTaskStatus is set to true or false at the correct index.
 * @param {string} divID - ID of an div.
 * @param {number} i - Index of the subtask.
 */
function setStatus(divID, i) {
    if (subtaskStatus[i] === 'false') {
        toggleElements([divID], 'd-none', false);
        subtaskStatus.splice(i, 1, 'true');
    } else {
        toggleElements([divID], 'd-none', true);
        subtaskStatus.splice(i, 1, 'false');
    }
}