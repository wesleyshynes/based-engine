/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/style.scss":
/*!************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/style.scss ***!
  \************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#game-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  padding: 0;\n  margin: 0;\n  width: 100vw;\n  height: 100vh;\n  display: flex;\n  align-content: center;\n  align-items: center;\n  justify-content: center;\n  overflow-y: hidden;\n}\n#game-container canvas {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  user-select: none;\n  touch-action: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  overflow-y: hidden;\n}", "",{"version":3,"sources":["webpack://./src/assets/style.scss"],"names":[],"mappings":"AAAA;EACI,kBAAA;EACA,MAAA;EACA,OAAA;EACA,UAAA;EACA,SAAA;EACA,YAAA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,uBAAA;EACA,kBAAA;AACJ;AACI;EAEE,6CAAA;EACA,iBAAA;EACA,kBAAA;EACA,yBAAA;EACA,sBAAA;EACA,SAAA;EACA,UAAA;AAAN;;AAIA;EACE,kBAAA;AADF","sourcesContent":["#game-container {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    padding: 0;\r\n    margin: 0;\r\n    width: 100vw;\r\n    height: 100vh;\r\n    display: flex;\r\n    align-content: center;\r\n    align-items: center;\r\n    justify-content: center;\r\n    overflow-y: hidden;\r\n\r\n    canvas {\r\n      // border: 1px solid;\r\n      -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n      user-select: none;\r\n      touch-action: none;\r\n      -webkit-user-select: none;\r\n      -moz-user-select: none;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n}\r\n\r\nbody {\r\n  overflow-y: hidden;\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/assets/style.scss":
/*!*******************************!*\
  !*** ./src/assets/style.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./style.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/style.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./src/engine/BasedButton.ts":
/*!***********************************!*\
  !*** ./src/engine/BasedButton.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BasedButton": () => (/* binding */ BasedButton)
/* harmony export */ });
/* harmony import */ var _BasedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BasedObject */ "./src/engine/BasedObject.ts");
/* harmony import */ var _libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/drawHelpers */ "./src/engine/libs/drawHelpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var BasedButton = /** @class */ (function (_super) {
    __extends(BasedButton, _super);
    function BasedButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        _this.y = 0;
        _this.width = 100;
        _this.height = 50;
        _this.fillColor = '#777';
        _this.hoverColor = '#333';
        _this.focusColor = '#000';
        _this.strokeWidth = 0;
        _this.strokeColor = '';
        _this.hovered = false;
        _this.focused = false;
        _this.textColor = '#fff';
        _this.buttonText = 'Click Me';
        _this.style = '';
        _this.weight = 'bold';
        _this.fontSize = 16;
        _this.fontFamily = 'sans-serif';
        _this.clickFunction = function () { return null; };
        _this.holdFunction = function () { return null; };
        return _this;
    }
    BasedButton.prototype.initialize = function () { };
    BasedButton.prototype.update = function () {
        var x1 = this.x;
        var y1 = this.y;
        var x2 = this.x + this.width;
        var y2 = this.y + this.height;
        var _a = this.gameRef.mouseInfo, x = _a.x, y = _a.y;
        this.hovered = x > x1 && x < x2 && y > y1 && y < y2;
        if (this.hovered && this.gameRef.mouseInfo.mouseDown) {
            this.focused = true;
            this.holdFunction();
        }
        else if (this.hovered && this.focused && !this.gameRef.mouseInfo.mouseDown) {
            this.clickFunction();
            this.focused = false;
        }
        else {
            this.focused = false;
        }
    };
    BasedButton.prototype.draw = function () {
        (0,_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawBox)({
            c: this.gameRef.ctx,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fillColor: this.hovered && this.focused ? this.focusColor : this.hovered ? this.hoverColor : this.fillColor
        });
        (0,_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawText)({
            c: this.gameRef.ctx,
            x: (this.x + this.x + this.width) / 2,
            y: (this.y + this.y + this.height) / 2 + this.fontSize / 3,
            align: 'center',
            fillColor: this.textColor,
            style: this.style,
            weight: this.weight,
            fontFamily: this.fontFamily,
            fontSize: 16,
            text: this.buttonText
        });
    };
    return BasedButton;
}(_BasedObject__WEBPACK_IMPORTED_MODULE_0__.BasedObject));



/***/ }),

/***/ "./src/engine/BasedEngine.ts":
/*!***********************************!*\
  !*** ./src/engine/BasedEngine.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BasedGame": () => (/* binding */ BasedGame)
/* harmony export */ });
/* harmony import */ var _BasedSounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BasedSounds */ "./src/engine/BasedSounds.ts");
/* harmony import */ var _libs_mathHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/mathHelpers */ "./src/engine/libs/mathHelpers.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var BasedGame = /** @class */ (function () {
    function BasedGame(settings) {
        var _this = this;
        this.gameActive = false;
        this.lastUpdate = Date.now();
        this.updateDiff = Date.now();
        this.updateTick = 1000 / 60;
        this.diffMulti = this.updateDiff / this.updateTick;
        this.keyBoardEnabled = false;
        this.pressedKeys = {};
        this.mouseEnabled = false;
        this.mouseInfo = { x: -100, y: -100, mouseDown: false };
        this.levels = {};
        this.activeLevel = '';
        this.canvasElement = this.createCanvas();
        this.canvasElement.width = settings.width ? settings.width : 200;
        this.gameWidth = this.canvasElement.width;
        this.canvasElement.height = settings.height ? settings.height : 400;
        this.gameHeight = this.canvasElement.height;
        var baseElement = settings.canvasElementId ? document.getElementById(settings.canvasElementId) : document;
        if (baseElement) {
            baseElement.appendChild(this.canvasElement);
        }
        this.ctx = this.createContextFromElement(this.canvasElement);
        this.soundPlayer = new _BasedSounds__WEBPACK_IMPORTED_MODULE_0__.BasedSounds();
        if (settings.levels) {
            settings.levels.forEach(function (level) {
                _this.levels[level.key] = new level.level({ key: level.key, gameRef: _this });
                if (_this.activeLevel == '') {
                    _this.activeLevel = level.key;
                }
            });
        }
        this.gameLoop = this.gameLoop.bind(this);
        this.update = this.update.bind(this);
        this.tick = this.tick.bind(this);
        this.draw = this.draw.bind(this);
    }
    BasedGame.prototype.createCanvas = function () {
        return document.createElement('canvas');
    };
    BasedGame.prototype.createContextFromElement = function (e) {
        return e.getContext('2d');
    };
    BasedGame.prototype.enableMouse = function () {
        var _this = this;
        this.canvasElement.addEventListener('mousedown', function (e) {
            _this.mouseInfo.mouseDown = true;
        });
        this.canvasElement.addEventListener('mousemove', function (e) {
            var _a;
            _a = (0,_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_1__.getClickPosition)(e), _this.mouseInfo.x = _a[0], _this.mouseInfo.y = _a[1];
        });
        window.addEventListener('mouseup', function (e) {
            _this.mouseInfo.mouseDown = false;
        });
        this.canvasElement.addEventListener('touchstart', function (e) {
            var _a;
            // [this.mouseInfo.x,this.mouseInfo.y] = getClickPosition(e)
            // e.preventDefault()
            _a = (0,_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_1__.getTouchPosition)(e), _this.mouseInfo.x = _a[0], _this.mouseInfo.y = _a[1];
            _this.mouseInfo.mouseDown = true;
        });
        this.canvasElement.addEventListener('touchmove', function (e) {
            var _a;
            _a = (0,_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_1__.getTouchPosition)(e), _this.mouseInfo.x = _a[0], _this.mouseInfo.y = _a[1];
        });
        window.addEventListener('touchend', function (e) {
            // e.preventDefault()
            _this.mouseInfo.mouseDown = false;
        });
    };
    BasedGame.prototype.enableKeyboard = function () {
        var _this = this;
        if (this.keyBoardEnabled) {
            return;
        }
        document.addEventListener('keydown', function (e) {
            _this.pressedKeys[e.code] = true;
            // this.pressedKeys[e.keyCode] = true
        });
        document.addEventListener('keyup', function (e) {
            _this.pressedKeys[e.code] = false;
            // this.pressedKeys[e.keyCode] = false
        });
    };
    BasedGame.prototype.tick = function () {
        this.updateDiff = Date.now() - this.lastUpdate;
        this.diffMulti = this.updateDiff / this.updateTick;
        this.lastUpdate = Date.now();
    };
    BasedGame.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log('game start')
                        this.soundPlayer.initialize();
                        this.gameActive = true;
                        return [4 /*yield*/, this.levels[this.activeLevel].initialize()];
                    case 1:
                        _a.sent();
                        window.requestAnimationFrame(this.gameLoop);
                        return [2 /*return*/];
                }
            });
        });
    };
    BasedGame.prototype.update = function () {
        // console.log('game update')
        this.tick();
        this.levels[this.activeLevel].update();
    };
    BasedGame.prototype.draw = function () {
        // console.log('game draw')
        this.levels[this.activeLevel].draw();
    };
    BasedGame.prototype.loadLevel = function (level) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.levels[this.activeLevel].tearDown();
                        this.activeLevel = level;
                        return [4 /*yield*/, this.levels[this.activeLevel].initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BasedGame.prototype.gameLoop = function () {
        // console.log('game loop')
        this.update();
        this.draw();
        if (this.gameActive) {
            window.requestAnimationFrame(this.gameLoop);
        }
    };
    return BasedGame;
}());



/***/ }),

/***/ "./src/engine/BasedLevel.ts":
/*!**********************************!*\
  !*** ./src/engine/BasedLevel.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BasedLevel": () => (/* binding */ BasedLevel)
/* harmony export */ });
var BasedLevel = /** @class */ (function () {
    function BasedLevel(levelSettings) {
        this.levelKey = levelSettings.key;
        this.gameRef = levelSettings.gameRef;
        this.initialize = this.initialize.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.tearDown = this.tearDown.bind(this);
    }
    BasedLevel.prototype.initialize = function () { };
    BasedLevel.prototype.update = function () { };
    BasedLevel.prototype.draw = function () { };
    BasedLevel.prototype.tearDown = function () { };
    return BasedLevel;
}());



/***/ }),

/***/ "./src/engine/BasedObject.ts":
/*!***********************************!*\
  !*** ./src/engine/BasedObject.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BasedObject": () => (/* binding */ BasedObject)
/* harmony export */ });
var BasedObject = /** @class */ (function () {
    function BasedObject(objectSettings) {
        this.x = 0;
        this.y = 0;
        this.objectKey = objectSettings.key;
        this.gameRef = objectSettings.gameRef;
        this.initialize = this.initialize.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.tearDown = this.tearDown.bind(this);
    }
    BasedObject.prototype.initialize = function () { };
    BasedObject.prototype.update = function () { };
    BasedObject.prototype.draw = function () { };
    BasedObject.prototype.tearDown = function () { };
    return BasedObject;
}());



/***/ }),

/***/ "./src/engine/BasedSounds.ts":
/*!***********************************!*\
  !*** ./src/engine/BasedSounds.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BasedSounds": () => (/* binding */ BasedSounds)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BasedSounds = /** @class */ (function () {
    function BasedSounds() {
        this.enabled = true;
        var audioC = window.AudioContext || window.webkitAudioContext;
        // this.audioContext = new AudioContext()
        this.audioContext = new audioC();
        this.buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 1, this.audioContext.sampleRate);
        this.channelData = this.buffer.getChannelData(0);
        this.primaryGainControl = this.audioContext.createGain();
        this.primaryGainControl.gain.setValueAtTime(0.5, 0);
        this.primaryGainControl.connect(this.audioContext.destination);
    }
    BasedSounds.prototype.initialize = function () {
        // for (let i = 0; i < this.channelData.length; i++) {
        //   this.channelData[i] = Math.random() * 2 - 1
        // }
    };
    // play(){
    //   const whiteNoiseSource = this.audioContext.createBufferSource()
    //   whiteNoiseSource.buffer = this.buffer
    //   whiteNoiseSource.connect(this.primaryGainControl)
    //   whiteNoiseSource.start()
    // }
    BasedSounds.prototype.playNote = function (soundFrequency, length, soundType) {
        if (soundFrequency === void 0) { soundFrequency = 150; }
        if (length === void 0) { length = .2; }
        if (soundType === void 0) { soundType = ''; }
        if (!this.enabled) {
            return;
        }
        var kickSound = this.audioContext.createOscillator();
        if (soundType) {
            kickSound.type = soundType;
        } // else {
        // kickSound.frequency.exponentialRampToValueAtTime(
        //   0.001,
        //   this.audioContext.currentTime + length
        // )
        //}
        // kickSound.frequency.setValueAtTime(soundFrequency, 0)
        kickSound.frequency.setValueAtTime(soundFrequency, this.audioContext.currentTime);
        var kickGain = this.audioContext.createGain();
        kickGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        kickGain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + length);
        // kickGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + length)
        kickSound.connect(kickGain);
        kickGain.connect(this.primaryGainControl);
        // kickSound.connect(this.primaryGainControl)
        kickSound.start();
        kickSound.stop(this.audioContext.currentTime + length);
    };
    BasedSounds.prototype.playCustomSound = function (frequencyChart, soundType, endedCallback) {
        var _this = this;
        if (soundType === void 0) { soundType = ''; }
        if (!this.enabled) {
            return;
        }
        var customSound = this.audioContext.createOscillator();
        if (soundType) {
            customSound.type = soundType;
        }
        var length = 0;
        frequencyChart.forEach(function (x) {
            customSound.frequency.setValueAtTime(x.f, _this.audioContext.currentTime + length + x.t);
            length += x.t;
        });
        var soundGain = this.audioContext.createGain();
        soundGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        soundGain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + length);
        customSound.connect(soundGain);
        soundGain.connect(this.primaryGainControl);
        if (endedCallback) {
            customSound.onended = endedCallback;
        }
        customSound.start();
        customSound.stop(this.audioContext.currentTime + length);
        return customSound;
    };
    BasedSounds.prototype.loadSound = function (soundUrl) {
        if (soundUrl === void 0) { soundUrl = 'https://raw.githubusercontent.com/TinaSoltanian/Patatap/master/sounds/bubbles.mp3'; }
        return __awaiter(this, void 0, void 0, function () {
            var rawSound, soundBuffer, decodedBuffer, newBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.enabled) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch(soundUrl)];
                    case 1:
                        rawSound = _a.sent();
                        return [4 /*yield*/, rawSound.arrayBuffer()];
                    case 2:
                        soundBuffer = _a.sent();
                        return [4 /*yield*/, this.audioContext.decodeAudioData(soundBuffer)];
                    case 3:
                        decodedBuffer = _a.sent();
                        newBuffer = this.audioContext.createBufferSource();
                        newBuffer.buffer = decodedBuffer;
                        newBuffer.connect(this.primaryGainControl);
                        newBuffer.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BasedSounds;
}());



/***/ }),

/***/ "./src/engine/libs/drawHelpers.ts":
/*!****************************************!*\
  !*** ./src/engine/libs/drawHelpers.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "drawImage": () => (/* binding */ drawImage),
/* harmony export */   "createSprite": () => (/* binding */ createSprite),
/* harmony export */   "drawLine": () => (/* binding */ drawLine),
/* harmony export */   "drawCircle": () => (/* binding */ drawCircle),
/* harmony export */   "drawBox": () => (/* binding */ drawBox),
/* harmony export */   "drawText": () => (/* binding */ drawText)
/* harmony export */ });
/* harmony import */ var _mathHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mathHelpers */ "./src/engine/libs/mathHelpers.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

function drawImage(settings) {
    var c = settings.c, sprite = settings.sprite, sx = settings.sx, sy = settings.sy, sWidth = settings.sWidth, sHeight = settings.sHeight, dx = settings.dx, dy = settings.dy, dWidth = settings.dWidth, dHeight = settings.dHeight, img = settings.img;
    c.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}
function createSprite(spriteOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var spriteImg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var img = new Image();
                        img.onload = function () { resolve(img); };
                        img.onerror = function (err) { reject(err); };
                        img.src = spriteOptions.sprite;
                    })];
                case 1:
                    spriteImg = _a.sent();
                    spriteOptions.img = spriteImg;
                    return [2 /*return*/, spriteOptions];
            }
        });
    });
}
function drawLine(settings) {
    var c = settings.c, x = settings.x, y = settings.y, toX = settings.toX, toY = settings.toY, strokeWidth = settings.strokeWidth, strokeColor = settings.strokeColor;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(toX, toY);
    c.strokeStyle = strokeColor;
    c.lineWidth = strokeWidth;
    c.stroke();
}
function drawCircle(settings) {
    var c = settings.c, x = settings.x, y = settings.y, radius = settings.radius, startAngle = settings.startAngle, endAngle = settings.endAngle, fillColor = settings.fillColor, strokeWidth = settings.strokeWidth, strokeColor = settings.strokeColor;
    c.beginPath();
    c.arc(x, y, radius, startAngle ? (0,_mathHelpers__WEBPACK_IMPORTED_MODULE_0__.degToRad)(startAngle) : 0, endAngle ? (0,_mathHelpers__WEBPACK_IMPORTED_MODULE_0__.degToRad)(endAngle) : 2 * Math.PI);
    if (fillColor) {
        c.fillStyle = fillColor;
        c.fill();
    }
    if (strokeWidth && strokeColor) {
        c.strokeStyle = strokeColor;
        c.lineWidth = strokeWidth;
        c.stroke();
    }
}
function drawBox(settings) {
    var c = settings.c, x = settings.x, y = settings.y, width = settings.width, height = settings.height, fillColor = settings.fillColor, strokeWidth = settings.strokeWidth, strokeColor = settings.strokeColor;
    c.beginPath();
    c.rect(x, y, width, height);
    if (fillColor) {
        c.fillStyle = fillColor;
        c.fill();
    }
    if (strokeWidth && strokeColor) {
        c.strokeStyle = strokeColor;
        c.lineWidth = strokeWidth;
        c.stroke();
    }
}
function drawText(settings) {
    var c = settings.c, x = settings.x, y = settings.y, fillColor = settings.fillColor, strokeWidth = settings.strokeWidth, strokeColor = settings.strokeColor, text = settings.text, fontFamily = settings.fontFamily, fontSize = settings.fontSize, align = settings.align, style = settings.style, weight = settings.weight;
    c.textAlign = align ? align : 'center';
    c.font = "" + (style ? style + ' ' : '') + (weight ? weight + ' ' : '') + fontSize + "px " + fontFamily;
    if (fillColor) {
        c.fillStyle = fillColor;
        c.fillText(text, x, y);
    }
    if (strokeWidth && strokeColor) {
        c.strokeStyle = strokeColor;
        c.lineWidth = strokeWidth;
        c.strokeText(text, x, y);
    }
}


/***/ }),

/***/ "./src/engine/libs/mathHelpers.ts":
/*!****************************************!*\
  !*** ./src/engine/libs/mathHelpers.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRandomInt": () => (/* binding */ getRandomInt),
/* harmony export */   "getClickPosition": () => (/* binding */ getClickPosition),
/* harmony export */   "getTouchPosition": () => (/* binding */ getTouchPosition),
/* harmony export */   "distanceBetween": () => (/* binding */ distanceBetween),
/* harmony export */   "angleBetween": () => (/* binding */ angleBetween),
/* harmony export */   "pointOnCircle": () => (/* binding */ pointOnCircle),
/* harmony export */   "radToDeg": () => (/* binding */ radToDeg),
/* harmony export */   "degToRad": () => (/* binding */ degToRad)
/* harmony export */ });
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getClickPosition(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top; //y position within the element.
    return [x, y];
}
function getTouchPosition(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left; //x position within the element.
    var y = e.touches[0].clientY - rect.top; //y position within the element.
    return [x, y];
}
function distanceBetween(p1, p2) {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
    var c = Math.sqrt(a * a + b * b);
    return c;
}
function angleBetween(p1, p2, deg) {
    if (deg === void 0) { deg = false; }
    return deg ? Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI : Math.atan2(p2.y - p1.y, p2.x - p1.x);
}
function pointOnCircle(pointAngleInRadians, radius) {
    return {
        x: Math.cos(pointAngleInRadians) * radius,
        y: Math.sin(pointAngleInRadians) * radius
    };
}
function radToDeg(rads) {
    return rads * (180 / Math.PI);
}
function degToRad(deg) {
    return deg * (Math.PI / 180);
}


/***/ }),

/***/ "./src/games/troopas/TroopaStart.ts":
/*!******************************************!*\
  !*** ./src/games/troopas/TroopaStart.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TroopaStart": () => (/* binding */ TroopaStart)
