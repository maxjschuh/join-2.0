/**
 * Checks if the email exists. If the Email exist it will start other functions to send the mail to reset the password.
 */
async function requestPasswordReset() {
    const forgotPwEmail = document.getElementById('forgotPwEmail').value;
    const username = getUsername(forgotPwEmail);
    let response = {
        ok: true
    };

    if (username) response = await sendEmail(forgotPwEmail, username);

    if (!response.ok) {
        showErrorMessage(response);
        return;
    }

    playAnimation('emailSent');
    showAndHideElements(['loginContainer'], ['forgotPwContainer']);
}


/**
 * This function is used to get the username through the email
 * @param {string} forgotPwEmail This is the email from where we get the username
 * @returns The username will be returned, if the email does not exists it will return "false"
 */
function getUsername(forgotPwEmail) {

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (user.email == forgotPwEmail) return user.username;
    }
    return false;
}



/**
 * Makes a fetch request to the php script for sending the password reset link to the user's e-mail adress.
 * @param {string} forgotPwEmail The e-mail to where the link will be sent, which is the e-mail of the user who wants his / her password to be resetted
 * @param {string} username of the user who requested the password reset
 * @returns 
 */
async function sendEmail(forgotPwEmail, username) {

    const url = "./send_mail.php";
    const data = {
        email: forgotPwEmail,
        username: username,
        message: passwordResetMail(username, forgotPwEmail)
    };
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data)
    };

    return await fetch(url, options);
}


/**
 * This function will set link which includes the email to reset the password
 * 
 * @param {string} forgotPwEmail The Email from which the password should be changed
 * @returns {string} It returns the Link which includes the email to reset the password
 */
function getForgotPwLink(forgotPwEmail) {

    return 'https://mjschuh.com/join/login.html?email=' + encodeURIComponent(forgotPwEmail);
}




/**
 * This function will start the functions to reset the password.
 */
function submitNewPassword() {
    const newPassword = document.getElementById('newPassword').value;


    if (containsForbiddenCharacters(newPassword)) {


    } else {

        updatePassword(newPassword);
        toggleElements(['resetPassword'], 'd-none');

        setTimeout(() => {
            toggleElements(['resetPassword'], 'd-none');
        }, 1000);

        showAndHideElements(['signUp', 'loginContainer'], ['signUpContainer', 'resetPwContainer', 'forgotPwContainer']);
    }
}


/**
 *  This function changes the password.
 */
function updatePassword(newPassword) {

    users.forEach(user => {

        if (changePasswordEmail == user.email) user.password = newPassword;
    });
}


function containsForbiddenCharacters(input) {

    const regex = /(´|`|'"\\|[\s])/;

    return input.match(regex);
}


function replaceForbiddenCharacters(string) {

}


function passwordResetMail(username, forgotPwEmail) {

    const link = getForgotPwLink(forgotPwEmail)

    return /*html*/ `
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Join</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
            
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            
                h1 {
                    color: #333;
                }
            
                p {
                    color: #666;
                }
            
                a {
                    color: #007BFF;
                }
            
                .footer {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset</h1>
                <p>Hello ${username},</p>
                <p>We hope this message finds you well. It seems you've requested to reset your password for your Join account. No worries, we've got you covered!</p>
                <p>To reset your password, please click on the following link:</p>
                <p><a href="${link}">${link}</a></p>
                <p>If you did not initiate this request, please ignore this email, and your password will remain unchanged.</p>
                <p>For security reasons, this link will expire in 24 hours. You may request a new link anytime.</p>
                <p>Best regards</p>
                <p>The Join Team</p>
                <div class="footer">
                    <img src="www.mjschuh.com/join/assets/img/Join_dark.png" alt="Join Logo">
                </div>
            </div>
        </body>
        </html>
    `;
}