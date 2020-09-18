const fs = require("fs");
const path = require("path");
const Hanldebars = require("handlebars");

//import json data
const food =  require(path.join(__dirname, "../data/food.json"));
const health=  require(path.join(__dirname, "../data/health.json"));
const housing=  require(path.join(__dirname, "../data/housing.json"));
const livestock=  require(path.join(__dirname, "../data/livestock.json"));
const meals=  require(path.join(__dirname, "../data/meals.json"));
const shelters=  require(path.join(__dirname, "../data/shelters.json"));
const spiritual=  require(path.join(__dirname, "../data/spiritual.json"));
const translation=  require(path.join(__dirname, "../data/translation.json"));
const transportation=  require(path.join(__dirname, "../data/transportation.json"));


