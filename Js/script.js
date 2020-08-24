// checking weather the user is logged in or not 
(function(){
    if(!localStorage.getItem('IsUserLoggedIn')){
    window.location.href = 'http://127.0.0.1:8887/login.html';
    }

    // add active class to the current selected route (onload / on refresh)
    var currntHash = window.location.hash;
    var currntRoute = document.querySelector('a[href=\'' + currntHash.toString() + '\']');
    if(currntRoute){
        currntRoute.setAttribute('class', 'active');
    }
})();

// Show create user nav bar if signed in user is an admin
if(isAdminFn()){
    getById('liCreateUser').style.display = 'list-item';
    getById('liCreateTags').style.display = 'list-item';
}

// adding and removing the CSS class for nav bar (on hash change)
function changeHeaderActive(){

    if(event.target.hash == '#profile'){
        document.querySelector('ul li a.active').classList.remove('active');
        return;
    }
    if(event.target.tagName == 'A' && event.target.href !== ''){
        var previousSelection = document.querySelector('ul li a.active');
        if(previousSelection){
            previousSelection.classList.remove('active');
        }

        event.target.setAttribute('class', 'active');
    }

}

// check user is admin or not
function isAdminFn(){
    var isAdmin = localStorage.getItem('role') ? localStorage.getItem('role') == 'admin' : false;
    return isAdmin;
}


// function to show toaster
function showToaster(message, type){
    var spanElem = document.getElementById('toasterSpan');
    spanElem.innerText = message;
    spanElem.style.padding = "10px";
    switch(type){
        case "error": {
            spanElem.style.color = 'red';
            break;
        } 
        case "info": {
            spanElem.style.color = 'green';
            break;
        }
        default : spanElem.style.color = 'black';
    }
    spanElem.style.display = 'block';
    setTimeout(function(){
        spanElem.style.display = 'none';
    }, 4000);
}

// uitility to get element by ID
function getById ( id_string ) {
    return document.getElementById(id_string);
  }

// navigate the user to specific location 
function navigate(fileName){
    window.parent.location.href = 'http://127.0.0.1:8887/' + fileName + '.html';
}

// logout the user
function logOut(){
    localStorage.clear();
    navigate('Login');
}

// Closure to get the last page numbet of the currnt tab
function lastPage(){
    var lastPageNumber;
    return function(pageNumber){
        if(pageNumber){
            lastPageNumber = pageNumber;
        }
        return lastPageNumber
    }
}

var lastPageClosure = lastPage();