/* harmony export */ });
/* harmony import */ var _engine_BasedButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../engine/BasedButton */ "./src/engine/BasedButton.ts");
/* harmony import */ var _engine_BasedLevel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../engine/BasedLevel */ "./src/engine/BasedLevel.ts");
/* harmony import */ var _engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../engine/libs/drawHelpers */ "./src/engine/libs/drawHelpers.ts");
/* harmony import */ var _engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../engine/libs/mathHelpers */ "./src/engine/libs/mathHelpers.ts");
/* harmony import */ var _assets_star_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/star.png */ "./src/assets/star.png");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var customSong = [
    { f: 0, t: 0 },
    { f: 150, t: .2 },
    { f: 200, t: .2 },
    { f: 300, t: .5 },
    { f: 400, t: .2 },
    { f: 300, t: .1 },
    { f: 100, t: 1 },
    { f: 150, t: .2 },
    { f: 200, t: .1 },
    { f: 150, t: .2 },
    { f: 200, t: .1 },
    { f: 150, t: .2 },
    { f: 200, t: .1 },
    { f: 150, t: .2 },
    { f: 200, t: .1 },
    { f: 50, t: 2 },
    { f: -50, t: 3 },
];
var TroopaStart = /** @class */ (function (_super) {
    __extends(TroopaStart, _super);
    function TroopaStart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.highScore = 0;
        _this.lastScore = 0;
        _this.newHighScore = false;
        _this.bgValues = {
            r: 64,
            g: 244,
            b: 208
        };
        _this.colorSpeed = 2;
        _this.activeSound = {
            playing: false,
            soundRef: null,
        };
        return _this;
    }
    TroopaStart.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bHighScore, bLastScore, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.newHighScore = false;
                        this.startButton = new _engine_BasedButton__WEBPACK_IMPORTED_MODULE_0__.BasedButton({
                            key: "start-button",
                            gameRef: this.gameRef,
                        });
                        this.startButton.fillColor = '#ce192b';
                        this.startButton.x = 100;
                        this.startButton.y = this.gameRef.gameHeight - 100;
                        this.startButton.buttonText = 'Start Game';
                        this.startButton.width = this.gameRef.gameWidth - 200;
                        this.startButton.clickFunction = function () {
                            // if(this.activeSound.playing && this.activeSound.soundRef && this.activeSound.soundRef.stop) {
                            //   this.activeSound.soundRef.stop()
                            // }
                            _this.gameRef.soundPlayer.playNote(900, .4, 'square');
                            _this.gameRef.loadLevel('troopa1-1');
                            // alert('game started')
                        };
                        bHighScore = localStorage.getItem('hi-score');
                        bLastScore = localStorage.getItem('last-score');
                        if (bLastScore) {
                            this.lastScore = Number(bLastScore);
                        }
                        if (bHighScore) {
                            this.highScore = Number(bHighScore);
                        }
                        if (this.lastScore > this.highScore) {
                            this.highScore = this.lastScore;
                            this.newHighScore = true;
                            localStorage.setItem('hi-score', "" + this.highScore);
                        }
                        this.star = {
                            c: this.gameRef.ctx,
                            sprite: _assets_star_png__WEBPACK_IMPORTED_MODULE_4__,
                            sx: 0,
                            sy: 0,
                            sWidth: 32,
                            sHeight: 32,
                            dx: 0,
                            dy: 0,
                            dWidth: 64,
                            dHeight: 64,
                            frame: 0
                        };
                        _a = this;
                        return [4 /*yield*/, (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.createSprite)(this.star)];
                    case 1:
                        _a.star = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TroopaStart.prototype.handleSounds = function () {
        var _this = this;
        if (this.activeSound.playing == false) {
            this.activeSound.soundRef = this.gameRef.soundPlayer.playCustomSound(customSong, 'square', function () {
                _this.activeSound.playing = false;
            });
            this.activeSound.playing = true;
        }
    };
    TroopaStart.prototype.update = function () {
        this.updateBg();
        this.handleSounds();
        this.startButton.update();
    };
    TroopaStart.prototype.updateBg = function () {
        var _a = this.bgValues, r = _a.r, g = _a.g, b = _a.b;
        var speedFactor = this.colorSpeed * this.gameRef.diffMulti;
        r += ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_3__.getRandomInt)(3) - 1) * speedFactor;
        g += ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_3__.getRandomInt)(3) - 1) * speedFactor;
        b += ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_3__.getRandomInt)(3) - 1) * speedFactor;
        r = r < 0 ? 0 : r > 255 ? 255 : r;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        b = b < 0 ? 0 : b > 255 ? 255 : b;
        this.bgValues = {
            r: r, g: g, b: b
        };
        // console.log(r,g,b)
    };
    TroopaStart.prototype.drawBg = function () {
        this.gameRef.ctx.beginPath();
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight);
        this.gameRef.ctx.fillStyle = "rgba(" + this.bgValues.r + "," + this.bgValues.g + "," + this.bgValues.b + ",1)";
        this.gameRef.ctx.fill();
    };
    TroopaStart.prototype.draw = function () {
        this.gameRef.ctx.beginPath();
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight);
        this.gameRef.ctx.fillStyle = '#eee';
        this.gameRef.ctx.fill();
        this.drawBg();
        this.startButton.draw();
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 200,
            align: 'center',
            fillColor: '#000',
            strokeColor: '#fff',
            strokeWidth: 3,
            style: '',
            weight: '900',
            fontFamily: 'sans-serif',
            fontSize: 40,
            text: 'TROOPAS'
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 275,
            align: 'center',
            fillColor: '#000',
            strokeColor: '#fff',
            strokeWidth: 3,
            style: '',
            weight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: this.newHighScore ? 25 : 20,
            text: (this.newHighScore ? 'New High ' : '') + "Score: " + this.lastScore
            // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 320,
            align: 'center',
            fillColor: '#000',
            strokeColor: '#fff',
            strokeWidth: 3,
            style: '',
            weight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: 15,
            text: "Hi Score: " + this.highScore
            // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
        });
        /////////////////////////////////
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 200,
            align: 'center',
            fillColor: '#000',
            style: '',
            weight: '900',
            fontFamily: 'sans-serif',
            fontSize: 40,
            text: 'TROOPAS'
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 275,
            align: 'center',
            fillColor: '#000',
            style: '',
            weight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: this.newHighScore ? 25 : 20,
            text: (this.newHighScore ? 'New High ' : '') + "Score: " + this.lastScore
            // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 320,
            align: 'center',
            fillColor: '#000',
            style: '',
            weight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: 15,
            text: "Hi Score: " + this.highScore
            // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawText)({
            c: this.gameRef.ctx,
            x: (this.gameRef.gameWidth) / 2,
            y: 50,
            align: 'center',
            fillColor: '#000',
            style: '',
            weight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: 15,
            text: "" + JSON.stringify(this.gameRef.mouseInfo)
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_2__.drawImage)(this.star);
    };
    TroopaStart.prototype.tearDown = function () {
        this.startButton.tearDown();
    };
    return TroopaStart;
}(_engine_BasedLevel__WEBPACK_IMPORTED_MODULE_1__.BasedLevel));



/***/ }),

/***/ "./src/games/troopas/levels/TroopasLevel1-1.ts":
/*!*****************************************************!*\
  !*** ./src/games/troopas/levels/TroopasLevel1-1.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TroopasLevel1": () => (/* binding */ TroopasLevel1)
/* harmony export */ });
/* harmony import */ var _engine_BasedLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../engine/BasedLevel */ "./src/engine/BasedLevel.ts");
/* harmony import */ var _engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../engine/libs/drawHelpers */ "./src/engine/libs/drawHelpers.ts");
/* harmony import */ var _engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../engine/libs/mathHelpers */ "./src/engine/libs/mathHelpers.ts");
/* harmony import */ var _projectiles_Bullet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../projectiles/Bullet */ "./src/games/troopas/projectiles/Bullet.ts");
/* harmony import */ var _troops_BadTroopa__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../troops/BadTroopa */ "./src/games/troopas/troops/BadTroopa.ts");
/* harmony import */ var _troops_MainTroopa__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../troops/MainTroopa */ "./src/games/troopas/troops/MainTroopa.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var TroopasLevel1 = /** @class */ (function (_super) {
    __extends(TroopasLevel1, _super);
    function TroopasLevel1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.score = 0;
        _this.cameraPos = { x: 0, y: 0 };
        _this.levelWidth = 2000;
        _this.levelHeight = 2000;
        _this.bgValues = {
            r: 64,
            g: 244,
            b: 208
        };
        _this.colorSpeed = 5;
        return _this;
    }
    TroopasLevel1.prototype.initialize = function () {
        this.score = 0;
        this.gameRef.soundPlayer.loadSound('./public/sounds/boom.ogg');
        this.mainTroopa = new _troops_MainTroopa__WEBPACK_IMPORTED_MODULE_5__.MainTroopa({ key: 'main-troopa', gameRef: this.gameRef });
        this.mainTroopa.x = 100;
        this.mainTroopa.y = 100;
        this.mainTroopa.health = 10;
        this.loadBaddies(10);
        this.mainTroopa.initialize();
        this.shots = new _projectiles_Bullet__WEBPACK_IMPORTED_MODULE_3__.Bullet({ key: 'main-shot', gameRef: this.gameRef });
        this.shots.initialize();
    };
    TroopasLevel1.prototype.loadBaddies = function (enemyCount) {
        var _this = this;
        if (enemyCount === void 0) { enemyCount = 10; }
        this.badTroopas = (new Array(enemyCount)).fill('').map(function (x, i) {
            var newBaddie = new _troops_BadTroopa__WEBPACK_IMPORTED_MODULE_4__.BadTroopa({ key: "bad-troopa-" + i, gameRef: _this.gameRef });
            newBaddie.initialize();
            newBaddie.target = _this.mainTroopa;
            newBaddie.x = 100 + (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(_this.levelWidth);
            newBaddie.y = 100 + (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(_this.levelHeight);
            if ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(2) > 0) {
                newBaddie.radius = 35;
                newBaddie.maxHealth = 3;
                newBaddie.health = 3;
            }
            else {
                newBaddie.baseSpeed = 2;
                newBaddie.fastSpeed = 4;
            }
            // console.log(newBaddie)
            return newBaddie;
        });
    };
    TroopasLevel1.prototype.update = function () {
        var _this = this;
        this.mainTroopa.collision = false;
        this.mainTroopa.update();
        // move targeting
        if (this.gameRef.mouseInfo.mouseDown) {
            this.mainTroopa.target = {
                x: this.gameRef.mouseInfo.x - this.cameraPos.x,
                y: this.gameRef.mouseInfo.y - this.cameraPos.y,
                active: true
            };
            if (this.mainTroopa.target.x < 0)
                this.mainTroopa.target.x = 0;
            if (this.mainTroopa.target.x > this.levelWidth)
                this.mainTroopa.target.x = this.levelWidth;
            if (this.mainTroopa.target.y < 0)
                this.mainTroopa.target.y = 0;
            if (this.mainTroopa.target.y > this.levelHeight)
                this.mainTroopa.target.y = this.levelHeight;
        }
        this.updateCamera();
        var closestEnemy;
        var closestEnemyDistance = 1000;
        var liveEnemies = 0;
        this.badTroopas.forEach(function (x, i) {
            if (x.health <= 0) {
                return;
            }
            x.collision = false;
            x.update();
            liveEnemies++;
            var distanceToPlayer = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(_this.mainTroopa, x);
            // player collision
            if (distanceToPlayer <= _this.mainTroopa.radius + x.radius) {
                _this.mainTroopa.collision = true;
                var totalVelocity = Math.abs(x.velocity.x) + Math.abs(x.velocity.y);
                if (totalVelocity) {
                    _this.mainTroopa.x += x.velocity.x / totalVelocity * 10;
                    _this.mainTroopa.y += x.velocity.y / totalVelocity * 10;
                }
                // x.collision = true
                _this.mainTroopa.damage(1);
                _this.gameRef.soundPlayer.playNote(100, .3, 'square');
                // console.log(this.mainTroopa, totalVelocity)
            }
            if (distanceToPlayer < closestEnemyDistance) {
                closestEnemy = x;
                closestEnemyDistance = distanceToPlayer;
            }
            // bullet collision
            if (_this.shots.active && (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(_this.shots, x) <= _this.shots.radius + x.radius) {
                _this.shots.active = false;
                x.damage(1);
                _this.gameRef.soundPlayer.playNote(50, .3, 'square');
                _this.score++;
                var totalVelocity = Math.abs(_this.shots.velocity.x) + Math.abs(_this.shots.velocity.y);
                x.x += _this.shots.velocity.x / totalVelocity * 10;
                x.y += _this.shots.velocity.y / totalVelocity * 10;
            }
            // collision with other baddies
            _this.badTroopas.forEach(function (y, j) {
                if (y.health > 0 && !y.alternateTarget.active && (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(y, x) <= (x.radius + y.radius) && j !== i) {
                    y.alternateTarget = {
                        x: y.target.x + (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(50) - 25,
                        y: y.target.y + (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(50) - 25,
                        active: true
                    };
                }
            });
        });
        this.shots.update();
        // shoot bullet based on closest enemy and time
        if (closestEnemy) {
            // closestEnemy.collision = true
            var enemyAnglePos = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.pointOnCircle)((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.angleBetween)(this.mainTroopa, closestEnemy), this.mainTroopa.radius);
            var shootingPos = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.pointOnCircle)((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.degToRad)(this.mainTroopa.shootingHand.currentAngle), this.mainTroopa.radius);
            var shotDistance = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(enemyAnglePos, shootingPos);
            // console.log(enemyAnglePos, shootingPos)
            if (shotDistance < 1) {
                var targetEndPoint = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.pointOnCircle)((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.angleBetween)(this.mainTroopa, closestEnemy), this.shots.maxDistance);
                this.shots.fire(this.mainTroopa.shootingHand, {
                    x: targetEndPoint.x + this.mainTroopa.x,
                    y: targetEndPoint.y + this.mainTroopa.y
                });
                // this.shots.fire(this.mainTroopa, this.mainTroopa.shootingHand)
            }
            this.mainTroopa.nearestTarget = closestEnemy;
        }
        // reset or next level
        if (liveEnemies === 0) {
            // this.gameRef.loadLevel('start-screen')
            this.randomizeBg();
            this.loadBaddies(this.badTroopas.length + 10);
        }
        if (this.mainTroopa.health <= 0) {
            localStorage.setItem('last-score', "" + this.score);
            this.gameRef.loadLevel('start-screen');
        }
    };
    TroopasLevel1.prototype.updateCamera = function () {
        this.cameraPos = {
            x: -(this.mainTroopa.x - this.gameRef.gameWidth / 2),
            y: -(this.mainTroopa.y - this.gameRef.gameHeight / 2)
        };
        if (this.gameRef.gameWidth < this.levelWidth) {
            if (this.cameraPos.x > 0)
                this.cameraPos.x = 0;
            if (this.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1)
                this.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth);
        }
        else {
            this.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2;
        }
        if (this.gameRef.gameHeight < this.levelHeight) {
            if (this.cameraPos.y > 0)
                this.cameraPos.y = 0;
            if (this.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1)
                this.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight);
        }
        else {
            this.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2;
        }
    };
    TroopasLevel1.prototype.updateBg = function () {
        var _a = this.bgValues, r = _a.r, g = _a.g, b = _a.b;
        var speedFactor = this.colorSpeed * this.gameRef.diffMulti;
        r += ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(3) - 1) * speedFactor;
        g += ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(3) - 1) * speedFactor;
        b += ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(3) - 1) * speedFactor;
        r = r < 0 ? 0 : r > 255 ? 255 : r;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        b = b < 0 ? 0 : b > 255 ? 255 : b;
        this.bgValues = {
            r: r, g: g, b: b
        };
        // console.log(r,g,b)
    };
    TroopasLevel1.prototype.randomizeBg = function () {
        var _a = this.bgValues, r = _a.r, g = _a.g, b = _a.b;
        r += (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(256);
        g += (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(256);
        b += (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.getRandomInt)(256);
        this.bgValues = {
            r: r, g: g, b: b
        };
    };
    TroopasLevel1.prototype.drawBg = function () {
        // this.updateBg()
        var gridWidth = 200;
        var gridHeight = 200;
        var drawWidth = this.gameRef.gameWidth > this.levelWidth ? this.levelWidth : this.gameRef.gameWidth;
        var drawHeight = this.gameRef.gameHeight > this.levelHeight ? this.levelHeight : this.gameRef.gameHeight;
        var drawOffsetX = drawWidth == this.levelWidth ? this.cameraPos.x : this.cameraPos.x % gridWidth;
        var drawOffsetY = drawHeight == this.levelHeight ? this.cameraPos.y : this.cameraPos.y % gridHeight;
        for (var i = 0; i < drawWidth / gridWidth + 1; i++) {
            for (var j = 0; j < drawHeight / gridHeight + 1; j++) {
                // if(i*gridWidth > drawWidth || j*gridHeight > drawHeight) {
                //   continue
                // }
                this.gameRef.ctx.beginPath();
                var camX = (i * gridWidth - (this.cameraPos.x) + this.cameraPos.x % gridWidth) / (this.levelWidth);
                var camY = (j * gridHeight - (this.cameraPos.y) + +this.cameraPos.y % gridWidth) / (this.levelHeight);
                this.gameRef.ctx.rect(i * gridWidth + drawOffsetX, j * gridHeight + drawOffsetY, gridWidth + 1, gridHeight + 1);
                // this.gameRef.ctx.fillStyle = `black`
                this.gameRef.ctx.fillStyle = "rgba(" + (camX) * (this.bgValues.r) + "," + ((camX + camY) / (this.levelWidth + this.levelHeight)) * (this.bgValues.g) + "," + (camY) * (this.bgValues.b) + ",1)";
                // this.gameRef.ctx.fillStyle = `rgba(${(camX)*100 + 50},${((camX + camY)/(this.levelWidth + this.levelHeight))*100 + 50},${(camY)*100 + 50},1)`
                this.gameRef.ctx.fill();
            }
        }
        for (var i = 0; i < drawWidth / gridWidth + 1; i++) {
            (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawLine)({
                c: this.gameRef.ctx,
                x: i * gridWidth + this.cameraPos.x % gridWidth,
                y: 0,
                toX: i * gridWidth + this.cameraPos.x % gridWidth,
                toY: this.gameRef.gameHeight,
                strokeWidth: 1,
                strokeColor: 'rgba(255,255,255,.2)'
            });
        }
        for (var j = 0; j < drawHeight / gridHeight + 1; j++) {
            (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawLine)({
                c: this.gameRef.ctx,
                x: 0,
                y: j * gridHeight + this.cameraPos.y % gridHeight,
                toX: this.gameRef.gameWidth,
                toY: j * gridHeight + this.cameraPos.y % gridHeight,
                strokeWidth: 1,
                strokeColor: 'rgba(255,255,255,.2)'
            });
        }
    };
    TroopasLevel1.prototype.draw = function () {
        var _this = this;
        this.gameRef.ctx.beginPath();
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight);
        this.gameRef.ctx.fillStyle = '#eee';
        this.gameRef.ctx.fill();
        this.drawBg();
        this.mainTroopa.draw(this.cameraPos);
        this.badTroopas.forEach(function (x) {
            if (x.health <= 0) {
                return;
            }
            x.draw(_this.cameraPos);
        });
        this.shots.draw(this.cameraPos);
        if (this.mainTroopa.health > 0) {
            this.gameRef.ctx.beginPath();
            this.gameRef.ctx.rect(30, 30, (this.mainTroopa.health / 10) * 100, 10);
            this.gameRef.ctx.fillStyle = '#ce192b';
            this.gameRef.ctx.fill();
        }
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawText)({
            c: this.gameRef.ctx,
            x: 30,
            y: 60,
            align: 'left',
            fontSize: 16,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            strokeColor: '#000',
            strokeWidth: 3,
            text: "Score: " + this.score
        });
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawText)({
            c: this.gameRef.ctx,
            x: 30,
            y: 60,
            align: 'left',
            fontSize: 16,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            text: "Score: " + this.score
        });
        // drawText({
        //   c: this.gameRef.ctx,
        //   x: 30,
        //   y: 90,
        //   align: 'left',
        //   fontSize: 16,
        //   fontFamily: 'sans-serif',
        //   fillColor: '#000',
        //   text: `x: ${this.mainTroopa.x}, y: ${this.mainTroopa.y}`
        // })
    };
    return TroopasLevel1;
}(_engine_BasedLevel__WEBPACK_IMPORTED_MODULE_0__.BasedLevel));



/***/ }),

/***/ "./src/games/troopas/projectiles/Bullet.ts":
/*!*************************************************!*\
  !*** ./src/games/troopas/projectiles/Bullet.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bullet": () => (/* binding */ Bullet)
/* harmony export */ });
/* harmony import */ var _engine_BasedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../engine/BasedObject */ "./src/engine/BasedObject.ts");
/* harmony import */ var _engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../engine/libs/drawHelpers */ "./src/engine/libs/drawHelpers.ts");
/* harmony import */ var _engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../engine/libs/mathHelpers */ "./src/engine/libs/mathHelpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.active = false;
        _this.target = { x: 0, y: 0 };
        _this.speed = 15;
        _this.radius = 8;
        _this.velocity = { x: 0, y: 0 };
        _this.maxDistance = 800;
        _this.traveled = 0;
        _this.lastShot = 0;
        _this.shotDelay = 600;
        return _this;
    }
    Bullet.prototype.initialize = function () { };
    Bullet.prototype.update = function () {
        if (this.active && this.traveled < this.maxDistance) {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.traveled += Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
        }
        else {
            this.velocity = { x: 0, y: 0 };
            this.active = false;
            this.traveled = 0;
        }
    };
    Bullet.prototype.setVelocityToTarget = function () {
        var diffMulti = this.gameRef.diffMulti;
        var dt = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(this, this.target);
        var speedFactor = this.speed * diffMulti;
        this.velocity = {
            x: (speedFactor / dt) * (this.target.x - this.x),
            y: (speedFactor / dt) * (this.target.y - this.y)
        };
    };
    Bullet.prototype.fire = function (start, end) {
        if (!this.active && this.gameRef.lastUpdate - this.lastShot >= this.shotDelay) {
            this.x = start.x;
            this.y = start.y;
            this.target = end;
            this.setVelocityToTarget();
            this.active = true;
            this.traveled = 0;
            this.lastShot = this.gameRef.lastUpdate;
            this.gameRef.soundPlayer.playNote(-150, .3, 'square');
        }
    };
    Bullet.prototype.draw = function (cameraOffset) {
        if (cameraOffset === void 0) { cameraOffset = { x: 0, y: 0 }; }
        if (this.active) {
            (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawCircle)({
                c: this.gameRef.ctx,
                x: cameraOffset.x + this.x,
                y: cameraOffset.y + this.y,
                fillColor: 'gold',
                radius: this.radius,
                strokeColor: 'rgba(255,255,255,.5)',
                strokeWidth: 2
            });
        }
    };
    return Bullet;
}(_engine_BasedObject__WEBPACK_IMPORTED_MODULE_0__.BasedObject));



