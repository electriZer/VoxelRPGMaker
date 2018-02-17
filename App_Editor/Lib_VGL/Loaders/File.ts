/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */

namespace VGL.Loaders{
    declare var ActiveXObject: any;

    export class json{
        public static GET(url:string,callback:Function){
            try {
                var x = new ( XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                x.open('GET', url, true);
                x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                x.onreadystatechange = function () {
                    if (x.readyState > 3 && callback) { callback(JSON.parse(x.responseText)); }
                };
                x.send();
            } catch (e) {
                window.console && console.log(e);
            }
        }
    }
    export class File{
        public static GET(url: string, callback: Function) {
            try {
                var x = new ( XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                x.open('GET', url, true);
                x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                x.onreadystatechange = function () {
                    if (x.readyState > 3 && callback) { callback(x.responseText); }
                };
                x.send();
            } catch (e) {
                window.console && console.log(e);
            }
        }

        public static POST(url: string, callback: Function, data: any) {
            try {
                var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                x.open('POST', url, 1);
                x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                x.onreadystatechange = function () {
                    x.readyState > 3 && callback && callback(x.responseText);
                };
                x.send(data)
            } catch (e) {
                window.console && console.log(e);
            }
        }
    }
}