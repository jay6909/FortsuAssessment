const config = require('../config.js')
const emailjs = require('@emailjs/browser')
const mailgunService=require('../services/mailgunService.js')
const reader = require('xlsx')

async function getDataFromExcel(file) {
    const studentFile = reader.readFile('./student.xlsx')
    let data = []

    const sheets = studentFile.SheetNames

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
            studentFile.Sheets[studentFile.SheetNames[i]])
        temp.forEach((row) => {
            data.push(row)
        })
    }

    const convertedData = await convertExcelToJson(data)
    // console.log(convertedData)

    const missing=await checkMissingData(convertedData)
    // console.log(missing)
    // if(missing.degree==true || missing.board12==true || missing.matriculation==true){
        // sendEmail(value.email,value.name, missing)
    // }

    return data
}

async function convertExcelToJson (data){
    const newData= Promise.allSettled(
        data.map(async (value) => {
            value.enrollment_date =  await ExcelDateToJSDate(value.enrollment_date);
            value.state = config.student.DEFAULT_STATE;
            return  value
        })
    )

    return newData

}

async function ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return await new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

 
 async function checkMissingData (data){
    data.forEach((record)=>{
        console.log(record)
        let degree=true, matriculation=true, board12=true
        if(record.value.degree){
            degree=false
        }
        if(record.value.matriculation){
            matriculation=false;
        }
        if(record.value.board12){
            board12=false;
        }
        // console.log(degree, board12, matriculation)
        return {degree, board12, matriculation}
    })

 }
async function sendEmail(email,name, missing){
    let templateParams = {
        body:{
        toEmail:email,
        fromEmail:fromEmail,
        subject:subject,
        message: `Hey, ${name}. Kindly Fillout the dynmic form you have missing details ${missing.matriculation ?"Matriculation/10th":""} ${missing.board12 ?"12th":""} ${missing.degree ?"Degree":""}
        Link for form:` 
   
        } };

    mailgunService.sendMail(templateParams)
 }
module.exports = { getDataFromExcel }