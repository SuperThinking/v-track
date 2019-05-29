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

app.post("/", (req, res, next) => {
  let id = req.body.id,
    pass = req.body.pass;
  // res.send({
  //   name: "VISHAL DHAWAN",
  //   subjects: [
  //     [
  //       "CSE3021",
  //       "Social and Information Networks",
  //       "Embedded Theory",
  //       "37",
  //       "42",
  //       "89",
  //       "1229",
  //       "ETH"
  //     ],
  //     [
  //       "CSE3999",
  //       "Technical  Answers  for Real World Problems (TARP)",
  //       "Embedded Theory",
  //       "13",
  //       "14",
  //       "93",
  //       "2217",
  //       "ETH"
  //     ],
  //     [
  //       "CSE4003",
  //       "Cyber Security",
  //       "Embedded Theory",
  //       "33",
  //       "39",
  //       "85",
  //       "1246",
  //       "ETH"
  //     ],
  //     [
  //       "CSE4019",
  //       "Image  Processing",
  //       "Embedded Theory",
  //       "39",
  //       "40",
  //       "98",
  //       "1186",
  //       "ETH"
  //     ],
  //     [
  //       "CSE4022",
  //       "Natural Language Processing",
  //       "Embedded Theory",
  //       "40",
  //       "44",
  //       "91",
  //       "1220",
  //       "ETH"
  //     ],
  //     [
  //       "MGT1036",
  //       "Principles of Marketing",
  //       "Embedded Theory",
  //       "38",
  //       "42",
  //       "91",
  //       "2058",
  //       "ETH"
  //     ],
  //     [
  //       "STS3004",
  //       "Data Structures and Algorithms",
  //       "Soft Skill",
  //       "41",
  //       "43",
  //       "96",
  //       "1050",
  //       "SS"
  //     ]
  //   ]
  // });
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
      // This Works//
      attendance_module(cookieJ, marksURL, attendanceURL, res, name);
      // uniqueAttendance(cookieJ, marksURL, uattendanceURL, res, []);
      // res.send('ASDASD');
    } else {
      res.send({ Error: err });
    }
  });
  // res.send('Hey');
});

app.listen(5000, () => {
  console.log("Server is up on port " + 5000);
});
