require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");

const uri="mongodb+srv://ogusam:Password12345@cluster0.p4hxmas.mongodb.net/?retryWrites=true&w=majority"



const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/api", (req, res) =>{
    res.send("Fullstack React Project");
});

/*
app.post("/name", (req, res) =>{
    if(req.body.name) {
        return res.json({name:req.body.name}) 
    }else{
        return res.status(400).json({error:"no name provided "})
    }
});
*/

app.use("/api/auth", authRoute);

    async function connect(){
        try{
            await mongoose.connect(uri);
            console.log('connected to data base');
        } catch(error){
            console.error(error);
        }
    }
    connect();
/*
 mongoose.connect(process.env.URI).then(()=>{
    console.Console.log("connected to data base");

 });

 */
    app.listen(process.env.PORT, ()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    });


