/// <reference path="../../../jquery.d.ts"/>
/// <reference path="../../../jquery.jstree.d.ts"/>
/// <reference path="../../Editor.ts" />
declare var vex: any;

class FileTreeWidgetHandlers {
    /**
    * @description Folder Handler
    */    
    public static "0" = function (id) {
        console.log("Open Folder " + id);
    }
    /**
    * @description Text File Handler
    */
    public static "1" = function (id) {
        console.log("Open Text File " + id);
    }
    /**
    * @description Map File Handler
    */
    public static "2" = function (id) {
        //TODO : Tab Manager to create new tab
        var tab = $("x-tab-view");
        var editor = new VEditor(tab);
        //editor.OnReady();
        console.log("Open Map File " + id);
    }
}

class FileTreeWidget extends HTMLElement {

    public FileTypeHandler: object;

    private $TREE: JQuery;
    private projectApiUrl: string;
    private projectID: string;
    private apiListFiles: string;

    public static Width: { min: number, max: number } = { min: 100, max: 500 };

    /**
     * @description Called from DOM when new HTML Custom tag "<x-file-tree-widget />" was created
     */
    createdCallback() {


        // initialize jquery selector for jsTree to null
        this.$TREE = null;

        // register ready callback for this element
        $(this).ready(this.connectedCallback.bind(this));
    }

    /**
     * @description Called from DOM when new HTML Custom tag "<x-file-tree-widget />" is ready
     */
    connectedCallback() {
        console.log($(this).attr("data-file"));
        // get Project ID from 'data-pid' attribute
        this.projectID = $(this).data("pid");
        // get REST API URL from 'data-file' attribute combined with Project ID
        this.projectApiUrl = $(this).data("file") + "/" + this.projectID;
        // set URL for API 'list' command
        this.apiListFiles = this.projectApiUrl + "/list";

        // Initialize jsTree via jQuery 
        this.$TREE = $(this).jstree({
            'core': {
                'data': {
                    'url': this.apiListFiles,
                },
                'check_callback': true,
                //'li_height': '16px'
            },
            'types': {
                '#': {
                    'icon': 'fa fa-folder'
                },
                '0': {
                    'icon': 'fa fa-folder'
                },
                '1': {
                    'icon': 'fa fa-file-text',
                    'valid_children': []
                },
                '2': {
                    'icon': 'fa fa-cubes',
                    'valid_children': []
                }
            },
            'contextmenu': {
                'items': this.GenerateConextMenu.bind(this)
            },
            'plugins': ['contextmenu', 'types', 'wholerow', 'unique']
        });
        // register jsTree "Create Node" Event
        this.$TREE.on('create_node.jstree', function (e, data) {
            $.post(this.projectApiUrl + "/add", { 'type': data.node.type, 'parent': data.node.parent, 'text': data.node.text })
                .done(function (d) {
                    data.instance.set_id(data.node, d.id);
                })
                .fail(function () {
                    data.instance.refresh();
                });
        }.bind(this));
        // register jsTree "Rename Node" Event
        this.$TREE.on('rename_node.jstree', function (e, data) {
            $.post(this.projectApiUrl + "/update", data.node)
                .done(function (d) {
                    data.instance.set_id(data.node, d.id);
                })
                .fail(function () {
                    data.instance.refresh();
                });
        }.bind(this));

        // register jsTree "Delete Node" Event
        this.$TREE.on('delete_node.jstree', function (e, data) {
            $.post(this.projectApiUrl + "/remove", data.node)
                .done(function (d) {
                    if (d.error) {
                        data.instance.refresh();
                    }
                })
                .fail(function () {
                    data.instance.refresh();
                });
        }.bind(this));

        // register jsTree "Double Click" Event
        this.$TREE.on('dblclick.jstree', function (e) {
            var node = this.$TREE.jstree().get_node(e.target);
            if (FileTreeWidgetHandlers.hasOwnProperty(node.type)) {
                FileTreeWidgetHandlers[node.type](node.id);
            }
        }.bind(this));

        // register jsTree "Double Click" Event
        this.$TREE.on('after_open.jstree', function (e) {
            // Get parent sidebar
            var parentSideBar: any = $(this).parentsUntil("x-bar");
            // Update perfectScrollbar of parent sidebar
            parentSideBar.perfectScrollbar('update');
        }.bind(this));
    }

    private GenerateConextMenu(Node: any): any {
        var items: any = {};
        if (Node.type == "#" || Node.type == "0") {
            items.new = {
                'label': 'New',
                'separator_after': true,
                'submenu': {
                    'new_folder': {
                        'label': 'Folder',
                        'separator_after': true,
                        'action': this.NewFolderClicked
                    },
                    'new_file_txt': {
                        'label': 'Text File',
                        'action': this.NewTextFileClicked
                    },
                    'new_file_map': {
                        'label': 'Map File',
                        'action': this.NewMapFileClicked
                    }
                }
            }
        }
        items.rename = {
            'label': 'Rename',
            'action': this.RenameNode
        }
        items.remove = {
            'label': 'Delete',
            'action': this.RemoveNode.bind(this)
        }
        return items;
    }
    public RemoveNode(data) {
        var inst = $.jstree.reference(data.reference);
        $.each(inst.get_selected(true), (i, o) => {
            if (o.id == 0) return;
            inst.delete_node(o);
        });
    }
    public RenameNode(data) {
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);
        inst.select_node(obj);
        inst.edit(obj);
    }
    public NewFolderClicked(data) {
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);

        var new_node = inst.create_node(obj, { type: "0", "text": "New Folder" }, "last", (new_node) => {
            setTimeout(() => { inst.edit(new_node); }, 0);
        });
    }
    public NewTextFileClicked(data) {
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);

        var new_node = inst.create_node(obj, { type: "1", "text": "New Text File" }, "last", (new_node) => {
            setTimeout(() => { inst.edit(new_node); }, 0);
        });
    }
    public NewMapFileClicked(data) {
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);

        var new_node = inst.create_node(obj, { type: "2", "text": "New Map File" }, "last", (new_node) => {
            setTimeout(() => { inst.edit(new_node); }, 0);
        });
    }
}
var XFileTree = (<any>document).registerElement('x-file-tree', FileTreeWidget);