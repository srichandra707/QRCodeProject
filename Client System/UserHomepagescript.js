
document.addEventListener("DOMContentLoaded", function () {
    const email = localStorage.getItem('email');
    if (email) {
        fetch('/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ email }),
        })
            .then(response => {
                if (response.status === 404) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('firstName').value = data.firstName;
                document.getElementById('email').value = data.email;

                document.getElementById('balance').textContent = "Money Left: " + data.money;
            })
            .catch((error) => {
                console.error('Error:', error);
                if (error.message === 'User not found') {
                    window.location.href = "UserLogin.html";
                }
            });
    } else {
        window.location.href = "UserLogin.html";
    }

    document.querySelector('.qr-button').addEventListener('click', () => {
        let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {
            
            readQRCode(content);
        });
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
});
document.querySelector('#logout-button').addEventListener('click', ()=>{
    localStorage.removeItem('email');
});
});


// This will be your qr code reading function
function readQRCode(data) {
    let transactionData = JSON.parse(data);
    transactionData.userEmail = localStorage.getItem('email');
    fetch('/complete-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(transactionData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log("QR code is scanned");
                alert(data.message);
            }
            // Refresh the page to update the money left
            location.reload();
        })
        .catch(error => console.error('Error:', error));
}

