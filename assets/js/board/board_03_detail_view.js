/**
 * A onclick function that shows the detail view for the task that the user clicked.
 * @param {number} i the index of the clicked on task in the database or searchResults array
 */
function boardShowTaskDetails(i) {

    boardRenderDetailView(i);
    document.getElementById('board-detail-view').parentNode.classList.remove('board-display-none');
    toggleElements(['board-detail-view'], 'board-display-none', false);
    boardCurrentTaskInDetailView = i;

    toggleElements(['board-kanban'], 'board-display-none-700px', true);
}


/**
 * A onclick function that hides the detail view.
 */
function boardHideTaskDetails() {
    document.getElementById('board-detail-view').parentNode.classList.add('board-display-none');
    toggleElements(['board-detail-view'], 'board-display-none', true);
    toggleElements(['board-kanban'], 'board-display-none-700px', false);
    renderAllTaskCards();
    boardCreateAllEventListeners();
}


/**
 * Renders all sections of the detail view.
 * @param {number} i the index of the clicked on task in the database or searchResults array
 */
function boardRenderDetailView(i) {
    const task = database.tasks[i];

    setInnerHTML(['board-detail-view-category-tag'], task.category);
    setInlineStyle(['board-detail-view-category-tag'], `background-color:${getCategoryColor(task.category)}`);
    setInnerHTML(['board-detail-view-title'], task.title);
    setInnerHTML(['board-detail-view-description'], task.description);
    setInnerHTML(['board-detail-view-due-date'], `Due date: <div>${task.due_date}</div>`);
    
    boardDetailViewPriorityTag(task);
    boardDetailViewAssignees(task);
    boardRenderSubtasks(task.subtasks, 'board-detail-view-subtasks');
}


/**
 * Renders the priority tag in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewPriorityTag(task) {

    let container = document.getElementById('board-detail-view-priority-tag');
    container.innerHTML = /*html*/ `
    ${getTaskPrioBoard(task)} <img src="./assets/img/board/prio_${task.prio}_white.svg" alt="prio-icon">`;

    container.style.backgroundColor = `${boardGetPrioColor(task.prio)}`;
}


/**
 * Renders the already existing subtasks in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewSubtasks(task) {

    if (!task.subtasks.name) return;

    const container = document.getElementById('board-detail-view-subtasks');

    let html = /*html*/ `Subtasks: <ul>`;

    task.subtasks.name.forEach(subtaskName => {

        html += /*html*/ `<li>${subtaskName}</li>`;
    });

    html += /*html*/ `</ul>`;
    container.innerHTML = html;
}


/**
 * Returns the colour associated with the priority of the task.
 * @param {string} taskPrio the priority of the task as string: 'low', 'medium' or 'high'
 * @returns rgba color code for the priority
 */
function boardGetPrioColor(taskPrio) {

    if (taskPrio == 'low') return 'rgba(122, 226, 41, 1)';

    else if (taskPrio == 'medium') return 'rgba(255, 168, 0, 1)';

    else return 'rgba(255, 61, 0, 1)';
}


/**
 * Renders the assignees in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewAssignees(task) {

    const container = document.getElementById('board-detail-view-assignees');
    container.innerHTML = 'Assigned to:';

    task.assigned_to.forEach(emailOfAssignee => {

        const contact = findAssigneeInContacts(emailOfAssignee);
        container.innerHTML += /*html*/ `
        <div>
            ${htmlTemplateAssigneeIcon(contact)}
            ${contact.firstname} ${contact.lastname}
        </div>
        `;
    });
}


/**
 * Returns the corresponding contact object to the email that is passed as parameter.
 * @param {string} emailOfAssignee email for which the contact should be found
 * @returns {object} contact data of assignee
 */
function findAssigneeInContacts(emailOfAssignee) {

    for (let i = 0; i < database.contacts.length; i++) {
        const contact = database.contacts[i];

        if (contact.email === emailOfAssignee) return contact;
    }

}

/**
 * Deletes a task from the board by splicing it from the database. Then the board is re-rendered and the database is fetched to the backend.
 */
async function boardDeleteTask() {

    database.tasks.splice(boardCurrentTaskInDetailView, 1);

    boardHideTaskDetails();
    renderAllTaskCards();
    boardCreateAllEventListeners();
    await setItem('database', database);
}


/**
 * Deletes subtask by removing it from the database. Then the board is re-rendered and the database is fetched to the backend.
 * @param {number} i index of the subtask within the task
 * @param {string} containerId html id of the container where the subtask is rendered
 */
async function boardRemoveSubtask(i, containerId) {

    database.tasks[boardCurrentTaskInDetailView].subtasks.name.splice(i, 1);
    database.tasks[boardCurrentTaskInDetailView].subtasks.status.splice(i, 1);

    boardRenderSubtasks(database.tasks[boardCurrentTaskInDetailView].subtasks, containerId);
    renderAllTaskCards();
    boardCreateAllEventListeners();
    await setItem('database', database);
}