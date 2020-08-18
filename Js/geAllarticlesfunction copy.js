// function to get all articles
function getAllArticles(userID = undefined){
    var XHTTP = new XMLHttpRequest();
    
    XHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var isAdmin = isAdminFn();

            var articles = JSON.parse(this.response);

            var articlesTable = document.getElementById('articles-table');
            if (articles.length >= 1) {
                if(isAdmin && !userID && getById('btnAdminDelete')){
                    getById('btnAdminDelete').style.display = 'table-cell'
                }
                for(var i = 0; i < articles.length; i++){
                    var tr = document.createElement('tr');
                    article = articles[i];

                    tr.setAttribute('onclick', 'redirectToViewArticle(Number(this.firstElementChild.innerText))');
                    tr.style.cursor = "pointer";

                    for(var key in article){
                        if(key != 'createdUserID' && key != 'turnOffComments'){
                            var td = document.createElement('td');
                            td.innerText = article[key];
                            td.setAttribute('class', 'truncate');
                            if(key == 'id'){
                                tr.prepend(td)
                            }else{
                                tr.append(td);
                            }
                        }
                    }
                    if(userID || isAdmin){
                        var td = document.createElement('td');
                        var divInTd = document.createElement('div');
                        divInTd.style.display = 'flex';
                        divInTd.style.justifyContent = 'space-evenly';
                        var deleteDiv = document.createElement('div');
                        // deleteDiv.style.display = 'inline-block';
                        deleteDiv.addEventListener('click', function(){
                            // debugger;
                            showModal('Are you sure want to delete', undefined, deleteArticle, event.target.closest('tr').firstElementChild.innerText);
                        });
                        var delI = document.createElement('i');
                        delI.setAttribute('class', 'fas fa-trash-alt');
                        delI.setAttribute('id', 'deleteIcon');
                        deleteDiv.append(delI);
                        var editDiv = document.createElement('div');
                        editDiv.setAttribute('onclick', 'redirectToViewArticle(Number(parentElement.parentElement.parentElement.firstElementChild.innerText), true)');
                        // editDiv.style.display = 'inline-block';
                        var editI = document.createElement('i');                        
                        editI.setAttribute('class', 'far fa-edit');
                        editDiv.append(editI);
                        divInTd.append(editDiv);
                        divInTd.append(deleteDiv);
                        // td.innerText = 'delete';
                        td.append(divInTd);
                        td.setAttribute('class', 'truncate');

                        divInTd.addEventListener('click', function(){
                                event.stopPropagation();
                            });

                        // td.addEventListener('click', function(){
                        //     event.stopPropagation();
                        // });
                        
                        tr.append(td);
                    }
                    articlesTable.tBodies[0].append(tr);
                }
            }else{

                // <a href=\"#createArticle\">articles.</a>
                articlesTable.outerHTML = "Please add articles."
            }
        }

        if(this.status == 404){
            var articlesDiv = document.getElementsByClassName('articles-div')[0];
            articlesDiv.innerText = 'Articles not found '
        }
            // throw new Error(' replied 404');
    }

    if(userID == undefined){
        XHTTP.open('GET', 'http://localhost:3000/Articles');
    }else{
        XHTTP.open('GET', 'http://localhost:3000/Articles?createdUserID=' + userID);
    }
    
    XHTTP.send();
}

