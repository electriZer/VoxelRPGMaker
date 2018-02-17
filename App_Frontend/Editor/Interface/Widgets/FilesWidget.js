/// <reference path="../../../jquery.d.ts"/>
/// <reference path="../Components/Bootstrap.ts"/>
class FilesWidget {
    /**
     * Creates a File Tree Side Bar Widget
     * @param {JQuery} $e Selected DOM Element
     * @param {string} Title Widget Title
     */
    constructor($e, Title = "Project Files") {
        this.PadLength = 15;
        this.$ELEMENT = $e;
        $e.empty();
        // read URL for Data Controller from Attribute
        this.URL = $e.data("file");
        this.PID = $e.data("pid");
        /*
        //// Button Group
        var $MainButtons = Bootstrap.ButtonToolbar("main-buttons");
        // New File Drop Down Button
        var DD_NewFile = Bootstrap.DropDownButton(Bootstrap.FAIcon("plus") + " New ", "DD_NewFile", "btn-link btn-sm", $MainButtons);
        Bootstrap.DropDownMenuItem("Folder", DD_NewFile).click(()=>this.CreateNewFolder());
        Bootstrap.DropDownMenuDivider(DD_NewFile);
        Bootstrap.DropDownMenuItem("Text File", DD_NewFile).click(this.CreateNewFile);
        Bootstrap.DropDownMenuItem("Map File", DD_NewFile).click(this.CreateNewMapFile);
        
        //// Append All Objects
        $e.append($MainButtons);
        */
        // Generate Folder Context Menu Element
        this.$FolderContextMenu = $("<div></div>");
        this.$FolderContextMenu.addClass("dropdown-menu context-menu").hide();
        Bootstrap.DropDownMenuItem("New Folder").click(this.CreateNewFolder).appendTo(this.$FolderContextMenu);
        Bootstrap.DropDownMenuItem("New Text File").click(this.CreateNewFile).appendTo(this.$FolderContextMenu);
        Bootstrap.DropDownMenuItem("New Map File").click(this.CreateNewMapFile).appendTo(this.$FolderContextMenu);
        Bootstrap.DropDownMenuDivider().appendTo(this.$FolderContextMenu);
        Bootstrap.DropDownMenuItem("Delete Folder").click(this.CreateNewFolder).appendTo(this.$FolderContextMenu);
        Bootstrap.DropDownMenuItem("Rename Folder").click(this.CreateNewFolder).appendTo(this.$FolderContextMenu);
        this.$FolderContextMenu.contextmenu((e) => e.preventDefault());
        $e.append(this.$FolderContextMenu);
        // Generate File Context Menu Element
        this.$FileContextMenu = $("<div></div>");
        this.$FileContextMenu.addClass("dropdown-menu context-menu").hide();
        Bootstrap.DropDownMenuItem("Delete File").click(this.CreateNewFolder).appendTo(this.$FileContextMenu);
        Bootstrap.DropDownMenuItem("Rename File").click(this.CreateNewFolder).appendTo(this.$FileContextMenu);
        Bootstrap.DropDownMenuItem("Copy File").click(this.CreateNewFolder).appendTo(this.$FileContextMenu);
        this.$FileContextMenu.contextmenu((e) => e.preventDefault());
        $e.append(this.$FileContextMenu);
        // Register Event to close Context menus on mouse click out
        $(document).on("mouseup", this.HandleContextMenuOut.bind(this));
        this.$LIST = Bootstrap.List().appendTo($e);
        if (!this.URL || this.URL.length < 3) {
            console.log("ERROR:FileWidget.URL not set");
        }
        else {
            this.CONNECTED = false;
            $.ajax({
                url: this.URL + "/" + this.PID,
                method: "GET",
                async: true,
                dataType: "json",
                success: (data) => {
                    this.Load(data, this.$LIST);
                }
            });
        }
        // Mark this Widget as loaded to prevent it from reloading 
        $e.attr("loaded", "true");
    }
    Dispose() {
        // Unregister Handlers
        $(document).off("mouseup", this.HandleContextMenuOut);
    }
    /**
     * Initializes and loads File List from File structure
     * @param RootFiles Array of Root Files
     * @param $Parent Parent Element Selector
     */
    Load(RootFiles, $Parent) {
        if (!$Parent)
            return;
        /**
         * Recursive Nested Function for traversing through File Array
         * @param Files Array Of Files in a Directory
         * @param Padding Deepness of a Directory
         * @param ParentPath Path to Parent of a Directory (Files List)
         */
        var RecursiveAdd = (Files, Padding = 0, ParentPath = "") => {
            if (!!Files && Files.length > 0) {
                var entry;
                // iterate through child entries
                for (var i = 0; i < Files.length; i++) {
                    entry = Files[i];
                    // Generate new HTML List Item
                    var $Entry = Bootstrap.ListItem()
                        .append("<a href='#'>" + entry.Name + "</a>")
                        .attr("data-parent-folder", ParentPath)
                        .css({ "padding-left": 5 + (this.PadLength * Padding) + "px" });
                    $Entry.attr("data-hfid", entry.ID);
                    // If current entry is a directory
                    if (entry.IS_DIR == "1") {
                        // Generate Path to a directory
                        var MyPath = ParentPath + "/" + FilesWidget.CharByNum(i);
                        $Entry.attr("data-folder-id", MyPath) // Store Path to this folder
                            .addClass("folder"); // Mark this Entry as Folder
                        // Toggle Directory paths
                        $Entry.click(
                        // This is nested anonymous function in a anonymous function
                        // Why? Because else the Variable "MyPath" references to the last state and not the current value we want to store
                        ((Path) => () => { this.HandleCollapse(Path); })(MyPath))
                            .contextmenu(MyPath, (e) => {
                            e.preventDefault();
                            this.HandleFolderContextMenu(e.data, e);
                        })
                            .appendTo($Parent);
                        // Recursive Call this function for all Children of this Directory
                        // stored in 'entry.Files' Array
                        RecursiveAdd(entry.Files, Padding + 1, MyPath);
                    }
                    else {
                        // add this class for folder icon
                        $Entry.addClass("file")
                            .click(((FILE) => () => { this.HandleFileOpen(FILE); })(entry))
                            .attr("data-file-id", entry.ID)
                            .contextmenu(entry.ID, (e) => {
                            e.preventDefault();
                            this.HandleFileContextMenu(e.data, e);
                        })
                            .appendTo($Parent);
                    }
                }
            }
            else {
                // Create a "Empty" List ITem
                var $Entry = Bootstrap.ListItem("<i>Empty</i>");
                $Entry.appendTo($Parent); // Add List Item to Files List
            }
        };
        // Start recursive call
        RecursiveAdd(RootFiles);
    }
    // HANDLERS :
    HandleFileContextMenu(FileID, event) {
        // get list item as JQuery Object
        this.$SelectedEntry = this.$ELEMENT.find("li[data-hfid='" + FileID + "']");
        // reposition context menu element
        this.$FileContextMenu.css({
            top: event.clientY,
            left: event.clientX
        });
        // show context menu element
        this.$FileContextMenu.show();
    }
    /**
     * Folder Context Menu Handler
     * @remarks This Function is bound to every folder entry in the file list
     * @param FolderId "data-folder-id" attritute value
     * @param event JQuery Mouse Event
     */
    HandleFolderContextMenu(FolderId, event) {
        // get list item as JQuery Object
        this.$SelectedEntry = this.$ELEMENT.find("li[data-folder-id='" + FolderId + "']");
        // reposition context menu element
        this.$FolderContextMenu.css({
            top: event.clientY,
            left: event.clientX
        });
        // show context menu element
        this.$FolderContextMenu.show();
    }
    /**
     * Checks at every mouseup event if the context menu needs to be closed (mouseout)
     * @param event
     */
    HandleContextMenuOut(event) {
        if (!this.$FolderContextMenu.is(event.target) && this.$FolderContextMenu.has(event.target).length === 0) {
            this.$FolderContextMenu.hide();
            this.$SelectedEntry = null;
        }
        if (!this.$FileContextMenu.is(event.target) && this.$FileContextMenu.has(event.target).length === 0) {
            this.$FileContextMenu.hide();
            this.$SelectedEntry = null;
        }
    }
    /**
     * Finds in the Children Array the Entries which are collapsed, and hides the collapsed child entries of those entries.
     * @param $Children
     */
    HideCollapsedChildren($Children) {
        //var $ChildFolders = this.$ELEMENT.find("li[data-folder-id^='"+FolderPath+"'].Collapsed");
        var $Parent = this.$ELEMENT;
        $Children.each(function () {
            var $this = $(this);
            if ($this.hasClass("Collapsed")) {
                $Parent.find("li[data-parent-folder^='" + $this.attr("data-folder-id") + "']").hide();
            }
        });
    }
    /**
     * Handles a Collapse Click on a List Entry
     * @param FolderPath
     */
    HandleCollapse(FolderID) {
        var $Folder = this.$ELEMENT.find("li[data-folder-id='" + FolderID + "']");
        if ($Folder.length > 0) {
            var $Children = this.$ELEMENT.find("li[data-parent-folder^='" + FolderID + "']");
            if ($Folder.hasClass("Collapsed")) {
                $Folder.removeClass("Collapsed");
                $Children.show();
                this.HideCollapsedChildren($Children);
            }
            else {
                $Children.hide();
                $Folder.addClass("Collapsed");
            }
        }
    }
    ;
    // MISC Functions
    static CharByNum(Num) {
        var Chars = 'abcdefghijklmnopqrstuvwxyz';
        // If Num is to high for a char then generate a prefix
        if (Num >= Chars.length) {
            var OverflowSize = Math.floor(Num / Chars.length);
            var CleanNum = (OverflowSize * Chars.length) - 1;
            return "_(" + OverflowSize + ")" + Chars.charAt(CleanNum) + "_";
        }
        // else just return the char
        return Chars.charAt(Num);
    }
    HandleFileOpen(File) {
        if (!File) {
            console.log("ERROR:FileWidget.HandleFileOpen:Unknown File Object");
        }
        console.log("Opening File :'" + File.Name + "'");
    }
    CreateNewFolder() {
        if (!this.CONNECTED || !this.$SelectedEntry)
            return;
    }
    CreateNewFile() {
        if (!this.CONNECTED || !this.$SelectedEntry)
            return;
    }
    CreateNewMapFile() {
        if (!this.CONNECTED || !this.$SelectedEntry)
            return;
    }
}
//# sourceMappingURL=FilesWidget.js.map