
document
    .querySelector('#loginform button')
    .addEventListener('click', doLogin); //defining click as the spark event

function doLogin(event) {
    event.preventDefault(); //stops page from reloading
    console.log('Send a login request');

    let emailElement = document.querySelector('#loginform .email').value; //getting email val
    let passwordElement = document.querySelector('#loginform .password').value; //getting passwd val

    console.log('email: ', emailElement);
    console.log('password', passwordElement);

    if (!emailElement || !passwordElement) {
        console.log('One of the elements could not be found');
        return;
    }

    //Form validation
    let vendor = { email: emailElement, password: passwordElement};
    let endpoint = 'VendorLogin';
    sendData(vendor, endpoint, loginSuccess);
}

async function sendData(vendor, endpoint, callback) {
    let url = `http://localhost:5665/${endpoint}`;
    let h = new Headers();
    h.append('Content-Type', 'application/json');

    console.log('Sending data:',vendor);

    let req = new Request(url, {
        method: 'POST',   //for uploading the body
        headers: h,
        body: JSON.stringify(vendor),
    });
    fetch(req) //uploading request object then getting the response object back from the server
        .then((res) => res.json())  //assuming we're gonna recieve a json object(could be error or success)
        .then((content) => {        //content = object created from json
            //we have a response
            if ('message' in content && 'redirectUrl' in content) {
                loginSuccess(content.redirectUrl);
            }else if('message' in content){
                failure(content.message);
            }
        })
        .catch(failure); //network error, couldn't get a proper json object, or just couldnt upload the intial details
}

function loginSuccess(redirectUrl) {
    //we have a token so put it in localstorage
    alert('You are logged in');
    window.location.href = redirectUrl;
}

function failure(message) {
    alert(message);
    console.warn(message);
}
