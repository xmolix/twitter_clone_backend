"use strict";
exports.__esModule = true;
// @ts-ignore
var express_1 = require("express");
var app = (0, express_1["default"])();
app.get("/users");
app.listen(6666, function (err) {
    if (err) {
        throw new Error(err);
    }
    console.log("SERVER IS RUNNING!");
});
