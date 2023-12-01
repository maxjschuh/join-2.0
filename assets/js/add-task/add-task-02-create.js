/**
 * The function collects information from various input fields and assigns them to a task object. 
 * The function also includes some additional actions such as disabling a button,
 * reactivating the button after a delay if any input is missing and saving everything to the database.
 */
function collectAllInfos() {
    disableAddTaskButton();
    task.title = getValue('tileInput', 'titleReport');
    task.description = getValue('descriptionInput', 'descriptionReport');
    task.category = getCategory();
    task.assigned_to = getEmails();
    task.due_date = getDate();
    task.prio = getPrio();
    collectUnnecessaryInfos();
}


/**
 * This function checks whether all the required information is available and adds the optional information.
 */
function collectUnnecessaryInfos() {

    setTimeout(() => {

        if (required) {
            activateAddTaskButton();
            required = '';

        } else {
            pushSubtask();
            pushStatus();
            saveDatabase();
        }
    }, 300);
}


/**
 * This function disables the hover effect and the onclick on the add task button.
 */
function disableAddTaskButton() {
    document.getElementById('mobileCreateTask').removeAttribute("onclick");
    document.getElementById('desktopCreateTask').removeAttribute("onclick");
    toggleElements(['desktopCreateTask'], 'create-hover', false);
}


/**
 * This function aktivates the hover effect and the onclick on the add task button.
 */
function activateAddTaskButton() {
    document.getElementById('mobileCreateTask').setAttribute("onclick", `collectAllInfos()`);
    document.getElementById('desktopCreateTask').setAttribute("onclick", `collectAllInfos()`);
    toggleElements(['desktopCreateTask'], 'create-hover', true);
}


/**
 * This function pushes all the emails of the selected contacts in an array.
 */
function getEmails() {
    taskContactList.forEach((contact) => {

        collectedContacts.push(contact.email);
    });
    return collectedContacts;
}


/**
 * This function gets the value from the input field,
 * checks if it is empty and warns the user that this input field cannot be empty.
 * @param {string} valueId - Input field ID.
 * @param {string} reportID - Alert Message ID.
 * @returns {string} value from input field.
 */
function getValue(valueId, reportID) {
    const description = document.getElementById(valueId).value.trim();
    if (!description || containsBrackets(description)) {
        showAndHideElements([reportID]);
        required = true;
    } else return description;
}


/**
 * This function checks the variable selectedCategory if it is empty and
 * warns the user if no category is selected.
 * @returns selected category
 */
function getCategory() {
    if (!selectedCategory) {
        showAndHideElements(['categoryReport']);
        setInnerHTML(['categoryReport'], 'This field is required');
        required = true;
    } else return selectedCategory;
}


/**
 * This function gets the value from the input field,
 * checks if it is empty and warns the user that this input field cannot be empty.
 * @returns value from input field.
 */
function getDate() {
    const date_regex = /^(?:19|20)\d{2}-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[1-2][0-9]|3[0-1])$/;
    const chosenDate = document.getElementById('date').value.trim();

    if (chosenDate && date_regex.test(chosenDate)) return chosenDate;

    else {
        showAndHideElements(['dateReport']);
        required = true;
    }
}


/**
 * This function checks the variable prio if it is empty and
 * warns the user if no priority is selected.
 * @returns {string} 'urgent', 'medium' or 'low'
 */
function getPrio() {
    if (prio) return prio;
    else {
        showAndHideElements(['prioReport']);
        required = true;
    }
}


/**
 * This function pushes all subtasks into a JSON.
 */
function pushSubtask() {
    for (let i = 0; i < subtasks.length; i++) {
        task.subtasks.name.push(subtasks[i]);
    }
}


/**
 * This function pushes all subtask status into a JSON.
 */
function pushStatus() {
    for (let i = 0; i < subtaskStatus.length; i++) {
        task.subtasks.status.push(subtaskStatus[i]);
    }
}


