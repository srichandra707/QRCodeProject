document
    .querySelector('#signupform button')
    .addEventListener('click', doSignup);

function doSignup(event) {
  event.preventDefault();
  console.log('Send a Signup request');

  let Firstname = document.querySelector('#signupform .firstname');
  let Lastname = document.querySelector('#signupform .lastname');
  let emailElement = document.querySelector('#signupform .email');
  let passwordElement = document.querySelector('#signupform .password');
  let confirm_passwordElement = document.querySelector('#signupform .reenter-password');

  console.log('first-name: ', Firstname);
  console.log('last-name', Lastname);
  console.log('Email element:', emailElement);
  console.log('Password element:', passwordElement);
  console.log('Confirm password element:', confirm_passwordElement);

  if (!emailElement || !passwordElement || !confirm_passwordElement || !Firstname || !Lastname) {
      console.log('One of the elements could not be found');
      return;
  }

  let firstName = Firstname.value;
  let lastName = Lastname.value;
  let email = emailElement.value;
  let password = passwordElement.value;
  let confirm_password = confirm_passwordElement.value;

  // Check if passwords match
  if (password !== confirm_password) {
      alert('Passwords do not match!');
      return;
  }

  let user = {firstName, lastName, email, password, confirmPassword: confirm_password };

  sendData(user)
      .then(registerSuccess)
      .catch(failure);
}


async function sendData(user) {
    let url = 'http://localhost:5665/UserSignup';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        let message = await response.json(); // Get the error message from the server
        throw new Error(message.message); // Throw an error with the message
    }

    return response.json();
}


function registerSuccess(data) {
    console.log('new user created', data);
    alert('You have been registered');
    window.location.href = 'UserHomepage.html';
}

function failure(err) {
    if (err.message === 'Already registered! Please login!') {
        alert(err.message);
        window.location.href = 'UserLogin.html'; // Redirect to login page
    } else {
        alert(err.message);
        console.warn(err.code, err.message);
    }
}