/***/ }),

/***/ "./src/games/troopas/troops/BadTroopa.ts":
/*!***********************************************!*\
  !*** ./src/games/troopas/troops/BadTroopa.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BadTroopa": () => (/* binding */ BadTroopa)
/* harmony export */ });
/* harmony import */ var _engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../engine/libs/drawHelpers */ "./src/engine/libs/drawHelpers.ts");
/* harmony import */ var _engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../engine/libs/mathHelpers */ "./src/engine/libs/mathHelpers.ts");
/* harmony import */ var _MainTroopa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MainTroopa */ "./src/games/troopas/troops/MainTroopa.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var BadTroopa = /** @class */ (function (_super) {
    __extends(BadTroopa, _super);
    function BadTroopa() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speed = 1;
        _this.baseSpeed = 1;
        _this.fastSpeed = 3;
        _this.aggroRange = 250;
        _this.radius = 20;
        _this.health = 2;
        _this.maxHealth = 2;
        _this.damageBuffer = 100;
        _this.alternateTarget = { x: 0, y: 0, active: false };
        _this.healthColors = ['#000', '#ce192b', 'pink'];
        return _this;
    }
    BadTroopa.prototype.initialize = function () {
        this.health = 2;
    };
    BadTroopa.prototype.update = function () {
        var _this = this;
        if ((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_1__.distanceBetween)(this, this.target) < this.aggroRange) {
            this.speed = this.fastSpeed;
            this.alternateTarget.active = false;
        }
        else {
            this.speed = this.baseSpeed;
        }
        if (this.alternateTarget.active) {
            this.moveTo(this.alternateTarget, function () {
                _this.alternateTarget.active = false;
            });
        }
        else {
            this.moveTo(this.target);
        }
    };
    BadTroopa.prototype.draw = function (cameraOffset) {
        if (cameraOffset === void 0) { cameraOffset = { x: 0, y: 0 }; }
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_0__.drawCircle)({
            c: this.gameRef.ctx,
            x: cameraOffset.x + this.x,
            y: cameraOffset.y + this.y,
            radius: this.radius,
            fillColor: "rgb(255,0," + (this.maxHealth - this.health >= 0 ? (this.maxHealth - this.health) / this.maxHealth * 255 : 0) + ")",
            strokeWidth: 2,
            strokeColor: 'rgba(255,255,255,.5)'
        });
    };
    return BadTroopa;
}(_MainTroopa__WEBPACK_IMPORTED_MODULE_2__.MainTroopa));



/***/ }),

/***/ "./src/games/troopas/troops/MainTroopa.ts":
/*!************************************************!*\
  !*** ./src/games/troopas/troops/MainTroopa.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainTroopa": () => (/* binding */ MainTroopa)
/* harmony export */ });
/* harmony import */ var _engine_BasedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../engine/BasedObject */ "./src/engine/BasedObject.ts");
/* harmony import */ var _engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../engine/libs/drawHelpers */ "./src/engine/libs/drawHelpers.ts");
/* harmony import */ var _engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../engine/libs/mathHelpers */ "./src/engine/libs/mathHelpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var MainTroopa = /** @class */ (function (_super) {
    __extends(MainTroopa, _super);
    function MainTroopa() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.target = { x: 0, y: 0 };
        _this.radius = 30;
        _this.speed = 7;
        _this.health = 10;
        _this.maxHealth = 10;
        _this.lastHit = 0;
        _this.damageBuffer = 100;
        // active: boolean = false
        _this.hovered = false;
        _this.focused = false;
        _this.collision = false;
        _this.onCollision = function () { };
        _this.velocity = { x: 0, y: 0 };
        _this.shootingHand = {
            x: 0,
            y: 0,
            radius: 10,
            fillColor: '#55dafd',
            currentAngle: 0,
            angleSpeed: 5
        };
        _this.nearestTarget = { x: 0, y: 0 };
        return _this;
    }
    MainTroopa.prototype.initialize = function () {
        this.target = { x: this.x, y: this.y };
    };
    MainTroopa.prototype.update = function () {
        var _this = this;
        this.target.active && this.moveTo(this.target, function () {
            _this.target.active = false;
        });
        var targetAngle = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.angleBetween)(this, this.nearestTarget, true);
        var angleSpeed = this.shootingHand.angleSpeed * this.gameRef.diffMulti;
        var rotDir = (targetAngle - this.shootingHand.currentAngle + 540) % 360 - 180;
        if (rotDir > 0) {
            this.shootingHand.currentAngle += rotDir > angleSpeed ? angleSpeed : rotDir;
        }
        else if (rotDir < 0) {
            this.shootingHand.currentAngle -= rotDir < angleSpeed ? angleSpeed : -rotDir;
        }
        this.hovered = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(this, this.gameRef.mouseInfo) <= this.radius;
    };
    MainTroopa.prototype.moveTo = function (moveTarget, arriveFn) {
        if (arriveFn === void 0) { arriveFn = function () { return undefined; }; }
        var dt = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(this, moveTarget);
        if (dt > this.radius) {
            var speedFactor = this.speed * this.gameRef.diffMulti;
            this.velocity = {
                x: (speedFactor / dt) * (moveTarget.x - this.x),
                y: (speedFactor / dt) * (moveTarget.y - this.y)
            };
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
        else {
            this.velocity = { x: 0, y: 0 };
            arriveFn();
        }
    };
    MainTroopa.prototype.draw = function (cameraOffset) {
        if (cameraOffset === void 0) { cameraOffset = { x: 0, y: 0 }; }
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawCircle)({
            c: this.gameRef.ctx,
            x: cameraOffset.x + this.x,
            y: cameraOffset.y + this.y,
            radius: this.radius,
            fillColor: this.lastHit + 500 > this.gameRef.lastUpdate ? 'orange' : '#55dafd',
            strokeWidth: 2,
            strokeColor: 'rgba(255,255,255,.5)'
            // fillColor: this.collision ? 'orange' : 'green'
            // fillColor: this.collision ? 'orange' : this.hovered ? 'red' : 'green'
        });
        // const targetAngle = pointOnCircle(angleBetween(this, this.nearestTarget), this.radius + this.shootingHand.radius)
        var targetAngle = (0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.pointOnCircle)((0,_engine_libs_mathHelpers__WEBPACK_IMPORTED_MODULE_2__.degToRad)(this.shootingHand.currentAngle), this.radius + this.shootingHand.radius);
        this.shootingHand.x = targetAngle.x + this.x;
        this.shootingHand.y = targetAngle.y + this.y;
        (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawCircle)({
            c: this.gameRef.ctx,
            x: cameraOffset.x + this.x + targetAngle.x,
            y: cameraOffset.y + this.y + targetAngle.y,
            radius: this.shootingHand.radius,
            fillColor: this.shootingHand.fillColor
            // fillColor: this.collision ? 'orange' : 'green'
            // fillColor: this.collision ? 'orange' : this.hovered ? 'red' : 'green'
        });
        if (this.target.active) {
            (0,_engine_libs_drawHelpers__WEBPACK_IMPORTED_MODULE_1__.drawCircle)({
                c: this.gameRef.ctx,
                x: cameraOffset.x + this.target.x,
                y: cameraOffset.y + this.target.y,
                radius: 20,
                strokeWidth: 2,
                strokeColor: 'yellow'
                // fillColor: 'green'
            });
        }
    };
    MainTroopa.prototype.damage = function (amount) {
        if (this.lastHit + this.damageBuffer > this.gameRef.lastUpdate) {
            return;
        }
        this.health -= amount;
        this.lastHit = this.gameRef.lastUpdate;
    };
    return MainTroopa;
}(_engine_BasedObject__WEBPACK_IMPORTED_MODULE_0__.BasedObject));



/***/ }),

/***/ "./src/assets/star.png":
/*!*****************************!*\
  !*** ./src/assets/star.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "a7cb585cf61f7dafb028.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine_BasedEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine/BasedEngine */ "./src/engine/BasedEngine.ts");
/* harmony import */ var _games_troopas_levels_TroopasLevel1_1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./games/troopas/levels/TroopasLevel1-1 */ "./src/games/troopas/levels/TroopasLevel1-1.ts");
/* harmony import */ var _games_troopas_TroopaStart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./games/troopas/TroopaStart */ "./src/games/troopas/TroopaStart.ts");
/* harmony import */ var _assets_style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/style.scss */ "./src/assets/style.scss");




