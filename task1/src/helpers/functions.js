const reader = require('xlsx')

const studentFile = reader.readFile('./student.xlsx')
const emailjs=require('@emailjs/browser')
function getExcelData() {
    let data = []

    const sheets = studentFile.SheetNames

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
            studentFile.Sheets[studentFile.SheetNames[i]])
        temp.forEach((row) => {
            data.push(row)
        })
    }

    // Printing data 
    return data
}


module.exports={getExcelData,ExcelDateToJSDate,sendEmail,checkNull}