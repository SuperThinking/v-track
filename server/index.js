var express = require("express");
var app = express();
var login = require("./app");
var attendance_module = require("./modules/attendance_module")
  .getTotalAttendanceDetail;
var uniqueAttendance = require("./modules/attendance_module").uniqueAttendance;
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res, next) => {
  res.send(
    "<h2>Server for V-Track. <br/> Kindly contact <i>superthinkingdev@gmail.com (Vishal Dhawan)</i> for more info.</h2>"
  );
});

app.post("/", (req, res, next) => {
  let id = req.body.id,
    pass = req.body.pass;
  login.studentAuth(id, pass, (name, regno, cookieJ, err) => {
    if (!err) {
      let sem = "WS";
      let fromDate = "01-Jan-2015";
      let toDate = "01-Jan-2100";
      if (new Date().getMonth() >= 5 && new Date().getMonth() < 11) sem = "FS";
      const marksURL = `https://academicscc.vit.ac.in/student/marks1.asp?sem=${sem}`;
      const attendanceURL = `https://academicscc.vit.ac.in/student/attn_report.asp?sem=${sem}&fmdt=${fromDate}&todt=${toDate}`;
      const uattendanceURL =
        "https://academicscc.vit.ac.in/student/attn_report_details.asp";
      const ttURL = `https://academicscc.vit.ac.in/student/course_regular.asp?sem=${sem}`;
      attendance_module(cookieJ, marksURL, attendanceURL, ttURL, res, name);
    } else {
      res.send({ Error: err });
    }
  });
});

app.listen(5000, () => {
  console.log("Server is up on port " + 5000);
});