// function to get all articles depennd on the parameters
function getAllArticles(userID = undefined, searchInput = undefined, pageNumber = 1){

        // clear search and tag inputs an getting all articles
        if(getById('getAllArticlesBtn')){
            getById('getAllArticlesBtn').addEventListener( 'click', function() {
                var tag = getById('tagInput');
                var searchIp = getById('btnTagSearchSubmit');
                if(tag && searchIp){
                    tag.value = '';
                    searchIp.value = '';
                }
                getById('tagInfo').style.display = 'none';
            });
        }

    var perPage = 5;

    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            // gets tags for search with tag
            // getTagsForSearch()
            loadTags(true);

            if(pageNumber == 1){
                getById('previous').disabled = true;
                currrntPage = pagination();

                // Get the raw header string
                var headers = XHTTP.getAllResponseHeaders();

                // Convert the header string into an array
                // of individual headers
                var arr = headers.trim().split(/[\r\n]+/);
    
                // Create a map of header names to values
                var headerMap = {};
                arr.forEach(function (line) {
                var parts = line.split(': ');
                var header = parts.shift();
                var value = parts.join(': ');
                headerMap[header] = value;
                });
    
                // console.log(headerMap["x-total-count"]);

                var totalRecords = headerMap["x-total-count"];

                if((totalRecords / perPage) < 1){
                    lastPageClosure(1);
                    getById('next').disabled = true;
                }else{
                    lastPageClosure(Math.ceil(totalRecords / perPage));
                    getById('next').disabled = false;
                }
            } 

            var isAdmin = isAdminFn();
            var articles = JSON.parse(this.response);
            var articlesTable = document.getElementById('articles-table');

            console.log(articles);

            // checking the length of the received array 
            if (articles.length >= 1) {
                articlesTable.tBodies[0].innerHTML = "";

                // iterating through the received data and creating the article's table
                for(var i = 0; i < articles.length; i++){

                    var tr = document.createElement('tr');
                    article = articles[i];

                    tr.setAttribute('data-articleId', article['id']);

                    // tr.setAttribute('onclick', 'redirectToViewArticle(Number(this.dataset.articleid))');
                    // tr.style.cursor = "pointer";
                    tr.setAttribute('class', 'card');
                    var td = document.createElement('td');    
                    var titleDiv = document.createElement('div');
                    titleDiv.style.display = 'inline-block';        
                    var titleElem = document.createElement('h3');
                    titleElem.innerText = article['title']
                    var createdDate = document.createElement('span');
                    createdDate.setAttribute('class', 'opacity');
                    createdDate.innerText = article['createdDate'] ? (new Date(article['createdDate'])).toLocaleString() : 'no Date';
                    titleDiv.append(titleElem);
                    titleDiv.append(createdDate);
                    var contentElem = document.createElement('p');
                    contentElem.setAttribute('class','module line-clamp');
                    contentElem.style.maxHeight = '5em';
                    contentElem.style.pointerEvents = 'none';
                    contentElem.innerHTML = article['content'];
                    td.setAttribute('class', 'truncate');

                    var readMoreDiv = document.createElement('p');
                    readMoreDiv.setAttribute('class','onefourth col');
                    var readMoreBtn = document.createElement('button');
                    readMoreBtn.innerText = 'READ MORE »';
                    readMoreBtn.setAttribute('onclick', 'redirectToViewArticle(Number(this.closest(\'tr\').dataset.articleid))');
                    readMoreBtn.setAttribute('class','padding-large border button');
                    readMoreDiv.append(readMoreBtn);

                    var thirdDiv = document.createElement('div');
                    thirdDiv.setAttribute('class','onefourth col');
                    var pElem = document.createElement('p');
                    // pElem.setAttribute('class', 'margin0');
                    var spanComments = document.createElement('span');
                    spanComments.setAttribute('class', 'padding-large left');
                    var comments = document.createElement('b');
                    comments.innerHTML = 'Comments &nbsp;'
                    var count = document.createElement('span');
                    getCommentCount(article['id'], count);
                    count.setAttribute('class', 'tag');
                    count.innerText = 0;
                    spanComments.append(comments, count);
                    pElem.append(spanComments);
                    thirdDiv.append(pElem);



                    td.append(titleDiv);
                    // td.append(contentElem, readMoreDiv, editP, deleteP, thirdDiv);
                    // tr.append(td);

                    //tags div
                    var tagsDiv = document.createElement('div');
                    tagsDiv.setAttribute('class','.old-Tags');
                    tagsDiv.style.width = '75%';
                    tagsDiv.style.pointerEvents = 'none';
                    tagsDiv.style.clear = 'both';
                    
                    //
                    if(article.tags){
                        article.tags.forEach( function(val) {
                            getArticleTag(Number(val), tagsDiv);
                        });
                    }

                    // checking weather need to add edit and delete actions 
                    if(userID || isAdmin){

                        var editP = document.createElement('p');
                        editP.setAttribute('class','onefourth col');
                        var editBtn = document.createElement('button');
                        editBtn.innerHTML = 'Edit &nbsp;';
                        editBtn.setAttribute('class','padding-large border  edit button');
                        editBtn.setAttribute('onclick', 'redirectToViewArticle(Number(event.target.closest(\'tr\').dataset.articleid), true)');
                        var editI = document.createElement('i');                        
                        editI.setAttribute('class', 'far fa-edit');
                        editBtn.append(editI);
                        editP.append(editBtn);


    
                        var deleteP = document.createElement('p');
                        deleteP.setAttribute('class','onefourth col');
                        var deleteBtn = document.createElement('button');
                        deleteBtn.innerHTML = 'Delete &nbsp;';
                        deleteBtn.addEventListener('click', function(){
                            showModal('Are you sure want to delete', undefined, deleteArticle, event.target.closest('tr').dataset.articleid);
                        });
                        deleteBtn.setAttribute('class','padding-large border button delete');
                        var delI = document.createElement('i');
                        delI.setAttribute('class', 'fas fa-trash-alt');
                        delI.setAttribute('id', 'deleteIcon');
                        deleteBtn.append(delI);
                        deleteP.append(deleteBtn);






                        // var td = document.createElement('td');
                        // var divInTd = document.createElement('div');
                        // divInTd.style.display = 'flex';
                        // divInTd.style.justifyContent = 'space-evenly';
                        
                        // // delete Icon div creation
                        // var deleteDiv = document.createElement('div');
                        // deleteDiv.addEventListener('click', function(){
                        //     showModal('Are you sure want to delete', undefined, deleteArticle, event.target.closest('tr').dataset.articleid);
                        // });
                        // var delI = document.createElement('i');
                        // delI.setAttribute('class', 'fas fa-trash-alt');
                        // delI.setAttribute('id', 'deleteIcon');
                        // deleteDiv.append(delI);

                        // // edit Icon div creation
                        // var editDiv = document.createElement('div');
                        // editDiv.setAttribute('onclick', 'redirectToViewArticle(Number(event.target.closest(\'tr\').dataset.articleid), true)');
                        // var editI = document.createElement('i');                        
                        // editI.setAttribute('class', 'far fa-edit');
                        // editDiv.append(editI);
                        // divInTd.append(editDiv);
                        // divInTd.append(deleteDiv);

                        // // appending delete and edit Icons to td element 
                        // td.append(divInTd);
                        // td.setAttribute('class', 'truncate');

                        editP.addEventListener('click', function(){
                                event.stopPropagation();
                        });

                        deleteP.addEventListener('click', function(){
                            event.stopPropagation();
                        });

                        // tr.append(td);
                    }

                    if( editP && deleteP){
                        td.append(contentElem, readMoreDiv, editP, deleteP, thirdDiv, tagsDiv);
                    }else{
                        td.append(contentElem, readMoreDiv, thirdDiv, tagsDiv);
                    }
                    // td.append(contentElem, readMoreDiv, editP, deleteP, thirdDiv);
                    tr.append(td);

                    articlesTable.tBodies[0].append(tr);
                    var br = document.createElement('br');
                    articlesTable.tBodies[0].append(br);
                    articlesTable.tBodies[0].append(br);

                }
            }else{
                showToaster('Articles not found :(','error');
                articlesTable.tBodies[0].innerHTML = "";
            }
        }

        if(this.status == 404){
            var articlesTable = document.getElementById('articles-table');
            showToaster('404 No record\'s found','error');
                articlesTable.tBodies[0].innerHTML = "";
        }
    }
    
    if(userID && searchInput){
        // search in logged in user's article if both userId and searchInput available
        XHTTP.open('GET', 'http://localhost:3000/articles?q=' + searchInput + '&createdUserID=' + userID + '&_page=' + pageNumber +'&_limit=' + perPage);
    }else if(userID){
        // get the logged in user article's if userId available
        XHTTP.open('GET', 'http://localhost:3000/Articles?createdUserID=' + userID + '&_page=' + pageNumber + '&_limit=' + perPage);
    }else if(searchInput){
        // search in all article's if  searchInput available
        XHTTP.open('GET', 'http://localhost:3000/Articles?q=' + searchInput + '&_page=' + pageNumber + '&_limit=' + perPage);
    }else{
        // get all articles
        XHTTP.open('GET', 'http://localhost:3000/Articles?_page=' + pageNumber + '&_limit=' + perPage);   
    }
    
    XHTTP.send();
}

