const express = require("express");
const userSchema = require("../models/users");
const postSchema = require("../models/posts");
const router = express.Router();
const passport = require("passport");


// check password and username during login process
const localStrategy = require("passport-local");
passport.use(new localStrategy(userSchema.authenticate()));
// Configure the local strategy with the email as the username field
// passport.use(new LocalStrategy({ usernameField: 'email' }, userModel.authenticate()));

router.get('/', (req, res) => {
    res.render("index");
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const userData = new userSchema({ username, email });

        await userSchema.register(userData, req.body.password).then(function () {
            passport.authenticate('local')(req, res, function () {
                res.render("login", { messages: req.flash('error') });
            })
        })
    } catch (error) {
        res.render('register', { error: req.flash('error') });
    }
});
router.get('/profile', isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    const user = await userSchema.findById(userId).populate('posts');
    res.render('profile', { user });
});

router.get('/login', (req, res) => {
    res.render('login', { messages: req.flash('error') });
});

router.get('/posts', isLoggedIn, async (req, res) => {
    try {
        const posts = await postSchema.find();
        res.render('posts', { posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.get('/createpost', isLoggedIn, (req, res) => {
    res.render('createpost');
})
router.post('/createpost', isLoggedIn, async (req, res) => {
    const { vechileName, description, ownerName, ownerAddress, contact, postUrl } = req.body;
    const user = await userSchema.findOne({ username: req.session.passport.user });

    const postData = await postSchema.create({
        vechileName, description, ownerName, ownerAddress, contact, postUrl,
    })
    await user.posts.push(postData._id);
    user.save();
    res.redirect("/profile");
})
router.get('/deletePost/:postId', async (req, res) => {
    const postId = req.params.postId;

    // Use your ORM or database library to delete the post
    await postSchema.findByIdAndDelete(postId);

    // Redirect to the main page or wherever you want after deletion
    res.redirect('/profile');
})
router.post('/login', passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('login');
}
module.exports = router;