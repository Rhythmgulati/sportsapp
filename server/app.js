const express = require('express');
require("../db/conn");
const user = require("../db/models/user");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser');
const { log } = require('handlebars');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname,"../public")
console.log(staticPath);

app.use(express.static(staticPath));

const templatepath = path.join(__dirname,"../templates/views");
app.set("view engine","hbs");
app.set("views",templatepath);


app.get("/",(req,res)=>{
   res.render("index")
})
app.post("/register",async (req,res)=>{
          try {
            const {username,age,sports,email,password,location} = req.body;
            console.log(req.body);
            const Hashedpassword = await bcrypt.hash(password,10);
            const newuser = new user({
                name:username,
                age,
                sports,
                email,
                password:Hashedpassword,
                location
            });
            await newuser.save();
            res.status(201).redirect("homepage");
            
          } catch (error) {
            console.log(error);
          }
});
app.post("/login",async (req,res)=>{
    try {
      const {email,password} = req.body;
      
      const existinguser = await user.findOne({email:email});
      console.log(existinguser);
      if(!existinguser){
        return res.status(400).json({message:"invalid email or password"});
      }
      const isvalid = await bcrypt.compare(password,existinguser.password);
      if(!isvalid){
        return res.status(400).json({message:"invalid  password"});
      }
      const token = jwt.sign({userId:existinguser._id},"our-secret-key");
      existinguser.tokens.push(token);
      await existinguser.save();
      
      res.status(201).redirect("homepage",);
      
    } catch (error) {
      console.log(error);
    }
});
app.get("/homepage",(req,res)=>{
    res.render("homepage");
})
app.get("/teams",(req,res)=>{
    res.render("teams");
})
app.listen(PORT,()=>{console.log(`LISTENING TO PORT: ${PORT}`);});