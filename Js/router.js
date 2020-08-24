'use strict';

function Router(routes) {
    try {
        if (!routes) {
            throw 'error: routes param is mandatory';
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);   
    }
}

Router.prototype = {
    routes: undefined,
    rootElem: undefined,
    // Constructor to assign the routes and rootElem values
    constructor: function (routes) {
        this.routes = routes;
        this.rootElem = document.getElementById('app');
    },

    // adding hashchange event listner to window
    init: function () {
        var r = this.routes;
        (function(scope, r) { 
            window.addEventListener('hashchange', function (e) {
                scope.hasChanged(scope, r);
            });
        })(this, r);
        // calling hash changed method on initial load
        this.hasChanged(this, r);
    },

    // executes on hashchange
    hasChanged: function(scope, r){
        // check URL has hash or not
        if (window.location.hash.length > 0) {
            for (var i = 0, length = r.length; i < length; i++) {
                var route = r[i];
                
                // check route is available or not 
                if(route.isActiveRoute(window.location.hash.substr(1))) {
                    scope.goToRoute(route.htmlName);
                }
            }
        } else {
            for (var i = 0, length = r.length; i < length; i++) {
                var route = r[i];
                if(route.default) {
                    scope.goToRoute(route.htmlName);
                    getAllArticles();
                }
            }
        }
    },
    goToRoute: function (htmlName) {
        (function(scope) { 
            var url = 'http://127.0.0.1:8887/views/' + htmlName,
                xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElem.innerHTML = this.responseText;

                    if(window.location.hash.includes('articles')){
                        // call get all articles function if the route is articles
                        getAllArticles();
                        
                    }
        
                    if(window.location.hash.includes('viewArticle')){
                        // call loadViewArticle() if the route is viewArticle
                        loadViewArticle();
                    }
        
                    if(window.location.hash.includes('myArticles')){
                        // call getAllArticles function if the route is myArticles
                        getAllArticles(localStorage.getItem('userID'));
                    }
        
                    if(window.location.hash.includes('users')){
                        // call getAllUsers function if the route is users
                        getAllUsers();
                    }

                    if(window.location.hash.includes('profile')){
                        // call getAllUsers function if the route is users
                        getUserDetails(getItem('userID'));
                    }

                    if(window.location.hash.includes('tags')){
                        // call getTags function if the route is tags
                        getTags();
                    }

                    if(window.location.hash.includes('createArticle')){
                        // call getTags function if the route is tags
                        loadTags();
                    }
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
};