/**
 * This function searches for all elements with the name w3-include-html and inserts the corresponding html file.
 */
async function includeHTML() {
    const includeElements = document.querySelectorAll('[w3-include-html]');

    for (let i = 0; i < includeElements.length; i++) {

        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        const resp = await fetch(file);
        if (resp.ok) element.innerHTML = await resp.text();
        else element.innerHTML = 'Page not found!';
    }
}


/**
 * This function decides which div gets a background color based on the pathname.
 */
function sideMenuColor() {
    const subPage = window.location.pathname.split("/").pop();
    let id;

    if (subPage == 'summary.html') id = 'summaryMenu';
    else if (subPage == 'board.html') id = 'boardMenu';
    else if (subPage == 'add-task.html') id = 'addTaskMenu';
    else if (subPage == 'contacts.html') id = 'contactsMenu';
    else if (subPage == 'legal-notice.html') id = 'legalNoticeMenu';
    else return; 

    toggleElements([id], 'link-active', true);
}