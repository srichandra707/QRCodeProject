document.querySelector('#signupform button').addEventListener('click', doSignup);

function doSignup(event) {
  event.preventDefault();
  console.log('Send a Signup request');

  let firstname = document.querySelector('#signupform .firstname');
  let lastname = document.querySelector('#signupform .lastname');
  let emailElement = document.querySelector('#signupform .email');
  let passwordElement = document.querySelector('#signupform .password');
  let confirm_passwordElement = document.querySelector('#signupform .reenter-password');

  console.log('first-name: ', firstname);
  console.log('last-name', lastname);
  console.log('Email element:', emailElement);
  console.log('Password element:', passwordElement);
  console.log('Confirm password element:', confirm_passwordElement);

  if (!emailElement || !passwordElement || !confirm_passwordElement || !firstname || !lastname) {
      console.log('One of the elements could not be found');
      return;
  }

  let firstName = firstname.value;
  let lastName = lastname.value;
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
        throw new Error('Network response was not ok');
    }

    return response.json();
}

function registerSuccess(data) {
    console.log('new user created', data);
    alert('You have been registered');
}

function failure(err) {
    alert(err.message);
    console.warn(err.code, err.message);
}
