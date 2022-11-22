// const express = require("express")
// const app = express()
// const mongoose = require("mongoose")

// mongoose.connect("mongodb+srv://athefe:athefe@cluster0.ksqeutc.mongodb.net/?retryWrites=true&w=majority")
// const db = mongoose.connection
// db.on("error", (error) => console.log(error))
// db.once("open",()=>console.log("connected to database"))

// app.listen(5000, () => {
//     console.log("server started")
// })

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const { json } = require("body-parser");
const { connect } = require("mongoose");
const methodOverride = require('method-override')
const authSchema = require("./schemas/authschema");
app.use(json());

const initializepassport = require("./passport-config");
initializepassport(
  passport,
  (email) => user.find((user) => user.email === email),
  (id) => user.find((user) => user.id === id)
);
const user = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

connect(process.env.url)
  .then(() => {
    console.log("connected to the db");
  })
  .catch(() => {
    console.log("didn't connect to the db");
  });

app.get("/login",  checkNotAuthenticated,(req, res) => {
  res.render("login.ejs");
});
app.post(
  "/login", checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const hashedPassword = await bcrypt.compare(password, user.password);
    user.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(4005, () => {
  console.log("server started");
});
