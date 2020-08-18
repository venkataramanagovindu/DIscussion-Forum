'use strict';

(function () {
    function init() {
        // creating the routes 
        var router = new Router([
            new Route('articles', 'articles.html', true),
            new Route('login', 'Login.html'),
            new Route('viewArticle', 'viewArticle.html'),
            new Route('createArticle', 'createArticle.html'),
            new Route('createUser', 'createUser.html'),
            new Route('myArticles', 'myArticles.html'),
            new Route('profile', 'profile.html'),
            new Route('tags', 'tags.html')
        ]);
    }
    init();
}());