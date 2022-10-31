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

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const user = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({extended:false}))

app.get("/", (req, res) => {
  res.render("index.ejs", { name: "aatif" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {athefe
  try { 
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password:hashedPassword
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(user);
});
app.listen(4002, () => {
  console.log("server started");
});
