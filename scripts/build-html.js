const fs = require("fs");
const path = require("path");
const Hanldebars = require("handlebars");

//import json data
var food =  require(path.join(__dirname, "../data/food.json"));
var health=  require(path.join(__dirname, "../data/health.json"));
var housing=  require(path.join(__dirname, "../data/housing.json"));
var livestock=  require(path.join(__dirname, "../data/livestock.json"));
var meals=  require(path.join(__dirname, "../data/meals.json"));
var shelters=  require(path.join(__dirname, "../data/shelters.json"));
var spiritual=  require(path.join(__dirname, "../data/spiritual.json"));
var translation=  require(path.join(__dirname, "../data/translation.json"));
var transportation=  require(path.join(__dirname, "../data/transportation.json"));

//format the data



