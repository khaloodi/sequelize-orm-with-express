const express = require('express');
const router = express.Router();
const Article = require('../models').Article;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

/* GET articles listing. */
router.get('/', asyncHandler(async(req, res) => {
    const articles = await Article.findAll({ order: [
            ["createdAt", "DESC"]
        ] }); // display articles in descending order
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