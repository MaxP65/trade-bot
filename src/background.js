'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// var http = require('http');
// var url = require('url');

// http.createServer(onRequest).listen(3000);
// console.log("Server started");

// function onRequest(req, res) {
//     var queryData = url.parse(req.url, true).query;

//     console.log(queryData);

//     res.end({"msg":"hello world"});
// }   


// // Requiring express.js
// const express = require('express')
  
// // Changing the module to object to use its inbuilt functions
// const app = express()
  
// // Port number to run the port
// const port_no = 5555
  
// // Get request to send the data to the server
// app.get('/' , (req,res) => {
//     res.send('hey geeks!')
// })
  
// // Server Setup
// app.listen(port_no, () => {
//     console.log('port running atport number : 5555')
// })