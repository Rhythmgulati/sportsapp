const express = require('express');
require("../db/conn");
const user = require("../db/models/user");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const staticPath = path.join(__dirname,"../public")
console.log(staticPath);

app.use(express.static(staticPath));

app.get("/",(req,res)=>{
   
})
app.post("/register",async (req,res)=>{
          try {
            const {name,age,sports,email,password,location} = req.body;
            const Hashedpassword = await bcrypt.hash(password,10);
            const newuser = new user({
                name,
                age,
                sports,
                email,
                password:Hashedpassword,
                location
            });
            await newuser.save();
            res.status(201).json({Message:"User registed success"});
            
          } catch (error) {
            console.log(error);
          }
});


app.listen(PORT,()=>{console.log(`LISTENING TO PORT: ${PORT}`);});