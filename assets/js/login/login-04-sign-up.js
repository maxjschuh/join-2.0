/**
 * Handles a request for signing up.
 */
function submitSignUp() {

    const inputIds = ['firstname', 'lastname', 'signUpEmail', 'signUpPassword'];
    formValid = true;

    inputIds.forEach(inputId => {

        validateInput(inputId);
    });

    if (formValid) checkIfEmailExists();

    if (formValid) signUpUser();
}


/**
 * This function will push the data in the database
 */
function signUpUser() {

    retrieveSignUpData();
    setItem('database', database);
    playAnimation('accountCreated');
    resetValue(['firstname', 'lastname', 'signUpEmail', 'signUpPassword']);

    setTimeout(() => {
        login(database.users.length - 1);
    }, 1800);
}


/**
 * Collects data from the input fields on the sign up page for creating a private user account and public user contact. Pushes this data to the database object.
 */
function retrieveSignUpData() {

    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;

    const contact = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: '',
        color: generateRandomColor()
    };

    const account = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    };

    database.contacts.push(contact);
    database.users.push(account);
}


/**
 * This function will check if the email is already in use
 * @returns Returns if the email or the username already exists
 */
function checkIfEmailExists() {

    const emailSignUp = document.getElementById('signUpEmail').value;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (emailSignUp === user.email) {
            setInlineStyle('emailSignUpContainer', 'border: 1px solid red');
            document.getElementById('signUpEmailAlert').innerHTML = 'E-Mail already in use!';
            formValid = false;
            return;
        }
    }
    emptyInnerHTML(['signUpEmailAlert']);
    setInlineStyle(['emailSignUpContainer'], "");
}