document.addEventListener("DOMContentLoaded", function(){
    const email=localStorage.getItem('email');
    if (email){
        fetch('/user-data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', },
            body: JSON.stringify({email}),
        })
        .then (response => {
            if (response.status === 404){
                throw new Error('User not found');
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
            if (error.message === 'User not found'){
                window.location.href = "UserLogin.html";
            }
        });
    }else{
        window.location.href = "UserLogin.html";
    }

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', ()=>{
        localStorage.removeItem('email');
    });
   
});
