// validate article title and show error span if value is invalid
function validateArticleTitle(){
    if(event.target.value.trim() == "" || event.target.value == undefined){
        spanTitleError = getById('spanTitleError');
        spanTitleError.style.display = 'block';
        spanTitleError.innerText = 'Please enter title';
    }else{
        getById('spanTitleError').style.display = 'none';
    }
}

// validate article content and show error span if value is invalid
function validateContent(){
    if(event.target.value.trim() == "" || event.target.value == undefined){
        spanContentError = getById('spanContentError');
        spanContentError.style.display = 'block';
        spanContentError.innerText = 'Please enter article content';
    }else{
        getById('spanContentError').style.display = 'none';
    }
}

// validate firstname and show error span if value is invalid
function validateFName(){
    if(!event.target.readOnly && event.target.value.trim() == "" || event.target.value == undefined){
        spanFNameError = getById('spanFNameError');
        spanFNameError.style.display = 'block';
        spanFNameError.innerText = 'Please enter valid first name';
    }else{
        getById('spanFNameError').style.display = 'none';
    }
}

// validate last name and show error span if value is invalid
function validateLName(){
    if(!event.target.readOnly && event.target.value.trim() == "" || event.target.value == undefined){
        spanLNameError = getById('spanLNameError');
        spanLNameError.style.display = 'block';
        spanLNameError.innerText = 'Please enter valid last name';
    }else{
        getById('spanLNameError').style.display = 'none';
    }
}

// validate email and show error span if value is invalid
function validateEmail(){
    if(!event.target.readOnly && event.target.value.trim() == "" || event.target.value == undefined){
        spanEmailError = getById('spanEmailError');
        spanEmailError.style.display = 'block';
        spanEmailError.innerText = 'Please enter valid email id';
    }else{
        getById('spanEmailError').style.display = 'none';
    }
}

// validate age and show error span if value is invalid
function validateAge(){
    if(!event.target.readOnly && event.target.value.trim() == "" || event.target.value == undefined){
        spanAgeError = getById('spanAgeError');
        spanAgeError.style.display = 'block';
        spanAgeError.innerText = 'Please enter age';
    }else{
        getById('spanAgeError').style.display = 'none';
    }
}
