var request = require('request')
var cheerio = require('cheerio')

getTotalAttendanceDetail = (cookieJ, marksURL, attendanceURL, res, name) => {
    request.get(marksURL, { uri: marksURL, jar: cookieJ }, function (err, httpResponse, html) {
        if (err) {
            console.log(err)
        }
        request.get(attendanceURL, { uri: attendanceURL, jar: cookieJ }, function (err, httpResponse, html) {
            if (err) {
                console.log(err)
            }
            let $ = cheerio.load(html);
            let k = $('tbody').last().children().first().next()
            var AttObj = { 'name':name.trim(), 'subjects': [] }
            while (k.text().trim()) {
                let l = k.find('td').first()
                let classnbr = k.find('td').last().find('input').next().attr('value')
                let crstp = k.find('td').last().find('input').last().prev().attr('value')
                let tempArr = []
                while (l.text().trim()) {
                    tempArr.push(l.text().trim())
                    l = l.next()
                }
                // console.log(tempArr[1], tempArr[2], tempArr[4], tempArr[6], tempArr[7], tempArr[8])
                AttObj.subjects.push([tempArr[1], tempArr[2], tempArr[3], tempArr[6], tempArr[7], tempArr[8], classnbr, crstp])
                k = k.next()
            }
            console.log(AttObj)
            //Changed from html->AttObj
            res.send(AttObj);
        });
    });
}

//vvvvvvvvvvv NOT WORKING vvvvvvvvvvv//
getUniqueAttendanceDetail = (cookieJ, marksURL, attendanceURL, res, reqArray) => {
    let sem = "WINSEM" + (new Date().getFullYear() - 1) + "-" + (new Date().getFullYear().toString().substr(2))
    let fromDate = "01-Jan-2015"
    let toDate = "01-Jan-2100"
    if (new Date().getMonth() > 5 && new Date().getMonth() < 11)
        sem = "FALLSEM" + (new Date().getFullYear()) + "-" + ((new Date().getFullYear() + 1).toString().substr(2))
    let formData = {
        'semcode': "WINSEM2018-19",
        'classnbr': "1229",
        'from_date': "01-Jan-2015",
        'to_date': "01-Jan-2020",
        'crscd': "CSE3021",
        'crstp': "ETH"
    }
    console.log(formData)
    request.get(marksURL, { uri: marksURL, jar: cookieJ }, function (err, httpResponse, html) {
        if (err) {
            console.log(err)
        }
        request.post(attendanceURL, { jar: cookieJ, formData:formData, headers:{"Content-Type": "application/x-www-form-urlencoded"} }, function (err, httpResponse, html) {
            if (err) {
                console.log(err)
            }
            console.log(html)
            res.send(html)
        });
    });
}

module.exports = {
    getTotalAttendanceDetail: getTotalAttendanceDetail,
    uniqueAttendance: getUniqueAttendanceDetail
}