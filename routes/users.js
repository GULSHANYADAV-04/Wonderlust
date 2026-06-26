const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsink.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewere.js");
const usercontroller = require("../controller/users.js");

router.route("/signup")
.get(usercontroller.rendersignupform)
.post( WrapAsync(usercontroller.signup));

router.route("/login")
.get(usercontroller.renderloginform )
.post( saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
   usercontroller.login
);

router.get("/logout", usercontroller.logout);

module.exports = router;