// gets the comments for an article
function getCommentCount(articleId, ref){
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            var count = JSON.parse(this.response);
            if(count.length){
                ref.innerText = count.length;
            }else ref.innerText = 0;
        }

        if(this.status == 404){
            showToaster('Unable to dele article','error');
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/comments/?articleId=' + articleId);
    XHTTP.send();
}

// delete's the article
function deleteArticle(articleId = 0){
    event.stopPropagation();
    if(articleId == 0 || isNaN(articleId)){
        // return if the article Id is invalid
        return;
    }
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            console.log(this.response);

            showToaster("deleted successfully", 'info');

            var articlesTable = document.getElementById('articles-table');
            articlesTable.tBodies[0].innerText='';

            // get the articles on success full deletion
            if(window.location.hash.toLowerCase().includes('myarticles')){
                getAllArticles(localStorage.getItem('userID'));
            }else{
                getAllArticles();
            }   
        }

        if(this.status == 404){
            showToaster('Unable to dele article','error');
        }
    }

    XHTTP.open('DELETE', 'http://localhost:3000/Articles/' + articleId);
    XHTTP.send();
}

// checks weather article title exists or not
// and calls add aricle method if the tile is unique
function validateTitleAndAddArticle(){
    var XHTTP = new XMLHttpRequest();
    event.preventDefault();
    var createArticleForm = document.getElementById('createArticleForm');

    var ArticleTitle = createArticleForm.title.value;
    var content = CKEDITOR.instances.content.getData();

    if( ArticleTitle == undefined || title == '' ||
        content == undefined || content == '' ||
        !isNaN(title) || !isNaN(content)){
            // alert('Please enter valid details');
            showToaster('Please enter valid details', 'error');
            return;
    }
    var tagChips = Array.from(document.querySelectorAll('div.tag-chip-container'));
    var tagIDs;
    if(tagChips.length){
        tagIDs = [];
        tagChips.forEach( function(val) {
            tagIDs.push(val.dataset.tagid);
        });
    }


    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            // console.log(this.response);
            // alert("deleted successfully");
            // var articlesTable = document.getElementById('articles-table');
            // articlesTable.tBodies[0].innerText='';
            // getAllArticles(localStorage.getItem('userID'));
            var articles = JSON.parse(this.response);

            // Filtering the returned data
            articles = articles.filter( function(article) {
                return article.title.toLowerCase() == ArticleTitle.toLowerCase();
            });


            if(articles.length <= 0){
                var createdUserID = localStorage.getItem('userID');
                var turnOffComments = getById('turnOffComments').checked;

                addArticle({title : ArticleTitle, content, createdUserID, turnOffComments, createdDate : new Date(), tags : tagIDs});
            }else{
                var title = document.getElementById('title');
                var span = document.createElement('span');
                span.innerText = 'Article title already exists';
                span.style.float = 'right';
                span.style.color = 'red';
                span.style.fontWeight = 'bold';

                title.after(span);
            }
        }

        if( this.status == 404 ){
            showToaster('error occured while validating the title','error');
        }
    }

    // title_like get's case insensitive and partial string search 
    // To search in the total tile we have to filter again 
    XHTTP.open('GET', 'http://localhost:3000/Articles?title_like=' + ArticleTitle);
    XHTTP.send();
}

// function to create new article
function addArticle(article){
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 201){
            console.log(this.response);
            createArticleForm.reset();
            article = JSON.parse(this.response);
            redirectToViewArticle(article.id);
            showToaster('Added success fully', 'info');
        }

        if( this.status == 404 ){
            showToaster('error occured while adding the title','error');
        }
    }

    XHTTP.open('POST', 'http://localhost:3000/Articles', true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send(JSON.stringify(article));
}

// make UI changes on clicking edit artile
function editArticle(){

    getById('editTags').style.display = 'block';
    document.querySelector('.old-Tags').style.pointerEvents = 'auto';

    viewArticleTitle.contentEditable = 'true';
    // viewArticleContent.contentEditable = 'true';
    viewArticleContent.style.display = 'none';

    CKEDITOR.replace('editContent');
    CKEDITOR.instances.editContent.setData(viewArticleContent.innerHTML);

    var updateArticle = getById('updateArticle');
    updateArticle.style.display = 'inline-block';
    var editArticleSpan = getById('editArticleSpan');
    editArticleSpan.style.display = 'block';
    getById('spanCloseEditArticle').style.display = 'block';
    loadTags();
}

// Closing the Edit article
function closeEditArticle(){
    // tag related css changes
    getById('editTags').style.display = 'none';
    document.querySelector('.old-Tags').style.pointerEvents = 'none';

    var updateArticle = getById('updateArticle');
    updateArticle.style.display = 'none';
    getById('spanCloseEditArticle').style.display = 'none';
    var editArticleSpan = getById('editArticleSpan');
    editArticleSpan.style.display = 'none';
    viewArticleTitle.contentEditable = 'false';
    // viewArticleContent.contentEditable = 'false';
    viewArticleContent.style.display = 'block';
    getById('tempSpan').innerHTML = "";

    var chipsDiv = document.querySelector('.old-Tags');
    var chipArray = Array.from(chipsDiv.querySelectorAll('.tag-chip-container'));
    chipArray.forEach( function(chip) {
        if(chip.style.display == 'none'){
            chip.style.display = 'inline-block';
        }
    });
    
    // document.querySelector('.old-Tags').innerHTML = "";

            CKEDITOR.instances.editContent.destroy();

            // location.reload();
}

