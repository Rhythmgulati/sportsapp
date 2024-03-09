const express = require('express');
require("../db/conn");
const user = require("../db/models/user");
const team = require("../db/models/team");
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
      
      res.status(201).redirect("homepage");
      
    } catch (error) {
      console.log(error);
    }
});
app.get("/homepage",(req,res)=>{
    res.render("homepage");
})
app.post("/addteam",async (req,res)=>{
   try {
    console.log(req.body);
    const{image,teamname,sports,location,phoneno}=req.body;
    const newteam = new team({
    image,
     name:teamname,
     sports,
     location,
     phoneno
    });
    await newteam.save();
     res.status(201).redirect("/teams");
   } catch (error) {
    res.status(500),send("internal server error");
   }
});

app.get("/teams",async (req,res)=>{
    try {
        const teams = await team.find();
    console.log(teams);
    res.render("teams",{teams});
    } catch (error) {
        res.status(500).send("internal server error");
    }
});

app.get("/players",async (req,res)=>{
  try {
    const players = await user.find();
    res.render("players",{players})
  } catch (error) {
    res.status(500).send("internal server error");
  }
})
app.listen(PORT,()=>{console.log(`LISTENING TO PORT: ${PORT}`);});