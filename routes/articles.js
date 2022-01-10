const express = require('express');
const router = express.Router();
const Article = require('../models').Article; // include the article model, require the index file of the routers folder with const (don't have to specify index.js)

// using .Article we are accessing the articles model specifically,
// and all associated ORM methods such as find all, create, update, destroy

// We can access each model that we define via a property that gets imported from the code in the models index.js file
//

/* Handler function to wrap each route. In other words, we are abstracting away the try catch for all of our calls by creating an asyncHandler function and using or implimenting it in all of our calls.*/
function asyncHandler(cb) { // catches an error (or a rejected promise) that occurs in a route and forwards the error to the global error handler (in app.js) with the next() method
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // res.status(500).send(error) // this line/catch statement will send a 500 error or internal server error to the user if an exception is thrown in the try block, or in any of the handler functions           
            // With only next(error) inside of the catch block, if you visit an article that does not exist in the database (/articles/101, for example), or run findByPk() with an invalid ID, the response returns errors and a 500 status code. The server cannot process the request because the entry is not found.
            next(error); // Forward error to the global error handler, I believe this operates the same as res.status(500).send(error)

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
    // Within the handler, we use Sequelize's findAll method to retrieve a collection of articles instead of a single article 
    const articles = await Article.findAll({
        // the findAll method takes an options object,  within that object, you can specify any number of criteria to filter the returned results, including their order
        order: [
            ["createdAt", "DESC"] // display articles in descending order in localhost:3000/articles, first item in array is the "attribute" we want to "order by"
            // NOTE: SEQUELIZE already includes the attributes created at and updated at to the "model" aka table
        ]
    });
    // res.render("articles/index", { article: {}, title: "Sequelize-It!" });
    res.render("articles/index", { articles, title: "Sequelize-It!" });
}));

/* Create a new article form. */
router.get('/new', (req, res) => {
    res.render("articles/new", { article: {}, title: "New Article" });
});

/*
Handle and Display Validation Errors
Creating or updating an Article model instance without a title passes an error into the asyncHandler function's catch block. The server, however, should not respond with a 500 status in this case, because that would mean there is a server error. Instead, the route will re-render the "New Article" and "Edit Article" views to display the validation error message.

When validation fails, Sequelize throws a SequelizeValidationError with the validator message. Before any errors in the create and update article post routes are caught by asyncHandler's catch block, first check if it's a SequelizeValidationError.
*/

/* POST create article. */
router.post('/', asyncHandler(async(req, res) => {
    //const article = await Article.create(req.body)
    // when DB builds and saves new article record, app should redirect to the newly created article
    // console.log(req.body)
    // the sequelize create method builds a new model instance, which represents a database row & automatically stores its data in the db, Create is an asynchronous call that returns a promise
    // Create requires an object with properties that map to the model attributes, or the ones defined here in Article.init
    // The request body property returns an object containing the key value pairs of data submitted in the request body, in other words, the form data.
    let article;
    try {
        article = await Article.create(req.body);
        res.redirect("/articles/" + article.id);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') { // checking the error
            article = await Article.build(req.body)
            res.render("articles/new", { article, errors: error.errors, title: "New Article" })
                /**
                 * The Article.build() method used above will return an non-persistent (or unsaved) model instance. The built instance holds the properties / values of the Article being created via req.body. It will get stored in the database by the create() method once the user submits the form with a valid title.

                The errors property also gets passed into the view. The value is an errors array which Pug iterates over and renders. Open the file views/articles/errors.pug to review the template that renders validation errors.
                 */
        } else {
            throw error; // error caught in the asyncHandler's catch block
        }
    }

    // res.redirect("/articles/" + article.id);
    // When the database builds and saves the new article record, the app should redirect to the newly created article.
    // Sequelize generates an auto-incrementing ID for each model instance or entry created. So in the res.redirect method, I'll add the article id to the URL path by concatenating article.id to the articles path.
}));

/* Edit article form. */
router.get("/:id/edit", asyncHandler(async(req, res) => {
    const article = await Article.findByPk(req.params.id);
    if (article) {
        res.render("articles/edit", { article, title: "Edit Article" });
    } else {
        res.sendStatus(404);
    }
    // res.render("articles/edit", { article, title: "Edit Article" });
    // line above was before I added error checking with the if block
}));

/* GET individual article. */
router.get("/:id", asyncHandler(async(req, res) => { // This route renders the articles show view and displays an article based on the id parameter in the URL path
    const article = await Article.findByPk(req.params.id); // FindByPk is an asynchronous call that returns a promise whose resolved value is the single instance retrieved by the primary key or id value
    // In Express Routes, you use route parameters to capture values specified in the URL path, req.params returns parameters in the matched route
    // In this case, we need the id value specified in the path. So pass the findByPk method, req.params.id.
    // res.render("articles/show", { article: {}, title: "Article Title" });
    // res.render("articles/show", { article: article, title: article.title });
    // res.render("articles/show", { article, title: article.title });
    // above, in res.render, we'll render the article returned by findByPk within the article show view by replacing the empty object with the article variable Which is the single instance returned by findByPk, holding all the data of the article entry, like title, author, and body
    // NOTE: that data is made available to the view via local variables like article.title and article.body for instance. And since both the article key and value here are the same, you can use the object shorthand syntax by including just article.
    // Check this route w/localhost:3000/articles/1 or the articles primary key

    // Handling ERRORS:
    //instead send a 404 status code (or a Not Found error) to the client to let users know that the server is unable to locate the requested article
    if (article) {
        res.render("articles/show", { article, title: article.title });
    } else {
        res.sendStatus(404);
    }
}));

/* Update an article. */
router.post('/:id/edit', asyncHandler(async(req, res) => {
    const article = await Article.findByPk(req.params.id);
    // The update method is also asynchronous and returns a promise:
    if (article) {
        await article.update(req.body) // So in the async handler we'll await its fulfilled promise, the updated article instance with await article.update
            // The update method accepts an object with the key and values to update. So I'll pass it the request body or the updated form data with req.body.
            // res.redirect("/articles/"); I' changed this line when I added the update method
        res.redirect("/articles/" + article.id); // Once the update happens, the app will redirect to the individual article page via article.id.
    } else {
        res.sendStatus(404);
    }
}));

/* Delete article form. */
router.get("/:id/delete", asyncHandler(async(req, res) => {
    const article = await Article.findByPk(req.params.id);
    if (article) {
        res.render("articles/delete", { article, title: "Delete Article" });
    } else {
        res.sendStatus(404);
    }
    // res.render("articles/delete", { article: {}, title: "Delete Article" });
    // res.render("articles/delete", { article, title: "Delete Article" });
}));

/* Delete individual article. */
router.post('/:id/delete', asyncHandler(async(req, res) => {
    const article = await Article.findByPk(req.params.id);
    if (article) {
        await article.destroy(); // Once the article is found I can destroy it. The destroy method is also an asynchronous call returning a promise. So the handler will await.article.destroy. 
        // Once the promise is fulfilled or the entry is deleted from the database, the router will redirect to the articles path.
        res.redirect("/articles");
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;