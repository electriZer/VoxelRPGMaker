/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
var VGL;
(function (VGL) {
    var Handlers;
    (function (Handlers) {
        class InputHandler {
            constructor(Context) {
                this.mouseDragX = 0;
                this.mouseDragY = 0;
                this.mouseClickX = 0;
                this.mouseClickY = 0;
                this.MouseLeftPressed = false;
                this.MouseRightPressed = false;
                this.IsTouch = false;
                this.MouseRightTouched = false;
                this.OnMouseClickedEvents = {};
                this.OnMouseMovedEvents = {};
                this.CTRLPressed = false;
                this.ContextContainer = Context.Options.Parent; // DOM Element containing the Canvas
                this.ContextContainer.addEventListener("mousedown", (e) => { this.mousedown(e); });
                this.ContextContainer.addEventListener("contextmenu", (e) => { e.preventDefault(); });
                this.ContextContainer.addEventListener("mouseout", (e) => { this.mouseout(e); });
                this.ContextContainer.addEventListener("mouseup", (e) => { this.mouseup(e); });
                this.ContextContainer.addEventListener("mousemove", (e) => { this.mousemove(e); });
                this.ContextContainer.addEventListener("touchstart", (e) => { this.touchstart(e); }, false);
                this.ContextContainer.addEventListener("touchout", (e) => { this.touchout(e); }, false);
                this.ContextContainer.addEventListener("touchend", (e) => { this.touchend(e); }, false);
                this.ContextContainer.addEventListener("touchmove", (e) => { this.touchmove(e); }, false);
            }
            touchstart(e) {
                this.touchBuffer = {};
                if (e.touches.length < 1)
                    return;
                this.touchBuffer["main"] = e.touches[0].identifier;
                this.mouseClickX = e.touches[0].pageX;
                this.mouseClickY = e.touches[0].pageY;
                this.mouseDragX = 0;
                this.mouseDragY = 0;
                this.CTRLPressed = e.ctrlKey;
                this.MouseLeftPressed = true;
                if (e.touches.length > 1)
                    this.MouseRightTouched = true;
                else
                    this.MouseRightTouched = false;
                this.IsTouch = true;
                e.preventDefault();
            }
            touchout(e) {
                var main = false;
                for (var i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier == this.touchBuffer["main"]) {
                        main = true;
                        break;
                    }
                }
                if (e.touches.length <= 1)
                    this.MouseRightTouched = false;
                this.MouseLeftPressed = !main;
                if (main) {
                    this.mouseClickX = 0;
                    this.mouseClickY = 0;
                    this.mouseDragX = 0;
                    this.mouseDragY = 0;
                    this.CTRLPressed = false;
                    this.touchBuffer["main"] = -1;
                    this.IsTouch = false;
                }
                e.preventDefault();
            }
            touchend(e) {
                var main = false;
                for (var i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier == this.touchBuffer["main"]) {
                        main = true;
                        break;
                    }
                }
                if (e.touches.length <= 1)
                    this.MouseRightTouched = false;
                this.MouseLeftPressed = !main;
                if (main) {
                    this.mouseClickX = 0;
                    this.mouseClickY = 0;
                    this.mouseDragX = 0;
                    this.mouseDragY = 0;
                    this.CTRLPressed = false;
                    this.touchBuffer["main"] = -1;
                    this.IsTouch = false;
                }
                e.preventDefault();
            }
            touchmove(e) {
                var main = false;
                var i = 0;
                for (i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier == this.touchBuffer["main"]) {
                        main = true;
                        break;
                    }
                }
                if (main) {
                    this.mouseDragX = this.mouseClickX - e.touches[i].pageX;
                    this.mouseDragY = this.mouseClickY - e.touches[i].pageY;
                }
                this.CTRLPressed = e.ctrlKey;
                e.preventDefault();
            }
            mousedown(e) {
                e.preventDefault();
                this.mouseClickX = e.pageX;
                this.mouseClickY = e.pageY;
                this.mouseDragX = 0;
                this.mouseDragY = 0;
                this.CTRLPressed = e.ctrlKey;
                if (e.button == 0)
                    this.MouseLeftPressed = true;
                else if (e.button == 2)
                    this.MouseRightPressed = true;
                this.IsTouch = false;
            }
            mouseout(e) {
                this.MouseRightPressed = false;
                this.MouseLeftPressed = false;
                this.mouseClickX = 0;
                this.mouseClickY = 0;
                this.mouseDragX = 0;
                this.mouseDragY = 0;
                this.CTRLPressed = false;
            }
            mouseup(e) {
                e.preventDefault();
                if (e.button == 0) {
                    this.MouseLeftPressed = false;
                    for (var evnt in this.OnMouseClickedEvents) {
                        if (this.OnMouseClickedEvents.hasOwnProperty(evnt)) {
                            this.OnMouseClickedEvents[evnt](e);
                        }
                    }
                }
                else if (e.button == 2) {
                    this.MouseRightPressed = false;
                }
                this.CTRLPressed = e.ctrlKey;
            }
            mousemove(e) {
                e.preventDefault();
                this.mouseDragX = this.mouseClickX - e.pageX;
                this.mouseDragY = this.mouseClickY - e.pageY;
                this.CTRLPressed = e.ctrlKey;
                for (var evnt in this.OnMouseMovedEvents) {
                    if (this.OnMouseMovedEvents.hasOwnProperty(evnt)) {
                        this.OnMouseMovedEvents[evnt](e);
                    }
                }
            }
        }
        Handlers.InputHandler = InputHandler;
    })(Handlers = VGL.Handlers || (VGL.Handlers = {}));
})(VGL || (VGL = {}));
//# sourceMappingURL=InputHandler.js.map