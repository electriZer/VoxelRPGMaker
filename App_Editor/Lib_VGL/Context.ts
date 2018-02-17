/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="../Lib_Others/three.d.ts" />
/// <reference path="../Lib_Others/jquery.d.ts" />
/// <reference path="Entities/Entity.ts"/>
/// <reference path="Entities/Brick.ts"/>
/// <reference path="Entities/Grid.ts"/>
/// <reference path="Loaders/CubeMeshLoader.ts"/>
/// <reference path="Handlers/InputHandler.ts"/>

namespace VGL {
    export interface ContextConstructorParam {
        OnLoaded : Function;
        BrickPack : string;
        Width: number;
        Height: number;
        Parent: HTMLElement;    // DOM Element for Canvas
    }
    export class Context extends Entity{
        public CurrentCamera: THREE.Camera;
        private Renderer : THREE.WebGLRenderer;
        private OnLoaded : Function;
        private BrickLoader : VGL.Loaders.CubeMeshLoader;
        public UpdateRequest:{[k:string]:(Context:Context)=>void} = {};
        public InputHandler:VGL.Handlers.InputHandler;
        public Options:ContextConstructorParam;
        // Data Url's
        public static DataURL = {
            BricksPath: '/bricks/data/',
            ImagePath: "/bricks/images/"
        }
        
        private BrickPack = "0";
        
        constructor( Options : ContextConstructorParam){
            super(null,true);
            // Trivial Error Case
            if (Options == null || Options.Parent == null)
            {
                console.error("FATAL ERROR : Wrong Parameters given");
            }
            // Store Constructor Params
            this.Options = Options;

            // Load and Init THREE.js Renderer
            this.Renderer = new THREE.WebGLRenderer();
            this.Renderer.autoScaleCubemaps = false;
            this.Renderer.setSize(Options.Width,Options.Height);
            this.Renderer.setClearColor(0xAAAAAA);
            this.Renderer.setPixelRatio( window.devicePixelRatio );
         
            // Clear Content of Parent Container
           /* while (Options.Parent.firstChild) {
                Options.Parent.removeChild(Options.Parent.firstChild);
            }*/
            
            // Add Canvas DOM Element to Parent Container
            Options.Parent.appendChild(this.Renderer.domElement);
            
            // Store Settings
            this.OnLoaded = Options.OnLoaded || null; // Register OnLoaded Event
            this.BrickPack = Options.BrickPack;
            
            /// Init Queue : Here will be all Init Components be started
            /// When all Queue Elements finish the OnLoaded Event is fired
            // Init BrickPackage 
            VGL.Loaders.json.GET( Context.DataURL.BricksPath +this.BrickPack ,this.Init.BrickLoader);

            // Load and Init Editor Camera
            this.CurrentCamera = new THREE.PerspectiveCamera( 70, Options.Width / Options.Height, 1, 1000 );
            this.CurrentCamera.position.z = 20;
            this.CurrentCamera.position.y = 20;
            this.CurrentCamera.lookAt(new THREE.Vector3(0,0,0));
            //this.CurrentCamera.position.setZ(100);

            // Start Input Handler
            this.InputHandler = new VGL.Handlers.InputHandler(this);

            //var pointLight = new THREE.PointLight(0xFFFFFF);
            //this.getScene().add(pointLight);
        }

        // Starts Rendering Process
        public Draw(){
            if(isSet(super.getScene()) && isSet(this.CurrentCamera)){
                this.Renderer.render(super.getScene(),this.CurrentCamera);
            }
            for(var Request in this.UpdateRequest){
                if(this.UpdateRequest.hasOwnProperty(Request)){
                    this.UpdateRequest[Request](this);
                }
            }
            window.requestAnimationFrame(this.Draw.bind(this));
        }
        
        public Init = {
            Counter:0,
            FinishCount:1,
            BrickLoader: (Data) => {
                this.BrickLoader = new VGL.Loaders.CubeMeshLoader(Data, Context.DataURL);
                this.InitPartFinished();
            },
        }

        private InitPartFinished(){
            this.Init.Counter++;
            if(this.Init.Counter == this.Init.FinishCount && this.OnLoaded != null){
                this.OnLoaded(this);
            };
        }

        public Create = {
            Brick: (Type:string,Position:number[] = [0,0,0],Size:number[] = [1,1])=>{
                var Brick = new VGL.Entities.Brick(this.BrickLoader.loadBrick(Type,Size),this);
                if(Position!=null)Brick.Position = new THREE.Vector3(Position[0],Position[1],Position[2]);
                //super.getScene().add(Brick.getMesh());
                return Brick;
            }
        }

        public getCanvas(){
            return this.Renderer.domElement;
        }
    }
}

function  isSet(variable){
    return isDefined(variable) && !isNull(variable);
}

function  isSetAndTrue(variable){
    return (isDefined(variable) && !isNull(variable))?(variable==true):false;
}

function isDefined(variable) {
    return typeof variable !== typeof undefined ? true : false;
}

function isNull(variable){
    return variable == null;
}
