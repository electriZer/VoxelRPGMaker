/// <reference path="../../../jquery.d.ts"/>
class SideBar extends HTMLElement {
    /**
     * Simple Side Bar Widget with Title and Content
     */ 
        private _MinWidth: number;
    private _MaxWidth: number;

    private $xBarSplit: JQuery;

    static get observedAttributes() {
        return ["MinWidth","MaxWidth"/*,"Width"*/];
    }

    attributeChangedCallback(attr, old, Value) {
        switch (attr) {
            case "MinWidth": this._MinWidth = Value; break;
            case "MaxWidth": this._MaxWidth = Value; break;
            case "Width":
                if (Value > this._MinWidth && Value < this._MaxWidth) {
                    $(this).css("width", "w"+ Value);
                    console.log(Value);
                }
                break;
        }
    }

    createdCallback() {
        this._MinWidth = 150;
        this._MaxWidth = 500;
        $(this).ready(this.onLoaded.bind(this))
    }

    private onLoaded() {
        //$(this).css('width', this._MinWidth);
        // Init Bar Split
        this.$xBarSplit = $("<x-bar-split right><div></div></x-bar-split>")
            .mousedown(this.OnSplitMouseDown.bind(this))
            .appendTo(this);
    }

    private OnSplitMouseDown(e: JQueryMouseEventObject) {
        e.preventDefault();
        $(document).unbind('mousemove.xbarsplit'); // Unbind old events
        $(document).one('mouseup', () => $(document).unbind('mousemove.xbarsplit'));
        $(document).bind('mousemove.xbarsplit', this.OnSplitMouseDrag.bind(this));
        
    }

    private OnSplitMouseDrag(e: JQueryMouseEventObject) {
        var x = parseInt($(this).css("width")) + (e.pageX - this.$xBarSplit.offset().left) ;
        if (x < this._MaxWidth && e.pageX < ($(window).width())) {
            $(this).css("width", x > this._MinWidth ? x : this._MinWidth);
            this.Update();
        }
    }

    // For Hooks
    public Update() {
        $(this).children("x-bar-widget").trigger('update:size');
        //(this.$xSideBar as any).perfectScrollbar('update');
    }
}
var XSidebar = (<any>document).registerElement('x-side-bar', SideBar);