// submit's the edited article to the DB
function updateArticle(){
    var title = viewArticleTitle.innerText;
    var content = CKEDITOR.instances.editContent.getData();

    var tagChips = Array.from(document.querySelectorAll('div.tag-chip-container'));
    var tagIDs;
    if(tagChips.length){
        tagIDs = [];
        tagChips.forEach( function(val) {
            if( val.style.display != 'none'){
                tagIDs.push(val.dataset.tagid);
            }
        });
    }

    if( title == undefined || title == '' ||
        content == undefined || content == '' ||
        !isNaN(title) || !isNaN(content)){
            showToaster('Please enter valid details', 'error');
            return;
    }

    var article = {title, content, updatedDate : new Date(), tags : tagIDs? tagIDs : []};

    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            console.log(this.response);
            article = JSON.parse(this.response);
            // redirectToViewArticle(article.id);
            // alert("updated successfully");
            showToaster('updated successfully', 'info');

            // tag css changes
            getById('editTags').style.display = 'none';
            document.querySelector('.old-Tags').style.pointerEvents = 'none';


            // location.reload();
            getById('spanCloseEditArticle').style.display = 'none';
            var updateArticle = getById('updateArticle');
            updateArticle.style.display = 'none';
            var editArticleSpan = getById('editArticleSpan');
            editArticleSpan.style.display = 'none';
            viewArticleTitle.contentEditable = 'false';
            // viewArticleContent.contentEditable = 'false';
            viewArticleContent.style.display = 'block';
            document.querySelector('.old-Tags').innerHTML = "";
            getById('tempSpan').innerHTML = "";

            CKEDITOR.instances.editContent.destroy();
            loadViewArticle(true);
        }

        if( this.status == 404 ){
            showToaster('error occured while updating the article','error');
        }        
    }

    XHTTP.open('PATCH', 'http://localhost:3000/Articles/' + getID(), true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send(JSON.stringify(article));
}

// validate the email before adding he user
function validateEmailAndAddUser(isUpdateUser = false){
    event.preventDefault();
    var createUserForm = document.getElementById('createUserForm');

    var firstName = createUserForm.firstName.value;
    var lastName = createUserForm.lastName.value;
    var emailId = createUserForm.emailId.value;
    var age = createUserForm.age.value;
    var role = createUserForm.role.value;
    if(!isUpdateUser){
        var password = '123';
    }


    if(firstName == undefined || firstName == '' ||
        lastName == undefined || lastName == '' ||
        emailId == undefined || emailId == '' ||
        role == undefined || role == '' ||
        age == undefined || age == '' || age == 0){
            showToaster('please give correct details', 'error');
            return;
    }

    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            var articles = JSON.parse(this.response);
            getById('errEmail').style.display = 'none';
            if(articles.length <= 0){
                if(isUpdateUser){
                    updateUser({firstName, lastName, emailId, password, age, role},  getItem('userID'))
                }else{
                    addUser({firstName, lastName, emailId, password, age, role});
                }
            }else if( articles.length == 1 && isUpdateUser ){
                updateUser({firstName, lastName, emailId, password, age, role}, getItem('userID'));
            }else{
                
                // alert('emailID already exists');   
                // showToaster('emailID already exists', 'error');
                getById('errEmail').style.display = 'block';

            }
        }

        if( this.status == 404 ){
            showToaster('error occured while validating the user email','error');
        }    
    }

    XHTTP.open('GET', 'http://localhost:3000/Users?emailId=' + emailId);
    XHTTP.send();
}

// Function to reate user
function addUser(User){
    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 201){
            console.log(this.response);
            createUserForm.reset();
            // alert("Added success fully");
            showToaster('Added success fully', 'info');
        }

        if(this.status == 404){
            showToaster('error occured while adding the user','error');
        }
    }

    XHTTP.open('POST', 'http://localhost:3000/users', true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send(JSON.stringify(User));
}

// redirecting the user to view article page
function redirectToViewArticle(articleId, edit = false){
    if(edit){
        window.location.replace('http://127.0.0.1:8887?id=' + articleId + '&edit=' + true + '#viewArticle');
    }else{
        window.location.replace('http://127.0.0.1:8887?id=' + articleId + '#viewArticle');
    }    
}


// get url ID param
function getIDParam(){
    var urlParams = new URLSearchParams(window.location.search);
    
    var IDParam;
    if(urlParams.has('id')){
        IDParam = urlParams.get('id');
    }
    return function(){return IDParam;}
}

// get Url edit param
function getEditParam(){
    var urlParams = new URLSearchParams(window.location.search);
    
    if(urlParams.has('edit')){
        var editParam = urlParams.get('edit');
    }
    return editParam;
}

var getID;

