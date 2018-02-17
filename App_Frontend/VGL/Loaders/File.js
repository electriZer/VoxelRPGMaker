/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
var VGL;
(function (VGL) {
    var Loaders;
    (function (Loaders) {
        class json {
            static GET(url, callback) {
                try {
                    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                    x.open('GET', url, true);
                    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    x.onreadystatechange = function () {
                        if (x.readyState > 3 && callback) {
                            callback(JSON.parse(x.responseText));
                        }
                    };
                    x.send();
                }
                catch (e) {
                    window.console && console.log(e);
                }
            }
        }
        Loaders.json = json;
        class File {
            static GET(url, callback) {
                try {
                    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                    x.open('GET', url, true);
                    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    x.onreadystatechange = function () {
                        if (x.readyState > 3 && callback) {
                            callback(x.responseText);
                        }
                    };
                    x.send();
                }
                catch (e) {
                    window.console && console.log(e);
                }
            }
            static POST(url, callback, data) {
                try {
                    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                    x.open('POST', url, 1);
                    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    x.onreadystatechange = function () {
                        x.readyState > 3 && callback && callback(x.responseText);
                    };
                    x.send(data);
                }
                catch (e) {
                    window.console && console.log(e);
                }
            }
        }
        Loaders.File = File;
    })(Loaders = VGL.Loaders || (VGL.Loaders = {}));
})(VGL || (VGL = {}));
//# sourceMappingURL=File.js.map