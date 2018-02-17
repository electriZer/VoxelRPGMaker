/// <reference path="../../../jquery.d.ts"/>
class SimpleBarWidget extends HTMLElement {
    static get observedAttributes() {
        return ["title"];
    }
    
    attributeChangedCallback(attr, old, Value) {
        if (attr == "title") this.$Title.val(Value);
    }

    private $Title: JQuery;
    private $Content: JQuery;

    createdCallback() {
        $(this).ready(this.onLoaded.bind(this))
    }
    private onLoaded() {
        // Get current HTML Content
        var htmlContent = $(this).html();

        // Create new Title bar Element
        this.$Title = $('<h2 class="title">' + $(this).attr('title') + '</h2>');
        // Create new Content container and copy HTML Content into it
        this.$Content = $('<div class="content"></div>').html(htmlContent);

        // Clear current content and append new generatet Title and Content Container
        $(this).empty()
            .append(this.$Title)
            .append(this.$Content);

        // Initialize perfect scrollbar via jQuery on Content Container
        (<any>this.$Content).perfectScrollbar();

        // Register rezise event to update perfect Scrollbar
        this.$Content.on("update:size", () => (<any>this.$Content).perfectScrollbar('update'));
    }
}
// Register custom Element
var XBarWidget = (<any>document).registerElement('x-bar-widget', SimpleBarWidget);