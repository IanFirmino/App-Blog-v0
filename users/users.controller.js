const express = require('express');
const router = express.Router();
const User = require('./users.model');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then((users) => {
        res.render("../views/admin/users/index.ejs", {Users: users});
    });
});

router.get("/admin/users/new", adminAuth, (req, res) => {
    res.render("../views/admin/users/create.ejs");
});

router.post("/users/create", adminAuth, async (req, res) => {
    
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);

    const user = await User.findOne({
        where: {email: email}
    });

    if (user){
        console.log("Usuario ja cadastrado")
        res.redirect("/admin/users/create");
    }else {
        User.create(
            {
                name: name,
                email: email,
                password: hashPassword
            }).then(() => {
                res.redirect("/admin/users");
            }).catch((err) => {
                console.log(err);
                res.redirect("/admin/users");
            });
    }

});

router.get("/login", (req, res) =>{
    res.render("../views/admin/users/login.ejs")
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

router.post("/authenticate", async (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    const user = await User.findOne({where: {email: email}});

    if (user){

        var correct = await bcrypt.compareSync(password, user.password);
        if (correct) {
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }else{
            res.redirect("/login");
        }

        res.redirect("/admin/articles");

    }else{
        res.redirect("/login");
    }
});

router.post("/users/delete", (req, res) => {

    var userId = req.body.id;

    User.destroy({
        where: 
        {id: userId}
    }).then(() => {
        res.redirect("/admin/users");
    }).catch((err) => {
        console.log(err);
        res.redirect("/admin/users");
    });

});


module.exports = router;