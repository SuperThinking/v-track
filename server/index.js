var express = require("express");
var app = express();
var login = require("./app");
var fullInfo = require("./modules/attendance_module").getTotalUserInfo;
var updatedAttendance = require("./modules/attendance_module")
  .updatedAttendance;
var detailedAttendance = require("./modules/attendance_module").getDetailedInfo;
var uniqueAttendance = require("./modules/attendance_module").uniqueAttendance;
var bodyParser = require("body-parser");
const serverless = require("serverless-http");

const port = process.env.PORT || 5000;
const Router = express.Router();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

Router.get("/", (req, res, next) => {
  res.send(
    "<h2>Server for V-Track. <br/> Kindly contact <i>superthinkingdev@gmail.com (Vishal Dhawan)</i> for more info.</h2><br/><br/><br/><hr/>Last Updated : 11/09/2019<hr/>"
  );
});

Router.post("/detailedAttendance", (req, res, next) => {
  let id = req.body.id,
    pass = req.body.pass,
    cc = req.body.cc,
    cn = req.body.cn,
    ct = req.body.ct;
  login.studentAuth(id, pass, (name, regno, cookieJ, err) => {
    if (!err) {
      let sem = "WS";
      let fromDate = "01-Jan-2015";
      let toDate = "01-Jan-2100";
      if (new Date().getMonth() > 5 && new Date().getMonth() < 11) sem = "FS";
      const marksURL = `https://academicscc.vit.ac.in/student/attn_report.asp?sem=${sem}&fmdt=${fromDate}&todt=${toDate}`;
      let formData = [];
      let FullSem =
        "FALLSEM" +
        new Date().getFullYear() +
        "-" +
        (new Date().getFullYear() + 1).toString().substr(2);
      formData.push(`semcode=${FullSem}`);
      formData.push(`classnbr=${cn}`);
      formData.push(`from_date=${fromDate}`);
      formData.push(`to_date=${toDate}`);
      formData.push(`crscd=${cc}`);
      formData.push(`crstp=${ct}`);
      console.log(formData);
      detailedAttendance(cookieJ, marksURL, formData, res);
    } else {
      res.send({ Error: err });
    }
  });
});

Router.post("/login", (req, res, next) => {
  let id = req.body.id,
    pass = req.body.pass;
  login.studentAuth(id, pass, (name, regno, cookieJ, err) => {
    if (!err) {
      let sem = "WS";
      let fromDate = "01-Jan-2015";
      let toDate = "01-Jan-2100";
      if (new Date().getMonth() > 5 && new Date().getMonth() < 11) sem = "FS";
      const marksURL = `https://academicscc.vit.ac.in/student/marks1.asp?sem=${sem}`;
      const attendanceURL = `https://academicscc.vit.ac.in/student/attn_report.asp?sem=${sem}&fmdt=${fromDate}&todt=${toDate}`;
      const uattendanceURL =
        "https://academicscc.vit.ac.in/student/attn_report_details.asp";
      const ttURL = `https://academicscc.vit.ac.in/student/course_regular.asp?sem=${sem}`;
      fullInfo(cookieJ, marksURL, attendanceURL, ttURL, res, name);
    } else {
      res.send({ Error: err });
    }
  });
});

Router.post("/attendance", (req, res, next) => {
  let id = req.body.id,
    pass = req.body.pass;
  login.studentAuth(id, pass, (name, regno, cookieJ, err) => {
    if (!err) {
      let sem = "WS";
      let fromDate = "01-Jan-2015";
      let toDate = "01-Jan-2100";
      if (new Date().getMonth() > 5 && new Date().getMonth() < 11) sem = "FS";
      const marksURL = `https://academicscc.vit.ac.in/student/marks1.asp?sem=${sem}`;
      const attendanceURL = `https://academicscc.vit.ac.in/student/attn_report.asp?sem=${sem}&fmdt=${fromDate}&todt=${toDate}`;
      updatedAttendance(cookieJ, marksURL, attendanceURL, res, name);
    } else {
      res.send({ Error: err });
    }
  });
});

app.use("/.netlify/functions/index", Router);

module.exports.handler = serverless(app);
