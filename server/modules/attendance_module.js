var request = require('request')
var cheerio = require('cheerio')

getTotalAttendanceDetail = (cookieJ, marksURL, attendanceURL, res) => {
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
            var AttObj = { 'subjects': [] }
            while (k.text().trim()) {
                let l = k.find('td').first()
                let classNo = k.find('td').last().find('input').next().attr('value')
                let tempArr = []
                while (l.text().trim()) {
                    tempArr.push(l.text().trim())
                    l = l.next()
                }
                // console.log(tempArr[1], tempArr[2], tempArr[4], tempArr[6], tempArr[7], tempArr[8])
                AttObj.subjects.push([tempArr[1], tempArr[2], tempArr[3], classNo])
                k = k.next()
            }
            console.log(AttObj)
            res.send(html)
        });
    });
}

getUniqueAttendanceDetail = (cookieJ, marksURL, res) => {
    request.get(marksURL, { uri: marksURL, jar: cookieJ }, function (err, httpResponse, html) {
        if (err) {
            console.log(err)
        }
        //COMPLETE BELOW POST
        request.post("https://academicscc.vit.ac.in/student/attn_report_details.asp", { uri: attendanceURL, jar: cookieJ }, function (err, httpResponse, html) {
            if (err) {
                console.log(err)
            }
            let $ = cheerio.load(html);
            let k = $('tbody').last().children().first().next()
            var AttObj = { 'subjects': [] }
            while (k.text().trim()) {
                let l = k.find('td').first()
                let classNo = k.find('td').last().find('input').next().attr('value')
                let tempArr = []
                while (l.text().trim()) {
                    tempArr.push(l.text().trim())
                    l = l.next()
                }
                // console.log(tempArr[1], tempArr[2], tempArr[4], tempArr[6], tempArr[7], tempArr[8])
                AttObj.subjects.push([tempArr[1], tempArr[2], tempArr[3], classNo])
                k = k.next()
            }
            console.log(AttObj)
            res.send(html)
        });
    });
}

module.exports = {
    getTotalAttendanceDetail: getTotalAttendanceDetail
}