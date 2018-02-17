/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="../three.d.ts" />
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
            while (Options.Parent.firstChild) {
                Options.Parent.removeChild(Options.Parent.firstChild);
            }
            // Add Canvas DOM Element to Parent Container
            Options.Parent.appendChild(this.Renderer.domElement);
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
//# sourceMappingURL=Context.js.map