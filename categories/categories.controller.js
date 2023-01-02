const express = require('express');
const router = express.Router();
const Category = require('./categories.model');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render('../views/admin/categories/new.ejs')
});

router.post("/categories/save", adminAuth, (req, res) => {
    var tittle = req.body.tittle;

    if(tittle == undefined){
        res.redirect("/admin/categories/new");
    }

    try{
        Category.create({
            tittle: tittle,
            slug: slugify(tittle)
        });

        res.redirect("/admin/categories");
    }catch(err){
        console.log(err);
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then((Categories) => {
        res.render('../views/admin/categories/index.ejs', {
            Categories: Categories
        });
    });
});

router.post("/categories/delete", adminAuth, (req, res) => {
    var id= req.body.id;

    if(id == undefined || isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.destroy({
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories"); 
    });

});

router.get("/categories/edit/:id", adminAuth, (req, res) => {

    var id = req.params.id;

    if (isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then((category) => {
        res.render("../views/admin/categories/edit.ejs", {
            category: category
        });
    }).catch((err) => {
        console.log(err);
        res.redirect("/admin/categories");
    });
});

router.post("/categories/update", adminAuth, (req, res) => {

    var id = req.body.id;
    var tittle = req.body.tittle;

    Category.update({
        tittle: tittle,
        slug: slugify(tittle)
    },{
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories");
    });

});

module.exports = router;

