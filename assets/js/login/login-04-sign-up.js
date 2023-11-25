/**
 * This function will push the data in the database
 * 
 * @param {string} account This is the data of the account which will be pushed
 * @param {string} contact This is the data of the contact which will be pushed
 */
function signUpUser(account, contact) {
    database.users.push(account);
    database.contacts.push(contact);
    setItem('database', database);
    playAnimation('accountCreated');
    resetValue(['username', 'signUpEmail', 'signUpPassword']);

    setTimeout(() => {
        login(account.email, account.username);
    }, 2000);
}



/**
 * This function will set up the data to be pushed
 * @returns If the user already exists, the function will be stopped at that point
 */
function accountData() {
    const usernameSignUp = document.getElementById('username').value;
    const emailSignUp = document.getElementById('signUpEmail').value;
    const passwordSignUp = document.getElementById('signUpPassword').value;

    setInlineStyle(['usernameTaken', 'usernameContainer'], '');

    if (!checkIfUserExists(usernameSignUp, emailSignUp)) return;

    const account = {
        "username": usernameSignUp,
        "email": emailSignUp,
        "password": passwordSignUp
    };

    const contact = splitName(usernameSignUp, emailSignUp);

    signUpUser(account, contact);
}


/**
 * This function is used to split up the username into a firstname and a lastname
 * 
 * @param {string} usernameSignUp Username from the inputfield
 * @param {string} emailSignUp Email from the inputfield
 * @returns {object} user contact
 */
function splitName(usernameSignUp, emailSignUp) {
    const fullName = usernameSignUp.split(' ');
    const firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
    let lastName = '';

    if (fullName.length > 1) lastName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1);

    return {
        "firstname": firstName,
        "lastname": lastName,
        "email": emailSignUp,
        "phone": "",
        "color": generateRandomColor()
    };
}


/**
 * This function will check if the username or the email is already in use
 * 
 * @param {string} usernameSignUp This is the username to sign up
 * @param {string} emailSignUp This is the email to sign up
 * @returns {boolean} It returns "false" if the email or the username already exists and "true" if they doesn´t exists
 */
function checkIfUserExists(usernameSignUp, emailSignUp) {
    for (let i = 0; i < users.length; i++) {

        if (usernameSignUp == users[i]['username']) {
            document.getElementById('usernameTaken').style = 'color: red';
            document.getElementById('usernameContainer').style = 'border: 1px solid red';
            return false;
        }

        if (emailSignUp == users[i]['email']) {
            document.getElementById('emailTaken').style = 'color: red';
            document.getElementById('emailSignUpContainer').style = 'border: 1px solid red';
            return false;
        }
    }
    return true;
}