// Loading the article data
function loadViewArticle(toggleComments = false){
    getID = getIDParam();

    // check the article Id available or not
    if(getID()){
        var XHTTP = new XMLHttpRequest();
        XHTTP.onreadystatechange = function(){
            if( this.readyState == 4){
                if(this.status == 200){
                    console.log(this.response);
                    var article = JSON.parse(this.response);
                    var title = document.getElementById('viewArticleTitle');
                    var content = document.getElementById('viewArticleContent');
                     
    
                    title.innerText = article['title'];
                    content.innerHTML = article['content'];

                    if(article.tags){
                        article.tags.forEach( function(val) {
                            // var chipContainer = document.createElement('div');
                            // chipContainer.setAttribute('class', 'tag-chip-container');
                            // chipContainer.dataset.tagid = val.id;
                            
                            // var text = document.createElement('div');
                            // text.setAttribute('class', 'chip-text');
                            // text.innerText = val.tagName;
        
                            // var dlt = document.createElement('div');
                            // dlt.setAttribute('class', 'inline');
                    
                            // var dltI = document.createElement('i');
                            // dltI.setAttribute('class', 'far fa-times-circle deleteIcon');
                            // dlt.addEventListener('click', removeChip);
        
                    
                            // dlt.appendChild(dltI);
                            // chipContainer.appendChild(text);
                            // chipContainer.appendChild(dlt);
                            // // tagInput.append(chipContainer);
                    
                            // var parent = document.querySelector('.old-Tags');
                            getArticleTag(Number(val));
                            // parent.append(chipContainer);

                        });
                    }

                    getById('turnOffComments').checked = article['turnOffComments'];

                    // adding event listners to turn on/off comments checkbox 
                    getById('turnOffComments').addEventListener('change', function(){
                            if(event.target.checked){
                                showModal('Are you sure want to turn off comments', undefined, toggleCommentsFn, event.target.checked, function(){
                                    getById('turnOffComments').checked = false;
                                });
                            }else{
                                showModal('Now any one comment on your post!!',  undefined, toggleCommentsFn, event.target.checked, function(){
                                    getById('turnOffComments').checked = true;
                                });
                            }
                        }
                    );

                    // showing/hiding add comments button
                    if(article.turnOffComments){
                        var btnAddComment = getById('btnAddComment');
                        btnAddComment.style.display = 'none';
                    }else{
                        var btnAddComment = getById('btnAddComment');
                        btnAddComment.style.display = 'inline-block';
                    }

                    // get comments for the article
                    getComments(article.turnOffComments);
                    
                    // show Edit and delete button if the user is Admin or if the article is user's article
                    if(localStorage.getItem('userID') == article.createdUserID || isAdminFn()){
                        getById('btnEditArticle').style.display = 'inline-block';
                        getById('divTurnOffComments').style.display = 'block';
                    }

                    // checking the user has edit access or not
                    if(getEditParam()?.toLowerCase() == 'true' && !toggleComments){
                        checkForEditAccess();
                    }
                }

                if( this.status == 404){
                    showToaster('article not found', 'error');
                }
            }
        }

        XHTTP.open('GET', 'http://localhost:3000/articles/' + getID());
        XHTTP.send();
    }else{
        window.location.href = "http://127.0.0.1:8887/#articles";
    }
    
}

// get article tag
function getArticleTag(tagid, ref){
    if(tagid){
        var XHTTP = new XMLHttpRequest();

        XHTTP.onreadystatechange = function(){
            if( this.readyState == 4 && this.status == 200){
                var tag = JSON.parse(this.response);
                // document.querySelector('.old-Tags').innerHTML = '';
                if(tag){
                    var chipContainer = document.createElement('div');
                    chipContainer.dataset.tagid = tag.id;
                    
                    var text = document.createElement('div');
                    text.setAttribute('class', 'chip-text');
                    text.innerText = tag.tagName;

                    var dlt = document.createElement('div');
                    dlt.setAttribute('class', 'inline');
            
                    var dltI = document.createElement('i');
                    dltI.setAttribute('class', 'far fa-times-circle deleteIcon');
                    dlt.addEventListener('click', removeChipCreateArticle);

            
                    dlt.appendChild(dltI);
                    chipContainer.appendChild(text);
                    chipContainer.appendChild(dlt);
                    // tagInput.append(chipContainer);
                    if(ref){
                        chipContainer.setAttribute('class', 'tag-chip-container');
                        ref.append(chipContainer);
                    }else{
                        chipContainer.setAttribute('class', 'tag-chip-container');
                        var parent = document.querySelector('.old-Tags');
                        parent.append(chipContainer);
                    }

                }
            }
    
            if( this.status == 404){
                // showToaster('error occured while getting Tags', 'error');
            }
        }
    
        XHTTP.open('GET', 'http://localhost:3000/tags/' + tagid, true);
        XHTTP.setRequestHeader('Content-Type', 'application/json');
        XHTTP.send();
    }
}

// checking the user has edit access or not and enabling edit if has access
function checkForEditAccess(){
    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4){
            if(this.status == 200){
                var article = JSON.parse(this.response);
                if(article.length > 0 || localStorage.getItem('role') == 'admin'){
                    getById('btnEditArticle').click();
                }else{
                    return false;
                }
            }

            if( this.status == 404){
                // alert('article not found');
                showToaster('article not found', 'error');
            }
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/articles?createdUserID='+ localStorage.getItem('userID') + '&id=' +  + getID());
    XHTTP.send();
}

// Adds comment to the article
function submitComment(){
    
    var textArea = document.getElementById('commentTextArea');

    if( textArea.value == undefined || textArea.value == ''){
        showToaster('Please enter comment', 'info');
        return;
    }
    var comments = { 
        articleId : getID() ,
        name : localStorage.getItem('userFirstName'), 
        comment : textArea.value,
        createdDate : new Date(),
        createdUID : localStorage.getItem('userID'),
    };
    textArea.value = "";

    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 201){
            console.log(this.response);
            showToaster("Comment added success fully", 'info');
            commentSubmitBtn.disabled = true;
            cancelAddComment();
            getComments();
        }
    }

    XHTTP.open('POST', 'http://localhost:3000/comments', true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send(JSON.stringify(comments));
    
} 

// function to close edit comment 
function closeEditComment(){
    var commentID = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
    var updatedComment = getById('comment-' + commentID);
    var updateArticle = getById('spanUpdateComment-' + commentID); 
    updateArticle.style.display = 'none'; 
    updatedComment.contentEditable = 'false';

}

