/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
var VGL;
(function (VGL) {
    class Entity {
        /**
         * @param parent The Parent Entity if this is a child (default=null)
         * @param canCreateScene Create a new Scene if no Parent is defined (default:false)
         */
        constructor(parent = null, canCreateScene = false) {
            this.ChildEntities = [];
            this.ID = ++Entity.ID_Counter;
            this.Parent = parent;
            if (this.Parent != null) {
                this.Parent.addChild(this);
                this.Scene = this.Parent.getScene();
            }
            else {
                if (canCreateScene) {
                    this.Scene = new THREE.Scene();
                }
                else {
                    this.Scene = null;
                }
            }
        }
        /**
         * Returns Current Scene or false if no Scene is set
         * @returns {THREE.Scene}
         */
        getScene() {
            if (this.Scene != null)
                return this.Scene;
            else if (this.getParent() != null)
                return this.getParent().getScene();
        }
        addChild(Child) {
            if (!this.hasChild(Child)) {
                this.ChildEntities.push(Child);
            }
            return this;
        }
        /**
         * Searches for Entity in Child Entities and removes it from the Tree
         * @param Child Searched Entity
         * @param DeepSearch Asks Child Entities and their Childs for searched Entity
         * @param destroy Destrory if found?
         */
        removeChild(Child, DeepSearch = false, destroy = false) {
            for (var i = 0; i < this.ChildEntities.length; i++) {
                if (this.ChildEntities[i].ID == Child.ID) {
                    // ToDo : Check if 'delete' removes the object also from array
                    if (destroy) {
                        delete this.ChildEntities[i];
                    }
                    this.ChildEntities.splice(i, 1);
                    break;
                }
                else if (DeepSearch && this.ChildEntities[i].hasChild(Child, true)) {
                    this.ChildEntities[i].removeChild(Child);
                }
            }
        }
        /**
         * Check if this has the searched Entity as Parent
         * @param Parent Searched Entity or null to check if this Entity has any Parent
         * @returns {boolean}
         */
        hasParent(Parent = null) {
            if (this.Parent == Parent)
                return false;
            return true;
        }
        /**
         * Checks if contains searched Child Entity
         * @param Child Searched Entity
         * @param DeepSearch Asks Child Entities and their Childs for searched Entity
         * @returns {boolean}
         */
        hasChild(Child, DeepSearch = false) {
            for (var i = 0; i < this.ChildEntities.length; i++) {
                if (this.ChildEntities[i].ID == Child.ID)
                    return true;
                else if (DeepSearch && this.ChildEntities[i].hasChild(Child))
                    return true;
            }
            return false;
        }
        /**
         * Ask Child Entities if they have the searched Mesh
         * @param Mesh
         * @returns {boolean}
         */
        hasMesh(Mesh) {
            for (var i = 0; i < this.ChildEntities.length; i++) {
                if (this.ChildEntities[i].hasMesh(Mesh))
                    return true;
            }
            return false;
        }
        /**
         * Returns Entity containing the Mesh or 'false'
         * @param Mesh
         * @returns {any}
         */
        getEntityByMesh(Mesh) {
            for (var i = 0; i < this.ChildEntities.length; i++) {
                if (this.ChildEntities[i].hasMesh(Mesh))
                    return this.ChildEntities[i];
            }
            return false;
        }
        /**
         * Returns Mesh of this Entity (if there is one)
         * @returns {null}
         */
        getMesh() {
            console.error("Not Implemented ");
            return null;
        }
        /**
         * Returns Parent of this Entity
         * @returns {Entity}
         */
        getParent() {
            return this.Parent;
        }
        /**
         * Returns Parent of the Parent (of the Parent...)
         * @returns {VGL.Entity}
         */
        getRoot() {
            return (this.Parent == null) ? this : this.Parent.getRoot();
        }
        appendTo(Parent) {
            this.Parent = Parent;
            Parent.addChild(this);
            return this;
        }
        clone() {
            return new Entity(this.Parent);
        }
        /**
         * Returns editable Position Vector
         * @returns {THREE.Vector3}
         */
        get Position() {
            console.error("Not Implemented");
            return null;
        }
        set Position(pos) {
            console.error("Not Implemented");
        }
    }
    VGL.Entity = Entity;
})(VGL || (VGL = {}));
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
var VGL;
(function (VGL) {
    var Entities;
    (function (Entities) {
        class Brick extends VGL.Entity {
            /**
             * @param Mesh
             * @param Parent
             */
            constructor(Mesh, Parent = null) {
                super(Parent);
                this.Mesh = Mesh;
                // Mark this Mesh as a Brick
                this.Mesh.userData.isBrick = true;
                if (super.getScene() != null)
                    super.getScene().add(this.Mesh);
            }
            /**
             * Returns current Mesh
             * @returns {THREE.Mesh}
             */
            getMesh() {
                return this.Mesh;
            }
            /**
             * Returns editable Position Vector
             * @returns {THREE.Vector3}
             */
            get Position() {
                return this.Mesh.position;
            }
            /**
             * Clones the given Position and sets this Position to it
             * @param val
             * @constructor
             */
            set Position(val) {
                this.Mesh.position = val.clone();
            }
            /**
             * Checks if this Brick is the searched Mesh
             * If not then ask Child Entities
             * @param Mesh
             * @returns {boolean}
             */
            hasMesh(Mesh) {
                if (this.Mesh.uuid == Mesh.uuid)
                    return true;
                return super.hasMesh(Mesh);
            }
            clone() {
                return new Brick(this.Mesh.clone(), this.getParent());
            }
        }
        Entities.Brick = Brick;
    })(Entities = VGL.Entities || (VGL.Entities = {}));
})(VGL || (VGL = {}));
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
var VGL;
(function (VGL) {
    var Entities;
    (function (Entities) {
        class Grid extends VGL.Entity {
            /**
             * @param width (Background and Ground) In Block size (default = 10)
             * @param height (Background) In Block size (default = 10)
             * @param depth (Ground) In Block size (default = 10)
             * @param Parent Entity this is added to
             */
            constructor(Parent, width = 10, height = 10, depht = 10) {
                super(Parent);
                this.BoxWidth = 2;
                this.BoxHeight = 2;
                this.OffsetZ = 0;
                this.OffsetY = 0;
                this.HighlightedFields = [];
                this.width = width;
                this.height = height;
                this.depht = depht;
                this.GridY = new Array(this.height * this.width);
                this.GridZ = new Array(this.height * this.depht);
                var PlaneGeometry = new THREE.PlaneBufferGeometry(2, 2);
                var PlaneMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, fog: false, shading: THREE.FlatShading, transparent: true, opacity: 0 });
                //var PlaneMaterial = new THREE.MeshBasicMaterial({color:0xFF0000});
                //var Plane = new THREE.Mesh(PlaneGeometry,PlaneMaterial);
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var Plane = new THREE.Mesh(PlaneGeometry, PlaneMaterial.clone());
                        var edge = new THREE.EdgesHelper(Plane, 0x000);
                        edge.position.set(x * this.BoxWidth, y * this.BoxHeight, this.OffsetZ);
                        Plane.position.set(x * this.BoxWidth, y * this.BoxHeight, this.OffsetZ);
                        Plane.userData = { isGridElement: true, GridPlane: 0, x: x, y: y, Position: Plane.position };
                        edge.userData = { isGridElement: true, GridPlane: 0, x: x, y: y, Position: Plane.position };
                        this.getScene().add(edge);
                        this.getScene().add(Plane);
                        this.GridY[y * this.width + x] = Plane;
                    }
                }
                for (var z = 1; z < this.depht; z++) {
                    for (var x = 0; x < this.width; x++) {
                        var Plane = new THREE.Mesh(PlaneGeometry, PlaneMaterial.clone());
                        var edge = new THREE.EdgesHelper(Plane, 0x000);
                        edge.position.set(x * this.BoxWidth, this.OffsetY, z * 2);
                        Plane.position.set(x * this.BoxWidth, this.OffsetY, z * 2);
                        Plane.rotation.x = -Math.PI / 2;
                        Plane.userData = { isGridElement: true, GridPlane: 1, x: x, z: z, Position: Plane.position };
                        edge.userData = { isGridElement: true, GridPlane: 1, x: x, z: z, Position: Plane.position };
                        this.getScene().add(edge);
                        this.getScene().add(Plane);
                        this.GridZ[z * this.width + x] = Plane;
                    }
                }
            }
            /**
             * This gets called from a click/touch Callback if the interescted Element is a Field in this Grid
             * @param userData Stored in the userData of a THREE.Mesh which was generated by this Grid
             * @constructor
             */
            HighlightField(userData) {
                // 0. Get the Grid of the selected Field
                var grid;
                var yz = 0;
                switch (userData.GridPlane) {
                    case 0:// GridY
                        grid = this.GridY;
                        yz = userData.y;
                        break;
                    case 1:
                        grid = this.GridZ;
                        yz = userData.z;
                        break;
                    default:
                        console.error("Unknown Grid Number");
                        return;
                }
                // 1. Remove Highlight of other Fields
                this.HighlightedFields
                    .filter((f) => f.GridPlane == userData.GridPlane) // Get all selected Fields from this GridPlane
                    .forEach((e) => { e.field.material.setValues({ transparent: true }); }); // Make them transparent again
                this.HighlightedFields = this.HighlightedFields // Set the Array to the filtered Array :
                    .filter((f) => f.GridPlane != userData.GridPlane); // Get all Fields without selected Fields from this GridPlane
                // This removes all Fields from the GridPlane out of this Array
                // 2. Highlight the selected Field
                grid[yz * this.width + userData.x].material.setValues({ transparent: false });
                // 3. Store the Change in this Array to remove it later
                this.HighlightedFields.push({ GridPlane: userData.GridPlane, field: grid[yz * this.width + userData.x] });
            }
            /**
             * Clears Highlighted Fields
             * @param GridPlane null=>All || 0=>Y Grid (Background) || 1=>Z Grid (Ground)
             * @constructor
             */
            HighlightClear(GridPlane = null) {
                // Call this function recursive for all Grid Planes if no one was set
                // This means it clears all grids
                if (GridPlane == null) {
                    this.HighlightClear(0);
                    this.HighlightClear(1);
                    return;
                }
                // 0. Get the Grid of the selected Field
                var grid;
                switch (GridPlane) {
                    case 0:// GridY
                        grid = this.GridY;
                        break;
                    case 1:
                        grid = this.GridZ;
                        break;
                    default:
                        console.error("Unknown Grid Number");
                        return;
                }
                // 1. Remove Highlight of all Fields
                this.HighlightedFields
                    .filter((f) => f.GridPlane == GridPlane) // Get all selected Fields from this GridPlane
                    .forEach((e) => { e.field.material.setValues({ transparent: true }); }); // Make them transparent again
                this.HighlightedFields = this.HighlightedFields // Set the Array to the filtered Array :
                    .filter((f) => f.GridPlane != GridPlane); // Get all Fields without selected Fields from this GridPlane
                // This removes all Fields from the GridPlane out of this Array
            }
        }
        Entities.Grid = Grid;
    })(Entities = VGL.Entities || (VGL.Entities = {}));
})(VGL || (VGL = {}));
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
var VGL;
(function (VGL) {
    var Loaders;
    (function (Loaders) {
        class json {
            static GET(url, callback) {
                try {
                    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                    x.open('GET', url, true);
                    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    x.onreadystatechange = function () {
                        if (x.readyState > 3 && callback) {
                            callback(JSON.parse(x.responseText));
                        }
                    };
                    x.send();
                }
                catch (e) {
                    window.console && console.log(e);
                }
            }
        }
        Loaders.json = json;
        class File {
            static GET(url, callback) {
                try {
                    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                    x.open('GET', url, true);
                    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    x.onreadystatechange = function () {
                        if (x.readyState > 3 && callback) {
                            callback(x.responseText);
                        }
                    };
                    x.send();
                }
                catch (e) {
                    window.console && console.log(e);
                }
            }
            static POST(url, callback, data) {
                try {
                    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                    x.open('POST', url, 1);
                    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    x.onreadystatechange = function () {
                        x.readyState > 3 && callback && callback(x.responseText);
                    };
                    x.send(data);
                }
                catch (e) {
                    window.console && console.log(e);
                }
            }
        }
        Loaders.File = File;
    })(Loaders = VGL.Loaders || (VGL.Loaders = {}));
})(VGL || (VGL = {}));
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="File.ts"/>
var VGL;
(function (VGL) {
    var Loaders;
    (function (Loaders) {
        class CubeMeshLoader {
            constructor(LoaderSetting) {
                this.TextureLoader = new THREE.CubeTextureLoader();
                this.ImageLoader = new THREE.TextureLoader();
                this.TextureLoader.setPath(CubeMeshLoader.ImagePath);
                this.ImageLoader.setPath(CubeMeshLoader.ImagePath);
                this.Bricks = LoaderSetting;
                // The Error Brick for fallback is just plain red
                this.ErrorBrick = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
                this.TextureCache = {};
            }
            loadBrick(TypeName, Size = [1, 1]) {
                // Check if TypeName is valid
                if (!this.Bricks.hasOwnProperty(TypeName))
                    return this.ErrorBrick.clone();
                var BrickSetting = this.Bricks[TypeName];
                /* Check if the Mesh was already created and cached */
                if (!BrickSetting.hasOwnProperty("Cache")) {
                    /* Load all needed Textures and Materials to create the Cube Mesh */
                    var Mappings = new Array(BrickSetting.TextureMapping.length);
                    for (var i = 0; i < BrickSetting.TextureMapping.length; i++) {
                        var texture = this.ImageLoader.load(BrickSetting.TextureImages[BrickSetting.TextureMapping[i]]);
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(4, 1);
                        Mappings[i] = new THREE.MeshBasicMaterial({ map: texture });
                    }
                    BrickSetting.Cache = new THREE.Mesh(new THREE.BoxBufferGeometry(2 * Size[0], 2, 2 * Size[1]), new THREE.MultiMaterial(Mappings));
                    //this.TextureLoader.load(Mappings,(texture)=>{ var m = <THREE.MeshBasicMaterial>(BrickSetting.Cache.material); m.setValues({envMap:texture})});
                }
                /* Return Cached Cube Mesh */
                return BrickSetting.Cache.clone();
            }
            /**
             * Loads all necessary things for given Brick type and returns a usable Brick
             * @param TypeName
             * @returns {THREE.Mesh}
             */
            load(TypeName) {
                // ToDo : Return Fallback Brick instead of false or null
                if (!this.Bricks.hasOwnProperty(TypeName))
                    return this.ErrorBrick.clone();
                var BrickSetting = this.Bricks[TypeName];
                /* Check if the Mesh was already created and cached */
                if (!BrickSetting.hasOwnProperty("Cache")) {
                    /* Load all needed Textures and Materials to create the Cube Mesh */
                    // Load Texture Images 
                    var TextureMaterials = this.prepareTextures(BrickSetting.TextureImages);
                    // Copy the Textures in right order into the 'Mapping' Array (Order of the Cube Meshes [left,top,..])
                    var Mappings = new Array(BrickSetting.TextureMapping.length);
                    for (var i = 0; i < BrickSetting.TextureMapping.length; i++) {
                        Mappings[i] = TextureMaterials[BrickSetting.TextureMapping[i]];
                    }
                    // Create a MultiMaterial Material
                    var MaterialMapping = new THREE.MultiMaterial(Mappings);
                    /* Create the Cube Mesh and cache it */
                    BrickSetting.Cache = new THREE.Mesh(new THREE.BoxBufferGeometry(200, 200, 200), MaterialMapping);
                }
                /* Return Cached Cube Mesh */
                return BrickSetting.Cache.clone();
            }
            /**
             * Loads the textured Materials into cache or from cache
             * @param TextureFiles Array of Texture File Names to load
             * @returns {THREE.MeshLambertMaterial[]} Ordered Array of wished Textures as ready Material
             */
            prepareTextures(TextureFiles) {
                var ReturnBuffer = new Array(TextureFiles.length);
                for (var i = 0; i < TextureFiles.length; i++) {
                    // Check if Texture is already loaded
                    if (!this.TextureCache.hasOwnProperty(TextureFiles[i])) {
                        this.TextureCache[TextureFiles[i]] = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
                        // Load Texture into Cache
                        this.ImageLoader.load(CubeMeshLoader.ImagePath + TextureFiles[i], ((_cache_class, _cache_name) => {
                            return (texture) => {
                                texture.mapping = THREE.CubeReflectionMapping;
                                _cache_class.TextureCache[_cache_name].setValues({ color: 0xFF0000, map: texture }); // = texture;
                            };
                        })(this, TextureFiles[i]));
                    }
                    // Get Texture from Cache and store in Return Buffer
                    ReturnBuffer[i] = this.TextureCache[TextureFiles[i]];
                }
                return ReturnBuffer;
            }
        }
        CubeMeshLoader.ImagePath = "data/Texture/";
        Loaders.CubeMeshLoader = CubeMeshLoader;
    })(Loaders = VGL.Loaders || (VGL.Loaders = {}));
})(VGL || (VGL = {}));
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
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="../three.d.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="Entities/Entity.ts"/>
/// <reference path="Entities/Brick.ts"/>
/// <reference path="Entities/Grid.ts"/>
/// <reference path="Loaders/CubeMeshLoader.ts"/>
/// <reference path="Handlers/InputHandler.ts"/>
var VGL;
(function (VGL) {
    class Context extends VGL.Entity {
        constructor(Options) {
            super(null, true);
            this.UpdateRequest = {};
            this.BrickPack = "0";
            this.Init = {
                Counter: 0,
                FinishCount: 1,
                BrickLoader: (Data) => {
                    this.BrickLoader = new VGL.Loaders.CubeMeshLoader(Data);
                    this.InitPartFinished();
                },
            };
            this.Create = {
                Brick: (Type, Position = [0, 0, 0], Size = [1, 1]) => {
                    var Brick = new VGL.Entities.Brick(this.BrickLoader.loadBrick(Type, Size), this);
                    if (Position != null)
                        Brick.Position = new THREE.Vector3(Position[0], Position[1], Position[2]);
                    //super.getScene().add(Brick.getMesh());
                    return Brick;
                }
            };
            // Trivial Error Case
            if (Options == null || Options.Parent == null) {
                console.error("FATAL ERROR : Wrong Parameters given");
            }
            // Store Constructor Params
            this.Options = Options;
            // Load and Init THREE.js Renderer
            this.Renderer = new THREE.WebGLRenderer();
            this.Renderer.autoScaleCubemaps = false;
            this.Renderer.setSize(Options.Width, Options.Height);
            this.Renderer.setClearColor(0xAAAAAA);
            this.Renderer.setPixelRatio(window.devicePixelRatio);
            // Clear Content of Parent Container
            /* while (Options.Parent.firstChild) {
                 Options.Parent.removeChild(Options.Parent.firstChild);
             }*/
            // Add Canvas DOM Element to Parent Container
            Options.Parent.append(this.Renderer.domElement);
            // Store Settings
            this.OnLoaded = Options.OnLoaded || null; // Register OnLoaded Event
            this.BrickPack = Options.BrickPack;
            /// Init Queue : Here will be all Init Components be started
            /// When all Queue Elements finish the OnLoaded Event is fired
            // Init BrickPackage 
            VGL.Loaders.json.GET(Context.Data.Bricks + this.BrickPack, this.Init.BrickLoader);
            // Load and Init Editor Camera
            this.CurrentCamera = new THREE.PerspectiveCamera(70, Options.Width / Options.Height, 1, 1000);
            this.CurrentCamera.position.z = 20;
            this.CurrentCamera.position.y = 20;
            this.CurrentCamera.lookAt(new THREE.Vector3(0, 0, 0));
            //this.CurrentCamera.position.setZ(100);
            // Start Input Handler
            this.InputHandler = new VGL.Handlers.InputHandler(this);
            //var pointLight = new THREE.PointLight(0xFFFFFF);
            //this.getScene().add(pointLight);
        }
        // Starts Rendering Process
        Draw() {
            if (isSet(super.getScene()) && isSet(this.CurrentCamera)) {
                this.Renderer.render(super.getScene(), this.CurrentCamera);
            }
            for (var Request in this.UpdateRequest) {
                if (this.UpdateRequest.hasOwnProperty(Request)) {
                    this.UpdateRequest[Request](this);
                }
            }
            window.requestAnimationFrame(this.Draw.bind(this));
        }
        InitPartFinished() {
            this.Init.Counter++;
            if (this.Init.Counter == this.Init.FinishCount && this.OnLoaded != null) {
                this.OnLoaded(this);
            }
            ;
        }
        getCanvas() {
            return this.Renderer.domElement;
        }
    }
    // Data Url's
    Context.Data = {
        Bricks: '/data/Bricks/'
    };
    VGL.Context = Context;
})(VGL || (VGL = {}));
function isSet(variable) {
    return isDefined(variable) && !isNull(variable);
}
function isSetTrue(variable) {
    return (isDefined(variable) && !isNull(variable)) ? (variable == true) : false;
}
function isDefined(variable) {
    return typeof variable !== typeof undefined ? true : false;
}
function isNull(variable) {
    return variable == null;
}
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="../VGL/Context.ts"/>
/// <reference path="../jquery.d.ts"/>
class VEditor {
    /**
     * Initializes a new VEditor instance with a Rendering Context into
     * the givin ContetContainerElement.
     *
     * @param ContextContainerElement JQuery to Element where the Canvas will be placed in (default = document.body)
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
/// <reference path="../../../jquery.d.ts"/>
/// <reference path="../../../jquery.jstree.d.ts"/>
/// <reference path="../../Editor.ts" />
class FileTreeWidgetHandlers {
}
/**
* @description Folder Handler
*/
FileTreeWidgetHandlers["0"] = function (id) {
    console.log("Open Folder " + id);
};
/**
* @description Text File Handler
*/
FileTreeWidgetHandlers["1"] = function (id) {
    console.log("Open Text File " + id);
};
/**
* @description Map File Handler
*/
FileTreeWidgetHandlers["2"] = function (id) {
    //TODO : Tab Manager to create new tab
    var tab = $("x-tab-view");
    var editor = new VEditor(tab);
    //editor.OnReady();
    console.log("Open Map File " + id);
};
class FileTreeWidget extends HTMLElement {
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
            var parentSideBar = $(this).parentsUntil("x-bar");
            // Update perfectScrollbar of parent sidebar
            parentSideBar.perfectScrollbar('update');
        }.bind(this));
    }
    GenerateConextMenu(Node) {
        var items = {};
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
            };
        }
        items.rename = {
            'label': 'Rename',
            'action': this.RenameNode
        };
        items.remove = {
            'label': 'Delete',
            'action': this.RemoveNode.bind(this)
        };
        return items;
    }
    RemoveNode(data) {
        var inst = $.jstree.reference(data.reference);
        $.each(inst.get_selected(true), (i, o) => {
            if (o.id == 0)
                return;
            inst.delete_node(o);
        });
    }
    RenameNode(data) {
        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
        inst.select_node(obj);
        inst.edit(obj);
    }
    NewFolderClicked(data) {
        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
        var new_node = inst.create_node(obj, { type: "0", "text": "New Folder" }, "last", (new_node) => {
            setTimeout(() => { inst.edit(new_node); }, 0);
        });
    }
    NewTextFileClicked(data) {
        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
        var new_node = inst.create_node(obj, { type: "1", "text": "New Text File" }, "last", (new_node) => {
            setTimeout(() => { inst.edit(new_node); }, 0);
        });
    }
    NewMapFileClicked(data) {
        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
        var new_node = inst.create_node(obj, { type: "2", "text": "New Map File" }, "last", (new_node) => {
            setTimeout(() => { inst.edit(new_node); }, 0);
        });
    }
}
FileTreeWidget.Width = { min: 100, max: 500 };
var XFileTree = document.registerElement('x-file-tree', FileTreeWidget);
/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="../jquery.d.ts"/>
/// <reference path="Editor.ts"/>
/// <reference path="Interface/Widgets/FileTreeWidget.ts"/>
class Application {
    // Place this as onload Event
    static Run() {
        //new VEditor(document.body);
    }
}
;
//# sourceMappingURL=Editor.js.map