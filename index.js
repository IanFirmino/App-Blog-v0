const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');

const categoriesController = require("./categories/categories.controller");
const articlesController = require("./articles/articles.controller");
const usersController = require("./users/users.controller");

const Article = require('./articles/articles.model');

app.set('view engine', 'ejs');

app.use(session({
    secret: "secret3773",
    cookie: {
        maxAge: 30000000
    }
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection.authenticate().then(() => {
    console.log("Conexão DB realizada!");
}).catch((err) => {
    console.log(err);
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
    res.redirect("/home/1");
})

app.get("/home/:num", (req, res) => {

    const limit = 4;
    var page = req.params.num;
    var pageNum = page == 0 || 1 ? page * 4 - 3 : 1;
    var next;
    var previous;

    Article.findAndCountAll({
        limit: limit,
        offset: pageNum,
        order: [['id', 'desc']]
    }
    ).then((articles) => {
        
        next = articles.rows.length >= limit ? true : false;
        previous = page > 1 ? true : false;

        res.render("index",{
            articles: articles,
            next: next,
            previous: previous,
            page: parseInt(page) 
        });

    });


});

app.get("/article/:slug", (req, res) => {

    var slug = req.params.slug;

    Article.findOne({
        where: {slug: slug}
    }).then((article) => {
        res.render("article", {
            article: article
        })
    }).catch(() => {
        res.redirect("/");
    });

});

app.listen(8080, () => {
    console.log("Servidor rodando");
}); 

