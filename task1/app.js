
require("dotenv").config();
const express = require("express");
const mailgunController = require("./src/controllers/mailgunController.js");
const bodyParser = require("body-parser");
const excelHelper=require('./src/helpers/excelHelper.js')
const fs =require('fs')
const app = express();

const port = process.env.PORT ||8083;

app.use(bodyParser.json());
app.use("/api", mailgunController);

app.use('/',async (req, res)=>{
    const JsonExcelData=await excelHelper.getDataFromExcel();
    const json=JSON.stringify(JsonExcelData)
    fs.writeFile('../dynamicform/src/constants/studentData.json', json, 'utf8', ((err, data)=>{
        if(err){
            console.log(err);
            // res.status(500).send({message:err});
        }
        else{
            const obj=JSON.parse(data);
            console.log(obj)
            // res.status(200).send({data:obj})
        }
    }))
})

app.use("*",  (req, res) => res.status(404).send({ messgae: "the page you are accessing does not exist. check the url" }))
app.listen(port,() => {
    console.log(`Server is running on PORT ${port}`);
    
});
