// const loginForm = document.getElementById('loginForm');

loginForm.onsubmit = login;

// function to login the user
function login(event){
    var userName = loginForm.userName.value;
    var password = loginForm.password.value;


    console.dir(loginForm);
    event.preventDefault();

    // Validation 
    if( userName == '' || userName == undefined ||
        password == '' || password == undefined){
            alert('Please enter valid cedentials');
            return;
    }

    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var userDetails = JSON.parse(this.response);
            if (userDetails.length) {
                localStorage.setItem("IsUserLoggedIn",true);
                localStorage.setItem("userFirstName", userDetails[0].firstName);
                localStorage.setItem("userLastName", userDetails[0].lastName);
                localStorage.setItem("userID", userDetails[0].id);
                localStorage.setItem("role", userDetails[0].role);
                window.location.href = 'http://127.0.0.1:8887/';
            }else{
                alert('User not found!!');
            }
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/Users?emailId=' + userName + '&password=' + password);
    XHTTP.send();
}

