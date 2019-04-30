var express = require('express');
var app = express();
var login = require('./app');
var attendance_module = require('./modules/attendance_module').getTotalAttendanceDetail

app.get('/', (req, res, next) => {

    login.studentAuth("16BCE1111", "#23Oct1970#", (name, regno, cookieJ, err) => {
        let sem = "WS"
        let fromDate = "01-Jan-2015"
        let toDate = "01-Jan-2100"
        if (new Date().getMonth() > 5 && new Date().getMonth() < 11)
            sem = "FS"
        const marksURL = `https://academicscc.vit.ac.in/student/marks1.asp?sem=${sem}`
        const attendanceURL = `https://academicscc.vit.ac.in/student/attn_report.asp?sem=${sem}&fmdt=${fromDate}&todt=${toDate}`

        attendance_module(cookieJ, marksURL, attendanceURL, res);
        // res.send('ASDASD');
    })
    // res.send('Hey');
})

app.listen(5000, () => {
    console.log("Server is up on port " + 5000);
})