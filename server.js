const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/src/dist/firebase-angular-crud'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+
'/src/dist/firebase-angular-crud/index.html'));});
app.listen(process.env.PORT || 8080);