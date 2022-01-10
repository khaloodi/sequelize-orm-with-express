// define and initialize the Article model

'use strict';
const Sequelize = require('sequelize');
const moment = require('moment') // package/library we'll use to format and display the publish date for each article.


// Sequelize allows you to extend models with additional functionality.
// Since Sequelize modules are ES6 classes, can add custom instance methods to encapsulate the functionality.

/*
Objective: create a published at helper method which formats the publish or created at date and article by line and a short description method that generates a short description for an article when displayed in the main article listing view

NOTE: these methods will be available to all model instances created or invoked in the context of each model hence the name instance methods
*/

module.exports = (sequelize) => {
    class Article extends Sequelize.Model { // this is the articles class
        // create a method Inside the article class named publishedAt. In the method, declare a variable named date to store the formatted date. Then set it to the moment method.
        publishedAt() {
            const date = moment(this.createdAt).format('MMMM D, YYYY, h:mma') // format the created at timestamp of each model instance. Here I am formatting the timestamp using the moment libraries format method
                // this will display the publish date as month, day, year and time
            return date
                // to access the value returned by a model instances publishedAt method in the view by calling the method in the view (so inside of file, views, articles, by-line and replace article.createdAt with article.publishedAt)
        }
        shortDescription() {
            const shortDesc = this.body.length > 200 ? this.body.substring(0, 200) + '...' : this.body; // this line formats the description on the articles page to shorten the characters to first 200 characters + ... if the description is > 200, otherwise show the entire description
            return shortDesc
        }
    }
    Article.init({
        // title: Sequelize.STRING,
        //Change the value of the title model attribute to an object literal. Within the object, add the type attribute and a new validate property. Set validate to an object
        title: {
            type: Sequelize.STRING,
            // Add the notEmpty validator to prevent the title value from being set to an empty string. Then, set a custom error message when validation fails by setting notEmpty to an object containing a msg property set to your custom message:
            validate: {
                notEmpty: {
                    msg: '"Title" is required' // When title is invalid, the custom message "Title" is required will display to the user
                }
            }
        },
        author: Sequelize.STRING,
        body: Sequelize.TEXT
    }, { sequelize });

    return Article;
};