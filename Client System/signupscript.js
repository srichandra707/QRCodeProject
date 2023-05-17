const User = require('./server');

document
    .querySelector('#signupform button')
    .addEventListener('click', doSignup);

function doSignup(event) {
    event.preventDefault(); 
    console.log('Send a Signup request');
    let mail = document.querySelector('#signupform .email').value;
    let pass = document.querySelector('#signupform .password').value;
    //Form validation
    let user = { email: mail, password: pass };
    let endpoints = ['UserSignup', 'VendorSignup'];
    sendData(user, endpoints, registerSuccess);

}


async function sendData(user, endpoints, callback) {
    try {
      // Save the user data to the 'Users' collection
      const newUser = new User(user);
      await newUser.save();
  
      const requests = endpoints.map((endpoint) => {
        let url = 'http://localhost:5665/${endpoint}';
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        let req = new Request(url, {
            method: 'POST',
            Headers: h,
            body: JSON.stringify(user),
        });
        return fetch(req).then((res) => res.json());
      });

      const responses = await Promise.all(requests);

      responses.forEach((content) => {
        if ('error' in content){
            failure(content.error);
        }
        if ('data' in content){
            callback(content.data);
        }
      })
      callback(newUser);
    } catch (error) {
      failure(error);
    }
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