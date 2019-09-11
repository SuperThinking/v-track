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
  var headers = {
    Host: "academicscc.vit.ac.in",
    Origin: "https://academicscc.vit.ac.in",
    Referer: marksURL,
    "Content-Type": "application/x-www-form-urlencoded",
    "Sec-Fetch-Mode": "nested-navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
  };

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
        .send(data[0])
        .send(data[1])
        .send(data[2])
        .send(data[3])
        .send(data[4])
        .send(data[5])
        .end(response => {
          let html = response.body;
          let data = { details: [], status: 200 };
          try {
            let $ = cheerio.load(html);
            let k = $("tbody")
              .last()
              .children()
              .first()
              .next()
              .next();
            while (k.text().trim()) {
              data.details.push({
                date: k
                  .find("td")
                  .first()
                  .next()
                  .text(),
                status: k
                  .find("td")
                  .first()
                  .next()
                  .next()
                  .next()
                  .text()
              });
              k = k.next();
            }
            if (data.details.length == 0)
              throw "Error (Detailed Attendance) : Details not found";
            res.send(data);
          } catch (err) {
            data.status = 404;
            console.log(err);
            res.send(data);
          }
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
