document
    .querySelector('#signupform button')
    .addEventListener('click', doSignup);

function doSignup(event) {
    event.preventDefault(); //*
    console.log('Send a Signup request');
    let mail = document.querySelector('#signupform .email').value;
    let pass = document.querySelector('#signupform .password').value;
    //Form validation
    let user = { email: mail, password: pass };
    let endpoint = 'register';
    sendData(user, endpoint, registerSuccess);
}

function sendData(user, endpoint, callback) {
    let url = `http://localhost:4000/${endpoint}`;
    let h = new Headers();
    h.append('Content-Type', 'application/json');
    let req = new Request(url, {
        method: 'POST',
        headers: h,
        body: JSON.stringify(user),
    });
    fetch(req)
        .then((res) => res.json())
        .then((content) => {
            //response recieved
            if ('error' in content) {
                //bad attempt
                failure(content.error);
            }
            if ('data' in content) {
                //it worked
                callback(content.data);
            }
        })
        .catch(failure);
}

function registerSuccess(data) {
    //user has been registered
    console.log('new user created', data);
    alert('You have been registered');
}

function failure(err) {
    alert(err.message);
    console.warn(err.code, err.message);
}