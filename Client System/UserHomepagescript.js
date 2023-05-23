
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

    var transactionList = document.querySelector('#transactionList');
    
    function onScanSuccess(decodedText, decodedResult) {

        transactionList.innerHTML = '';  

        vendorEmail = decodedText;
        if (vendorEmail) {
            document.getElementById('scanner-result').innerText = `Vendor: ${vendorEmail}`;
            priceInput.style.display = 'block';
            confirmButton.style.display = 'block';
        } else {
            document.getElementById('scanner-result').innerText = `Invalid QR code`;

        }
    }
    function onScanFailure(error) {
        console.warn(`QR error = ${error}`);
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 250 }, true)

    scanButton.addEventListener('click', function () {
        readerDiv.style.display = 'block';
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    });

    confirmButton.addEventListener('click', function () {
        var price = parseFloat(priceInput.value);
        if (price <= 0) {
            alert('Price must be a positive Number');
            return;
        }
        if (price) {
            var userEmail = localStorage.getItem('email');
            var transactionData = {
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
                    alert("Transaction completed!");
                    console.log('Transaction success: ', data);

                    fetch('add-transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(transactionData),
                    })
                        .then(respons => response.json())
                        .then(data => {
                            console.log('Transaction history update success: ', data);
                        })
                        .catch((error) => {
                            console.error('Transaction history update error:', error);
                        });
                    location.reload();
                    readerDiv.style.display='none';
                    priceInput.style.display='none';
                    confirmButton.style.display='none';
                })
                .catch((error) => {
                    console.error('Transaction error:', error);
                    alert("'Transaction error");
                });
        } else {
            alert('Please enter a price');
        }
    });
    document.querySelector('#transactions').addEventListener('click', () => {
        fetch('/get-transaction-history?userEmail=' + encodeURIComponent(email))
            .then(response => response.json())
            .then(transactions => {
                const transactionList = document.querySelector('#transactionList');
                transactionList.innerHTML = '';  // clear the list
                transactions.forEach(transaction => {
                    const transactionElement = document.createElement('div');
                    transactionElement.classList.add('transaction');

                    const userEmailElement = document.createElement('p');
                    userEmailElement.textContent = `User: ${transaction.userEmail}`;
                    userEmailElement.classList.add('user-email');
                    transactionElement.appendChild(userEmailElement);

                    const vendorEmailElement = document.createElement('p');
                    vendorEmailElement.textContent = `Vendor: ${transaction.vendorEmail}`;
                    vendorEmailElement.classList.add('vendor-email');
                    transactionElement.appendChild(vendorEmailElement);

                    const priceElement = document.createElement('p');
                    priceElement.textContent = `Price: ${transaction.price}`;
                    priceElement.classList.add('price');
                    transactionElement.appendChild(priceElement);

                    const timestampElement = document.createElement('p');
                    timestampElement.textContent = `Date: ${new Date(transaction.timestamp).toLocaleString()}`;
                    timestampElement.classList.add('timestamp');
                    transactionElement.appendChild(timestampElement);

                    transactionList.appendChild(transactionElement);
                });

                const scanQRCodeButton = document.querySelector('#scanQRCode');


                scanButton.addEventListener('click', () => {

                    const transactionList = document.querySelector('#transactionList');


                    transactionList.innerHTML = '';
                });



            })
            .catch(error => console.error(error));

    });



    document.querySelector('#logout-button').addEventListener('click', () => {
        localStorage.removeItem('email');
    });
});

