const express = require('express');
const slugify = require('slugify');
const router = express.Router();
const Article = require('./articles.model');
const Category = require('../categories/categories.model');
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) => {

    Article.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render("../views/admin/articles/index.ejs",{
            Articles: articles
        });
    });

});

router.get("/admin/articles/new", adminAuth, (req, res) => {

    Category.findAll().then((categories) => {
        res.render("../views/admin/articles/new.ejs", {
            categories: categories 
        });
    });

});

router.post("/articles/save", adminAuth, (req, res) => {
    var tittle = req.body.tittle;
    var body = req.body.body;
    var categoryId = req.body.category;

    Article.create({
        tittle: tittle,
        body: body,
        slug: slugify(tittle),
        categoryId: categoryId
    }).then(() => {
        res.redirect("/admin/articles");
    });

});

router.post("/articles/delete", adminAuth, (req, res) => {
    var id= req.body.id;

    if(id == undefined || isNaN(id)){
        res.redirect("/admin/articles");
    }

    Article.destroy({
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/articles"); 
    }).catch((err) => {
        console.log(err);
        res.redirect("/admin/articles");
    });

});


router.get("/articles/edit/:id", adminAuth, (req, res) => {

    var id = req.params.id;

    Article.findByPk(id, {
        include: [{model: Category}]
    }).then((article) => {
        
        Category.findAll().then((categories) => {
            res.render("../views/admin/articles/edit.ejs", {
                article: article,
                categories: categories
            });
        });

    }).catch((err) => {
        console.log(err);
        res.redirect("/admin/articles");
    });

});


router.post("/articles/update", adminAuth, (req, res) => {

    var id = req.body.id;
    var tittle = req.body.tittle;
    var categoryId = req.body.category;
    var body = req.body.body;

    Article.update({
        tittle: tittle,
        categoryId: categoryId,
        body: body,
        slug: slugify(tittle)},
        {
            where: {id: id}
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch((err) =>{
            console.log(err);
            res.redirect("/admin/articles");
        });

});

router.get("/articles/page/:num", (req, res) => {

    const limit = 4;
    var page = req.params.num;
    var pageNum = page == 0 || 1 ? page * 4 - 3 : 1;
    var next;
    var previous;

    Article.findAndCountAll({
        limit: limit,
        offset: pageNum
    }
    ).then((articles) => {
        
        next = articles.rows.length >= limit ? true : false;
        previous = page > 1 ? true : false;

        res.render("../views/admin/articles/page.ejs",{
            articles: articles,
            next: next,
            previous: previous,
            page: parseInt(page) 
        });

    });

});

module.exports = router;


