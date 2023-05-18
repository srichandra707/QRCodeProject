document.addEventListener("DOMContentLoaded", function(){
    const email=localStorage.getItem('email');
    if (email){
        fetch('/vendor-data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', },
            body: JSON.stringify({email}),
        })
        .then (response => {
            if (response.status === 404){
                throw new Error('Vendor not found');
            }
            return response.json();
        })
        .then (data => {
            document.getElementById('firstName').value = data.firstName;
            document.getElementById('email').value = data.email;

            document.getElementById('balance').textContent = "Money Left: " +  data.money;
        })
        .catch((error) => {
            console.error('Error:', error);
            if (error.message === 'Vendor not found'){
                window.location.href = "VendorLogin.html";
            }
        });
    }else{
        window.location.href = "VendorLogin.html";
    }

   
   
});


document.getElementById('price').addEventListener('change', ()=> {
    let price = document.getElementById('price').value;
    let email = localStorage.getItem('email');
    let transactionData = {
        vendorEmail: email,
        price: price,
    };
    let qr = new QRCode(document.querySelector('.qr-button'), {
        text: JSON.stringify(transactionData),
        width: 128,
        height: 128
    });
    
   
});