// get comments for the article
function getComments(turnOffComments = undefined){
    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4){
            if(this.status == 200){
                console.log(this.response);

                var comments = JSON.parse(this.response);
                var commentsSection = document.getElementById('commentsSection');
                
                // commentsSection.parentNode.removeChild(commentsSection);
                commentsSection.innerHTML="";
                for(var i = 0; i < comments.length; i++){

                    var row = document.createElement('div');

                    var spanParent = document.createElement('span');


                    // Add edit comment option if the comment added by logged in user and 
                    // if the comments for the article is turned on
                    if(!turnOffComments && localStorage.getItem('userID') == comments[i].createdUID){
                        var btnEditComment = document.createElement('input');
                        btnEditComment.value = "Edit Comment";
                        btnEditComment.type = 'button';
                        btnEditComment.style.marginRight = "5px";
                        btnEditComment.addEventListener('click', editComment)

    
                        var btnUpdateComment = document.createElement('input');
                        btnUpdateComment.value = "updateComment";
                        btnUpdateComment.type = 'button';
                        btnUpdateComment.style.marginRight = "5px";
                        btnUpdateComment.setAttribute('id','updateComment-' + comments[i].id);
                        btnUpdateComment.addEventListener('click', updateComment);

                        var spanUpdateComment = document.createElement('span');
                        spanUpdateComment.style.display = 'none';

                        var btnDeleteComment = document.createElement('input');
                        btnDeleteComment.value = "Delete";
                        btnDeleteComment.type = 'button';
                        btnDeleteComment.style.marginRight = "5px";
                        btnDeleteComment.addEventListener('click', deleteComment)

                        var spanClose = document.createElement('span');
                        spanClose.innerText = 'X';
                        spanClose.style.marginRight = "5px";
                        spanClose.style.color = 'red';
                        spanClose.style.cursor = 'pointer';
                        spanClose.addEventListener('click', closeEditComment);

                        spanUpdateComment.setAttribute('id','spanUpdateComment-' + comments[i].id);
                        spanUpdateComment.append(btnUpdateComment);
                        spanUpdateComment.append(spanClose);
                        spanParent.append(btnEditComment);
                        spanParent.append(spanUpdateComment);
                        spanParent.append(btnDeleteComment);
                    }

                    
                    row.setAttribute('data-commentId', comments[i].id);
                    row.setAttribute('data-createdUID', comments[i].createdUID);

                    var commentIdInput = document.createElement('input');
                    commentIdInput.value = comments[i].id;
                    commentIdInput.type = 'hidden';

                    var cmtCreatedUID = document.createElement('input');
                    cmtCreatedUID.value = comments[i].createdUID;
                    cmtCreatedUID.type = 'hidden';

                    var parentDiv = document.createElement('div');
                    parentDiv.setAttribute('class', 'col-2');
                    parentDiv.style.width = '12%';
                    parentDiv.style.float = 'left';

                    var byDiv = document.createElement('span');
                    byDiv.innerText = 'by ';
    
                    var nameDiv = document.createElement('span');
                    nameDiv.innerText = comments[i].name;
                    nameDiv.setAttribute('class', 'text-info');

                    parentDiv.append(byDiv);
                    parentDiv.append(nameDiv)

                    var commentDiv = document.createElement('div');
                    commentDiv.innerText = comments[i].comment;
                    commentDiv.setAttribute('class', 'col-12');
                    commentDiv.setAttribute('id', 'comment-' + comments[i].id);

                    var createdDate = document.createElement('div');
                    createdDate.innerText = comments[i].createdDate ? (new Date(comments[i].createdDate)).toLocaleString() : 'no Date';
                    createdDate.setAttribute('class', 'col-2');
                    createdDate.style.width = '15%';
                    createdDate.style.float = 'left';

                    row.append(commentIdInput);
                    row.append(cmtCreatedUID);
                    row.append(parentDiv);
                    row.append(createdDate);

                    if(spanParent){  
                        row.append(spanParent);
                    }
                    row.append(commentDiv);

                    row.append(document.createElement('br'));
                    commentsSection.append(row);
                }
                
            }

            if( this.status == 404){
                showToaster('Comments not found', 'error');
            }
        }
    }
    XHTTP.open('GET', 'http://localhost:3000/comments?articleId=' + getID());
    XHTTP.send();
} 

// displays text area to add comment
function displayCommentbox(){
    var textArea = document.getElementById('commentTextArea');
    var commentActionRow = document.getElementById('commentActionRow');

    textArea.style.display = 'block';
    commentActionRow.style.display = 'block';   
}

// disable comment submit button of the comment is empty
function disableSubmitBtn(e){
    if(e.target.value == '' || e.target.value == undefined){
        commentSubmitBtn.disabled = true;
    }else{
        commentSubmitBtn.disabled = false;
    }
}

// closes the add comment text area
function cancelAddComment(){
    var textArea = document.getElementById('commentTextArea');
    var commentActionRow = document.getElementById('commentActionRow');
    commentActionRow.style.display = 'none';
    textArea.style.display = 'none'; 
}

// Edit comment start
function editComment(){
    var commentID = event.target.closest('div').dataset.commentid;
    if(commentID){
        getById('comment-' + commentID).contentEditable = 'true';

        var updateArticle = getById('spanUpdateComment-' + commentID);
        updateArticle.style.display = 'inline-block';
    }
}

function updateComment(){

    var commentID = event.target.closest('div').dataset.commentid;
    var updatedComment = getById('comment-' + commentID);

    var updatedDate = new Date();
    var comment = {comment : updatedComment.innerText, updatedDate};

    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            console.log(this.response);
            article = JSON.parse(this.response);
            showToaster('updated comment successfully', 'info');

            var updateArticle = getById('spanUpdateComment-' + commentID);
            updateArticle.style.display = 'none';
            updatedComment.contentEditable = 'false';
        }
    }

    XHTTP.open('PATCH', 'http://localhost:3000/Comments/' + commentID + '?createdUID=' + localStorage.getItem('userID'), true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send(JSON.stringify(comment));
}

// Delete comment start
function deleteComment(){
    var commentID = event.target.closest('div').dataset.commentid;

    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            showToaster('deleted comment successfully', 'info');
            getComments();
        }

        if(this.status == 404){
            showToaster('unable to delete the comment', 'error');
        }
    }

    XHTTP.open('DELETE', 'http://localhost:3000/Comments/' + commentID + '?createdUID=' + localStorage.getItem('userID'), true);
    XHTTP.send();
}

