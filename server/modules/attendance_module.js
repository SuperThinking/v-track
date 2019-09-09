var request = require("request");
var cheerio = require("cheerio");
var unirest = require("unirest");

getTotalUserInfo = (cookieJ, marksURL, attendanceURL, ttURL, res, name) => {
  request.get(marksURL, { uri: marksURL, jar: cookieJ }, function(
    err,
    httpResponse,
    html
  ) {
    if (err) {
      console.log(err);
    }
    request.get(attendanceURL, { uri: attendanceURL, jar: cookieJ }, function(
      err,
      httpResponse,
      html
    ) {
      if (err) {
        console.log(err);
      }
      let $ = cheerio.load(html);
      let k = $("tbody")
        .last()
        .children()
        .first()
        .next();
      let AttObj = { name: name.trim(), subjects: [] };
      let subObj = {};
      while (k.text().trim()) {
        let l = k.find("td").first();
        let classnbr = k
          .find("td")
          .last()
          .find("input")
          .next()
          .attr("value");
        let crstp = k
          .find("td")
          .last()
          .find("input")
          .last()
          .prev()
          .attr("value");
        let tempArr = [];
        while (l.text().trim()) {
          tempArr.push(l.text().trim());
          l = l.next();
        }
        subObj[classnbr] = [
          tempArr[1],
          tempArr[2],
          tempArr[3],
          tempArr[6],
          tempArr[7],
          tempArr[8],
          classnbr,
          crstp,
          tempArr[4]
        ];
        k = k.next();
      }
      request.get(ttURL, { uri: ttURL, jar: cookieJ }, function(
        err,
        httpResponse,
        html
      ) {
        if (err) {
          console.log(err);
        }
        let $ = cheerio.load(html);
        $ = cheerio.load(
          $("form")
            .first()
            .html()
        );
        let k = $("tbody")
          .children()
          .first()
          .next();
        while (k.text().trim()) {
          let l = k.find("td").first();
          let cn = l.text().trim();
          if (!cn) {
            l = l.next().next();
            cn = l.text().trim();
          }
          if (cn in subObj) {
            subObj[cn].push(
              l
                .next()
                .next()
                .next()
                .next()
                .next()
                .next()
                .next()
                .next()
                .text()
                .trim()
            );
          }
          k = k.next();
        }
        for (i in subObj) {
          AttObj.subjects.push(subObj[i]);
        }
        console.log(AttObj);
        //Changed from html->AttObj
        res.send(AttObj);
      });
    });
  });
};

updatedAttendance = (cookieJ, marksURL, attendanceURL, res, name) => {
  request.get(marksURL, { uri: marksURL, jar: cookieJ }, function(
    err,
    httpResponse,
    html
  ) {
    if (err) {
      res.send({ code: "150", message: "VIT Student Login Blocked" });
      console.log(err);
    } else {
      request.get(attendanceURL, { uri: attendanceURL, jar: cookieJ }, function(
        err,
        httpResponse,
        html
      ) {
        if (err) {
          console.log(err);
          res.send({ code: "150", message: "VIT Student Login Blocked" });
        } else {
          try {
            let $ = cheerio.load(html);
            let k = $("tbody")
              .last()
              .children()
              .first()
              .next();
            let subObj = {};
            while (k.text().trim()) {
              let l = k.find("td").first();
              let classnbr = k
                .find("td")
                .last()
                .find("input")
                .next()
                .attr("value");
              let tempArr = [];
              while (l.text().trim()) {
                tempArr.push(l.text().trim());
                l = l.next();
              }
              subObj[classnbr] = [tempArr[6], tempArr[7], tempArr[8]];
              k = k.next();
            }
            res.send(subObj);
          } catch (err) {
            console.log("Updated Attendance Function Error");
            res.send({
              code: "150",
              message: "Unable to fetch data. Contact DEV."
            });
          }
        }
      });
    }
  });
};

getDetailedInfo = (cookieJ, marksURL, data, res) => {
  console.log("Found Me!");
  const sub_url =
    "https://academicscc.vit.ac.in/student/attn_report_details.asp";
  var formD = {
    semcode: "FALLSEM2019-20",
    classnbr: "2375",
    from_date: "10-JUL-2019",
    to_date: "21-AUG-2019",
    crscd: "CSE3013",
    crstp: "ETH"
  };
  var headers = {
    Host: "academicscc.vit.ac.in",
    Origin: "https://academicscc.vit.ac.in",
    Referer:
      "https://academicscc.vit.ac.in/student/attn_report.asp?sem=FS&fmdt=07-Aug-2017&todt=21-Aug-2050",
    "Content-Type": "application/x-www-form-urlencoded",
    "Sec-Fetch-Mode": "nested-navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
  };
  formD = JSON.stringify(formD);

  request.get(marksURL, { uri: marksURL, jar: cookieJ }, function(
    err,
    httpResponse,
    html
  ) {
    if (err) {
      res.send({ code: "150", message: "VIT Student Login Blocked" });
      console.log(err);
    } else {
      unirest
        .post(sub_url)
        .headers(headers)
        .jar(cookieJ)
        .send(`semcode=FALLSEM2019-20`)
        .send(`classnbr=2375`)
        .send(`from_date=10-JUL-2019`)
        .send(`to_date=21-AUG-2019`)
        .send(`crscd=CSE3013`)
        .send(`crstp=ETH`)
        .end(response => {
          // console.log(response);
          res.send(response.body);
        });
    }
  });
};

//vvvvvvvvvvv NOT WORKING vvvvvvvvvvv//
getUniqueAttendanceDetail = (
  cookieJ,
  marksURL,
  attendanceURL,
  res,
  reqArray
) => {
  let sem =
    "WINSEM" +
    (new Date().getFullYear() - 1) +
    "-" +
    new Date()
      .getFullYear()
      .toString()
      .substr(2);
  let fromDate = "01-Jan-2015";
  let toDate = "01-Jan-2100";
  if (new Date().getMonth() > 5 && new Date().getMonth() < 11)
    sem =
      "FALLSEM" +
      new Date().getFullYear() +
      "-" +
      (new Date().getFullYear() + 1).toString().substr(2);
  let formData = {
    semcode: "WINSEM2018-19",
    classnbr: "1229",
    from_date: "01-Jan-2015",
    to_date: "01-Jan-2020",
    crscd: "CSE3021",
    crstp: "ETH"
  };
  console.log(formData);
  request.get(marksURL, { uri: marksURL, jar: cookieJ }, function(
    err,
    httpResponse,
    html
  ) {
    if (err) {
      console.log(err);
    }
    request.post(
      attendanceURL,
      {
        jar: cookieJ,
        formData: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      },
      function(err, httpResponse, html) {
        if (err) {
          console.log(err);
        }
        console.log(html);
        res.send(html);
      }
    );
  });
};

module.exports = {
  getTotalUserInfo: getTotalUserInfo,
  updatedAttendance: updatedAttendance,
  uniqueAttendance: getUniqueAttendanceDetail,
  getDetailedInfo: getDetailedInfo
};
