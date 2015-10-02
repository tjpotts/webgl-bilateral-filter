"use strict";

var css = require('./index.scss');

var React = require("react");
var ImageFilterApp = require("./components/ImageFilterApp");

React.render(<ImageFilterApp/>,document.getElementById('app'));
