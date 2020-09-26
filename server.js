const express = require("express");
const connectDB = require("./config/db")
const app = express();
const path = require("path")
const Port = process.env.PORT || 5000;
connectDB();

app.use(express.json({extended :false}));
app.use("/api/users",require("./routes/users"))
app.use("/api/contacts",require("./routes/contacts"))
app.use("/api/auth",require("./routes/auth"))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}
app.listen(Port,()=>{
    console.log(`Server is up on port ${Port}`);
})