// Toggle comments start
function toggleCommentsFn(toggleOrNot){
    if(toggleOrNot){
            var XHTTP = new XMLHttpRequest();

            var article = {turnOffComments : true};

            XHTTP.onreadystatechange = function(){
                if( this.readyState == 4 && this.status == 200){
                    console.log(this.response);
                    article = JSON.parse(this.response);
                    // redirectToViewArticle(article.id);
                    // alert("updated successfully");
                    showToaster('updated article successfully', 'info');
        
                    loadViewArticle(true);
                }
            }
        
            XHTTP.open('PATCH', 'http://localhost:3000/Articles/' + getID(), true);
            XHTTP.setRequestHeader('Content-Type', 'application/json');
            XHTTP.send(JSON.stringify(article));
        // }
    }else{
            var XHTTP = new XMLHttpRequest();

            var article = {turnOffComments : false};

            XHTTP.onreadystatechange = function(){
                if( this.readyState == 4 && this.status == 200){
                    console.log(this.response);
                    article = JSON.parse(this.response);
                    // redirectToViewArticle(article.id);
                    // alert("updated successfully");
                    showToaster('updated article successfully', 'info');
        
                    loadViewArticle(true);
                }
            }
        
            XHTTP.open('PATCH', 'http://localhost:3000/Articles/' + getID(), true);
            XHTTP.setRequestHeader('Content-Type', 'application/json');
            XHTTP.send(JSON.stringify(article));
    }
}

// get's the user details
function getUserDetails(userId = 0){
    if(!userId){
        return;
    }
    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            console.log(this.response);
            var user = JSON.parse(this.response);
            // getById(firstName).value = user.firstName;

            for(var key in user){
                if(key !== 'id' && key !== 'password'){
                    getById(key).value = user[key];
                }
            }
        }

        if(this.status == 404){
            showToaster('error occured while getting the user details','error');
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/users/' + userId);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send();   
}

// enable's the input fields in profile page
function enableProfileEdit(){
    var elems = getById('createUserForm');
    for(var i = 0; i < elems.length; i++){
        elems[i].disabled = false;
    }
    getById('cancleEditProfile').style.display = 'inline-block';
}

function disableProfileEdit(){
    var elems = getById('createUserForm');
    for(var i = 0; i < elems.length; i++){
        elems[i].disabled = true;
    }
    getById('cancleEditProfile').style.display = 'none';
}

function updateUser(User, id){
    var XHTTP = new XMLHttpRequest();
    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            console.log(this.response);
            // alert("Added success fully");
            disableProfileEdit();
            showToaster('Updated success fully', 'info');
        }

        if(this.status == 404){
            showToaster('error occured while updating the user','error');
        }
    }

    XHTTP.open('PATCH', 'http://localhost:3000/users/' + id, true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send(JSON.stringify(User));
}

// create's new tag chip
function createChip(e){
    if(e.keyCode == 188){
        var tagInput = event.target;
        event.preventDefault();

        if(tagInput.value){

            // createTags(tagInput.value);
            tagInput.value = '';


            // var chipContainer = document.createElement('div');
            // chipContainer.setAttribute('class', 'tag-chip-container');
            
            // var text = document.createElement('div');
            // text.setAttribute('class', 'chip-text');
            // text.innerText = tagInput.value;
            // tagInput.value = '';

            // var dlt = document.createElement('div');
            // dlt.setAttribute('class', 'inline');
    
            // var dltI = document.createElement('i');
            // dltI.setAttribute('class', 'far fa-times-circle deleteIcon');
            // dlt.addEventListener('click', removeChip);
    
            // dlt.appendChild(dltI);
            // chipContainer.appendChild(text);
            // chipContainer.appendChild(dlt);
            // // tagInput.append(chipContainer);
    
            // var parent = document.querySelector('.tags-inner');
            // var dd = parent.firstElementChild;
            // dd.append(chipContainer);
            // parent.insertBefore(chipContainer, tagInput);
        }
    }
} 

// removes the chip
function removeChip(event){

    if(event){
        var dltDiv = event.target.closest('div.tag-chip-container'); 
        if(dltDiv.parentElement.className == 'old-Tags'){
            dltDiv.style.display = 'none';
        }else{
            dltDiv.parentElement.removeChild(dltDiv);
        }  
    }

    // var tagsInner = document.querySelector('.old-Tags');
    // var dltDiv = event.target.closest('div.tag-chip-container');

    // deleteTag(dltDiv.dataset.tagid);

    // tagsInner.removeChild(dltDiv);
}

//
function validateTagAndCreate(){
    var tagName = getById('tag-input');
    if(tagName.value){
        var XHTTP = new XMLHttpRequest();

        XHTTP.onreadystatechange = function(){
            if( this.readyState == 4 && this.status == 200){
                var tags = JSON.parse(this.response);
    
                // Filtering the returned data
                tags = tags.filter( function(tag) {
                    return tag.tagName.toLowerCase() == tagName.value.toLowerCase();
                });
    
                if(tags.length > 0) 
                {
                    showToaster('tag already exists', 'info');
                    tagName.value = '';
                }
                else createTags(tagName.value)
            }
    
            if( this.status == 404){
                showToaster('error occured while validating the tag', 'error');
            }
        }
    
        XHTTP.open('GET', 'http://localhost:3000/tags?tagName_like=' + tagName.value);
        XHTTP.setRequestHeader('Content-Type', 'application/json');
        XHTTP.send(); 
    }  
}

// creates new tags
function createTags(tagName = undefined){
    // var tagElems = document.querySelectorAll('div.chip-text');
    // var tags = [];
    // for(var i = 0; i < tagElems.length; i++){
    //     tags.push({tagName: tagElems[i].innerText, createdDate : new Date()});
    // }

    // checking the length of the tags

    if(tagName){
        var XHTTP = new XMLHttpRequest();

        XHTTP.onreadystatechange = function(){
            if( this.readyState == 4 && this.status == 201){
                console.log(this.response);
                article = JSON.parse(this.response);
                // redirectToViewArticle(article.id);
                // alert("updated successfully");
                showToaster('Tags added successfully', 'info');
                getById('tag-input').value = '';
                getTags();
            }

            if( this.status == 404){
                showToaster('error occured while adding Tags', 'error');
            }
        }
    
        XHTTP.open('POST', 'http://localhost:3000/tags', true);
        XHTTP.setRequestHeader('Content-Type', 'application/json');
        XHTTP.send(JSON.stringify({tagName: tagName, createdDate : new Date()}));
    }
}

