const express = require('express');
var axios = require('axios');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser')
const PORT = 5000;
var fetch = require('fetch');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors())

app.get('/', urlencodedParser, (req, res, next)=>{
    res.send("ASD");
    fetch.FetchStream("https://academicscc.vit.ac.in/student/marks1.asp?sem=WS", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3","accept-language":"en-US,en-IN;q=0.9,en;q=0.8","upgrade-insecure-requests":"1"},"referrer":"https://academicscc.vit.ac.in/student/stud_menu.asp","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
})

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});