/**
 * Decides on whether to use the search results or the full database to render the tasks.
 * @param {boolean} newBoardSearch true = return search results; false = return database
 * @returns {object} JSON containing tasks
 */
function boardUseSearchResults(newBoardSearch) {

    if (newBoardSearch || boardActiveSearch) return searchResults;

    else return database;
}


/**
 * Removes start and end whitespace from the search input string. If the string then contains characters, it passes the input to the search function. Otherwise it re-renders the default board.
 */
function boardValidateSearchInput() {

    let inputField;
    searchResultsDatabaseIndexes = [];

    if (window.innerWidth > 700) inputField = document.getElementById('board-search-input-desktop');
    else inputField = document.getElementById('board-search-input-mobile');

    const userInput = inputField.value.trim().toLowerCase();

    if (userInput.length) {
        boardActiveSearch = true;
        boardSearch(userInput);

    } else {
        boardActiveSearch = false;
        renderAllTaskCards();
        boardCreateAllEventListeners();
    }
}


/**
 * Iterates through the database and calls for every task the boardSearchTask function which creates the search results array. Then it calls functions to re-render the board using the search results.
 * @param {string} userInput validated search input string typed by the user
 */
function boardSearch(userInput) {

    searchResults = { "tasks": [] };

    database.tasks.forEach((task, i) => boardSearchTask(task, userInput, i));

    renderAllTaskCards(true);
    boardCreateAllEventListeners(true);
}


/**
 * Checks if the input string is found in the title, description, category or assignees of the inputted task.
 * @param {object} task task that is checked for fitting the search input
 * @param {string} userInput validated search input string typed by the user
 * @param {number} databaseIndex the index of the examined task in the database array
 */
function boardSearchTask(task, userInput, databaseIndex) {

    if (boardFieldIncludes(userInput, task.title) ||
        boardFieldIncludes(userInput, task.description) ||
        boardFieldIncludes(userInput, task.category) ||
        boardTaskAssigneesIncludes(userInput, task.assigned_to)) {

        boardSaveSearchResults(task);
        searchResultsDatabaseIndexes.push(databaseIndex);
    }
}


/**
 * Checks if the input string is found in the assignees of the task that is passed as parameter.
 * @param {string} userInput validated lowercase search input string typed by the user
 * @param {Array} assignees of the task to be searched
 * @returns {boolean} true if there is a match, false if not
 */
function boardTaskAssigneesIncludes(userInput, assignees) {

    for (let i = 0; i < assignees.length; i++) {
        const assignee = assignees[i].toLowerCase();

        if (assignee.includes(userInput)) return true;
    }
}


/**
 * Checks if a specific input string matches the user search input.
 * @param {string} userInput validated lowercase search input string typed by the user
 * @param {string} propertyToSearch property of the task object that should be searched for a match with the user input
 * @returns {boolean} true if there is a match, false if not
 */
function boardFieldIncludes(userInput, propertyToSearch) {

    const propertyToSearchLowercase = propertyToSearch.toLowerCase();

    if (propertyToSearchLowercase.includes(userInput)) return true;
}


/**
 * Saves a task in the search results JSON.
 * @param {object} task task that is saved
 */
function boardSaveSearchResults(task) {

    const taskAsString = JSON.stringify(task);
    let searchResultsAsString = JSON.stringify(searchResults);

    searchResultsAsString = searchResultsAsString.slice(0, -2);

    if (searchResultsAsString.length > 20) searchResultsAsString = searchResultsAsString + ',' + taskAsString;

    else searchResultsAsString = searchResultsAsString + taskAsString;

    searchResultsAsString = searchResultsAsString + ']}';
    searchResults = JSON.parse(searchResultsAsString);
}