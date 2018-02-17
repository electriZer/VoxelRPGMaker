/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="../VGL/Context.ts"/>
/// <reference path="Interface/Widgets/FilesWidget.ts"/>
/// <reference path="../jquery.d.ts"/>
class VEditor {
    /**
     * Initializes a new VEditor instance with a Rendering Context into
     * the givin ContetContainerElement.
     *
     * @param ContextContainerElement DOM Element where the Canvas will be placed in (default = document.body)
     */
    constructor(ContextContainerElement) {
        this.Ray = new THREE.Raycaster();
        this.SelectedEntity = null;
        this.SelectedEntityMesh = null;
        this.SelectionDirty = false;
        this.PlaneSelected = null;
        this.CurrentFieldPosition = null;
        // ==== INIT CONTEXT AND APPEND IT TO THIS INSTANCE =================
        // Specify a valid DOM Element as Canvas Container
        var ContextContainer = ContextContainerElement || null;
        // Set Options von Context 
        var ContextOptions = {
            // Set OnLoad callback and bind function to current Instance of VEditor
            OnLoaded: this.OnReady.bind(this),
            // Brick Pack ID
            BrickPack: "0",
            // Width and Height of Canvas DOM Element
            Width: ContextContainer.clientWidth,
            Height: ContextContainer.clientHeight,
            // DOM Element where to append the Canvas
            Parent: ContextContainer
        };
        // Construct Context
        // After construction it will fie "OnLoaded" event and be appended
        // to the new VEditor Instance
        new VGL.Context(ContextOptions);
    }
    // Create Ray from MouseClick and find out which Element was clicked
    SelectEntity(event) {
        if (!event.ctrlKey)
            return;
        this.SelectedEntity = null;
        this.SelectionDirty = true;
        var canvas = this.Context.getCanvas();
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var mouse = {
            x: ((event.clientX - canvas.offsetLeft) / canvasWidth) * 2 - 1,
            y: -((event.clientY - canvas.offsetTop) / canvasHeight) * 2 + 1
        };
        this.Ray.setFromCamera(mouse, this.Context.CurrentCamera);
        var intersects = this.Ray.intersectObjects(this.Context.getScene().children);
        //console.dir(intersects);
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].object instanceof THREE.Mesh) {
                    if (isSetTrue(intersects[i].object.userData.isBrick)) {
                        var SelectedEntity = this.Context.getEntityByMesh((intersects[i].object));
                        if (SelectedEntity != false) {
                            this.SelectedEntity = (SelectedEntity);
                        }
                    }
                }
            }
        }
        //console.log(this.SelectedEntity);
    }
    PlaceEntity(event) {
        if (event.ctrlKey || this.SelectedEntity == null || this.SelectedEntityMesh == null)
            return;
        var NewBrick = new VGL.Entities.Brick(this.SelectedEntityMesh.clone(), this.Context);
        this.Context.addChild(NewBrick);
    }
    HighLightGrid(event) {
        if (event.ctrlKey)
            return;
        this.CurrentFieldPosition = null;
        var canvas = this.Context.getCanvas();
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var mouse = {
            x: ((event.clientX - canvas.offsetLeft) / canvasWidth) * 2 - 1,
            y: -((event.clientY - canvas.offsetTop) / canvasHeight) * 2 + 1
        };
        this.Ray.setFromCamera(mouse, this.Context.CurrentCamera);
        var intersects = this.Ray.intersectObjects(this.Context.getScene().children);
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].object instanceof THREE.Mesh) {
                    if (isSetTrue(intersects[i].object.userData.isGridElement)) {
                        var Field = (intersects[i].object.userData);
                        this.Grid.HighlightField(Field);
                        this.CurrentFieldPosition = Field.Position;
                    }
                }
            }
        }
        if (this.CurrentFieldPosition == null || this.SelectedEntityMesh != null) {
            this.Grid.HighlightClear();
        }
    }
    /**
     * Clones the selected Entity and Moves it to the Mouse Position on the Grid
     * @param event
     * @constructor
     */
    MoveSelected(event) {
        // Check if no Entity was selected
        if (this.SelectedEntity == null) {
            // Check if there is a Cloned Mesh still showing
            if (this.SelectedEntityMesh != null) {
                // Remove it from the scene and delete it
                this.Context.getScene().remove(this.SelectedEntityMesh);
                this.SelectedEntityMesh = null;
            }
            return;
        }
        // Check if there is no cloned Mesh
        if (this.SelectedEntityMesh == null || this.SelectionDirty) {
            // Check if the selected Entity is a clonable one
            if (this.SelectedEntity instanceof VGL.Entities.Brick) {
                // Clone the Mesh of the Entity and add it to the Scene
                this.SelectedEntityMesh = this.SelectedEntity.getMesh().clone();
                this.Context.getScene().add(this.SelectedEntityMesh);
                this.SelectionDirty = false;
            }
            else {
                return;
            }
        }
        else if (this.CurrentFieldPosition != null) {
            // Set the Position of the cloned Mesh to the selected Field Position on the Grid
            this.SelectedEntityMesh.position.set(this.CurrentFieldPosition.x, this.CurrentFieldPosition.y, this.CurrentFieldPosition.z);
        }
    }
    OnReady(Context) {
        this.Context = Context;
        this.Context.InputHandler.OnMouseClickedEvents["SelectObject"] = this.SelectEntity.bind(this);
        this.Context.InputHandler.OnMouseClickedEvents["PlaceObject"] = this.PlaceEntity.bind(this);
        this.Context.InputHandler.OnMouseMovedEvents["HighlightGrid"] = this.HighLightGrid.bind(this);
        this.Context.InputHandler.OnMouseMovedEvents["DragObject"] = this.MoveSelected.bind(this);
        console.log("Ready");
        var Test = Context.Create.Brick("grass", [0, 0, 0]);
        this.Grid = new VGL.Entities.Grid(Context);
        Context.Draw();
        //Test.getMesh().rotateX(45);
        //Test.getMesh().rotateZ(-45);
        /*Context.UpdateRequest["RotateCube"] = (Context)=>{
         Test.getMesh().rotateY(5/(60*30));
         }*/
        //setTimeout(()=>{Context.Create.Brick("grass",[0,0,0])},1000);
    }
}
;
//# sourceMappingURL=Editor.js.map