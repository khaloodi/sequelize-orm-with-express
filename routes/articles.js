const express = require('express');
const router = express.Router();
const Article = require('../models').Article; // include the article model, require the index file of the routers folder with const (don't have to specify index.js)

// using .Article we are accessing the articles model specifically,
// and all associated ORM methods such as find all, create, update, destroy

// We can access each model that we define via a property that gets imported from the code in the models index.js file
//

/* Handler function to wrap each route. In other words, we are abstracting away the try catch for all of our calls by creating an asyncHandler function and using or implimenting it in all of our calls.*/
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // res.status(500).send(error) // this line/catch statement will send a 500 error or internal server error to the user if an exception is thrown in the try block, or in any of the handler functions           
            next(error); // Forward error to the global error handler
        }
    }
}

/*
The articles.js file contains several routes to handle HTTP requests, like POST and GET.

The handler functions execute when a route matches the path defined.

Since sequelize is promise-based, most of the handlers are going to perform asynchronous actions to make calls to the database and execute all the CRUD operations.

NOTE: WE ARE STILL USING THE async/await syntax though for all asynchronous calls made w/sequelize

And we want to use a try/catch statement in each handler to run the code that needs to be executed and catch any exceptions that are thrown. 
*/

/* GET articles listing. */
router.get('/', asyncHandler(async(req, res) => {
    const articles = await Article.findAll({
        order: [
            ["createdAt", "DESC"]
        ]
    }); // display articles in descending order
    res.render("articles/index", { articles, title: "Sequelize-It!" });
}));

/* Create a new article form. */
router.get('/new', (req, res) => {
    res.render("articles/new", { article: {}, title: "New Article" });
});

/* POST create article. */
router.post('/', asyncHandler(async(req, res) => {
    const article = await Article.create(req.body) // when DB builds and saves new article record, app should redirect to the newly created article
        // console.log(req.body)
    res.redirect("/articles/" + article.id);
}));

/* Edit article form. */
router.get("/:id/edit", asyncHandler(async(req, res) => {
    res.render("articles/edit", { article: {}, title: "Edit Article" });
}));

/* GET individual article. */
router.get("/:id", asyncHandler(async(req, res) => {
    const article = await Article.findByPk(req.params.id);
    res.render("articles/show", { article, title: article.title });
}));

/* Update an article. */
router.post('/:id/edit', asyncHandler(async(req, res) => {
    res.redirect("/articles/");
}));

/* Delete article form. */
router.get("/:id/delete", asyncHandler(async(req, res) => {
    res.render("articles/delete", { article: {}, title: "Delete Article" });
}));

/* Delete individual article. */
router.post('/:id/delete', asyncHandler(async(req, res) => {
    res.redirect("/articles");
}));

module.exports = router;