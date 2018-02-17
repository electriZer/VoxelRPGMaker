/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
namespace VGL.Handlers {
    export interface MouseCallBackChunk {
        [k: string]: (e:MouseEvent)=>void;
    }
    export class InputHandler {
        private ContextContainer: HTMLElement;

        public mouseDragX = 0;
        public mouseDragY = 0;

        public mouseClickX = 0;
        public mouseClickY = 0;

        public MouseLeftPressed = false;
        public MouseRightPressed = false;

        public IsTouch = false;
        public MouseRightTouched = false;

        public OnMouseClickedEvents: MouseCallBackChunk = {};
        public OnMouseMovedEvents: MouseCallBackChunk  = {};
        public CTRLPressed = false;

        constructor(Context: Context) {
            this.ContextContainer = Context.Options.Parent; // DOM Element containing the Canvas

            this.ContextContainer.addEventListener("mousedown", (e: any) => { this.mousedown(e); });
            this.ContextContainer.addEventListener("contextmenu", (e: any) => { e.preventDefault();  });

            this.ContextContainer.addEventListener("mouseout", (e: any) => { this.mouseout(e); });
            this.ContextContainer.addEventListener("mouseup", (e: any) => { this.mouseup(e); });
            this.ContextContainer.addEventListener("mousemove", (e: any) => { this.mousemove(e); });

            this.ContextContainer.addEventListener("touchstart", (e: any) => { this.touchstart(e); }, false);
            this.ContextContainer.addEventListener("touchout", (e: any) => { this.touchout(e); }, false);
            this.ContextContainer.addEventListener("touchend", (e: any) => { this.touchend(e); }, false);
            this.ContextContainer.addEventListener("touchmove", (e: any) => { this.touchmove(e); }, false);
        }

        private touchBuffer: Object;

        private touchstart(e: TouchEvent) {
            this.touchBuffer = {};

            if (e.touches.length < 1) return;
            this.touchBuffer["main"] = e.touches[0].identifier;
            this.mouseClickX = e.touches[0].pageX;
            this.mouseClickY = e.touches[0].pageY;
            this.mouseDragX = 0;
            this.mouseDragY = 0;
            this.CTRLPressed = e.ctrlKey;

            this.MouseLeftPressed = true;
            if (e.touches.length > 1) this.MouseRightTouched = true;
            else this.MouseRightTouched = false;
            this.IsTouch = true;
            e.preventDefault();

        }

        private touchout(e: TouchEvent) {
            var main = false;
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier == this.touchBuffer["main"]) {
                    main = true;
                    break;
                }
            }
            if (e.touches.length <= 1) this.MouseRightTouched = false;
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

        private touchend(e: TouchEvent) {
            var main = false;
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier == this.touchBuffer["main"]) {
                    main = true;
                    break;
                }
            }
            if (e.touches.length <= 1) this.MouseRightTouched = false;
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

        private touchmove(e: TouchEvent) {
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

        private mousedown(e: MouseEvent) {
            e.preventDefault();

            this.mouseClickX = e.pageX;
            this.mouseClickY = e.pageY;
            this.mouseDragX = 0;
            this.mouseDragY = 0;
            this.CTRLPressed = e.ctrlKey;

            if (e.button == 0) // Left Click
                this.MouseLeftPressed = true;
            else if (e.button == 2) // Right Click
                this.MouseRightPressed = true;
            this.IsTouch = false;
        }

        private mouseout(e: MouseEvent) {
            this.MouseRightPressed = false;
            this.MouseLeftPressed = false;
            this.mouseClickX = 0;
            this.mouseClickY = 0;
            this.mouseDragX = 0;
            this.mouseDragY = 0;
            this.CTRLPressed = false;

        }
        private mouseup(e: MouseEvent) {
            e.preventDefault();

            if (e.button == 0) // Left Click
            {
                this.MouseLeftPressed = false;
                for (var evnt in this.OnMouseClickedEvents) {
                    if (this.OnMouseClickedEvents.hasOwnProperty(evnt)) {
                        this.OnMouseClickedEvents[evnt](e);
                    }
                }
            }
            else if (e.button == 2) // Right Click
            {
                this.MouseRightPressed = false;
            }
            this.CTRLPressed = e.ctrlKey;
        }
        private mousemove(e: MouseEvent) {
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
}