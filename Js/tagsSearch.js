// get tags for search
function getTagsForSearch(){
    var XHTTP = new XMLHttpRequest();

    XHTTP.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            var tags = JSON.parse(this.response);
            if(tags.length){
                tags.forEach( function(tag) {
                    var a = document.createElement('a');
                    a.dataset.tagid = tag.id;
                    a.innerText = tag.tagName;

                    getById('tagsSearchDiv').append(a);
                })
            }
        }

        if(this.status == 404){
            showToaster('Unable to dele article','error');
        }
    }

    XHTTP.open('GET', 'http://localhost:3000/tags');
    XHTTP.send();
}


function searchWithtagName(){
    var tagInput = getById('tagInput');
    if(tagInput){
        var XHTTP = new XMLHttpRequest();

        XHTTP.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var tag = JSON.parse(this.response);
                if(tag.length > 0) searchWithTagID(tag[0].id, tagInput);
                else showToaster('tag not found', 'info');
            }
        }   

        // get all articles
        XHTTP.open('GET', 'http://localhost:3000/tags?tagName=' + tagInput.value);   
        XHTTP.send();
    }
}


function searchWithTagID(tagId, tagName = undefined){
    
    if(tagId){
        var XHTTP = new XMLHttpRequest();

        XHTTP.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var allArticles = JSON.parse(this.response);
                if(allArticles.length){
                    var articles = allArticles.filter( function( article ) {
                        if(article.tags ? article.tags.length : false) return article.tags.includes('' + tagId)
                        return false;
                    });

                    var articlesTable = document.getElementById('articles-table');

                    getById('previous').disabled = true;
                    getById('next').disabled = true;

                    if (articles.length >= 1) {
                        
                        var isAdmin = isAdminFn();
                        var userID = false;
                        articlesTable.tBodies[0].innerHTML = "";

                        var tagInfo = getById('tagInfo');
                        if(tagName && tagInfo){
                            tagInfo.style.display = 'block';
                            tagInfo.innerHTML = 'showing articles with tag <strong style="color:green">' + tagName.value + '</strong> tag';
                        }
        
                        // iterating through the received data and creating the article's table
                        for(var i = 0; i < articles.length; i++){
        
                            if(getItem('userID') == articles[i].createdUserID){
                                userID = true;
                            }
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
                        articlesTable.tBodies[0].innerHTML = "";

                        

                        var tagInfo = getById('tagInfo');
                        if(tagName && tagInfo){
                            tagInfo.style.display = 'block';
                            tagInfo.innerHTML = 'no articles found with tag <strong style="color:red">' + tagName.value + '<strong>';
                        }
                    }
                }
            }
        }   

        // get all articles
        XHTTP.open('GET', 'http://localhost:3000/Articles');   
        XHTTP.send();
    }
}