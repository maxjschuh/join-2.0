/**
 * This function starts all eventListener.
 */
function startEventListener() {
    subtaskEventListener();
    clickOutsideDropdownMenu();
}


/**
 * This function starts an event listener that checks whether enter is pressed in the subtask input field.
 */
function subtaskEventListener() {

    setTimeout(() => {

        let subTaskInputField = document.getElementById('subtaskInput');

        subTaskInputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") addSubtask();
        });
    }, 150);
}


/**
 * This function shows a datepicker.
 * Source: https://github.com/qodesmith/datepicker
 */
function datePicker() {

    const picker = datepicker('#date', {
        startDay: 1,
        minDate: new Date(),
        formatter: (input, date, instance) => {
            const dateObject = new Date(date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
            const day = String(dateObject.getDate()).padStart(2, '0');
            const isoDate = `${year}-${month}-${day}`;
            input.value = isoDate;
        }
    });
}


/**
 * This function is used to change the height of a div and display its contents
 * if the height of a div was previously changed and you click on another,
 * the previous div is reduced again and the content is hidden. 
 * The height of the clicked div is increased and the content is displayed
 * 
 * @param {string} clicked - This is the id where a classlist should be changed
 * @param {string} notClicked - This is the id where a classlist should be changed
 * @param {string} visible - This is the id where the classlist "d-none" will removed
 * @param {string} notVisible - This is the id where the classlist "d-none" will added
 */
function pullDownMenu(clicked, notClicked, visible, notVisible) {
    const openMenu = document.getElementById(clicked).classList;
    if (openMenu === 'dropdown-category-closed') openDropDownMenu(clicked, notClicked, visible, notVisible);
    else closeDropDownMenu(clicked, visible, notVisible);

    if (clicked === 'assignedTo') {
        switchContactIcons();
        renderInitials();
        initialsRendered = false;
    }
}


/**
 * This function adds and removes CSS classes
 */
function openDropDownMenu(clicked, notClicked, visible, notVisible) {

    document.getElementById(clicked).classList.add('dropdown-category-open');
    document.getElementById(notClicked).classList.remove('dropdown-category-open');
    document.getElementById(visible).classList.remove('d-none');

    toggleElements([notVisible, 'initialsContainer'], 'd-none', true);
}


/**
 * This function adds and removes CSS classes
 */
function closeDropDownMenu(clicked, visible, notVisible) {

    toggleElements([clicked], 'dropdown-category-open', false);
    showAndHideElements(['initialsContainer'], [visible, notVisible]);
}


/**
 * This function checks whether you have clicked.
 */
function clickOutsideDropdownMenu() {
    document.addEventListener('click', closeMenuIfClickedOutside);
}


/**
 * This function checks whether a dropdown menu is open, close it and restore the default.
 * @param {boolean} event - Click event.
 */
function closeMenuIfClickedOutside(event) {
    const categoryMenu = document.getElementById('category');
    const assignedToMenu = document.getElementById('assignedTo');

    if (!categoryMenu.contains(event.target) && categoryMenu.classList.contains('dropdown-category-open')) {
        pullDownMenu('category', 'assignedTo', 'moreCategories', 'moreContacts')
    }

    if (!assignedToMenu.contains(event.target) && assignedToMenu.classList.contains('dropdown-category-open')) {
        pullDownMenu('assignedTo', 'category', 'moreContacts', 'moreCategories');
        initialsRendered = true;
        switchContactIcons();
        setTimeout(() => {
            initialsRendered = false;
        }, 20);
    }
}


/**
 * This function changes the class of the input field.
 * If you click in the input field, add a subtask or press cancel,
 * you will switch between 2 different views on the right side of the input field.
 */
function switchSubtaskIcons() {
    let addSubtask = document.getElementById('addSubtask');
    let createSubtask = document.getElementById('createSubtask');
    let subtaskInput = document.getElementById('subtaskInput');
    const createSubtaskClass = createSubtask.classList.value;

    if (createSubtaskClass.includes('d-none')) showAddClearIcons(addSubtask, createSubtask, subtaskInput);
    else removeAddClearIcons(addSubtask, createSubtask, subtaskInput);
}


/**
 * This function changes the classes of the input field, 
 * focuses the input field and removes onclick.
 * @param {string} addSubtask - ID of a button.
 * @param {string} createSubtask - ID of a button container.
 * @param {string} subtaskInput - ID of an input field.
 */
function showAddClearIcons(addSubtask, createSubtask, subtaskInput) {
    subtaskInput.removeAttribute("onclick");
    createSubtask.classList.remove('d-none');
    addSubtask.classList.add('d-none');
    subtaskInput.focus();
}


/**
 * This function changes the classes of the input field,
 * clears the value of the input field and removes the focus from the input field
 * @param {string} addSubtask - ID of a button.
 * @param {string} createSubtask - ID of a button container.
 * @param {string} subtaskInput - ID of an input field.
 */
function removeAddClearIcons(addSubtask, createSubtask, subtaskInput) {
    subtaskInput.setAttribute("onclick", "switchSubtaskIcons()");
    createSubtask.classList.add('d-none');
    addSubtask.classList.remove('d-none');
    subtaskInput.blur();
    subtaskInput.value = '';
}


/**
 * This function adds and/or removes css classes to create a drop down menu.
 */
function switchContactIcons() {
    
    if (!taskContactList.length || initialsRendered) {
        showAndHideElements(['ddArrow'], ['clearAddButtons']);
        setTimeout(setAttribute, 200)

    } else {
        showAndHideElements(['clearAddButtons'], ['ddArrow']);
        document.getElementById('contactsToAssingContainer').removeAttribute("onclick");
    }
}


/**
 * This function adds an onclick.
 */
function setAttribute() {
    document.getElementById('contactsToAssingContainer').setAttribute("onclick",
        "pullDownMenu('assignedTo', 'category', 'moreContacts', 'moreCategories')");
}


/**
 * This function clears all input fields and selected fields.
 */
function clearAllFields() {
    clearCreateCategory();
    clearContacts();
    resetValue(['tileInput', 'descriptionInput', 'date']);
    resetPrioButton();
    resetSubTasks();
    resetWarnings();
}


/**
 * This function resets the input field under new category in the category dropdown menu.
 */
function clearCreateCategory() {
    document.getElementById('chosenCategory').innerHTML = `Select task category`;
    selectedCategory = category;
    const classStatus = document.getElementById('category').classList;

    if (classStatus.contains('dropdown-category-open')) {
        pullDownMenu('category', 'assignedTo', 'moreCategories', 'moreContacts');
    }
}


/**
 * This function deletes all subtasks that have just been created.
 */
function resetSubTasks() {
    document.getElementById('subTaskReport').classList.add('d-none');
    subtasks = [];
    subtaskStatus = [];
    renderSubtasks();
}


/**
 * This function opens the add contact overlay. 
 */
function openAddContact() {
    openNewContactForm();
    clearContacts();
    renderContactsAfterCreate();
}


/**
 * This function renders the contacts after creating a new contact.
 */
function renderContactsAfterCreate() {
    document.getElementById("create-contact").addEventListener("click", function () {
        setTimeout(clearContacts, 300);
    });
}


/**
 * This function clears the warnings.
 */
function resetWarnings() {

    toggleElements(['titleReport', 'descriptionReport', 'categoryReport', 'dateReport', 'prioReport'], 'd-none', true);
}