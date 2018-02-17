/**
 * This Class generates Bootstrap Components with JQuery
 */
class Bootstrap {
    /**
     * Simple Button
     * @param {string} Caption The button caption as HTML or basic text
     * @param {boolean} ariaLabel HTML Tag "aria-label"
     */
    static Button(Caption, ariaLabel) {
        var $btn = $("button").attr("type", "button").addClass("btn btn-default").append(Caption);
        if (ariaLabel) {
            $btn.attr("aria-label", ariaLabel);
        }
        return $btn;
    }
    /**
     * DropDownButton
     * @param {string} Caption The button caption as HTML or basic text
     * @param {string} DropDownID A unique Name for this DropDown Button (will be the ID for the Button element)
     * @param {JQuery} $Parent Parent Element (f.e. Toolbar)
     * //@param {array} MenuEntries Array containing all Drop Down Menu Elements
     * @returns {DropDownButtonReturnValue} Object containing Button and Menu Container
     */
    static DropDownButton(Caption, DropDownID = "", btnType = "btn-secondary", $Parent = null /*,MenuEntries:any[]=[]*/) {
        let _R = { Group: null, btn: null, menu: null };
        _R.btn = $('<button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>')
            .attr("id", DropDownID)
            .addClass(btnType)
            .append(Caption);
        // Create Drop Down Menu Container
        _R.menu = $('<div class="dropdown-menu" ></div>').attr("aria-labelledby", DropDownID);
        // If those Parameters are defined
        /*if(!!MenuEntries && !!DropDownID){
             // Append all Drop Down Element Entries to it
             MenuEntries.forEach((MenuEntry)=>{
                 _R.menu.append(MenuEntry);
             });
        }*/
        _R.Group = Bootstrap.ButtonGroup().append(_R.btn, _R.menu);
        if (!!$Parent) {
            $Parent.append(_R.Group);
        }
        return _R;
    }
    static DropDownMenuDivider(DropDownButton = null) {
        var $divider = $('<div class="dropdown-divider"></div>');
        if (DropDownButton && DropDownButton.menu) {
            DropDownButton.menu.append($divider);
        }
        return $divider;
    }
    static DropDownMenuItem(Caption, DropDownButton = null) {
        var $btn = $('<a href="#" class="dropdown-item"></a>').append(Caption);
        if (DropDownButton && DropDownButton.menu) {
            DropDownButton.menu.append($btn);
        }
        return $btn;
    }
    /**
     * Button Group
     */
    static ButtonGroup(ClassName = "") {
        return $('<div class="btn-group" role="group"></div>').addClass(ClassName);
    }
    static ButtonToolbar(ClassName = "") {
        return $('<div class="btn-toolbar" role="toolbar"></div>').addClass(ClassName);
    }
    /**
     * Font Awesome Icon
     * @param {string} name Icon Name
     * @param {boolean} AsString Return as HTML String or as JQuery Object
     */
    static FAIcon(name, AsString = true) {
        //return $('<i class="fa fa-'+name+'"></i>').attr("aria-hidden","true");
        if (AsString) {
            return '<i class="fa fa-' + name + '" aria-hidden="true"></i>';
        }
        else {
            return $('<i class="fa fa-' + name + '" aria-hidden="true"></i>');
        }
    }
    static List(StyleClasses = "") {
        return $("<ul class='list-group'></ul>").addClass(StyleClasses);
    }
    static ListItem(Content = "", StyleClasses = "") {
        return $("<li class='list-group-item'></li>").addClass(StyleClasses).html(Content);
    }
}
//# sourceMappingURL=Bootstrap.js.map