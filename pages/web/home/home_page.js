var express = require('express');
var connect = require("connect");
var app = express();

//set engine
var cons = require('consolidate');
app.engine('html', cons.mustache);