/**
 * This function pushes the created task into the database.
 * Starts the upload on the remote server and redirects the user to the summary page.
 */
async function saveDatabase() {
    toggleElements(['addedToBoard'], 'added-to-board-position-animate', true);

    database.tasks.push(task);

    await setItem('database', database);

    setTimeout(() => {
        window.location.replace('./board.html');
    }, 1500);
}


/**
 * This function opens an input field and a div with selectable random colors.
 */
function openCreateCategory() {

    toggleElements(['newCategoryContainer', 'color-picker'], 'd-none', false);
    pullDownMenu('category', 'assignedTo', 'moreCategories', 'moreContacts');
    getRandomColor();
    showAndHideElements(null, (['category']));
}


/**
 * This function removes an input field and a div with selectable random colors.
 */
function closeCreateCategory() {

    toggleElements(['category', 'categoryPlaceholder'], 'd-none', false);
    toggleElements(['newCategoryContainer', 'color-picker', 'categoryReport'], 'd-none', true);
    document.getElementById('categoryInput').value = '';
    removeSelectedColor();
}


/**
 * This function adds a rgb background color to div's.
 */
function getRandomColor() {
    for (let index = 0; index < 6; index++) {
        generatedColor = generateRandomColor();
        colorCircle = document.getElementById('colorPickCircle' + index);
        colorCircle.style = `background-color: ${generatedColor}`;
        setOnclickForColorpicker(colorCircle, generatedColor, index);
    }
}


/**
 * This function set a oncklick.
 * @param {string} colorCircle - The ID of a div.
 * @param {string} generatedColor - rgb code.
 * @param {number} index - index of a div.
 */
function setOnclickForColorpicker(colorCircle, generatedColor, index) {
    colorCircle.setAttribute("onclick", `selectedColor('${generatedColor}', 'colorPickCircle${index}')`);
}


/**
 * This function gives an rgb code to one variable and an ID to another variable.
 * Adds a class to the corresponding div to show the user what he clicked.
 * @param {string} color - rgb code
 * @param {string} id - The ID of the clicked div.
 */
function selectedColor(color, id) {
    colorForNewCategory = `${color}`;
    colorForNewCategoryID = id;
    removeSelectedColor();
    toggleElements([id], 'task-selected-category-color', true);
}


/**
 * This function removes the CSS class 'task-selected-category-color'.
 */
function removeSelectedColor() {

    for (let i = 0; i < 6; i++) {

        toggleElements(['colorPickCircle' + i], 'task-selected-category-color', false);
    }
}


/**
 * Checks if the category input field has a value and a category color has been selected. If so createCategory() is called for creating a new category.
 * @returns if a new category can be created so that the alert is not shown
 */
function addCategory() {
    categoryInputFilled = document.getElementById('categoryInput');
    newCategory = categoryInputFilled.value.trim();

    if (!newCategory) setInnerHTML(['categoryReport'], 'Please enter a new category name');

    else if (newCategory.length > 20) setInnerHTML(['categoryReport'], 'Maximum 20 characters allowed');

    else if (!colorForNewCategory) setInnerHTML(['categoryReport'], 'Please choose a color');

    else {
        createCategory(categoryInputFilled);
        return;
    }

    showAndHideElements(['categoryReport']);
}


/**
 * This function saves a new category, empty and close an input field,
 * select and shows the new category.
 */
function createCategory(categoryInputFilled) {
    saveNewCategory();
    categoryInputFilled.value = '';
    closeCreateCategory();
    selectCategory(newCategory, colorForNewCategory);
}


/**
 * This function prepares a new category to be pushed into a JSON.
 */
function saveNewCategory() {
    category = {
        "name": `${newCategory}`,
        "color": `${colorForNewCategory}`
    };
    pushCategoryInCategories();
}


/**
 * This function pushes a new category into the database array.
 */
function pushCategoryInCategories() {
    categories.push(category);
    renderCategories();
}