function getAllArticles_2(userID = undefined, searchInput = undefined, pageNumber = 1){
    var perPage = 6;
    var XHTTP = new XMLHttpRequest();
    
    XHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            // Get the raw header string
            var headers = XHTTP.getAllResponseHeaders();

            // Convert the header string into an array
            // of individual headers

            if(pageNumber == 1){
                getById('previous').disabled = true;
                currrntPage = pagination();

                var arr = headers.trim().split(/[\r\n]+/);

                // console.log(arr);
    
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
                }

                // var lastPage =  headerMap["link"];
    
                // var start = lastPage.lastIndexOf('_page=') + 6;
                // var end = lastPage.lastIndexOf('&_limit');



                // lastPageNumber = Number(lastPage.substring(start, end));
                // lastPageClosure(lastPageNumber);
            } 

            var isAdmin = isAdminFn();

            var articles = JSON.parse(this.response);

            var articlesTable = document.getElementById('articles-table');
            if (articles.length >= 1) {
                articlesTable.tBodies[0].innerHTML = "";

                if(isAdmin && !userID && getById('btnAdminDelete')){
                    getById('btnAdminDelete').style.display = 'table-cell'
                }
                for(var i = 0; i < articles.length; i++){
                    var tr = document.createElement('tr');
                    article = articles[i];

                    tr.setAttribute('data-articleId', article['id']);

                    tr.setAttribute('onclick', 'redirectToViewArticle(Number(this.dataset.articleid))');
                    tr.style.cursor = "pointer";

                    // for(var key in article){
                        // if(key != 'createdUserID' && key != 'turnOffComments'){
                        //     var td = document.createElement('td');
                        //     td.innerText = article[key];
                        //     td.setAttribute('class', 'truncate');
                        //     if(key == 'id'){
                        //         tr.prepend(td)
                        //     }else{
                        //         tr.append(td);
                        //     }
                        // }

                        var td = document.createElement('td');                        
                        var titleElem = document.createElement('b');
                        titleElem.innerText = article['title']
                        var contentElem = document.createElement('p');
                        contentElem.setAttribute('class','contentOverFlow');
                        contentElem.innerText = article['content'];
                        td.setAttribute('class', 'truncate');
                        td.append(titleElem);
                        td.append(contentElem);
                        tr.append(td);

                        // if(key != 'createdUserID' && key != 'turnOffComments'){
                        //     var td = document.createElement('td');
                        //     td.innerText = article[key];
                        //     td.setAttribute('class', 'truncate');
                        //     if(key == 'id'){
                        //         tr.prepend(td)
                        //     }else{
                        //         tr.append(td);
                        //     }
                        // }
                    // }
                    if(userID || isAdmin){
                        var td = document.createElement('td');
                        var divInTd = document.createElement('div');
                        divInTd.style.display = 'flex';
                        divInTd.style.justifyContent = 'space-evenly';
                        var deleteDiv = document.createElement('div');
                        // deleteDiv.style.display = 'inline-block';
                        deleteDiv.addEventListener('click', function(){
                            // debugger;
                            showModal('Are you sure want to delete', undefined, deleteArticle, event.target.closest('tr').dataset.articleid);
                        });
                        var delI = document.createElement('i');
                        delI.setAttribute('class', 'fas fa-trash-alt');
                        delI.setAttribute('id', 'deleteIcon');
                        deleteDiv.append(delI);
                        var editDiv = document.createElement('div');
                        editDiv.setAttribute('onclick', 'redirectToViewArticle(Number(event.target.closest(\'tr\').dataset.articleid), true)');
                        // editDiv.style.display = 'inline-block';
                        var editI = document.createElement('i');                        
                        editI.setAttribute('class', 'far fa-edit');
                        editDiv.append(editI);
                        divInTd.append(editDiv);
                        divInTd.append(deleteDiv);
                        // td.innerText = 'delete';
                        td.append(divInTd);
                        td.setAttribute('class', 'truncate');

                        divInTd.addEventListener('click', function(){
                                event.stopPropagation();
                            });

                        // td.addEventListener('click', function(){
                        //     event.stopPropagation();
                        // });
                        
                        tr.append(td);
                    }
                    articlesTable.tBodies[0].append(tr);
                }
            }else{

                // <a href=\"#createArticle\">articles.</a>
                articlesTable.outerHTML = "Articles not found :("
            }
        }

        if(this.status == 404){
            var articlesDiv = document.getElementsByClassName('articles-div')[0];
            articlesDiv.innerText = 'Articles not found '
        }
            // throw new Error(' replied 404');
    }
    
    if(userID && searchInput){
        XHTTP.open('GET', 'http://localhost:3000/articles?q=' + searchInput + '&createdUserID=' + userID + '&_page=' + pageNumber +'&_limit=' + perPage);
    }else if(userID){
        XHTTP.open('GET', 'http://localhost:3000/Articles?createdUserID=' + userID + '&_page=' + pageNumber + '&_limit=' + perPage);
    }else if(searchInput){
        XHTTP.open('GET', 'http://localhost:3000/Articles?q=' + searchInput + '&_page=' + pageNumber + '&_limit=' + perPage);
    }else{
        XHTTP.open('GET', 'http://localhost:3000/Articles?_page=' + pageNumber + '&_limit=' + perPage);   
    }
    
    XHTTP.send();
}