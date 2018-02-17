/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="Lib_VGL/Context.ts"/>

class VEditor {
    /**
     * Initializes a new VEditor instance with a Rendering Context into
     * the givin ContetContainerElement.
     * 
     * @param ContextContainerElement JQuery to Element where the Canvas will be placed in (default = document.body)
     */
    constructor(ContextContainerElement: HTMLElement) { 
        // ==== INIT CONTEXT AND APPEND IT TO THIS INSTANCE =================
        // Specify a valid DOM Element as Canvas Container
        var ContextContainer = ContextContainerElement || null;
        // Set Options von Context 
        var ContextOptions = {
            // Set OnLoad callback and bind function to current Instance of VEditor
            OnLoaded : this.OnReady.bind(this),
            // Brick Pack ID
            BrickPack : "0",
            // Width and Height of Canvas DOM Element
            Width : ContextContainer.clientWidth,
            Height : ContextContainer.clientHeight,
            // DOM Element where to append the Canvas
            Parent: ContextContainer
        };
        // Construct Context
        // After construction it will fie "OnLoaded" event and be appended
        // to the new VEditor Instance
        new VGL.Context (ContextOptions);   
    }
    
    private Ray = new THREE.Raycaster();

    private Context: VGL.Context;

    private CurrentFieldPosition: THREE.Vector3 = null;
    private SelectedEntity: VGL.Entity      = null;
    private SelectedEntityMesh: THREE.Mesh = null;
    private SelectionDirty: boolean         = false;
    private PlaneSelected: boolean          = null;
    private Grid: VGL.Entities.Grid;

    /**
    * Create Ray from MouseClick and find out which Element was clicked
    *
    * @param event Mouse Event Information
    */
    private SelectEntity(event: MouseEvent) {
        // This Function only works with CTRL Key Pressed
        if (!event.ctrlKey)
            return;

        // Reset Tmp Variables
        this.SelectedEntity = null;
        this.SelectionDirty = true;

        // Get Canvas Element and Information
        var canvas = this.Context.getCanvas();
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;

        // Calculate Mouse Position in Canvas
        var mouse = {
            x : ((event.clientX - canvas.offsetLeft) / canvasWidth) * 2 - 1,
            y : - ((event.clientY - canvas.offsetTop) / canvasHeight) * 2 + 1
        }

        // Raycast from mouse position
        this.Ray.setFromCamera(mouse, this.Context.CurrentCamera);

        // Test which Scene Objects the ray intersects 
        var intersects = this.Ray.intersectObjects(this.Context.getScene().children);

        // If ray intersects scene objects
        if (intersects.length > 0) {
            // Iterate through list of intersected Objects 
            for (var i = 0; i < intersects.length; i++) {
                // Continue loop if object is not a Mesh
                if (!(intersects[i].object instanceof THREE.Mesh))
                    continue;
                // Check if intersected object is a brick mesh
                if (isSetAndTrue(intersects[i].object.userData.isBrick)) {
                    // Get Entity Reference of intersected object
                    var EntityOfObject = this.Context.getEntityByMesh(<THREE.Mesh>(intersects[i].object));
                    // check if Entity was found by getEntityByMesh
                    if (EntityOfObject != false) {
                        // Store Entity of intersected objet in tmp class variable 
                        this.SelectedEntity = <VGL.Entity>(EntityOfObject);
                    }
                }

            }
        }
    }

    /**
     * 
     * @param event
     */
    private PlaceEntity (event:MouseEvent){
        if(event.ctrlKey || this.SelectedEntity==null || this.SelectedEntityMesh==null) return;
        var NewBrick = new VGL.Entities.Brick(this.SelectedEntityMesh.clone(), this.Context);
        this.Context.addChild(NewBrick);
    }


    /**
     * 
     * @param event
     */
    private HighLightGrid(event:MouseEvent){
        if(event.ctrlKey)return;
        this.CurrentFieldPosition = null;

        var canvas = this.Context.getCanvas();
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var mouse = {
            x : ((event.clientX - canvas.offsetLeft) / canvasWidth) * 2 - 1,
            y : - ((event.clientY - canvas.offsetTop) / canvasHeight) * 2 + 1
        }
        this.Ray.setFromCamera(mouse,this.Context.CurrentCamera);
        var intersects = this.Ray.intersectObjects(this.Context.getScene().children);
        if(intersects.length>0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].object instanceof THREE.Mesh) {
                    if(isSetAndTrue(intersects[i].object.userData.isGridElement)){
                        var Field = <VGL.Entities.GridField>(intersects[i].object.userData);
                        this.Grid.HighlightField(Field);
                        this.CurrentFieldPosition = Field.Position;
                    }
                }
            }
        }
        if(this.CurrentFieldPosition == null || this.SelectedEntityMesh!=null){
            this.Grid.HighlightClear();
        }
    }

    /**
     * Clones the selected Entity and Moves it to the Mouse Position on the Grid
     * @param event
     * @constructor
     */
    private MoveSelected(event:MouseEvent){
        // Check if no Entity was selected
            if(this.SelectedEntity==null){
            // Check if there is a Cloned Mesh still showing
            if(this.SelectedEntityMesh!=null){
                // Remove it from the scene and delete it
                this.Context.getScene().remove(this.SelectedEntityMesh);
                this.SelectedEntityMesh = null;
            }
            return;
        }
        // Check if there is no cloned Mesh
        if(this.SelectedEntityMesh==null || this.SelectionDirty) {
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
            // Check if there is Field Position on the Grid where we can move the Mesh
        else if (this.CurrentFieldPosition!=null){
            // Set the Position of the cloned Mesh to the selected Field Position on the Grid
            this.SelectedEntityMesh.position.set(this.CurrentFieldPosition.x,this.CurrentFieldPosition.y,this.CurrentFieldPosition.z);
        }
    }
    private OnReady (Context:VGL.Context) {
        this.Context = Context;

        this.Context.InputHandler.OnMouseClickedEvents["SelectObject"] = this.SelectEntity.bind(this);
        this.Context.InputHandler.OnMouseClickedEvents["PlaceObject"] = this.PlaceEntity.bind(this);

        this.Context.InputHandler.OnMouseMovedEvents["HighlightGrid"] = this.HighLightGrid.bind(this);
        this.Context.InputHandler.OnMouseMovedEvents["DragObject"] = this.MoveSelected.bind(this);

        console.log("Ready");
        var Test = Context.Create.Brick("grass",[0,0,0]);
        this.Grid = new VGL.Entities.Grid(Context,10,10,10);

        Context.Draw();


        //Test.getMesh().rotateX(45);
        //Test.getMesh().rotateZ(-45);
        /*Context.UpdateRequest["RotateCube"] = (Context)=>{
         Test.getMesh().rotateY(5/(60*30));
         }*/
        //setTimeout(()=>{Context.Create.Brick("grass",[0,0,0])},1000);
    }
};
