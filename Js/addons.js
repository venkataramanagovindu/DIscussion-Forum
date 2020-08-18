// Search article in all articles
function searchArticle(){
    getById('next').disabled = false;
    var searchInputString = getById('IPsearchAticle').value;
        getAllArticles(undefined , searchInputString);
}

// search for article in myarticle page
function searchMyArticle(){
    getById('next').disabled = false;
    var searchInputString = getById('IPsearchMyAticle').value;
        getAllArticles(localStorage.getItem('userID') , searchInputString);
}

// closure to get or set current page value
function pagination(){
    currrntPageVal = 1;
    return function(val){
        if(val){
            currrntPageVal += Number(val);
        }
        return currrntPageVal;
    }
}

var currrntPage = pagination();

function previous(searchInput = undefined){
    if(currrntPage() == 1){
        getById('previous').disabled = true;
        return;
    }

    if(currrntPage() == 2){
        getById('previous').disabled = true;
    }
    
    if( currrntPage() <= lastPageClosure()){
        getById('next').disabled = false;
    }

    var isFromMyarticle = window.location.hash.toLocaleLowerCase().includes('myarticles');

    if(isFromMyarticle){
        getAllArticles(localStorage.getItem('userID'), searchInput, pageNumber = currrntPage(-1));
    }else{
        getAllArticles(undefined, searchInput, pageNumber = currrntPage(-1));
    }
}

// go to next set of articles
function next(searchInput = undefined){
    if(currrntPage() == lastPageClosure()){
        return;
    }

    if(currrntPage() == lastPageClosure() - 1){
        getById('next').disabled = true;
    }

    if(currrntPage() == 1){
        getById('previous').disabled = false;
    }

    var isFromMyarticle = window.location.hash.toLocaleLowerCase().includes('myarticles');

    if(isFromMyarticle){
        getAllArticles(localStorage.getItem('userID'), searchInput, pageNumber = currrntPage(+1));
    }else{
        getAllArticles(undefined, searchInput, pageNumber = currrntPage(+1));
    }
}

// handling the next button option with search in put
function nextWithSearch(){
    if( getById('IPsearchMyAticle').value != undefined ||
        getById('IPsearchMyAticle').value.trim() != '' ){
            
        next(getById('IPsearchMyAticle').value.trim());
    }else{
        next();
    }
}

// handling the previous button option with search in put
function previousWithSearch(){
    if( getById('IPsearchMyAticle').value != undefined ||
        getById('IPsearchMyAticle').value.trim() != '' ){
            
        previous(getById('IPsearchMyAticle').value.trim());
    }else{
        previous();
    }
}