// import { LevelOneBase, OtherLevel } from "./levels/gameLevels";
// import { StartLevel } from "./levels/startLevel";
function startGame() {
    var newGame = new _engine_BasedEngine__WEBPACK_IMPORTED_MODULE_0__.BasedGame({
        canvasElementId: 'game-container',
        width: window.innerWidth,
        // width: window.innerWidth > 600 ? 600: window.innerWidth,
        // width: 400,
        height: window.innerHeight,
        // height: window.innerHeight > 800 ? 800 : window.innerHeight,
        // height: 600,
        levels: [
            // { key: 'start-level', level: StartLevel },
            // { key: 'new-level-1', level: OtherLevel },
            // { key: 'level-one', level: LevelOneBase }
            { key: 'start-screen', level: _games_troopas_TroopaStart__WEBPACK_IMPORTED_MODULE_2__.TroopaStart },
            { key: 'troopa1-1', level: _games_troopas_levels_TroopasLevel1_1__WEBPACK_IMPORTED_MODULE_1__.TroopasLevel1 },
        ]
    });
    newGame.enableMouse();
    newGame.enableKeyboard();
    newGame.start();
}
var startBtn = document.getElementById('start-game');
var audioP = document.getElementById('audio-b');
// const fakeSound = new Audio()
// const fakeSound = new Audio('https://www.dizzisternberg.co.uk/music/Picts.mp3')
if (startBtn && audioP && audioP) {
    startBtn.addEventListener('click', function () {
        // fakeSound.muted = false
        // fakeSound.play()
        audioP.play();
        startGame();
        startBtn.remove();
        setTimeout(function () {
            audioP.remove();
        }, 500);
        // audioP.remove()
    });
}
// openFullscreen(newGame.canvasElement)
//
// function openFullscreen(elem: any) {
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvYXNzZXRzL3N0eWxlLnNjc3MiLCJ3ZWJwYWNrOi8vdHlwdXJyLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90eXB1cnIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvY3NzV2l0aE1hcHBpbmdUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvYXNzZXRzL3N0eWxlLnNjc3M/ZDhjMCIsIndlYnBhY2s6Ly90eXB1cnIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdHlwdXJyLy4vc3JjL2VuZ2luZS9CYXNlZEJ1dHRvbi50cyIsIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvZW5naW5lL0Jhc2VkRW5naW5lLnRzIiwid2VicGFjazovL3R5cHVyci8uL3NyYy9lbmdpbmUvQmFzZWRMZXZlbC50cyIsIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvZW5naW5lL0Jhc2VkT2JqZWN0LnRzIiwid2VicGFjazovL3R5cHVyci8uL3NyYy9lbmdpbmUvQmFzZWRTb3VuZHMudHMiLCJ3ZWJwYWNrOi8vdHlwdXJyLy4vc3JjL2VuZ2luZS9saWJzL2RyYXdIZWxwZXJzLnRzIiwid2VicGFjazovL3R5cHVyci8uL3NyYy9lbmdpbmUvbGlicy9tYXRoSGVscGVycy50cyIsIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvZ2FtZXMvdHJvb3Bhcy9Ucm9vcGFTdGFydC50cyIsIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvZ2FtZXMvdHJvb3Bhcy9sZXZlbHMvVHJvb3Bhc0xldmVsMS0xLnRzIiwid2VicGFjazovL3R5cHVyci8uL3NyYy9nYW1lcy90cm9vcGFzL3Byb2plY3RpbGVzL0J1bGxldC50cyIsIndlYnBhY2s6Ly90eXB1cnIvLi9zcmMvZ2FtZXMvdHJvb3Bhcy90cm9vcHMvQmFkVHJvb3BhLnRzIiwid2VicGFjazovL3R5cHVyci8uL3NyYy9nYW1lcy90cm9vcGFzL3Ryb29wcy9NYWluVHJvb3BhLnRzIiwid2VicGFjazovL3R5cHVyci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90eXB1cnIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdHlwdXJyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90eXB1cnIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly90eXB1cnIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90eXB1cnIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90eXB1cnIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vdHlwdXJyLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ3lIO0FBQzdCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyx3R0FBcUM7QUFDL0Y7QUFDQSwyREFBMkQsdUJBQXVCLFdBQVcsWUFBWSxlQUFlLGNBQWMsaUJBQWlCLGtCQUFrQixrQkFBa0IsMEJBQTBCLHdCQUF3Qiw0QkFBNEIsdUJBQXVCLEdBQUcsMEJBQTBCLGtEQUFrRCxzQkFBc0IsdUJBQXVCLDhCQUE4QiwyQkFBMkIsY0FBYyxlQUFlLEdBQUcsVUFBVSx1QkFBdUIsR0FBRyxPQUFPLHdGQUF3RixXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssV0FBVywwQ0FBMEMsMkJBQTJCLGVBQWUs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bXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2Nzc1dpdGhNYXBwaW5nVG9TdHJpbmcuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiNnYW1lLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogMTAwdmg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24tY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xcbn1cXG4jZ2FtZS1jb250YWluZXIgY2FudmFzIHtcXG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG5ib2R5IHtcXG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Fzc2V0cy9zdHlsZS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFVBQUE7RUFDQSxTQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxhQUFBO0VBQ0EscUJBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7QUFDSjtBQUNJO0VBRUUsNkNBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0FBQU47O0FBSUE7RUFDRSxrQkFBQTtBQURGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiNnYW1lLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgdG9wOiAwO1xcclxcbiAgICBsZWZ0OiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHdpZHRoOiAxMDB2dztcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xcclxcblxcclxcbiAgICBjYW52YXMge1xcclxcbiAgICAgIC8vIGJvcmRlcjogMXB4IHNvbGlkO1xcclxcbiAgICAgIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLDAsMCwwKTtcXHJcXG4gICAgICB1c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gICAgICB0b3VjaC1hY3Rpb246IG5vbmU7XFxyXFxuICAgICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gICAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xcclxcbiAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgICBwYWRkaW5nOiAwO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbmJvZHkge1xcclxcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xcclxcbn1cXHJcXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgcmV0dXJuIFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChjb250ZW50LCBcIn1cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiAobW9kdWxlcywgbWVkaWFRdWVyeSwgZGVkdXBlKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItZGVzdHJ1Y3R1cmluZ1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IG1vZHVsZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19pXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udGludWVcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYVF1ZXJ5KSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMl0gPSBcIlwiLmNvbmNhdChtZWRpYVF1ZXJ5LCBcIiBhbmQgXCIpLmNvbmNhdChpdGVtWzJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9pID0gYXJyICYmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl0pOyBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9zLCBfZTsgdHJ5IHsgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSkge1xuICB2YXIgX2l0ZW0gPSBfc2xpY2VkVG9BcnJheShpdGVtLCA0KSxcbiAgICAgIGNvbnRlbnQgPSBfaXRlbVsxXSxcbiAgICAgIGNzc01hcHBpbmcgPSBfaXRlbVszXTtcblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJpbXBvcnQgYXBpIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICAgICAgICBpbXBvcnQgY29udGVudCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5zY3NzXCI7XG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuaW5zZXJ0ID0gXCJoZWFkXCI7XG5vcHRpb25zLnNpbmdsZXRvbiA9IGZhbHNlO1xuXG52YXIgdXBkYXRlID0gYXBpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY29udGVudC5sb2NhbHMgfHwge307IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc09sZElFID0gZnVuY3Rpb24gaXNPbGRJRSgpIHtcbiAgdmFyIG1lbW87XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSgpIHtcbiAgICBpZiAodHlwZW9mIG1lbW8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuICAgICAgLy8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuICAgICAgLy8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuICAgICAgLy8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcbiAgICAgIG1lbW8gPSBCb29sZWFuKHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn0oKTtcblxudmFyIGdldFRhcmdldCA9IGZ1bmN0aW9uIGdldFRhcmdldCgpIHtcbiAgdmFyIG1lbW8gPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9yaXplKHRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1t0YXJnZXRdO1xuICB9O1xufSgpO1xuXG52YXIgc3R5bGVzSW5Eb20gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRvbS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRvbVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdXG4gICAgfTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXNJbkRvbS5wdXNoKHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogYWRkU3R5bGUob2JqLCBvcHRpb25zKSxcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBvcHRpb25zLmF0dHJpYnV0ZXMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLm5vbmNlID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gJ3VuZGVmaW5lZCcgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgICBpZiAobm9uY2UpIHtcbiAgICAgIGF0dHJpYnV0ZXMubm9uY2UgPSBub25jZTtcbiAgICB9XG4gIH1cblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICB9KTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy5pbnNlcnQoc3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQob3B0aW9ucy5pbnNlcnQgfHwgJ2hlYWQnKTtcblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICAgIH1cblxuICAgIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbnZhciByZXBsYWNlVGV4dCA9IGZ1bmN0aW9uIHJlcGxhY2VUZXh0KCkge1xuICB2YXIgdGV4dFN0b3JlID0gW107XG4gIHJldHVybiBmdW5jdGlvbiByZXBsYWNlKGluZGV4LCByZXBsYWNlbWVudCkge1xuICAgIHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcbiAgICByZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcbiAgfTtcbn0oKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG4gIHZhciBjc3MgPSByZW1vdmUgPyAnJyA6IG9iai5tZWRpYSA/IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIikuY29uY2F0KG9iai5jc3MsIFwifVwiKSA6IG9iai5jc3M7IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG4gICAgaWYgKGNoaWxkTm9kZXNbaW5kZXhdKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZSwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBvYmouY3NzO1xuICB2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChtZWRpYSkge1xuICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdtZWRpYScpO1xuICB9XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyIHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlO1xuICB2YXIgdXBkYXRlO1xuICB2YXIgcmVtb3ZlO1xuXG4gIGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuICAgIHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuICAgIHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuICAgIHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUgPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gICAgdXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblxuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZShvYmopO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307IC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuICAvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cbiAgaWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09ICdib29sZWFuJykge1xuICAgIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuICB9XG5cbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuZXdMaXN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRvbVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5Eb21bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5Eb20uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJpbXBvcnQgeyBCYXNlZE9iamVjdCB9IGZyb20gXCIuL0Jhc2VkT2JqZWN0XCJcclxuaW1wb3J0IHsgZHJhd0JveCwgZHJhd1RleHQgfSBmcm9tIFwiLi9saWJzL2RyYXdIZWxwZXJzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXNlZEJ1dHRvbiBleHRlbmRzIEJhc2VkT2JqZWN0IHtcclxuXHJcbiAgeDogbnVtYmVyID0gMFxyXG4gIHk6IG51bWJlciA9IDBcclxuICB3aWR0aDogbnVtYmVyID0gMTAwXHJcbiAgaGVpZ2h0OiBudW1iZXIgPSA1MFxyXG4gIGZpbGxDb2xvcjogc3RyaW5nID0gJyM3NzcnXHJcbiAgaG92ZXJDb2xvcjogc3RyaW5nID0gJyMzMzMnXHJcbiAgZm9jdXNDb2xvcjogc3RyaW5nID0gJyMwMDAnXHJcbiAgc3Ryb2tlV2lkdGg6IG51bWJlciA9IDBcclxuICBzdHJva2VDb2xvcjogc3RyaW5nID0gJydcclxuXHJcbiAgaG92ZXJlZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIHRleHRDb2xvcjogc3RyaW5nID0gJyNmZmYnXHJcbiAgYnV0dG9uVGV4dDogc3RyaW5nID0gJ0NsaWNrIE1lJ1xyXG4gIHN0eWxlOiBzdHJpbmcgPSAnJ1xyXG4gIHdlaWdodDogc3RyaW5nID0gJ2JvbGQnXHJcbiAgZm9udFNpemU6IG51bWJlciA9IDE2XHJcbiAgZm9udEZhbWlseTogc3RyaW5nID0gJ3NhbnMtc2VyaWYnXHJcblxyXG4gIGNsaWNrRnVuY3Rpb246ICgpID0+IHZvaWQgPSAoKSA9PiBudWxsXHJcbiAgaG9sZEZ1bmN0aW9uOiAoKSA9PiB2b2lkID0gKCkgPT4gbnVsbFxyXG5cclxuICBpbml0aWFsaXplKCkgeyB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgY29uc3QgeDEgPSB0aGlzLnhcclxuICAgIGNvbnN0IHkxID0gdGhpcy55XHJcbiAgICBjb25zdCB4MiA9IHRoaXMueCArIHRoaXMud2lkdGhcclxuICAgIGNvbnN0IHkyID0gdGhpcy55ICsgdGhpcy5oZWlnaHRcclxuICAgIGNvbnN0IHt4LHl9ID0gdGhpcy5nYW1lUmVmLm1vdXNlSW5mb1xyXG4gICAgdGhpcy5ob3ZlcmVkID0geCA+IHgxICYmIHggPCB4MiAmJiB5ID4geTEgJiYgeSA8IHkyXHJcblxyXG4gICAgaWYodGhpcy5ob3ZlcmVkICYmIHRoaXMuZ2FtZVJlZi5tb3VzZUluZm8ubW91c2VEb3duKSB7XHJcbiAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWVcclxuICAgICAgdGhpcy5ob2xkRnVuY3Rpb24oKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmhvdmVyZWQgJiYgdGhpcy5mb2N1c2VkICYmICF0aGlzLmdhbWVSZWYubW91c2VJbmZvLm1vdXNlRG93bikge1xyXG4gICAgICB0aGlzLmNsaWNrRnVuY3Rpb24oKVxyXG4gICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2VcclxuICAgIH1cclxuICB9XHJcbiAgZHJhdygpIHtcclxuICAgIGRyYXdCb3goe1xyXG4gICAgICBjOiB0aGlzLmdhbWVSZWYuY3R4LFxyXG4gICAgICB4OiB0aGlzLngsXHJcbiAgICAgIHk6IHRoaXMueSxcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgIGZpbGxDb2xvcjogdGhpcy5ob3ZlcmVkICYmIHRoaXMuZm9jdXNlZCA/IHRoaXMuZm9jdXNDb2xvciA6IHRoaXMuaG92ZXJlZCA/IHRoaXMuaG92ZXJDb2xvciA6IHRoaXMuZmlsbENvbG9yXHJcbiAgICB9KVxyXG5cclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogKHRoaXMueCArIHRoaXMueCArIHRoaXMud2lkdGgpLzIsXHJcbiAgICAgIHk6ICh0aGlzLnkgKyB0aGlzLnkgKyB0aGlzLmhlaWdodCkvMiArIHRoaXMuZm9udFNpemUvMyxcclxuICAgICAgYWxpZ246J2NlbnRlcicsXHJcbiAgICAgIGZpbGxDb2xvcjogdGhpcy50ZXh0Q29sb3IsXHJcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlLFxyXG4gICAgICB3ZWlnaHQ6IHRoaXMud2VpZ2h0LFxyXG4gICAgICBmb250RmFtaWx5OiB0aGlzLmZvbnRGYW1pbHksXHJcbiAgICAgIGZvbnRTaXplOiAxNixcclxuICAgICAgdGV4dDogdGhpcy5idXR0b25UZXh0XHJcbiAgICB9KVxyXG5cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQmFzZWRMZXZlbCB9IGZyb20gXCIuL0Jhc2VkTGV2ZWxcIjtcclxuaW1wb3J0IHsgQmFzZWRTb3VuZHMgfSBmcm9tIFwiLi9CYXNlZFNvdW5kc1wiO1xyXG5pbXBvcnQgeyBnZXRDbGlja1Bvc2l0aW9uLCBnZXRUb3VjaFBvc2l0aW9uIH0gZnJvbSBcIi4vbGlicy9tYXRoSGVscGVyc1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBnYW1lU2V0dGluZ3Mge1xyXG4gIHdpZHRoPzogbnVtYmVyXHJcbiAgaGVpZ2h0PzogbnVtYmVyXHJcbiAgY2FudmFzRWxlbWVudElkPzogc3RyaW5nXHJcbiAgbGV2ZWxzPzogeyBrZXk6IHN0cmluZywgbGV2ZWw6IGFueSB9W11cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCYXNlZEdhbWVUeXBlIHtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBnYW1lQWN0aXZlOiBib29sZWFuO1xyXG4gIHNvdW5kUGxheWVyOiBCYXNlZFNvdW5kcztcclxuXHJcbiAgZ2FtZVdpZHRoOiBudW1iZXI7XHJcbiAgZ2FtZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBsYXN0VXBkYXRlOiBudW1iZXI7XHJcbiAgdXBkYXRlRGlmZjogbnVtYmVyO1xyXG4gIHVwZGF0ZVRpY2s6IG51bWJlcjtcclxuICBkaWZmTXVsdGk6IG51bWJlcjtcclxuXHJcbiAgcHJlc3NlZEtleXM6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9XHJcblxyXG4gIGNyZWF0ZUNhbnZhczogKCkgPT4gdm9pZDtcclxuICBjcmVhdGVDb250ZXh0RnJvbUVsZW1lbnQ6IChlOiBhbnkpID0+IHZvaWQ7XHJcbiAgZW5hYmxlS2V5Ym9hcmQ6ICgpID0+IHZvaWQ7XHJcbiAgdGljazogKCkgPT4gdm9pZDtcclxuICBzdGFydDogKCkgPT4gdm9pZDtcclxuICB1cGRhdGU6ICgpID0+IHZvaWQ7XHJcbiAgZHJhdzogKCkgPT4gdm9pZDtcclxuICBnYW1lTG9vcDogKCkgPT4gdm9pZDtcclxuICBsb2FkTGV2ZWw6IChsZXZlbDogc3RyaW5nKSA9PiB2b2lkO1xyXG4gIGxldmVsczogeyBba2V5OiBzdHJpbmddOiBCYXNlZExldmVsIH1cclxuICBhY3RpdmVMZXZlbDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZWRHYW1lIGltcGxlbWVudHMgQmFzZWRHYW1lVHlwZSB7XHJcbiAgY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgZ2FtZUFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBzb3VuZFBsYXllcjogQmFzZWRTb3VuZHM7XHJcblxyXG4gIGdhbWVXaWR0aDogbnVtYmVyO1xyXG4gIGdhbWVIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgbGFzdFVwZGF0ZTogbnVtYmVyID0gRGF0ZS5ub3coKVxyXG4gIHVwZGF0ZURpZmY6IG51bWJlciA9IERhdGUubm93KClcclxuICB1cGRhdGVUaWNrOiBudW1iZXIgPSAxMDAwIC8gNjBcclxuICBkaWZmTXVsdGk6IG51bWJlciA9IHRoaXMudXBkYXRlRGlmZiAvIHRoaXMudXBkYXRlVGlja1xyXG5cclxuICBrZXlCb2FyZEVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHByZXNzZWRLZXlzOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9XHJcblxyXG4gIG1vdXNlRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgbW91c2VJbmZvOiB7XHJcbiAgICB4OiBudW1iZXIsIHk6IG51bWJlcixcclxuICAgIG1vdXNlRG93bjogYm9vbGVhblxyXG4gIH0gPSB7IHg6IC0xMDAsIHk6IC0xMDAsIG1vdXNlRG93bjogZmFsc2UgfVxyXG5cclxuICBsZXZlbHM6IHsgW2tleTogc3RyaW5nXTogQmFzZWRMZXZlbCB9ID0ge31cclxuICBhY3RpdmVMZXZlbDogc3RyaW5nID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiBnYW1lU2V0dGluZ3MpIHtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IHRoaXMuY3JlYXRlQ2FudmFzKClcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCA9IHNldHRpbmdzLndpZHRoID8gc2V0dGluZ3Mud2lkdGggOiAyMDBcclxuICAgIHRoaXMuZ2FtZVdpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoXHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gc2V0dGluZ3MuaGVpZ2h0ID8gc2V0dGluZ3MuaGVpZ2h0IDogNDAwXHJcbiAgICB0aGlzLmdhbWVIZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICBjb25zdCBiYXNlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsIHwgRG9jdW1lbnQgPSBzZXR0aW5ncy5jYW52YXNFbGVtZW50SWQgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZXR0aW5ncy5jYW52YXNFbGVtZW50SWQpIDogZG9jdW1lbnRcclxuICAgIGlmIChiYXNlRWxlbWVudCkge1xyXG4gICAgICBiYXNlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhc0VsZW1lbnQpXHJcbiAgICB9XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuY3JlYXRlQ29udGV4dEZyb21FbGVtZW50KHRoaXMuY2FudmFzRWxlbWVudClcclxuXHJcbiAgICB0aGlzLnNvdW5kUGxheWVyID0gbmV3IEJhc2VkU291bmRzKClcclxuXHJcbiAgICBpZiAoc2V0dGluZ3MubGV2ZWxzKSB7XHJcbiAgICAgIHNldHRpbmdzLmxldmVscy5mb3JFYWNoKChsZXZlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMubGV2ZWxzW2xldmVsLmtleV0gPSBuZXcgbGV2ZWwubGV2ZWwoeyBrZXk6IGxldmVsLmtleSwgZ2FtZVJlZjogdGhpcyB9KVxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUxldmVsID09ICcnKSB7XHJcbiAgICAgICAgICB0aGlzLmFjdGl2ZUxldmVsID0gbGV2ZWwua2V5XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2FtZUxvb3AgPSB0aGlzLmdhbWVMb29wLmJpbmQodGhpcylcclxuICAgIHRoaXMudXBkYXRlID0gdGhpcy51cGRhdGUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy50aWNrID0gdGhpcy50aWNrLmJpbmQodGhpcylcclxuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpXHJcbiAgfVxyXG5cclxuICBjcmVhdGVDYW52YXMoKTogYW55IHtcclxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29udGV4dEZyb21FbGVtZW50KGU6IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gZS5nZXRDb250ZXh0KCcyZCcpXHJcbiAgfVxyXG5cclxuICBlbmFibGVNb3VzZSgpIHtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcclxuICAgICAgdGhpcy5tb3VzZUluZm8ubW91c2VEb3duID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcclxuICAgICAgW3RoaXMubW91c2VJbmZvLngsIHRoaXMubW91c2VJbmZvLnldID0gZ2V0Q2xpY2tQb3NpdGlvbihlKVxyXG4gICAgfSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGUgPT4ge1xyXG4gICAgICB0aGlzLm1vdXNlSW5mby5tb3VzZURvd24gPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZSA9PiB7XHJcbiAgICAgIC8vIFt0aGlzLm1vdXNlSW5mby54LHRoaXMubW91c2VJbmZvLnldID0gZ2V0Q2xpY2tQb3NpdGlvbihlKVxyXG4gICAgICAvLyBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgW3RoaXMubW91c2VJbmZvLngsIHRoaXMubW91c2VJbmZvLnldID0gZ2V0VG91Y2hQb3NpdGlvbihlKVxyXG4gICAgICB0aGlzLm1vdXNlSW5mby5tb3VzZURvd24gPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGUgPT4ge1xyXG4gICAgICBbdGhpcy5tb3VzZUluZm8ueCwgdGhpcy5tb3VzZUluZm8ueV0gPSBnZXRUb3VjaFBvc2l0aW9uKGUpXHJcbiAgICB9KTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGUgPT4ge1xyXG4gICAgICAvLyBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgdGhpcy5tb3VzZUluZm8ubW91c2VEb3duID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGVuYWJsZUtleWJvYXJkKCkge1xyXG4gICAgaWYgKHRoaXMua2V5Qm9hcmRFbmFibGVkKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMucHJlc3NlZEtleXNbZS5jb2RlXSA9IHRydWVcclxuICAgICAgLy8gdGhpcy5wcmVzc2VkS2V5c1tlLmtleUNvZGVdID0gdHJ1ZVxyXG4gICAgfSlcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcclxuICAgICAgdGhpcy5wcmVzc2VkS2V5c1tlLmNvZGVdID0gZmFsc2VcclxuICAgICAgLy8gdGhpcy5wcmVzc2VkS2V5c1tlLmtleUNvZGVdID0gZmFsc2VcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB0aWNrKCkge1xyXG4gICAgdGhpcy51cGRhdGVEaWZmID0gRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZVxyXG4gICAgdGhpcy5kaWZmTXVsdGkgPSB0aGlzLnVwZGF0ZURpZmYgLyB0aGlzLnVwZGF0ZVRpY2tcclxuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KClcclxuICB9XHJcblxyXG4gIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dhbWUgc3RhcnQnKVxyXG4gICAgdGhpcy5zb3VuZFBsYXllci5pbml0aWFsaXplKClcclxuICAgIHRoaXMuZ2FtZUFjdGl2ZSA9IHRydWVcclxuICAgIGF3YWl0IHRoaXMubGV2ZWxzW3RoaXMuYWN0aXZlTGV2ZWxdLmluaXRpYWxpemUoKVxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmdhbWVMb29wKVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dhbWUgdXBkYXRlJylcclxuICAgIHRoaXMudGljaygpXHJcbiAgICB0aGlzLmxldmVsc1t0aGlzLmFjdGl2ZUxldmVsXS51cGRhdGUoKVxyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdnYW1lIGRyYXcnKVxyXG4gICAgdGhpcy5sZXZlbHNbdGhpcy5hY3RpdmVMZXZlbF0uZHJhdygpXHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkTGV2ZWwobGV2ZWw6IHN0cmluZykge1xyXG4gICAgdGhpcy5sZXZlbHNbdGhpcy5hY3RpdmVMZXZlbF0udGVhckRvd24oKVxyXG4gICAgdGhpcy5hY3RpdmVMZXZlbCA9IGxldmVsXHJcbiAgICBhd2FpdCB0aGlzLmxldmVsc1t0aGlzLmFjdGl2ZUxldmVsXS5pbml0aWFsaXplKClcclxuICB9XHJcblxyXG4gIGdhbWVMb29wKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dhbWUgbG9vcCcpXHJcbiAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB0aGlzLmRyYXcoKVxyXG4gICAgaWYgKHRoaXMuZ2FtZUFjdGl2ZSkge1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZ2FtZUxvb3ApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBCYXNlZEdhbWUgfSBmcm9tIFwiLi4vZW5naW5lL0Jhc2VkRW5naW5lXCI7XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCYXNlZExldmVsVHlwZSB7XHJcbiAgbGV2ZWxLZXk6IHN0cmluZztcclxuICBnYW1lUmVmOiBCYXNlZEdhbWU7XHJcbiAgaW5pdGlhbGl6ZTogKCkgPT4gdm9pZDtcclxuICB1cGRhdGU6ICgpID0+IHZvaWQ7XHJcbiAgZHJhdzogKCkgPT4gdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VkTGV2ZWwge1xyXG4gIGxldmVsS2V5OiBzdHJpbmc7XHJcbiAgZ2FtZVJlZjogQmFzZWRHYW1lO1xyXG5cclxuICBjb25zdHJ1Y3RvcihsZXZlbFNldHRpbmdzOiB7IGtleTogc3RyaW5nLCBnYW1lUmVmOiBCYXNlZEdhbWUgfSkge1xyXG4gICAgdGhpcy5sZXZlbEtleSA9IGxldmVsU2V0dGluZ3Mua2V5XHJcbiAgICB0aGlzLmdhbWVSZWYgPSBsZXZlbFNldHRpbmdzLmdhbWVSZWZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSA9IHRoaXMuaW5pdGlhbGl6ZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnVwZGF0ZSA9IHRoaXMudXBkYXRlLmJpbmQodGhpcylcclxuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnRlYXJEb3duID0gdGhpcy50ZWFyRG93bi5iaW5kKHRoaXMpXHJcbiAgfVxyXG4gIGluaXRpYWxpemUoKSB7IH1cclxuICB1cGRhdGUoKSB7IH1cclxuICBkcmF3KCkgeyB9XHJcbiAgdGVhckRvd24oKSB7IH1cclxufVxyXG4iLCJpbXBvcnQgeyBCYXNlZEdhbWUgfSBmcm9tIFwiLi9CYXNlZEVuZ2luZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VkT2JqZWN0IHtcclxuICBvYmplY3RLZXk6IHN0cmluZztcclxuICB4OiBudW1iZXIgPSAwXHJcbiAgeTogbnVtYmVyID0gMFxyXG4gIGdhbWVSZWY6IEJhc2VkR2FtZVxyXG4gIGNvbnN0cnVjdG9yKG9iamVjdFNldHRpbmdzOiB7IGtleTogc3RyaW5nLCBnYW1lUmVmOiBCYXNlZEdhbWUsIG9wdGlvbnM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9IH0pIHtcclxuICAgIHRoaXMub2JqZWN0S2V5ID0gb2JqZWN0U2V0dGluZ3Mua2V5XHJcbiAgICB0aGlzLmdhbWVSZWYgPSBvYmplY3RTZXR0aW5ncy5nYW1lUmVmXHJcbiAgICB0aGlzLmluaXRpYWxpemUgPSB0aGlzLmluaXRpYWxpemUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy51cGRhdGUgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKVxyXG4gICAgdGhpcy50ZWFyRG93biA9IHRoaXMudGVhckRvd24uYmluZCh0aGlzKVxyXG4gIH1cclxuICBpbml0aWFsaXplKCkgeyB9XHJcbiAgdXBkYXRlKCkgeyB9XHJcbiAgZHJhdygpIHsgfVxyXG4gIHRlYXJEb3duKCkgeyB9XHJcbn1cclxuIiwiZGVjbGFyZSBnbG9iYWwge1xyXG4gIGludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgd2Via2l0QXVkaW9Db250ZXh0OiB0eXBlb2YgQXVkaW9Db250ZXh0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZWRTb3VuZHMge1xyXG4gIGF1ZGlvQ29udGV4dDogQXVkaW9Db250ZXh0O1xyXG4gIGJ1ZmZlcjogQXVkaW9CdWZmZXI7XHJcbiAgY2hhbm5lbERhdGE6IEZsb2F0MzJBcnJheTtcclxuICBwcmltYXJ5R2FpbkNvbnRyb2w6IEdhaW5Ob2RlO1xyXG4gIGVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGNvbnN0IGF1ZGlvQyA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dFxyXG4gICAgLy8gdGhpcy5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KClcclxuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IGF1ZGlvQygpXHJcbiAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcihcclxuICAgICAgMSxcclxuICAgICAgdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSAqIDEsXHJcbiAgICAgIHRoaXMuYXVkaW9Db250ZXh0LnNhbXBsZVJhdGVcclxuICAgIClcclxuICAgIHRoaXMuY2hhbm5lbERhdGEgPSB0aGlzLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKVxyXG5cclxuICAgIHRoaXMucHJpbWFyeUdhaW5Db250cm9sID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpXHJcbiAgICB0aGlzLnByaW1hcnlHYWluQ29udHJvbC5nYWluLnNldFZhbHVlQXRUaW1lKDAuNSwgMClcclxuICAgIHRoaXMucHJpbWFyeUdhaW5Db250cm9sLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKCkge1xyXG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5uZWxEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgIHRoaXMuY2hhbm5lbERhdGFbaV0gPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIC8vIHBsYXkoKXtcclxuICAvLyAgIGNvbnN0IHdoaXRlTm9pc2VTb3VyY2UgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxyXG4gIC8vICAgd2hpdGVOb2lzZVNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlclxyXG4gIC8vICAgd2hpdGVOb2lzZVNvdXJjZS5jb25uZWN0KHRoaXMucHJpbWFyeUdhaW5Db250cm9sKVxyXG4gIC8vICAgd2hpdGVOb2lzZVNvdXJjZS5zdGFydCgpXHJcbiAgLy8gfVxyXG5cclxuICBwbGF5Tm90ZShzb3VuZEZyZXF1ZW5jeTogbnVtYmVyID0gMTUwLCBsZW5ndGg6IG51bWJlciA9IC4yLCBzb3VuZFR5cGU6ICdzYXd0b290aCcgfCAnc2luZScgfCAndHJpYW5nbGUnIHwgJ3NxdWFyZScgfCAnJyA9ICcnKSB7XHJcbiAgICBpZighdGhpcy5lbmFibGVkKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3Qga2lja1NvdW5kID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpXHJcbiAgICBpZihzb3VuZFR5cGUpIHtcclxuICAgICAga2lja1NvdW5kLnR5cGUgPSBzb3VuZFR5cGVcclxuICAgIH0vLyBlbHNlIHtcclxuICAgICAgLy8ga2lja1NvdW5kLmZyZXF1ZW5jeS5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKFxyXG4gICAgICAvLyAgIDAuMDAxLFxyXG4gICAgICAvLyAgIHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgbGVuZ3RoXHJcbiAgICAgIC8vIClcclxuICAgIC8vfVxyXG4gICAgLy8ga2lja1NvdW5kLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShzb3VuZEZyZXF1ZW5jeSwgMClcclxuICAgIGtpY2tTb3VuZC5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoc291bmRGcmVxdWVuY3ksIHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKVxyXG5cclxuICAgIGNvbnN0IGtpY2tHYWluID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpXHJcbiAgICBraWNrR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDEsIHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKVxyXG4gICAga2lja0dhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjAxLCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGxlbmd0aClcclxuICAgIC8vIGtpY2tHYWluLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAxLCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGxlbmd0aClcclxuXHJcbiAgICBraWNrU291bmQuY29ubmVjdChraWNrR2FpbilcclxuICAgIGtpY2tHYWluLmNvbm5lY3QodGhpcy5wcmltYXJ5R2FpbkNvbnRyb2wpXHJcbiAgICAvLyBraWNrU291bmQuY29ubmVjdCh0aGlzLnByaW1hcnlHYWluQ29udHJvbClcclxuICAgIGtpY2tTb3VuZC5zdGFydCgpXHJcbiAgICBraWNrU291bmQuc3RvcCh0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGxlbmd0aClcclxuICB9XHJcblxyXG4gIHBsYXlDdXN0b21Tb3VuZChmcmVxdWVuY3lDaGFydDoge2Y6IG51bWJlciwgdDogbnVtYmVyfVtdLCBzb3VuZFR5cGU6ICdzYXd0b290aCcgfCAnc2luZScgfCAndHJpYW5nbGUnIHwgJ3NxdWFyZScgfCAnJyA9ICcnLCBlbmRlZENhbGxiYWNrPzogKCkgPT4gdm9pZCApIHtcclxuICAgIGlmKCF0aGlzLmVuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXN0b21Tb3VuZCA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKVxyXG4gICAgaWYoc291bmRUeXBlKSB7XHJcbiAgICAgIGN1c3RvbVNvdW5kLnR5cGUgPSBzb3VuZFR5cGVcclxuICAgIH1cclxuICAgIGxldCBsZW5ndGggPSAwXHJcblxyXG4gICAgZnJlcXVlbmN5Q2hhcnQuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgY3VzdG9tU291bmQuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKHguZiwgdGhpcy5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBsZW5ndGggKyB4LnQpXHJcbiAgICAgIGxlbmd0aCArPSB4LnRcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3Qgc291bmRHYWluID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpXHJcbiAgICBzb3VuZEdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgxLCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSlcclxuICAgIHNvdW5kR2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDEsIHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgbGVuZ3RoKVxyXG4gICAgY3VzdG9tU291bmQuY29ubmVjdChzb3VuZEdhaW4pXHJcbiAgICBzb3VuZEdhaW4uY29ubmVjdCh0aGlzLnByaW1hcnlHYWluQ29udHJvbClcclxuXHJcbiAgICBpZihlbmRlZENhbGxiYWNrKSB7XHJcbiAgICAgIGN1c3RvbVNvdW5kLm9uZW5kZWQgPSBlbmRlZENhbGxiYWNrXHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tU291bmQuc3RhcnQoKVxyXG4gICAgY3VzdG9tU291bmQuc3RvcCh0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGxlbmd0aClcclxuXHJcbiAgICByZXR1cm4gY3VzdG9tU291bmRcclxuICB9XHJcblxyXG4gIGFzeW5jIGxvYWRTb3VuZChzb3VuZFVybDogc3RyaW5nID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9UaW5hU29sdGFuaWFuL1BhdGF0YXAvbWFzdGVyL3NvdW5kcy9idWJibGVzLm1wMycpIHtcclxuICAgIGlmKCF0aGlzLmVuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCByYXdTb3VuZCA9IGF3YWl0IGZldGNoKHNvdW5kVXJsKVxyXG4gICAgY29uc3Qgc291bmRCdWZmZXIgPSBhd2FpdCByYXdTb3VuZC5hcnJheUJ1ZmZlcigpXHJcbiAgICBjb25zdCBkZWNvZGVkQnVmZmVyID0gYXdhaXQgdGhpcy5hdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHNvdW5kQnVmZmVyKVxyXG5cclxuICAgIGNvbnN0IG5ld0J1ZmZlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXHJcbiAgICBuZXdCdWZmZXIuYnVmZmVyID0gZGVjb2RlZEJ1ZmZlclxyXG4gICAgbmV3QnVmZmVyLmNvbm5lY3QodGhpcy5wcmltYXJ5R2FpbkNvbnRyb2wpXHJcbiAgICBuZXdCdWZmZXIuc3RhcnQoKVxyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgZGVnVG9SYWQgfSBmcm9tIFwiLi9tYXRoSGVscGVyc1wiXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0ltYWdlKHNldHRpbmdzOiB7XHJcbiAgYzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gIGltZzogQ2FudmFzSW1hZ2VTb3VyY2UsXHJcbiAgc3g6IG51bWJlcixcclxuICBzeTogbnVtYmVyLFxyXG4gIHNXaWR0aDogbnVtYmVyLFxyXG4gIHNIZWlnaHQ6IG51bWJlcixcclxuICBkeDogbnVtYmVyLFxyXG4gIGR5OiBudW1iZXIsXHJcbiAgZFdpZHRoOiBudW1iZXIsXHJcbiAgZEhlaWdodDogbnVtYmVyLFxyXG4gIHNwcml0ZTogc3RyaW5nXHJcbn0pIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgICBjLFxyXG4gICAgICAgIHNwcml0ZSxcclxuICAgICAgICBzeCxcclxuICAgICAgICBzeSxcclxuICAgICAgICBzV2lkdGgsXHJcbiAgICAgICAgc0hlaWdodCxcclxuICAgICAgICBkeCxcclxuICAgICAgICBkeSxcclxuICAgICAgICBkV2lkdGgsXHJcbiAgICAgICAgZEhlaWdodCxcclxuICAgICAgICBpbWdcclxuICAgIH0gPSBzZXR0aW5nc1xyXG4gICAgYy5kcmF3SW1hZ2UoaW1nLCBzeCwgc3ksIHNXaWR0aCwgc0hlaWdodCwgZHgsIGR5LCBkV2lkdGgsIGRIZWlnaHQpXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTcHJpdGUoc3ByaXRlT3B0aW9uczogYW55KSB7XHJcbiAgICBjb25zdCBzcHJpdGVJbWcgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7cmVzb2x2ZShpbWcpfVxyXG4gICAgICAgIGltZy5vbmVycm9yID0gKGVycikgPT4ge3JlamVjdChlcnIpfVxyXG4gICAgICAgIGltZy5zcmMgPSBzcHJpdGVPcHRpb25zLnNwcml0ZVxyXG4gICAgfSlcclxuICAgIHNwcml0ZU9wdGlvbnMuaW1nID0gc3ByaXRlSW1nXHJcbiAgICByZXR1cm4gc3ByaXRlT3B0aW9uc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0xpbmUoc2V0dGluZ3M6IHtcclxuICBjOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgeDogbnVtYmVyLFxyXG4gIHk6IG51bWJlcixcclxuICB0b1g6IG51bWJlcixcclxuICB0b1k6IG51bWJlcixcclxuICBzdHJva2VXaWR0aDogbnVtYmVyLFxyXG4gIHN0cm9rZUNvbG9yOiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHtcclxuICAgIGMsXHJcbiAgICB4LFxyXG4gICAgeSxcclxuICAgIHRvWCxcclxuICAgIHRvWSxcclxuICAgIHN0cm9rZVdpZHRoLFxyXG4gICAgc3Ryb2tlQ29sb3JcclxuICB9ID0gc2V0dGluZ3NcclxuICBjLmJlZ2luUGF0aCgpXHJcbiAgYy5tb3ZlVG8oeCwgeSk7XHJcbiAgYy5saW5lVG8odG9YLCB0b1kpO1xyXG4gIGMuc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gIGMubGluZVdpZHRoID0gc3Ryb2tlV2lkdGhcclxuICBjLnN0cm9rZSgpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Q2lyY2xlKHNldHRpbmdzOiB7XHJcbiAgYzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gIHg6IG51bWJlcixcclxuICB5OiBudW1iZXIsXHJcbiAgcmFkaXVzOiBudW1iZXIsXHJcbiAgc3RhcnRBbmdsZT86IG51bWJlcixcclxuICBlbmRBbmdsZT86IG51bWJlcixcclxuICBmaWxsQ29sb3I/OiBzdHJpbmcsXHJcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXIsXHJcbiAgc3Ryb2tlQ29sb3I/OiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHtcclxuICAgIGMsIHgsIHksIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGZpbGxDb2xvciwgc3Ryb2tlV2lkdGgsIHN0cm9rZUNvbG9yXHJcbiAgfSA9IHNldHRpbmdzXHJcbiAgYy5iZWdpblBhdGgoKVxyXG4gIGMuYXJjKHgsIHksIHJhZGl1cywgc3RhcnRBbmdsZSA/IGRlZ1RvUmFkKHN0YXJ0QW5nbGUpIDogMCwgZW5kQW5nbGUgPyBkZWdUb1JhZChlbmRBbmdsZSkgOiAyICogTWF0aC5QSSlcclxuICBpZiAoZmlsbENvbG9yKSB7XHJcbiAgICBjLmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgYy5maWxsKClcclxuICB9XHJcbiAgaWYgKHN0cm9rZVdpZHRoICYmIHN0cm9rZUNvbG9yKSB7XHJcbiAgICBjLnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgIGMubGluZVdpZHRoID0gc3Ryb2tlV2lkdGhcclxuICAgIGMuc3Ryb2tlKClcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Qm94KHNldHRpbmdzOiB7XHJcbiAgYzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gIHg6IG51bWJlcixcclxuICB5OiBudW1iZXIsXHJcbiAgd2lkdGg6IG51bWJlcixcclxuICBoZWlnaHQ6IG51bWJlcixcclxuICBmaWxsQ29sb3I/OiBzdHJpbmcsXHJcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXIsXHJcbiAgc3Ryb2tlQ29sb3I/OiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHtcclxuICAgIGMsIHgsIHksIHdpZHRoLCBoZWlnaHQsIGZpbGxDb2xvciwgc3Ryb2tlV2lkdGgsIHN0cm9rZUNvbG9yXHJcbiAgfSA9IHNldHRpbmdzXHJcbiAgYy5iZWdpblBhdGgoKVxyXG4gIGMucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG4gIGlmIChmaWxsQ29sb3IpIHtcclxuICAgIGMuZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICBjLmZpbGwoKVxyXG4gIH1cclxuXHJcbiAgaWYgKHN0cm9rZVdpZHRoICYmIHN0cm9rZUNvbG9yKSB7XHJcbiAgICBjLnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgIGMubGluZVdpZHRoID0gc3Ryb2tlV2lkdGhcclxuICAgIGMuc3Ryb2tlKClcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3VGV4dChzZXR0aW5nczoge1xyXG4gIGM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICB4OiBudW1iZXIsXHJcbiAgeTogbnVtYmVyLFxyXG4gIGZpbGxDb2xvcjogc3RyaW5nLFxyXG4gIGFsaWduOiAnY2VudGVyJyB8ICAnbGVmdCcgfCAncmlnaHQnLFxyXG4gIHRleHQ6IHN0cmluZyxcclxuICBzdHJva2VXaWR0aD86IG51bWJlcixcclxuICBzdHJva2VDb2xvcj86IHN0cmluZyxcclxuICBmb250RmFtaWx5OiBzdHJpbmcsXHJcbiAgZm9udFNpemU6IG51bWJlcixcclxuICBzdHlsZT86IHN0cmluZyxcclxuICB3ZWlnaHQ/OiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHtcclxuICAgICAgIGMsXHJcbiAgICAgICB4LFxyXG4gICAgICAgeSxcclxuICAgICAgIGZpbGxDb2xvcixcclxuICAgICAgIHN0cm9rZVdpZHRoLFxyXG4gICAgICAgc3Ryb2tlQ29sb3IsXHJcbiAgICAgICB0ZXh0LFxyXG4gICAgICAgZm9udEZhbWlseSxcclxuICAgICAgIGZvbnRTaXplLFxyXG4gICAgICAgYWxpZ24sXHJcbiAgICAgICBzdHlsZSxcclxuICAgICAgIHdlaWdodFxyXG4gICB9ID0gc2V0dGluZ3NcclxuICAgYy50ZXh0QWxpZ24gPSBhbGlnbiA/IGFsaWduIDogJ2NlbnRlcidcclxuICAgYy5mb250ID0gYCR7c3R5bGUgPyBzdHlsZSArICcgJyA6ICcnfSR7d2VpZ2h0ID8gd2VpZ2h0ICsgJyAnIDogJyd9JHtmb250U2l6ZX1weCAke2ZvbnRGYW1pbHl9YFxyXG5cclxuICAgaWYoZmlsbENvbG9yKSB7XHJcbiAgICAgICBjLmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgICAgYy5maWxsVGV4dCh0ZXh0LCB4LCB5KVxyXG4gICB9XHJcbiAgIGlmKHN0cm9rZVdpZHRoICYmIHN0cm9rZUNvbG9yKSB7XHJcbiAgICAgICBjLnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgICAgIGMubGluZVdpZHRoID0gc3Ryb2tlV2lkdGhcclxuICAgICAgIGMuc3Ryb2tlVGV4dCh0ZXh0LCB4LCB5KVxyXG4gICB9XHJcbn1cclxuIiwiZXhwb3J0IGludGVyZmFjZSBYWUNvb3JkaW5hdGVUeXBlIHtcclxuICB4Om51bWJlclxyXG4gIHk6bnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnQobWF4OiBudW1iZXIpIHtcclxuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsaWNrUG9zaXRpb24oZTogYW55KSB7XHJcbiAgICBjb25zdCByZWN0ID0gZS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0OyAvL3ggcG9zaXRpb24gd2l0aGluIHRoZSBlbGVtZW50LlxyXG4gICAgY29uc3QgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wOyAgLy95IHBvc2l0aW9uIHdpdGhpbiB0aGUgZWxlbWVudC5cclxuICAgIHJldHVybiBbeCwgeV1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRvdWNoUG9zaXRpb24oZTogYW55KSB7XHJcbiAgICBjb25zdCByZWN0ID0gZS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7IC8veCBwb3NpdGlvbiB3aXRoaW4gdGhlIGVsZW1lbnQuXHJcbiAgICBjb25zdCB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDsgIC8veSBwb3NpdGlvbiB3aXRoaW4gdGhlIGVsZW1lbnQuXHJcbiAgICByZXR1cm4gW3gsIHldXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW4ocDE6WFlDb29yZGluYXRlVHlwZSwgcDI6WFlDb29yZGluYXRlVHlwZSkge1xyXG4gIGNvbnN0IGEgPSBwMS54IC0gcDIueDtcclxuICBjb25zdCBiID0gcDEueSAtIHAyLnk7XHJcbiAgY29uc3QgYyA9IE1hdGguc3FydCggYSphICsgYipiICk7XHJcbiAgcmV0dXJuIGNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFuZ2xlQmV0d2VlbihwMTpYWUNvb3JkaW5hdGVUeXBlLHAyOlhZQ29vcmRpbmF0ZVR5cGUsIGRlZzpib29sZWFuID0gZmFsc2UpIHtcclxuICByZXR1cm4gZGVnID8gTWF0aC5hdGFuMihwMi55IC0gcDEueSwgcDIueCAtIHAxLngpICogMTgwIC8gTWF0aC5QSSA6IE1hdGguYXRhbjIocDIueSAtIHAxLnksIHAyLnggLSBwMS54KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcG9pbnRPbkNpcmNsZShwb2ludEFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHJhZGl1czogbnVtYmVyKXtcclxuICByZXR1cm4ge1xyXG4gICAgeDogTWF0aC5jb3MocG9pbnRBbmdsZUluUmFkaWFucykgKiByYWRpdXMsXHJcbiAgICB5OiBNYXRoLnNpbihwb2ludEFuZ2xlSW5SYWRpYW5zKSAqIHJhZGl1c1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhZFRvRGVnKHJhZHM6bnVtYmVyKSB7XHJcbiAgcmV0dXJuIHJhZHMgKiAoMTgwL01hdGguUEkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVnVG9SYWQoZGVnOm51bWJlcikge1xyXG4gIHJldHVybiBkZWcgKiAoTWF0aC5QSS8xODApO1xyXG59XHJcbiIsImltcG9ydCB7IEJhc2VkQnV0dG9uIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9CYXNlZEJ1dHRvblwiO1xyXG5pbXBvcnQgeyBCYXNlZExldmVsIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9CYXNlZExldmVsXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNwcml0ZSwgZHJhd0ltYWdlLCBkcmF3VGV4dCB9IGZyb20gXCIuLi8uLi9lbmdpbmUvbGlicy9kcmF3SGVscGVyc1wiO1xyXG5pbXBvcnQgeyBnZXRSYW5kb21JbnQgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2xpYnMvbWF0aEhlbHBlcnNcIjtcclxuXHJcbmltcG9ydCBTdGFyVXJsIGZyb20gJy4uLy4uL2Fzc2V0cy9zdGFyLnBuZydcclxuXHJcbmNvbnN0IGN1c3RvbVNvbmcgPSBbXHJcblxyXG4gIHtmOiAwLCB0OiAwfSxcclxuICB7ZjogMTUwLCB0OiAuMn0sXHJcbiAge2Y6IDIwMCwgdDogLjJ9LFxyXG4gIHtmOiAzMDAsIHQ6IC41fSxcclxuICB7ZjogNDAwLCB0OiAuMn0sXHJcbiAge2Y6IDMwMCwgdDogLjF9LFxyXG4gIHtmOiAxMDAsIHQ6IDF9LFxyXG5cclxuICB7ZjogMTUwLCB0OiAuMn0sXHJcbiAge2Y6IDIwMCwgdDogLjF9LFxyXG4gIHtmOiAxNTAsIHQ6IC4yfSxcclxuICB7ZjogMjAwLCB0OiAuMX0sXHJcbiAge2Y6IDE1MCwgdDogLjJ9LFxyXG4gIHtmOiAyMDAsIHQ6IC4xfSxcclxuICB7ZjogMTUwLCB0OiAuMn0sXHJcbiAge2Y6IDIwMCwgdDogLjF9LFxyXG5cclxuICB7ZjogNTAsIHQ6IDJ9LFxyXG4gIHtmOiAtNTAsIHQ6IDN9LFxyXG5dXHJcblxyXG5leHBvcnQgY2xhc3MgVHJvb3BhU3RhcnQgZXh0ZW5kcyBCYXNlZExldmVsIHtcclxuXHJcbiAgc3RhcnRCdXR0b246IGFueTtcclxuICBoaWdoU2NvcmU6IG51bWJlciA9IDBcclxuICBsYXN0U2NvcmU6IG51bWJlciA9IDBcclxuICBuZXdIaWdoU2NvcmU6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICBmdWxsU2NyZWVuQnRuOiBhbnk7XHJcblxyXG4gIGJnVmFsdWVzOiBhbnkgPSB7XHJcbiAgICByOiA2NCxcclxuICAgIGc6IDI0NCxcclxuICAgIGI6IDIwOFxyXG4gIH1cclxuICBjb2xvclNwZWVkOiBudW1iZXIgPSAyXHJcblxyXG4gIGFjdGl2ZVNvdW5kOiBhbnkgPSB7XHJcbiAgICBwbGF5aW5nOiBmYWxzZSxcclxuICAgIHNvdW5kUmVmOiBudWxsLFxyXG4gIH1cclxuXHJcbiAgc3RhcjogYW55O1xyXG5cclxuICBhc3luYyBpbml0aWFsaXplKCkge1xyXG4gICAgdGhpcy5uZXdIaWdoU2NvcmUgPSBmYWxzZVxyXG4gICAgdGhpcy5zdGFydEJ1dHRvbiA9IG5ldyBCYXNlZEJ1dHRvbih7XHJcbiAgICAgIGtleTogYHN0YXJ0LWJ1dHRvbmAsXHJcbiAgICAgIGdhbWVSZWY6IHRoaXMuZ2FtZVJlZixcclxuICAgIH0pXHJcbiAgICB0aGlzLnN0YXJ0QnV0dG9uLmZpbGxDb2xvciA9ICcjY2UxOTJiJ1xyXG4gICAgdGhpcy5zdGFydEJ1dHRvbi54ID0gMTAwXHJcbiAgICB0aGlzLnN0YXJ0QnV0dG9uLnkgPSB0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodCAtIDEwMFxyXG4gICAgdGhpcy5zdGFydEJ1dHRvbi5idXR0b25UZXh0ID0gJ1N0YXJ0IEdhbWUnXHJcbiAgICB0aGlzLnN0YXJ0QnV0dG9uLndpZHRoID0gdGhpcy5nYW1lUmVmLmdhbWVXaWR0aCAtIDIwMFxyXG4gICAgdGhpcy5zdGFydEJ1dHRvbi5jbGlja0Z1bmN0aW9uID0gKCkgPT4ge1xyXG4gICAgICAvLyBpZih0aGlzLmFjdGl2ZVNvdW5kLnBsYXlpbmcgJiYgdGhpcy5hY3RpdmVTb3VuZC5zb3VuZFJlZiAmJiB0aGlzLmFjdGl2ZVNvdW5kLnNvdW5kUmVmLnN0b3ApIHtcclxuICAgICAgLy8gICB0aGlzLmFjdGl2ZVNvdW5kLnNvdW5kUmVmLnN0b3AoKVxyXG4gICAgICAvLyB9XHJcbiAgICAgIHRoaXMuZ2FtZVJlZi5zb3VuZFBsYXllci5wbGF5Tm90ZSg5MDAsIC40LCAnc3F1YXJlJylcclxuICAgICAgdGhpcy5nYW1lUmVmLmxvYWRMZXZlbCgndHJvb3BhMS0xJylcclxuICAgICAgLy8gYWxlcnQoJ2dhbWUgc3RhcnRlZCcpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYkhpZ2hTY29yZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaS1zY29yZScpXHJcbiAgICBjb25zdCBiTGFzdFNjb3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhc3Qtc2NvcmUnKVxyXG4gICAgaWYoYkxhc3RTY29yZSkge1xyXG4gICAgICB0aGlzLmxhc3RTY29yZSA9IE51bWJlcihiTGFzdFNjb3JlKVxyXG4gICAgfVxyXG4gICAgaWYoYkhpZ2hTY29yZSkge1xyXG4gICAgICB0aGlzLmhpZ2hTY29yZSA9IE51bWJlcihiSGlnaFNjb3JlKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5sYXN0U2NvcmUgPiB0aGlzLmhpZ2hTY29yZSkge1xyXG4gICAgICB0aGlzLmhpZ2hTY29yZSA9IHRoaXMubGFzdFNjb3JlXHJcbiAgICAgIHRoaXMubmV3SGlnaFNjb3JlID0gdHJ1ZVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaGktc2NvcmUnLCBgJHt0aGlzLmhpZ2hTY29yZX1gKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB0aGlzLnN0YXIgPSB7XHJcbiAgICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgICBzcHJpdGU6IFN0YXJVcmwsXHJcbiAgICAgICAgc3g6IDAsXHJcbiAgICAgICAgc3k6IDAsXHJcbiAgICAgICAgc1dpZHRoOiAzMixcclxuICAgICAgICBzSGVpZ2h0OiAzMixcclxuICAgICAgICBkeDogMCxcclxuICAgICAgICBkeTogMCxcclxuICAgICAgICBkV2lkdGg6IDY0LFxyXG4gICAgICAgIGRIZWlnaHQ6IDY0LFxyXG4gICAgICAgIGZyYW1lOiAwXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGFyID0gYXdhaXQgY3JlYXRlU3ByaXRlKHRoaXMuc3RhcilcclxuICB9XHJcblxyXG4gIGhhbmRsZVNvdW5kcygpIHtcclxuICAgIGlmKHRoaXMuYWN0aXZlU291bmQucGxheWluZyA9PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVNvdW5kLnNvdW5kUmVmID0gdGhpcy5nYW1lUmVmLnNvdW5kUGxheWVyLnBsYXlDdXN0b21Tb3VuZChjdXN0b21Tb25nLCAnc3F1YXJlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlU291bmQucGxheWluZyA9IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICAgIHRoaXMuYWN0aXZlU291bmQucGxheWluZyA9IHRydWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMudXBkYXRlQmcoKVxyXG4gICAgdGhpcy5oYW5kbGVTb3VuZHMoKVxyXG4gICAgdGhpcy5zdGFydEJ1dHRvbi51cGRhdGUoKVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQmcoKSB7XHJcbiAgICBsZXQge1xyXG4gICAgICByLGcsYlxyXG4gICAgfSA9IHRoaXMuYmdWYWx1ZXNcclxuICAgIGNvbnN0IHNwZWVkRmFjdG9yID0gdGhpcy5jb2xvclNwZWVkICogdGhpcy5nYW1lUmVmLmRpZmZNdWx0aVxyXG4gICAgciArPSAoZ2V0UmFuZG9tSW50KDMpIC0gMSkqc3BlZWRGYWN0b3JcclxuICAgIGcgKz0gKGdldFJhbmRvbUludCgzKSAtIDEpKnNwZWVkRmFjdG9yXHJcbiAgICBiICs9IChnZXRSYW5kb21JbnQoMykgLSAxKSpzcGVlZEZhY3RvclxyXG5cclxuICAgIHIgPSByIDwgMCA/IDAgOiByID4gMjU1ID8gMjU1IDogclxyXG4gICAgZyA9IGcgPCAwID8gMCA6IGcgPiAyNTUgPyAyNTUgOiBnXHJcbiAgICBiID0gYiA8IDAgPyAwIDogYiA+IDI1NSA/IDI1NSA6IGJcclxuICAgIHRoaXMuYmdWYWx1ZXMgPSB7XHJcbiAgICAgIHIsZyxiXHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyLGcsYilcclxuICB9XHJcblxyXG4gIGRyYXdCZygpIHtcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHguYmVnaW5QYXRoKClcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHgucmVjdCgwLCAwLCB0aGlzLmdhbWVSZWYuZ2FtZVdpZHRoLCB0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodClcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHguZmlsbFN0eWxlID0gYHJnYmEoJHt0aGlzLmJnVmFsdWVzLnJ9LCR7dGhpcy5iZ1ZhbHVlcy5nfSwke3RoaXMuYmdWYWx1ZXMuYn0sMSlgXHJcbiAgICB0aGlzLmdhbWVSZWYuY3R4LmZpbGwoKVxyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHguYmVnaW5QYXRoKClcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHgucmVjdCgwLCAwLCB0aGlzLmdhbWVSZWYuZ2FtZVdpZHRoLCB0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodClcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHguZmlsbFN0eWxlID0gJyNlZWUnXHJcbiAgICB0aGlzLmdhbWVSZWYuY3R4LmZpbGwoKVxyXG5cclxuICAgIHRoaXMuZHJhd0JnKClcclxuXHJcbiAgICB0aGlzLnN0YXJ0QnV0dG9uLmRyYXcoKVxyXG5cclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogKHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGgpLzIsXHJcbiAgICAgIHk6IDIwMCxcclxuICAgICAgYWxpZ246J2NlbnRlcicsXHJcbiAgICAgIGZpbGxDb2xvcjogJyMwMDAnLFxyXG4gICAgICBzdHJva2VDb2xvcjogJyNmZmYnLFxyXG4gICAgICBzdHJva2VXaWR0aDogMyxcclxuICAgICAgc3R5bGU6ICcnLFxyXG4gICAgICB3ZWlnaHQ6ICc5MDAnLFxyXG4gICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXHJcbiAgICAgIGZvbnRTaXplOiA0MCxcclxuICAgICAgdGV4dDogJ1RST09QQVMnXHJcbiAgICB9KVxyXG5cclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogKHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGgpLzIsXHJcbiAgICAgIHk6IDI3NSxcclxuICAgICAgYWxpZ246J2NlbnRlcicsXHJcbiAgICAgIGZpbGxDb2xvcjogJyMwMDAnLFxyXG4gICAgICBzdHJva2VDb2xvcjogJyNmZmYnLFxyXG4gICAgICBzdHJva2VXaWR0aDogMyxcclxuICAgICAgc3R5bGU6ICcnLFxyXG4gICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogdGhpcy5uZXdIaWdoU2NvcmUgPyAyNSA6IDIwLFxyXG4gICAgICB0ZXh0OiBgJHt0aGlzLm5ld0hpZ2hTY29yZSA/ICdOZXcgSGlnaCAnIDogJyd9U2NvcmU6ICR7dGhpcy5sYXN0U2NvcmV9YFxyXG4gICAgICAvLyB0ZXh0OiBgJHtKU09OLnN0cmluZ2lmeSh0aGlzLmdhbWVSZWYubW91c2VJbmZvKX1gXHJcbiAgICB9KVxyXG5cclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogKHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGgpLzIsXHJcbiAgICAgIHk6IDMyMCxcclxuICAgICAgYWxpZ246J2NlbnRlcicsXHJcbiAgICAgIGZpbGxDb2xvcjogJyMwMDAnLFxyXG4gICAgICBzdHJva2VDb2xvcjogJyNmZmYnLFxyXG4gICAgICBzdHJva2VXaWR0aDogMyxcclxuICAgICAgc3R5bGU6ICcnLFxyXG4gICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogMTUsXHJcbiAgICAgIHRleHQ6IGBIaSBTY29yZTogJHt0aGlzLmhpZ2hTY29yZX1gXHJcbiAgICAgIC8vIHRleHQ6IGAke0pTT04uc3RyaW5naWZ5KHRoaXMuZ2FtZVJlZi5tb3VzZUluZm8pfWBcclxuICAgIH0pXHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZHJhd1RleHQoe1xyXG4gICAgICBjOiB0aGlzLmdhbWVSZWYuY3R4LFxyXG4gICAgICB4OiAodGhpcy5nYW1lUmVmLmdhbWVXaWR0aCkvMixcclxuICAgICAgeTogMjAwLFxyXG4gICAgICBhbGlnbjonY2VudGVyJyxcclxuICAgICAgZmlsbENvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHN0eWxlOiAnJyxcclxuICAgICAgd2VpZ2h0OiAnOTAwJyxcclxuICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogNDAsXHJcbiAgICAgIHRleHQ6ICdUUk9PUEFTJ1xyXG4gICAgfSlcclxuXHJcbiAgICBkcmF3VGV4dCh7XHJcbiAgICAgIGM6IHRoaXMuZ2FtZVJlZi5jdHgsXHJcbiAgICAgIHg6ICh0aGlzLmdhbWVSZWYuZ2FtZVdpZHRoKS8yLFxyXG4gICAgICB5OiAyNzUsXHJcbiAgICAgIGFsaWduOidjZW50ZXInLFxyXG4gICAgICBmaWxsQ29sb3I6ICcjMDAwJyxcclxuICAgICAgc3R5bGU6ICcnLFxyXG4gICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgICBmb250U2l6ZTogdGhpcy5uZXdIaWdoU2NvcmUgPyAyNSA6IDIwLFxyXG4gICAgICB0ZXh0OiBgJHt0aGlzLm5ld0hpZ2hTY29yZSA/ICdOZXcgSGlnaCAnIDogJyd9U2NvcmU6ICR7dGhpcy5sYXN0U2NvcmV9YFxyXG4gICAgICAvLyB0ZXh0OiBgJHtKU09OLnN0cmluZ2lmeSh0aGlzLmdhbWVSZWYubW91c2VJbmZvKX1gXHJcbiAgICB9KVxyXG5cclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogKHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGgpLzIsXHJcbiAgICAgIHk6IDMyMCxcclxuICAgICAgYWxpZ246J2NlbnRlcicsXHJcbiAgICAgIGZpbGxDb2xvcjogJyMwMDAnLFxyXG4gICAgICBzdHlsZTogJycsXHJcbiAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXHJcbiAgICAgIGZvbnRTaXplOiAxNSxcclxuICAgICAgdGV4dDogYEhpIFNjb3JlOiAke3RoaXMuaGlnaFNjb3JlfWBcclxuICAgICAgLy8gdGV4dDogYCR7SlNPTi5zdHJpbmdpZnkodGhpcy5nYW1lUmVmLm1vdXNlSW5mbyl9YFxyXG4gICAgfSlcclxuXHJcblxyXG5cclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogKHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGgpLzIsXHJcbiAgICAgIHk6IDUwLFxyXG4gICAgICBhbGlnbjonY2VudGVyJyxcclxuICAgICAgZmlsbENvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHN0eWxlOiAnJyxcclxuICAgICAgd2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcclxuICAgICAgZm9udFNpemU6IDE1LFxyXG4gICAgICB0ZXh0OiBgJHtKU09OLnN0cmluZ2lmeSh0aGlzLmdhbWVSZWYubW91c2VJbmZvKX1gXHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICBkcmF3SW1hZ2UodGhpcy5zdGFyKVxyXG5cclxuICB9XHJcbiAgdGVhckRvd24oKSB7XHJcbiAgICB0aGlzLnN0YXJ0QnV0dG9uLnRlYXJEb3duKClcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQmFzZWRMZXZlbCB9IGZyb20gXCIuLi8uLi8uLi9lbmdpbmUvQmFzZWRMZXZlbFwiO1xyXG5pbXBvcnQgeyBkcmF3TGluZSwgZHJhd1RleHQgfSBmcm9tIFwiLi4vLi4vLi4vZW5naW5lL2xpYnMvZHJhd0hlbHBlcnNcIjtcclxuaW1wb3J0IHsgYW5nbGVCZXR3ZWVuLCBkZWdUb1JhZCwgZGlzdGFuY2VCZXR3ZWVuLCBnZXRSYW5kb21JbnQsIHBvaW50T25DaXJjbGUgfSBmcm9tIFwiLi4vLi4vLi4vZW5naW5lL2xpYnMvbWF0aEhlbHBlcnNcIjtcclxuaW1wb3J0IHsgQnVsbGV0IH0gZnJvbSBcIi4uL3Byb2plY3RpbGVzL0J1bGxldFwiO1xyXG5pbXBvcnQgeyBCYWRUcm9vcGEgfSBmcm9tIFwiLi4vdHJvb3BzL0JhZFRyb29wYVwiO1xyXG5pbXBvcnQgeyBNYWluVHJvb3BhIH0gZnJvbSBcIi4uL3Ryb29wcy9NYWluVHJvb3BhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJvb3Bhc0xldmVsMSBleHRlbmRzIEJhc2VkTGV2ZWwge1xyXG4gIG1haW5Ucm9vcGE6IGFueTtcclxuICBzaG90czogYW55O1xyXG4gIC8vIGxhc3RTaG90OiBudW1iZXIgPSAwXHJcbiAgYmFkVHJvb3BhczogYW55O1xyXG4gIHNjb3JlOiBudW1iZXIgPSAwXHJcblxyXG4gIGNhbWVyYVBvczoge3g6IG51bWJlciwgeTogbnVtYmVyfSA9IHt4OjAsIHk6MH1cclxuICBsZXZlbFdpZHRoOiBudW1iZXIgPSAyMDAwXHJcbiAgbGV2ZWxIZWlnaHQ6IG51bWJlciA9IDIwMDBcclxuXHJcbiAgYmdWYWx1ZXM6IGFueSA9IHtcclxuICAgIHI6IDY0LFxyXG4gICAgZzogMjQ0LFxyXG4gICAgYjogMjA4XHJcbiAgfVxyXG4gIGNvbG9yU3BlZWQ6IG51bWJlciA9IDVcclxuXHJcbiAgaW5pdGlhbGl6ZSgpIHtcclxuICAgIHRoaXMuc2NvcmUgPSAwXHJcbiAgICB0aGlzLmdhbWVSZWYuc291bmRQbGF5ZXIubG9hZFNvdW5kKCcuL3B1YmxpYy9zb3VuZHMvYm9vbS5vZ2cnKVxyXG5cclxuICAgIHRoaXMubWFpblRyb29wYSA9IG5ldyBNYWluVHJvb3BhKHsga2V5OiAnbWFpbi10cm9vcGEnLCBnYW1lUmVmOiB0aGlzLmdhbWVSZWYgfSlcclxuICAgIHRoaXMubWFpblRyb29wYS54ID0gMTAwXHJcbiAgICB0aGlzLm1haW5Ucm9vcGEueSA9IDEwMFxyXG4gICAgdGhpcy5tYWluVHJvb3BhLmhlYWx0aCA9IDEwXHJcblxyXG4gICAgdGhpcy5sb2FkQmFkZGllcygxMClcclxuXHJcbiAgICB0aGlzLm1haW5Ucm9vcGEuaW5pdGlhbGl6ZSgpXHJcblxyXG4gICAgdGhpcy5zaG90cyA9IG5ldyBCdWxsZXQoe2tleTogJ21haW4tc2hvdCcsIGdhbWVSZWY6IHRoaXMuZ2FtZVJlZn0pXHJcbiAgICB0aGlzLnNob3RzLmluaXRpYWxpemUoKVxyXG4gIH1cclxuXHJcbiAgbG9hZEJhZGRpZXMoZW5lbXlDb3VudDogbnVtYmVyID0gMTApIHtcclxuICAgIHRoaXMuYmFkVHJvb3BhcyA9IChuZXcgQXJyYXkoZW5lbXlDb3VudCkpLmZpbGwoJycpLm1hcCgoeDogYW55LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgbmV3QmFkZGllID0gbmV3IEJhZFRyb29wYSh7a2V5OiBgYmFkLXRyb29wYS0ke2l9YCwgZ2FtZVJlZjogdGhpcy5nYW1lUmVmfSlcclxuICAgICAgbmV3QmFkZGllLmluaXRpYWxpemUoKVxyXG4gICAgICBuZXdCYWRkaWUudGFyZ2V0ID0gdGhpcy5tYWluVHJvb3BhXHJcbiAgICAgIG5ld0JhZGRpZS54ID0gMTAwICsgZ2V0UmFuZG9tSW50KHRoaXMubGV2ZWxXaWR0aClcclxuICAgICAgbmV3QmFkZGllLnkgPSAxMDAgKyBnZXRSYW5kb21JbnQodGhpcy5sZXZlbEhlaWdodClcclxuXHJcbiAgICAgIGlmKGdldFJhbmRvbUludCgyKSA+IDApe1xyXG4gICAgICAgIG5ld0JhZGRpZS5yYWRpdXMgPSAzNVxyXG4gICAgICAgIG5ld0JhZGRpZS5tYXhIZWFsdGggPSAzXHJcbiAgICAgICAgbmV3QmFkZGllLmhlYWx0aCA9IDNcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdCYWRkaWUuYmFzZVNwZWVkID0gMlxyXG4gICAgICAgIG5ld0JhZGRpZS5mYXN0U3BlZWQgPSA0XHJcbiAgICAgIH1cclxuICAgICAgLy8gY29uc29sZS5sb2cobmV3QmFkZGllKVxyXG4gICAgICByZXR1cm4gbmV3QmFkZGllXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5tYWluVHJvb3BhLmNvbGxpc2lvbiA9IGZhbHNlXHJcbiAgICB0aGlzLm1haW5Ucm9vcGEudXBkYXRlKClcclxuXHJcbiAgICAvLyBtb3ZlIHRhcmdldGluZ1xyXG4gICAgaWYgKHRoaXMuZ2FtZVJlZi5tb3VzZUluZm8ubW91c2VEb3duKSB7XHJcbiAgICAgIHRoaXMubWFpblRyb29wYS50YXJnZXQgPSB7XHJcbiAgICAgICAgeDogdGhpcy5nYW1lUmVmLm1vdXNlSW5mby54IC0gdGhpcy5jYW1lcmFQb3MueCxcclxuICAgICAgICB5OiB0aGlzLmdhbWVSZWYubW91c2VJbmZvLnkgLSB0aGlzLmNhbWVyYVBvcy55LFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMubWFpblRyb29wYS50YXJnZXQueCA8IDApIHRoaXMubWFpblRyb29wYS50YXJnZXQueCA9IDBcclxuICAgICAgaWYodGhpcy5tYWluVHJvb3BhLnRhcmdldC54ID4gdGhpcy5sZXZlbFdpZHRoKSB0aGlzLm1haW5Ucm9vcGEudGFyZ2V0LnggPSB0aGlzLmxldmVsV2lkdGhcclxuICAgICAgaWYodGhpcy5tYWluVHJvb3BhLnRhcmdldC55IDwgMCkgdGhpcy5tYWluVHJvb3BhLnRhcmdldC55ID0gMFxyXG4gICAgICBpZih0aGlzLm1haW5Ucm9vcGEudGFyZ2V0LnkgPiB0aGlzLmxldmVsSGVpZ2h0KSB0aGlzLm1haW5Ucm9vcGEudGFyZ2V0LnkgPSB0aGlzLmxldmVsSGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVDYW1lcmEoKVxyXG5cclxuICAgIGxldCBjbG9zZXN0RW5lbXk6YW55O1xyXG4gICAgbGV0IGNsb3Nlc3RFbmVteURpc3RhbmNlID0gMTAwMFxyXG4gICAgbGV0IGxpdmVFbmVtaWVzID0gMFxyXG4gICAgdGhpcy5iYWRUcm9vcGFzLmZvckVhY2goKHg6IEJhZFRyb29wYSwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmKHguaGVhbHRoIDw9IDApIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB4LmNvbGxpc2lvbiA9IGZhbHNlXHJcbiAgICAgIHgudXBkYXRlKClcclxuICAgICAgbGl2ZUVuZW1pZXMrK1xyXG4gICAgICBsZXQgZGlzdGFuY2VUb1BsYXllciA9IGRpc3RhbmNlQmV0d2Vlbih0aGlzLm1haW5Ucm9vcGEsIHgpXHJcblxyXG4gICAgICAvLyBwbGF5ZXIgY29sbGlzaW9uXHJcbiAgICAgIGlmKGRpc3RhbmNlVG9QbGF5ZXIgPD0gdGhpcy5tYWluVHJvb3BhLnJhZGl1cyArIHgucmFkaXVzKSB7XHJcbiAgICAgICAgdGhpcy5tYWluVHJvb3BhLmNvbGxpc2lvbiA9IHRydWVcclxuICAgICAgICBjb25zdCB0b3RhbFZlbG9jaXR5ID0gTWF0aC5hYnMoeC52ZWxvY2l0eS54KSArIE1hdGguYWJzKHgudmVsb2NpdHkueSlcclxuICAgICAgICBpZih0b3RhbFZlbG9jaXR5KSB7XHJcbiAgICAgICAgICB0aGlzLm1haW5Ucm9vcGEueCArPSB4LnZlbG9jaXR5LngvdG90YWxWZWxvY2l0eSAqIDEwXHJcbiAgICAgICAgICB0aGlzLm1haW5Ucm9vcGEueSArPSB4LnZlbG9jaXR5LnkvdG90YWxWZWxvY2l0eSAqIDEwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHguY29sbGlzaW9uID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMubWFpblRyb29wYS5kYW1hZ2UoMSlcclxuICAgICAgICB0aGlzLmdhbWVSZWYuc291bmRQbGF5ZXIucGxheU5vdGUoMTAwLCAuMywgJ3NxdWFyZScpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5tYWluVHJvb3BhLCB0b3RhbFZlbG9jaXR5KVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGRpc3RhbmNlVG9QbGF5ZXIgPCBjbG9zZXN0RW5lbXlEaXN0YW5jZSkge1xyXG4gICAgICAgIGNsb3Nlc3RFbmVteSA9IHhcclxuICAgICAgICBjbG9zZXN0RW5lbXlEaXN0YW5jZSA9IGRpc3RhbmNlVG9QbGF5ZXJcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYnVsbGV0IGNvbGxpc2lvblxyXG4gICAgICBpZih0aGlzLnNob3RzLmFjdGl2ZSAmJiBkaXN0YW5jZUJldHdlZW4odGhpcy5zaG90cywgeCkgPD0gdGhpcy5zaG90cy5yYWRpdXMgKyB4LnJhZGl1cykge1xyXG4gICAgICAgIHRoaXMuc2hvdHMuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICB4LmRhbWFnZSgxKVxyXG4gICAgICAgIHRoaXMuZ2FtZVJlZi5zb3VuZFBsYXllci5wbGF5Tm90ZSg1MCwgLjMsICdzcXVhcmUnKVxyXG4gICAgICAgIHRoaXMuc2NvcmUrK1xyXG4gICAgICAgIGNvbnN0IHRvdGFsVmVsb2NpdHkgPSBNYXRoLmFicyh0aGlzLnNob3RzLnZlbG9jaXR5LngpICsgTWF0aC5hYnModGhpcy5zaG90cy52ZWxvY2l0eS55KVxyXG4gICAgICAgIHgueCArPSB0aGlzLnNob3RzLnZlbG9jaXR5LngvdG90YWxWZWxvY2l0eSAqIDEwXHJcbiAgICAgICAgeC55ICs9IHRoaXMuc2hvdHMudmVsb2NpdHkueS90b3RhbFZlbG9jaXR5ICogMTBcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gY29sbGlzaW9uIHdpdGggb3RoZXIgYmFkZGllc1xyXG4gICAgICB0aGlzLmJhZFRyb29wYXMuZm9yRWFjaCgoeTogQmFkVHJvb3BhLCBqOiBudW1iZXIpID0+IHtcclxuICAgICAgICBpZih5LmhlYWx0aCA+IDAgJiYgIXkuYWx0ZXJuYXRlVGFyZ2V0LmFjdGl2ZSAmJiBkaXN0YW5jZUJldHdlZW4oeSx4KSA8PSAoeC5yYWRpdXMgKyB5LnJhZGl1cykgJiYgaiE9PWkpIHtcclxuICAgICAgICAgIHkuYWx0ZXJuYXRlVGFyZ2V0ID0ge1xyXG4gICAgICAgICAgICB4OiB5LnRhcmdldC54ICsgZ2V0UmFuZG9tSW50KDUwKSAtIDI1LFxyXG4gICAgICAgICAgICB5OiB5LnRhcmdldC55ICsgZ2V0UmFuZG9tSW50KDUwKSAtIDI1LFxyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMuc2hvdHMudXBkYXRlKClcclxuICAgIC8vIHNob290IGJ1bGxldCBiYXNlZCBvbiBjbG9zZXN0IGVuZW15IGFuZCB0aW1lXHJcbiAgICBpZihjbG9zZXN0RW5lbXkpIHtcclxuICAgICAgLy8gY2xvc2VzdEVuZW15LmNvbGxpc2lvbiA9IHRydWVcclxuICAgICAgY29uc3QgZW5lbXlBbmdsZVBvcyA9IHBvaW50T25DaXJjbGUoYW5nbGVCZXR3ZWVuKHRoaXMubWFpblRyb29wYSwgY2xvc2VzdEVuZW15KSwgdGhpcy5tYWluVHJvb3BhLnJhZGl1cylcclxuICAgICAgY29uc3Qgc2hvb3RpbmdQb3MgPSBwb2ludE9uQ2lyY2xlKGRlZ1RvUmFkKHRoaXMubWFpblRyb29wYS5zaG9vdGluZ0hhbmQuY3VycmVudEFuZ2xlKSwgdGhpcy5tYWluVHJvb3BhLnJhZGl1cylcclxuICAgICAgY29uc3Qgc2hvdERpc3RhbmNlID0gZGlzdGFuY2VCZXR3ZWVuKGVuZW15QW5nbGVQb3MsIHNob290aW5nUG9zKVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhlbmVteUFuZ2xlUG9zLCBzaG9vdGluZ1BvcylcclxuICAgICAgaWYoc2hvdERpc3RhbmNlIDwgMSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldEVuZFBvaW50ID0gcG9pbnRPbkNpcmNsZShhbmdsZUJldHdlZW4odGhpcy5tYWluVHJvb3BhLCBjbG9zZXN0RW5lbXkpLCB0aGlzLnNob3RzLm1heERpc3RhbmNlKVxyXG5cclxuICAgICAgICB0aGlzLnNob3RzLmZpcmUoXHJcbiAgICAgICAgICB0aGlzLm1haW5Ucm9vcGEuc2hvb3RpbmdIYW5kLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB4OiB0YXJnZXRFbmRQb2ludC54ICsgdGhpcy5tYWluVHJvb3BhLngsXHJcbiAgICAgICAgICAgIHk6IHRhcmdldEVuZFBvaW50LnkgKyB0aGlzLm1haW5Ucm9vcGEueVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgICAgICAvLyB0aGlzLnNob3RzLmZpcmUodGhpcy5tYWluVHJvb3BhLCB0aGlzLm1haW5Ucm9vcGEuc2hvb3RpbmdIYW5kKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubWFpblRyb29wYS5uZWFyZXN0VGFyZ2V0ID0gY2xvc2VzdEVuZW15XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVzZXQgb3IgbmV4dCBsZXZlbFxyXG4gICAgaWYobGl2ZUVuZW1pZXMgPT09IDApIHtcclxuICAgICAgLy8gdGhpcy5nYW1lUmVmLmxvYWRMZXZlbCgnc3RhcnQtc2NyZWVuJylcclxuICAgICAgdGhpcy5yYW5kb21pemVCZygpXHJcbiAgICAgIHRoaXMubG9hZEJhZGRpZXModGhpcy5iYWRUcm9vcGFzLmxlbmd0aCArIDEwKVxyXG4gICAgfVxyXG5cclxuICAgIGlmKHRoaXMubWFpblRyb29wYS5oZWFsdGggPD0gMCkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdC1zY29yZScsIGAke3RoaXMuc2NvcmV9YClcclxuICAgICAgdGhpcy5nYW1lUmVmLmxvYWRMZXZlbCgnc3RhcnQtc2NyZWVuJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUNhbWVyYSgpIHtcclxuICAgIHRoaXMuY2FtZXJhUG9zID0ge1xyXG4gICAgICB4OiAtKHRoaXMubWFpblRyb29wYS54IC0gdGhpcy5nYW1lUmVmLmdhbWVXaWR0aC8yKSxcclxuICAgICAgeTogLSh0aGlzLm1haW5Ucm9vcGEueSAtIHRoaXMuZ2FtZVJlZi5nYW1lSGVpZ2h0LzIpXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmdhbWVSZWYuZ2FtZVdpZHRoIDwgdGhpcy5sZXZlbFdpZHRoKSB7XHJcbiAgICAgIGlmKHRoaXMuY2FtZXJhUG9zLnggPiAwICkgdGhpcy5jYW1lcmFQb3MueCA9IDBcclxuICAgICAgaWYodGhpcy5jYW1lcmFQb3MueCAtIHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGggIDwgdGhpcy5sZXZlbFdpZHRoKi0xICkgdGhpcy5jYW1lcmFQb3MueCA9IC0odGhpcy5sZXZlbFdpZHRoIC0gdGhpcy5nYW1lUmVmLmdhbWVXaWR0aClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2FtZXJhUG9zLnggPSAodGhpcy5nYW1lUmVmLmdhbWVXaWR0aCAtIHRoaXMubGV2ZWxXaWR0aCkvMlxyXG4gICAgfVxyXG5cclxuICAgIGlmKHRoaXMuZ2FtZVJlZi5nYW1lSGVpZ2h0IDwgdGhpcy5sZXZlbEhlaWdodCkge1xyXG4gICAgICBpZih0aGlzLmNhbWVyYVBvcy55ID4gMCApIHRoaXMuY2FtZXJhUG9zLnkgPSAwXHJcbiAgICAgIGlmKHRoaXMuY2FtZXJhUG9zLnkgLSB0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodCAgPCB0aGlzLmxldmVsSGVpZ2h0Ki0xICkgdGhpcy5jYW1lcmFQb3MueSA9IC0odGhpcy5sZXZlbEhlaWdodCAtIHRoaXMuZ2FtZVJlZi5nYW1lSGVpZ2h0KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jYW1lcmFQb3MueSA9ICh0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodCAtIHRoaXMubGV2ZWxIZWlnaHQpLzJcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB1cGRhdGVCZygpIHtcclxuICAgIGxldCB7XHJcbiAgICAgIHIsZyxiXHJcbiAgICB9ID0gdGhpcy5iZ1ZhbHVlc1xyXG4gICAgY29uc3Qgc3BlZWRGYWN0b3IgPSB0aGlzLmNvbG9yU3BlZWQgKiB0aGlzLmdhbWVSZWYuZGlmZk11bHRpXHJcbiAgICByICs9IChnZXRSYW5kb21JbnQoMykgLSAxKSpzcGVlZEZhY3RvclxyXG4gICAgZyArPSAoZ2V0UmFuZG9tSW50KDMpIC0gMSkqc3BlZWRGYWN0b3JcclxuICAgIGIgKz0gKGdldFJhbmRvbUludCgzKSAtIDEpKnNwZWVkRmFjdG9yXHJcblxyXG4gICAgciA9IHIgPCAwID8gMCA6IHIgPiAyNTUgPyAyNTUgOiByXHJcbiAgICBnID0gZyA8IDAgPyAwIDogZyA+IDI1NSA/IDI1NSA6IGdcclxuICAgIGIgPSBiIDwgMCA/IDAgOiBiID4gMjU1ID8gMjU1IDogYlxyXG4gICAgdGhpcy5iZ1ZhbHVlcyA9IHtcclxuICAgICAgcixnLGJcclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKHIsZyxiKVxyXG4gIH1cclxuXHJcbiAgcmFuZG9taXplQmcoKSB7XHJcbiAgICBsZXQge1xyXG4gICAgICByLGcsYlxyXG4gICAgfSA9IHRoaXMuYmdWYWx1ZXNcclxuICAgIHIgKz0gZ2V0UmFuZG9tSW50KDI1NilcclxuICAgIGcgKz0gZ2V0UmFuZG9tSW50KDI1NilcclxuICAgIGIgKz0gZ2V0UmFuZG9tSW50KDI1NilcclxuICAgIHRoaXMuYmdWYWx1ZXMgPSB7XHJcbiAgICAgIHIsZyxiXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcmF3QmcoKSB7XHJcbiAgICAvLyB0aGlzLnVwZGF0ZUJnKClcclxuICAgIGNvbnN0IGdyaWRXaWR0aCA9IDIwMFxyXG4gICAgY29uc3QgZ3JpZEhlaWdodCA9IDIwMFxyXG4gICAgY29uc3QgZHJhd1dpZHRoID0gdGhpcy5nYW1lUmVmLmdhbWVXaWR0aCA+IHRoaXMubGV2ZWxXaWR0aCA/IHRoaXMubGV2ZWxXaWR0aCA6IHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGhcclxuICAgIGNvbnN0IGRyYXdIZWlnaHQgPSB0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodCA+IHRoaXMubGV2ZWxIZWlnaHQgPyB0aGlzLmxldmVsSGVpZ2h0IDogdGhpcy5nYW1lUmVmLmdhbWVIZWlnaHRcclxuXHJcbiAgICBjb25zdCBkcmF3T2Zmc2V0WCA9IGRyYXdXaWR0aCA9PSB0aGlzLmxldmVsV2lkdGggPyB0aGlzLmNhbWVyYVBvcy54IDogdGhpcy5jYW1lcmFQb3MueCVncmlkV2lkdGhcclxuICAgIGNvbnN0IGRyYXdPZmZzZXRZID0gZHJhd0hlaWdodCA9PSB0aGlzLmxldmVsSGVpZ2h0ID8gdGhpcy5jYW1lcmFQb3MueSA6IHRoaXMuY2FtZXJhUG9zLnklZ3JpZEhlaWdodFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkcmF3V2lkdGgvZ3JpZFdpZHRoICsgMTsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZHJhd0hlaWdodC9ncmlkSGVpZ2h0ICsgMTsgaisrKSB7XHJcbiAgICAgICAgLy8gaWYoaSpncmlkV2lkdGggPiBkcmF3V2lkdGggfHwgaipncmlkSGVpZ2h0ID4gZHJhd0hlaWdodCkge1xyXG4gICAgICAgIC8vICAgY29udGludWVcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5nYW1lUmVmLmN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgIGNvbnN0IGNhbVggPSAoaSpncmlkV2lkdGggLSAodGhpcy5jYW1lcmFQb3MueCkgKyB0aGlzLmNhbWVyYVBvcy54JWdyaWRXaWR0aCkvKHRoaXMubGV2ZWxXaWR0aClcclxuICAgICAgICBjb25zdCBjYW1ZID0gIChqKmdyaWRIZWlnaHQgLSAodGhpcy5jYW1lcmFQb3MueSkgKyArIHRoaXMuY2FtZXJhUG9zLnklZ3JpZFdpZHRoKS8odGhpcy5sZXZlbEhlaWdodClcclxuICAgICAgICB0aGlzLmdhbWVSZWYuY3R4LnJlY3QoXHJcbiAgICAgICAgICBpKmdyaWRXaWR0aCArIGRyYXdPZmZzZXRYLFxyXG4gICAgICAgICAgaipncmlkSGVpZ2h0ICsgZHJhd09mZnNldFksXHJcbiAgICAgICAgICBncmlkV2lkdGggKyAxLFxyXG4gICAgICAgICAgZ3JpZEhlaWdodCArIDEsXHJcbiAgICAgICAgICAvLyBpKmdyaWRXaWR0aCArIGdyaWRXaWR0aCArIDEgPD0gZHJhd1dpZHRoID8gZ3JpZFdpZHRoICsgMSA6IGRyYXdXaWR0aCAtIChpLTEpKmdyaWRXaWR0aCxcclxuICAgICAgICAgIC8vIGoqZ3JpZEhlaWdodCArIGdyaWRIZWlnaHQgKyAxIDw9IGRyYXdIZWlnaHQgPyBncmlkSGVpZ2h0ICsgMSA6IGRyYXdIZWlnaHQgLSAoai0xKSpncmlkSGVpZ2h0LFxyXG4gICAgICAgIClcclxuICAgICAgICAvLyB0aGlzLmdhbWVSZWYuY3R4LmZpbGxTdHlsZSA9IGBibGFja2BcclxuICAgICAgICB0aGlzLmdhbWVSZWYuY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7KGNhbVgpKih0aGlzLmJnVmFsdWVzLnIpfSwkeygoY2FtWCArIGNhbVkpLyh0aGlzLmxldmVsV2lkdGggKyB0aGlzLmxldmVsSGVpZ2h0KSkqKHRoaXMuYmdWYWx1ZXMuZyl9LCR7KGNhbVkpKih0aGlzLmJnVmFsdWVzLmIpfSwxKWBcclxuICAgICAgICAvLyB0aGlzLmdhbWVSZWYuY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7KGNhbVgpKjEwMCArIDUwfSwkeygoY2FtWCArIGNhbVkpLyh0aGlzLmxldmVsV2lkdGggKyB0aGlzLmxldmVsSGVpZ2h0KSkqMTAwICsgNTB9LCR7KGNhbVkpKjEwMCArIDUwfSwxKWBcclxuICAgICAgICB0aGlzLmdhbWVSZWYuY3R4LmZpbGwoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkcmF3V2lkdGgvZ3JpZFdpZHRoICsgMTsgaSsrKSB7XHJcbiAgICAgIGRyYXdMaW5lKHtcclxuICAgICAgICBjOiB0aGlzLmdhbWVSZWYuY3R4LFxyXG4gICAgICAgIHg6IGkqZ3JpZFdpZHRoICsgdGhpcy5jYW1lcmFQb3MueCVncmlkV2lkdGgsXHJcbiAgICAgICAgeTogMCxcclxuICAgICAgICB0b1g6IGkqZ3JpZFdpZHRoICsgdGhpcy5jYW1lcmFQb3MueCVncmlkV2lkdGgsXHJcbiAgICAgICAgdG9ZOiB0aGlzLmdhbWVSZWYuZ2FtZUhlaWdodCxcclxuICAgICAgICBzdHJva2VXaWR0aDogMSxcclxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjIpJ1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkcmF3SGVpZ2h0L2dyaWRIZWlnaHQgKyAxOyBqKyspIHtcclxuICAgICAgZHJhd0xpbmUoe1xyXG4gICAgICAgIGM6IHRoaXMuZ2FtZVJlZi5jdHgsXHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiBqKmdyaWRIZWlnaHQgKyB0aGlzLmNhbWVyYVBvcy55JWdyaWRIZWlnaHQsXHJcbiAgICAgICAgdG9YOiB0aGlzLmdhbWVSZWYuZ2FtZVdpZHRoLFxyXG4gICAgICAgIHRvWTogaipncmlkSGVpZ2h0ICsgdGhpcy5jYW1lcmFQb3MueSVncmlkSGVpZ2h0LFxyXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLFxyXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuMiknXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcmF3KCkge1xyXG4gICAgdGhpcy5nYW1lUmVmLmN0eC5iZWdpblBhdGgoKVxyXG4gICAgdGhpcy5nYW1lUmVmLmN0eC5yZWN0KDAsIDAsIHRoaXMuZ2FtZVJlZi5nYW1lV2lkdGgsIHRoaXMuZ2FtZVJlZi5nYW1lSGVpZ2h0KVxyXG4gICAgdGhpcy5nYW1lUmVmLmN0eC5maWxsU3R5bGUgPSAnI2VlZSdcclxuICAgIHRoaXMuZ2FtZVJlZi5jdHguZmlsbCgpXHJcblxyXG4gICAgdGhpcy5kcmF3QmcoKVxyXG5cclxuICAgIHRoaXMubWFpblRyb29wYS5kcmF3KHRoaXMuY2FtZXJhUG9zKVxyXG4gICAgdGhpcy5iYWRUcm9vcGFzLmZvckVhY2goKHg6IEJhZFRyb29wYSkgPT4ge1xyXG4gICAgICBpZih4LmhlYWx0aCA8PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgeC5kcmF3KHRoaXMuY2FtZXJhUG9zKVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLnNob3RzLmRyYXcodGhpcy5jYW1lcmFQb3MpXHJcblxyXG4gICAgaWYodGhpcy5tYWluVHJvb3BhLmhlYWx0aCA+IDApIHtcclxuICAgICAgdGhpcy5nYW1lUmVmLmN0eC5iZWdpblBhdGgoKVxyXG4gICAgICB0aGlzLmdhbWVSZWYuY3R4LnJlY3QoMzAsIDMwLCAodGhpcy5tYWluVHJvb3BhLmhlYWx0aC8xMCkqMTAwLCAxMClcclxuICAgICAgdGhpcy5nYW1lUmVmLmN0eC5maWxsU3R5bGUgPSAnI2NlMTkyYidcclxuICAgICAgdGhpcy5nYW1lUmVmLmN0eC5maWxsKClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3VGV4dCh7XHJcbiAgICAgIGM6IHRoaXMuZ2FtZVJlZi5jdHgsXHJcbiAgICAgIHg6IDMwLFxyXG4gICAgICB5OiA2MCxcclxuICAgICAgYWxpZ246ICdsZWZ0JyxcclxuICAgICAgZm9udFNpemU6IDE2LFxyXG4gICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXHJcbiAgICAgIGZpbGxDb2xvcjogJyNmZmYnLFxyXG4gICAgICBzdHJva2VDb2xvcjogJyMwMDAnLFxyXG4gICAgICBzdHJva2VXaWR0aDogMyxcclxuICAgICAgdGV4dDogYFNjb3JlOiAke3RoaXMuc2NvcmV9YFxyXG4gICAgfSlcclxuICAgIGRyYXdUZXh0KHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogMzAsXHJcbiAgICAgIHk6IDYwLFxyXG4gICAgICBhbGlnbjogJ2xlZnQnLFxyXG4gICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcclxuICAgICAgZmlsbENvbG9yOiAnI2ZmZicsXHJcbiAgICAgIHRleHQ6IGBTY29yZTogJHt0aGlzLnNjb3JlfWBcclxuICAgIH0pXHJcblxyXG4gICAgLy8gZHJhd1RleHQoe1xyXG4gICAgLy8gICBjOiB0aGlzLmdhbWVSZWYuY3R4LFxyXG4gICAgLy8gICB4OiAzMCxcclxuICAgIC8vICAgeTogOTAsXHJcbiAgICAvLyAgIGFsaWduOiAnbGVmdCcsXHJcbiAgICAvLyAgIGZvbnRTaXplOiAxNixcclxuICAgIC8vICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgLy8gICBmaWxsQ29sb3I6ICcjMDAwJyxcclxuICAgIC8vICAgdGV4dDogYHg6ICR7dGhpcy5tYWluVHJvb3BhLnh9LCB5OiAke3RoaXMubWFpblRyb29wYS55fWBcclxuICAgIC8vIH0pXHJcblxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBCYXNlZE9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9lbmdpbmUvQmFzZWRPYmplY3RcIjtcclxuaW1wb3J0IHsgZHJhd0NpcmNsZSB9IGZyb20gXCIuLi8uLi8uLi9lbmdpbmUvbGlicy9kcmF3SGVscGVyc1wiO1xyXG5pbXBvcnQgeyBkaXN0YW5jZUJldHdlZW4gfSBmcm9tIFwiLi4vLi4vLi4vZW5naW5lL2xpYnMvbWF0aEhlbHBlcnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCdWxsZXQgZXh0ZW5kcyBCYXNlZE9iamVjdCB7XHJcbiAgYWN0aXZlOiBib29sZWFuID0gZmFsc2VcclxuICB0YXJnZXQ6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSA9IHsgeDogMCwgeTogMCB9XHJcbiAgc3BlZWQ6IG51bWJlciA9IDE1XHJcbiAgcmFkaXVzOiBudW1iZXIgPSA4XHJcbiAgdmVsb2NpdHk6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSA9IHsgeDogMCwgeTogMCB9XHJcbiAgbWF4RGlzdGFuY2U6IG51bWJlciA9IDgwMFxyXG4gIHRyYXZlbGVkOiBudW1iZXIgPSAwXHJcbiAgbGFzdFNob3Q6IG51bWJlciA9IDBcclxuICBzaG90RGVsYXk6IG51bWJlciA9IDYwMFxyXG5cclxuICBpbml0aWFsaXplKCkge31cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMudHJhdmVsZWQgPCB0aGlzLm1heERpc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMueCArPSB0aGlzLnZlbG9jaXR5LnhcclxuICAgICAgdGhpcy55ICs9IHRoaXMudmVsb2NpdHkueVxyXG4gICAgICB0aGlzLnRyYXZlbGVkICs9IE1hdGguYWJzKHRoaXMudmVsb2NpdHkueCkgKyBNYXRoLmFicyh0aGlzLnZlbG9jaXR5LnkpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZlbG9jaXR5ID0geyB4OiAwLCB5OiAwIH1cclxuICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLnRyYXZlbGVkID0gMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0VmVsb2NpdHlUb1RhcmdldCgpIHtcclxuICAgIGNvbnN0IGRpZmZNdWx0aSA9IHRoaXMuZ2FtZVJlZi5kaWZmTXVsdGlcclxuICAgIGNvbnN0IGR0ID0gZGlzdGFuY2VCZXR3ZWVuKHRoaXMsIHRoaXMudGFyZ2V0KVxyXG4gICAgY29uc3Qgc3BlZWRGYWN0b3IgPSB0aGlzLnNwZWVkICogZGlmZk11bHRpXHJcbiAgICB0aGlzLnZlbG9jaXR5ID0ge1xyXG4gICAgICB4OiAoc3BlZWRGYWN0b3IgLyBkdCkgKiAodGhpcy50YXJnZXQueCAtIHRoaXMueCksXHJcbiAgICAgIHk6IChzcGVlZEZhY3RvciAvIGR0KSAqICh0aGlzLnRhcmdldC55IC0gdGhpcy55KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmlyZShzdGFydDoge3g6IG51bWJlciwgeTogbnVtYmVyfSwgZW5kOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9KSB7XHJcbiAgICBpZighdGhpcy5hY3RpdmUgJiYgdGhpcy5nYW1lUmVmLmxhc3RVcGRhdGUgLSB0aGlzLmxhc3RTaG90ID49IHRoaXMuc2hvdERlbGF5KSB7XHJcbiAgICAgIHRoaXMueCA9IHN0YXJ0LnhcclxuICAgICAgdGhpcy55ID0gc3RhcnQueVxyXG4gICAgICB0aGlzLnRhcmdldCA9IGVuZFxyXG4gICAgICB0aGlzLnNldFZlbG9jaXR5VG9UYXJnZXQoKVxyXG4gICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcclxuICAgICAgdGhpcy50cmF2ZWxlZCA9IDBcclxuICAgICAgdGhpcy5sYXN0U2hvdCA9IHRoaXMuZ2FtZVJlZi5sYXN0VXBkYXRlXHJcbiAgICAgIHRoaXMuZ2FtZVJlZi5zb3VuZFBsYXllci5wbGF5Tm90ZSgtMTUwLCAuMywgJ3NxdWFyZScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZHJhdyhjYW1lcmFPZmZzZXQ6IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gPSB7eDogMCwgeTogMH0pIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICBkcmF3Q2lyY2xlKHtcclxuICAgICAgICBjOiB0aGlzLmdhbWVSZWYuY3R4LFxyXG4gICAgICAgIHg6IGNhbWVyYU9mZnNldC54ICsgdGhpcy54LFxyXG4gICAgICAgIHk6IGNhbWVyYU9mZnNldC55ICsgdGhpcy55LFxyXG4gICAgICAgIGZpbGxDb2xvcjogJ2dvbGQnLFxyXG4gICAgICAgIHJhZGl1czogdGhpcy5yYWRpdXMsXHJcbiAgICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LC41KScsXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDJcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGRyYXdDaXJjbGUgfSBmcm9tIFwiLi4vLi4vLi4vZW5naW5lL2xpYnMvZHJhd0hlbHBlcnNcIjtcclxuaW1wb3J0IHsgZGlzdGFuY2VCZXR3ZWVuIH0gZnJvbSBcIi4uLy4uLy4uL2VuZ2luZS9saWJzL21hdGhIZWxwZXJzXCI7XHJcbmltcG9ydCB7IE1haW5Ucm9vcGEgfSBmcm9tIFwiLi9NYWluVHJvb3BhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFkVHJvb3BhIGV4dGVuZHMgTWFpblRyb29wYSB7XHJcblxyXG4gIHNwZWVkOiBudW1iZXIgPSAxXHJcbiAgYmFzZVNwZWVkOiBudW1iZXIgPSAxXHJcbiAgZmFzdFNwZWVkOiBudW1iZXIgPSAzXHJcbiAgYWdncm9SYW5nZTogbnVtYmVyID0gMjUwXHJcbiAgcmFkaXVzOiBudW1iZXIgPSAyMFxyXG4gIGhlYWx0aDogbnVtYmVyID0gMlxyXG4gIG1heEhlYWx0aDogbnVtYmVyID0gMlxyXG4gIGRhbWFnZUJ1ZmZlcjogbnVtYmVyID0gMTAwXHJcbiAgYWx0ZXJuYXRlVGFyZ2V0OiB7IHg6IG51bWJlciwgeTogbnVtYmVyLCBhY3RpdmU6IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCwgYWN0aXZlOiBmYWxzZSB9O1xyXG4gIGhlYWx0aENvbG9yczogc3RyaW5nW10gPSBbJyMwMDAnLCAnI2NlMTkyYicsICdwaW5rJ11cclxuXHJcbiAgaW5pdGlhbGl6ZSgpIHtcclxuICAgIHRoaXMuaGVhbHRoID0gMlxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgaWYoZGlzdGFuY2VCZXR3ZWVuKHRoaXMsIHRoaXMudGFyZ2V0KSA8IHRoaXMuYWdncm9SYW5nZSkge1xyXG4gICAgICB0aGlzLnNwZWVkID0gdGhpcy5mYXN0U3BlZWRcclxuICAgICAgdGhpcy5hbHRlcm5hdGVUYXJnZXQuYWN0aXZlID0gZmFsc2VcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLmJhc2VTcGVlZFxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuYWx0ZXJuYXRlVGFyZ2V0LmFjdGl2ZSkge1xyXG4gICAgICB0aGlzLm1vdmVUbyh0aGlzLmFsdGVybmF0ZVRhcmdldCwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuYWx0ZXJuYXRlVGFyZ2V0LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1vdmVUbyh0aGlzLnRhcmdldClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRyYXcoY2FtZXJhT2Zmc2V0OiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPSB7IHg6IDAsIHk6IDAgfSkge1xyXG4gICAgZHJhd0NpcmNsZSh7XHJcbiAgICAgIGM6IHRoaXMuZ2FtZVJlZi5jdHgsXHJcbiAgICAgIHg6IGNhbWVyYU9mZnNldC54ICsgdGhpcy54LFxyXG4gICAgICB5OiBjYW1lcmFPZmZzZXQueSArIHRoaXMueSxcclxuICAgICAgcmFkaXVzOiB0aGlzLnJhZGl1cyxcclxuICAgICAgZmlsbENvbG9yOiBgcmdiKDI1NSwwLCR7dGhpcy5tYXhIZWFsdGggLSB0aGlzLmhlYWx0aCA+PSAwID8gKHRoaXMubWF4SGVhbHRoIC0gdGhpcy5oZWFsdGgpIC8gdGhpcy5tYXhIZWFsdGggKiAyNTUgOiAwfSlgLFxyXG4gICAgICBzdHJva2VXaWR0aDogMixcclxuICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LC41KSdcclxuICAgIH0pXHJcblxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBCYXNlZE9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9lbmdpbmUvQmFzZWRPYmplY3RcIjtcclxuaW1wb3J0IHsgZHJhd0NpcmNsZSB9IGZyb20gXCIuLi8uLi8uLi9lbmdpbmUvbGlicy9kcmF3SGVscGVyc1wiO1xyXG5pbXBvcnQgeyBhbmdsZUJldHdlZW4sIGRlZ1RvUmFkLCBkaXN0YW5jZUJldHdlZW4sIHBvaW50T25DaXJjbGUsIFhZQ29vcmRpbmF0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vZW5naW5lL2xpYnMvbWF0aEhlbHBlcnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYWluVHJvb3BhIGV4dGVuZHMgQmFzZWRPYmplY3Qge1xyXG5cclxuICB0YXJnZXQ6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIsIGFjdGl2ZT86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9O1xyXG4gIHJhZGl1czogbnVtYmVyID0gMzBcclxuICBzcGVlZDogbnVtYmVyID0gN1xyXG4gIGhlYWx0aDogbnVtYmVyID0gMTBcclxuICBtYXhIZWFsdGg6IG51bWJlciA9IDEwXHJcbiAgbGFzdEhpdDogbnVtYmVyID0gMFxyXG4gIGRhbWFnZUJ1ZmZlcjogbnVtYmVyID0gMTAwXHJcbiAgLy8gYWN0aXZlOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgaG92ZXJlZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgZm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIGNvbGxpc2lvbjogYm9vbGVhbiA9IGZhbHNlXHJcbiAgb25Db2xsaXNpb246IChjU2VsZjogYW55LCBjT3RoZXI6IGFueSkgPT4gdm9pZCA9ICgpID0+IHsgfVxyXG5cclxuICB2ZWxvY2l0eTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9ID0geyB4OiAwLCB5OiAwIH1cclxuXHJcbiAgc2hvb3RpbmdIYW5kOiBhbnkgPSB7XHJcbiAgICB4OiAwLFxyXG4gICAgeTogMCxcclxuICAgIHJhZGl1czogMTAsXHJcbiAgICBmaWxsQ29sb3I6ICcjNTVkYWZkJyxcclxuICAgIGN1cnJlbnRBbmdsZTogMCxcclxuICAgIGFuZ2xlU3BlZWQ6IDVcclxuICB9XHJcbiAgbmVhcmVzdFRhcmdldDogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9ID0geyB4OiAwLCB5OiAwIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSgpIHtcclxuICAgIHRoaXMudGFyZ2V0ID0geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcblxyXG4gICAgdGhpcy50YXJnZXQuYWN0aXZlICYmIHRoaXMubW92ZVRvKHRoaXMudGFyZ2V0LCAoKSA9PiB7XHJcbiAgICAgIHRoaXMudGFyZ2V0LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IHRhcmdldEFuZ2xlID0gYW5nbGVCZXR3ZWVuKHRoaXMsIHRoaXMubmVhcmVzdFRhcmdldCwgdHJ1ZSlcclxuICAgIGNvbnN0IGFuZ2xlU3BlZWQgPSB0aGlzLnNob290aW5nSGFuZC5hbmdsZVNwZWVkICogdGhpcy5nYW1lUmVmLmRpZmZNdWx0aVxyXG4gICAgY29uc3Qgcm90RGlyID0gKHRhcmdldEFuZ2xlIC0gdGhpcy5zaG9vdGluZ0hhbmQuY3VycmVudEFuZ2xlICsgNTQwKSUzNjAtMTgwXHJcbiAgICBpZihyb3REaXIgPiAwKSB7XHJcbiAgICAgIHRoaXMuc2hvb3RpbmdIYW5kLmN1cnJlbnRBbmdsZSArPSByb3REaXIgPiBhbmdsZVNwZWVkID8gYW5nbGVTcGVlZCA6IHJvdERpclxyXG4gICAgfSBlbHNlIGlmIChyb3REaXIgPCAwKSB7XHJcbiAgICAgIHRoaXMuc2hvb3RpbmdIYW5kLmN1cnJlbnRBbmdsZSAtPSByb3REaXIgPCBhbmdsZVNwZWVkID8gYW5nbGVTcGVlZCA6IC1yb3REaXJcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhvdmVyZWQgPSBkaXN0YW5jZUJldHdlZW4odGhpcywgdGhpcy5nYW1lUmVmLm1vdXNlSW5mbykgPD0gdGhpcy5yYWRpdXNcclxuICB9XHJcblxyXG4gIG1vdmVUbyhtb3ZlVGFyZ2V0OiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIGFjdGl2ZT86IGJvb2xlYW59LCBhcnJpdmVGbjogKCkgPT4gdm9pZCA9ICgpID0+IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc3QgZHQgPSBkaXN0YW5jZUJldHdlZW4odGhpcywgbW92ZVRhcmdldClcclxuICAgIGlmIChkdCA+IHRoaXMucmFkaXVzKSB7XHJcbiAgICAgIGNvbnN0IHNwZWVkRmFjdG9yID0gdGhpcy5zcGVlZCAqIHRoaXMuZ2FtZVJlZi5kaWZmTXVsdGlcclxuICAgICAgdGhpcy52ZWxvY2l0eSA9IHtcclxuICAgICAgICB4OiAoc3BlZWRGYWN0b3IgLyBkdCkgKiAobW92ZVRhcmdldC54IC0gdGhpcy54KSxcclxuICAgICAgICB5OiAoc3BlZWRGYWN0b3IgLyBkdCkgKiAobW92ZVRhcmdldC55IC0gdGhpcy55KVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMueCArPSB0aGlzLnZlbG9jaXR5LnhcclxuICAgICAgdGhpcy55ICs9IHRoaXMudmVsb2NpdHkueVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52ZWxvY2l0eSA9IHsgeDogMCwgeTogMCB9XHJcbiAgICAgIGFycml2ZUZuKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRyYXcoY2FtZXJhT2Zmc2V0OiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9ID0ge3g6IDAsIHk6IDB9KSB7XHJcbiAgICBkcmF3Q2lyY2xlKHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogY2FtZXJhT2Zmc2V0LnggKyB0aGlzLngsXHJcbiAgICAgIHk6IGNhbWVyYU9mZnNldC55ICsgdGhpcy55LFxyXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzLFxyXG4gICAgICBmaWxsQ29sb3I6IHRoaXMubGFzdEhpdCArIDUwMCA+IHRoaXMuZ2FtZVJlZi5sYXN0VXBkYXRlID8gJ29yYW5nZScgOiAnIzU1ZGFmZCcsXHJcbiAgICAgIHN0cm9rZVdpZHRoOiAyLFxyXG4gICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjUpJ1xyXG4gICAgICAvLyBmaWxsQ29sb3I6IHRoaXMuY29sbGlzaW9uID8gJ29yYW5nZScgOiAnZ3JlZW4nXHJcbiAgICAgIC8vIGZpbGxDb2xvcjogdGhpcy5jb2xsaXNpb24gPyAnb3JhbmdlJyA6IHRoaXMuaG92ZXJlZCA/ICdyZWQnIDogJ2dyZWVuJ1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBjb25zdCB0YXJnZXRBbmdsZSA9IHBvaW50T25DaXJjbGUoYW5nbGVCZXR3ZWVuKHRoaXMsIHRoaXMubmVhcmVzdFRhcmdldCksIHRoaXMucmFkaXVzICsgdGhpcy5zaG9vdGluZ0hhbmQucmFkaXVzKVxyXG4gICAgY29uc3QgdGFyZ2V0QW5nbGUgPSBwb2ludE9uQ2lyY2xlKGRlZ1RvUmFkKHRoaXMuc2hvb3RpbmdIYW5kLmN1cnJlbnRBbmdsZSksIHRoaXMucmFkaXVzICsgdGhpcy5zaG9vdGluZ0hhbmQucmFkaXVzKVxyXG4gICAgdGhpcy5zaG9vdGluZ0hhbmQueCA9IHRhcmdldEFuZ2xlLnggKyB0aGlzLnhcclxuICAgIHRoaXMuc2hvb3RpbmdIYW5kLnkgPSB0YXJnZXRBbmdsZS55ICsgdGhpcy55XHJcbiAgICBkcmF3Q2lyY2xlKHtcclxuICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgeDogY2FtZXJhT2Zmc2V0LnggKyB0aGlzLnggKyB0YXJnZXRBbmdsZS54LFxyXG4gICAgICB5OiBjYW1lcmFPZmZzZXQueSArIHRoaXMueSArIHRhcmdldEFuZ2xlLnksXHJcbiAgICAgIHJhZGl1czogdGhpcy5zaG9vdGluZ0hhbmQucmFkaXVzLFxyXG4gICAgICBmaWxsQ29sb3I6IHRoaXMuc2hvb3RpbmdIYW5kLmZpbGxDb2xvclxyXG4gICAgICAvLyBmaWxsQ29sb3I6IHRoaXMuY29sbGlzaW9uID8gJ29yYW5nZScgOiAnZ3JlZW4nXHJcbiAgICAgIC8vIGZpbGxDb2xvcjogdGhpcy5jb2xsaXNpb24gPyAnb3JhbmdlJyA6IHRoaXMuaG92ZXJlZCA/ICdyZWQnIDogJ2dyZWVuJ1xyXG4gICAgfSlcclxuXHJcblxyXG5cclxuICAgIGlmICh0aGlzLnRhcmdldC5hY3RpdmUpIHtcclxuICAgICAgZHJhd0NpcmNsZSh7XHJcbiAgICAgICAgYzogdGhpcy5nYW1lUmVmLmN0eCxcclxuICAgICAgICB4OiBjYW1lcmFPZmZzZXQueCArIHRoaXMudGFyZ2V0LngsXHJcbiAgICAgICAgeTogY2FtZXJhT2Zmc2V0LnkgKyB0aGlzLnRhcmdldC55LFxyXG4gICAgICAgIHJhZGl1czogMjAsXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXHJcbiAgICAgICAgc3Ryb2tlQ29sb3I6ICd5ZWxsb3cnXHJcbiAgICAgICAgLy8gZmlsbENvbG9yOiAnZ3JlZW4nXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkYW1hZ2UoYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGlmKHRoaXMubGFzdEhpdCArIHRoaXMuZGFtYWdlQnVmZmVyID4gdGhpcy5nYW1lUmVmLmxhc3RVcGRhdGUpe1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHRoaXMuaGVhbHRoIC09IGFtb3VudFxyXG4gICAgdGhpcy5sYXN0SGl0ID0gdGhpcy5nYW1lUmVmLmxhc3RVcGRhdGVcclxuICB9XHJcblxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0IHsgQmFzZWRHYW1lIH0gZnJvbSBcIi4vZW5naW5lL0Jhc2VkRW5naW5lXCI7XG5pbXBvcnQgeyBUcm9vcGFzTGV2ZWwxIH0gZnJvbSBcIi4vZ2FtZXMvdHJvb3Bhcy9sZXZlbHMvVHJvb3Bhc0xldmVsMS0xXCI7XG5pbXBvcnQgeyBUcm9vcGFTdGFydCB9IGZyb20gXCIuL2dhbWVzL3Ryb29wYXMvVHJvb3BhU3RhcnRcIjtcbmltcG9ydCAnLi9hc3NldHMvc3R5bGUuc2Nzcyc7XG5cbi8vIGltcG9ydCB7IExldmVsT25lQmFzZSwgT3RoZXJMZXZlbCB9IGZyb20gXCIuL2xldmVscy9nYW1lTGV2ZWxzXCI7XG4vLyBpbXBvcnQgeyBTdGFydExldmVsIH0gZnJvbSBcIi4vbGV2ZWxzL3N0YXJ0TGV2ZWxcIjtcblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICBjb25zdCBuZXdHYW1lID0gbmV3IEJhc2VkR2FtZSh7XG4gICAgY2FudmFzRWxlbWVudElkOiAnZ2FtZS1jb250YWluZXInLFxuICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAvLyB3aWR0aDogd2luZG93LmlubmVyV2lkdGggPiA2MDAgPyA2MDA6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgIC8vIHdpZHRoOiA0MDAsXG4gICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgLy8gaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgPiA4MDAgPyA4MDAgOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgLy8gaGVpZ2h0OiA2MDAsXG4gICAgbGV2ZWxzOiBbXG4gICAgICAvLyB7IGtleTogJ3N0YXJ0LWxldmVsJywgbGV2ZWw6IFN0YXJ0TGV2ZWwgfSxcbiAgICAgIC8vIHsga2V5OiAnbmV3LWxldmVsLTEnLCBsZXZlbDogT3RoZXJMZXZlbCB9LFxuICAgICAgLy8geyBrZXk6ICdsZXZlbC1vbmUnLCBsZXZlbDogTGV2ZWxPbmVCYXNlIH1cbiAgICAgIHsga2V5OiAnc3RhcnQtc2NyZWVuJywgbGV2ZWw6IFRyb29wYVN0YXJ0IH0sXG4gICAgICB7IGtleTogJ3Ryb29wYTEtMScsIGxldmVsOiBUcm9vcGFzTGV2ZWwxIH0sXG4gICAgXVxuICB9KVxuICBuZXdHYW1lLmVuYWJsZU1vdXNlKClcbiAgbmV3R2FtZS5lbmFibGVLZXlib2FyZCgpXG4gIG5ld0dhbWUuc3RhcnQoKVxufVxuXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydC1nYW1lJylcbmNvbnN0IGF1ZGlvUDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1ZGlvLWInKVxuLy8gY29uc3QgZmFrZVNvdW5kID0gbmV3IEF1ZGlvKClcbi8vIGNvbnN0IGZha2VTb3VuZCA9IG5ldyBBdWRpbygnaHR0cHM6Ly93d3cuZGl6emlzdGVybmJlcmcuY28udWsvbXVzaWMvUGljdHMubXAzJylcbmlmKHN0YXJ0QnRuICYmIGF1ZGlvUCAmJiBhdWRpb1ApIHtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgLy8gZmFrZVNvdW5kLm11dGVkID0gZmFsc2VcbiAgICAvLyBmYWtlU291bmQucGxheSgpXG4gICAgYXVkaW9QLnBsYXkoKVxuICAgIHN0YXJ0R2FtZSgpXG4gICAgc3RhcnRCdG4ucmVtb3ZlKClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGF1ZGlvUC5yZW1vdmUoKVxuICAgIH0sIDUwMClcbiAgICAvLyBhdWRpb1AucmVtb3ZlKClcbiAgfSlcblxufVxuXG4vLyBvcGVuRnVsbHNjcmVlbihuZXdHYW1lLmNhbnZhc0VsZW1lbnQpXG4vL1xuLy8gZnVuY3Rpb24gb3BlbkZ1bGxzY3JlZW4oZWxlbTogYW55KSB7XG4vLyAgIGlmIChlbGVtLnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4vLyAgICAgZWxlbS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuLy8gICB9IGVsc2UgaWYgKGVsZW0ud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHsgLyogU2FmYXJpICovXG4vLyAgICAgZWxlbS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuLy8gICB9IGVsc2UgaWYgKGVsZW0ubXNSZXF1ZXN0RnVsbHNjcmVlbikgeyAvKiBJRTExICovXG4vLyAgICAgZWxlbS5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XG4vLyAgIH1cbi8vIH1cbiJdLCJzb3VyY2VSb290IjoiIn0=