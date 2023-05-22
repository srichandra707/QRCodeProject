
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

    var scanButton = document.getElementById('scan-button');
    var readerDiv = document.getElementById('reader');
    var priceInput = document.getElementById('price-input');
    var confirmButton = document.getElementById('confirm-button');
    var vendorEmail;
    function onScanSuccess(decodedText, decodedResult) {
        vendorEmail = JSON.parse(decodedText).email;
        if (vendorEmail){
            document.getElementById('scanner-result').innerText = `Vendor: ${vendorEmail}`;
            priceInput.style.display = 'block';
            confirmButton.style.display ='block';
        }else{
            document.getElementById('scanner-result').innerText=`Invalid QR code`;

        }
    }
    function onScanFailure(error) {
        console.warn(`QR error = ${error}`);
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", {fps:10,qrbox:250}, true)

    scanButton.addEventListener('click', function() {
        readerDiv.style.display = 'block';
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    });

    confirmButton.addEventListener('click', function(){
        var price = priceInput.value;
        if(price){
            var userEmail = localStorage.getItem('email');
            var transactionData ={
                userEmail: userEmail,
                vendorEmail: vendorEmail,
                price: price
            };

            fetch('complete-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Transaction success: ',data);
            })
            .catch((error)=>{
                console.error('Transaction error:', error);
            });
        }else {
            alert('Please enter a price');
        }
    });
    
    
    
    
document.querySelector('#logout-button').addEventListener('click', ()=>{
    localStorage.removeItem('email');
});
});