// gets the tags
function getTags(){
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            var tags = JSON.parse(this.response);
            document.querySelector('.old-Tags').innerHTML = '';
            if(tags.length){
                tags.forEach( function(val) {
                    var chipContainer = document.createElement('div');
                    chipContainer.setAttribute('class', 'tag-chip-container');
                    chipContainer.dataset.tagid = val.id;
                    
                    var text = document.createElement('div');
                    text.setAttribute('class', 'chip-text');
                    text.innerText = val.tagName;

                    var dlt = document.createElement('div');
                    dlt.setAttribute('class', 'inline');
            
                    var dltI = document.createElement('i');
                    dltI.setAttribute('class', 'far fa-times-circle deleteIcon');
                    dlt.addEventListener('click', removeChip);

            
                    dlt.appendChild(dltI);
                    chipContainer.appendChild(text);
                    chipContainer.appendChild(dlt);
                    // tagInput.append(chipContainer);
            
                    var parent = document.querySelector('.old-Tags');
                    
                    parent.append(chipContainer);
                });
            }
        }

        if( this.status == 404){
            // showToaster('error occured while getting Tags', 'error');
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/tags', true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send();
}

// delet's the tag 
function deleteTag(tagID){
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            showToaster('deleted tag successfully', 'info');
            getTags();
        }

        if(this.status == 404){
            showToaster('unable to delete the tag', 'error');
        }
    }

    XHTTP.open('DELETE', 'http://localhost:3000/Tags/' + tagID, true);
    XHTTP.send(); 
}

// load lags for creating article
function loadTags(isFromArticles = false){
    if(!isFromArticles){
        CKEDITOR.replace( 'content');
    }
    // CKEDITOR.instances.content.setData('some temp data');
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            var tags = JSON.parse(this.response);
            if(tags.length && getById('tagInput')){
                autocomplete(getById('tagInput'), tags);
            }
        }

        if( this.status == 404){
            // showToaster('error occured while getting Tags', 'error');
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/tags', true);
    XHTTP.setRequestHeader('Content-Type', 'application/json');
    XHTTP.send();   
}

// auto complete tags
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var listItem, listContainer, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        listContainer = document.createElement("DIV");
        listContainer.setAttribute("id", this.id + "autocomplete-list");
        listContainer.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(listContainer);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].tagName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            listItem = document.createElement("DIV");
            listItem.dataset.tagid = arr[i].id;
            /*make the matching letters bold:*/
            listItem.innerHTML = "<strong>" + arr[i].tagName.substr(0, val.length) + "</strong>";
            listItem.innerHTML += arr[i].tagName.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            listItem.innerHTML += "<input type='hidden' value='" + arr[i].tagName + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            listItem.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            listContainer.appendChild(listItem);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var list = document.getElementById(this.id + "autocomplete-list");
        if (list) list = list.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(list);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(list);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (list) list[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });


    if(getById('btnTagSubmit')){
        getById('btnTagSubmit').addEventListener('click', function(e){
            var tagName = inp.value;
            if(tagName){
                var isValidTag = arr.filter( function(val) {
                    return val.tagName == tagName;
                });
    
                var tagElems = document.querySelectorAll('div.chip-text');
                for(var i = 0; i < tagElems.length; i++){
                    if(isValidTag[0].tagName == tagElems[i].innerText){
                        if( tagElems[i].closest('div.tag-chip-container' )){
                            tagElems[i].closest('div.tag-chip-container').style.display = 'inline-block';
                        }
                        inp.value = "";
                        return;
                    }
                    // tags.push({tagName: tagElems[i].innerText, createdDate : new Date()});
                }
                if(isValidTag.length){
                    var chipContainer = document.createElement('div');
                    chipContainer.setAttribute('class', 'tag-chip-container');
                    chipContainer.dataset.tagid = isValidTag[0].id;
                    
                    var text = document.createElement('div');
                    text.setAttribute('class', 'chip-text');
                    text.innerText = isValidTag[0].tagName;
    
                    var dlt = document.createElement('div');
                    dlt.setAttribute('class', 'inline');
            
                    var dltI = document.createElement('i');
                    dltI.setAttribute('class', 'far fa-times-circle deleteIcon');
                    dlt.addEventListener('click', removeChipCreateArticle);
    
            
                    dlt.appendChild(dltI);
                    chipContainer.appendChild(text);
                    chipContainer.appendChild(dlt);
                    // tagInput.append(chipContainer);
            
                   

                    if(getById('tempSpan')){
                        var parent = getById('tempSpan');
                        
                    }else{
                        var parent = document.querySelector('.old-Tags');
                    }
                    
                    parent.append(chipContainer);
                    inp.value = "";
                }
            }
        });
    }

}

// removes the chip from create article
function removeChipCreateArticle(event){
    // if(event){
    //     var dltDiv = event.target.closest('div.tag-chip-container'); 
    //     dltDiv.parentElement.removeChild(dltDiv);
    // }

    if(event){
        var dltDiv = event.target.closest('div.tag-chip-container'); 
        if(dltDiv.parentElement.className == 'old-Tags'){
            dltDiv.style.display = 'none';
        }else{
            dltDiv.parentElement.removeChild(dltDiv);
        }  
    }

    // var tagsInner = document.querySelector('.old-Tags');
    

    // // deleteTag(dltDiv.dataset.tagid);

    // tagsInner.removeChild(dltDiv);
}   

function ck4(){
    var data = CKEDITOR.instances.content.getData();
}

