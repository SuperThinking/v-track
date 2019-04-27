var express = require('express');
var app = express();
var login = require('./app');
var Browser = require('zombie');
var unirest = require('unirest');
const fs = require('fs');
const jsdom = require("jsdom")
const { JSDOM } = jsdom;
var request = require('request')
var cheerio = require('cheerio');

const marksURL = 'https://academicscc.vit.ac.in/student/marks1.asp?sem=WS' 
const attendanceURL = 'https://academicscc.vit.ac.in/student/attn_report.asp?sem=WS&fmdt=01-Apr-2019&todt=17-Apr-2019'

app.get('/', (req, res, next) => {

    login.studentAuth("16BCE1111", "#23Oct1970#", (name, regno, cookieJ, err) => {
        request.get(marksURL, { uri: marksURL, jar: cookieJ }, function (err, httpResponse, html) {
            if (err) {
                console.log(err)
            }
            request.get(attendanceURL, { uri: attendanceURL, jar: cookieJ }, function (err, httpResponse, html) {
                if (err) {
                    console.log(err)
                }
                let $ = cheerio.load(html);
                let k = $('tbody').last().children().first()
                while(k.text().trim())
                {
                    console.log(k.text().trim())
                    k = k.next()
                }
                res.send(html)
            });
        });
        // unirest.get('https://academicscc.vit.ac.in/student/marks1.asp?sem=WS')
        // // .headers({'Referer':"https://academicscc.vit.ac.in/student/stud_menu.asp"})
        // .jar(cookieJ)
        // .then(resp=>{
        //     res.send(resp.body)
        // })
    })
    // res.send('Hey');
})

app.listen(5000, () => {
    console.log("Server is up on port " + 5000);
})