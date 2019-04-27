var express = require('express');
var app = express();
var login = require('./app');
var attendance_module = require('./modules/attendance_module').getTotalAttendanceDetail

const marksURL = 'https://academicscc.vit.ac.in/student/marks1.asp?sem=WS' 
const attendanceURL = 'https://academicscc.vit.ac.in/student/attn_report.asp?sem=WS&fmdt=01-Apr-2019&todt=17-Apr-2019'

app.get('/', (req, res, next) => {

    login.studentAuth("16BCE1111", "#23Oct1970#", (name, regno, cookieJ, err) => {
        attendance_module(cookieJ, marksURL, attendanceURL, res);
        // res.send('ASDASD');
    })
    // res.send('Hey');
})

app.listen(5000, () => {
    console.log("Server is up on port " + 5000);
})