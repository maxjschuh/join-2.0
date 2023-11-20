/**
 * Shows the addtask overlay on the board.
 * @param {string} progress progress that the newly created task should have
 */
function boardShowAddtaskOverlay(progress) {

    task.progress = progress;
    subtasks = [];
    subtaskStatus = [];

    boardIncludeAssignePickerOnAddTask();
    document.getElementById('board-add-task-subtasks').innerHTML = boardAddTaskTemplateSubtasks();

    renderCategories();
    renderContacts();
    startEventListener();

    clearAllFields();
    document.getElementById('board-add-task').parentNode.classList.remove('board-display-none');
    toggleElements(['board-kanban'], 'board-display-none-700px', true);
    toggleElements(['mobileCreateTask', 'board-add-task'], 'board-display-none', false);
}


/**
 * Hides the addtask overlay on the board.
 */
function boardHideAddtaskOverlay() {

    document.removeEventListener('click', closeMenuIfClickedOutside);

    document.getElementById('board-add-task').parentNode.classList.add('board-display-none');
    toggleElements(['board-kanban'], 'board-display-none-700px', false);
    toggleElements(['board-add-task', 'mobileCreateTask'], 'board-display-none', true);

    emptyInnerHTML(['board-add-task-assignee-picker', 'board-add-task-subtasks']);
}


/**
 * Includes the assignee picker in the add task overlay.
 */
function boardIncludeAssignePickerOnAddTask() {

    let container = document.getElementById('board-add-task-assignee-picker');

    container.innerHTML = boardTemplateAssigneePicker();
}