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

    

    document.querySelector('#logout-button').addEventListener('click', ()=>{
        localStorage.removeItem('email');
    });
   
   
});


document.getElementById('qr-button').addEventListener('click', ()=> {
    let vendorEmail = localStorage.getItem('email');
    let qrcode = new QRCode(document.getElementById("qrcode-canvas"), {
        text: vendorEmail,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    
   
});




