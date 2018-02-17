/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */


namespace VGL.Entities{
    export interface GridField
    {isGridElement:boolean,/*Grid:VGL.Entities.Grid,*/GridPlane:number,x:number,y:number,z:number,Position:THREE.Vector3}

    export class Grid extends VGL.Entity{
        private BoxWidth = 2;
        private BoxHeight = 2;
        private OffsetZ = 0;
        private OffsetY = 0;

        /**
         * @param width (Background and Ground) In Block size (default = 10)
         * @param height (Background) In Block size (default = 10)
         * @param depth (Ground) In Block size (default = 10)
         * @param Parent Entity this is added to
         */
        constructor(Parent:VGL.Entity,width:number = 10, height:number = 10, depht:number = 10){
            super(Parent);
            this.width = width;
            this.height = height;
            this.depht = depht;

            this.GridY = new Array<THREE.Mesh>(this.height*this.width);
            this.GridZ = new Array<THREE.Mesh>(this.height*this.depht);

            var PlaneGeometry = new THREE.PlaneBufferGeometry(2,2);
            var PlaneMaterial = new THREE.MeshBasicMaterial({color:0xFF0000,fog:false,shading :THREE.FlatShading,transparent:true,opacity:0});
            //var PlaneMaterial = new THREE.MeshBasicMaterial({color:0xFF0000});

            //var Plane = new THREE.Mesh(PlaneGeometry,PlaneMaterial);

            for(var y = 0; y < this.height; y++){
                for (var x = 0; x < this.width; x++){
                    var Plane = new THREE.Mesh(PlaneGeometry,PlaneMaterial.clone());
                    var edge = new THREE.EdgesHelper(Plane,0x000);
                    edge.position.set(x * this.BoxWidth, y * this.BoxHeight, this.OffsetZ);
                    Plane.position.set(x * this.BoxWidth, y * this.BoxHeight, this.OffsetZ);
                    Plane.userData = {isGridElement:true,GridPlane:0,x:x,y:y,Position:Plane.position};
                    edge.userData = {isGridElement:true,GridPlane:0,x:x,y:y,Position:Plane.position};
                    this.getScene().add(edge);
                    this.getScene().add(Plane);
                    this.GridY[y*this.width+x] = Plane;
                }
            }

            for(var z = 1; z < this.depht; z++){
                for (var x = 0; x < this.width; x++){
                    var Plane   = new THREE.Mesh(PlaneGeometry,PlaneMaterial.clone());
                    var edge    = new THREE.EdgesHelper(Plane,0x000);
                    edge.position.set(x * this.BoxWidth, this.OffsetY, z * 2);
                    Plane.position.set(x * this.BoxWidth, this.OffsetY, z * 2);
                    Plane.rotation.x = -Math.PI/2;
                    Plane.userData  = {isGridElement:true,GridPlane:1,x:x,z:z,Position:Plane.position};
                    edge.userData   = {isGridElement:true,GridPlane:1,x:x,z:z,Position:Plane.position};
                    this.getScene().add(edge);
                    this.getScene().add(Plane);
                    this.GridZ[z*this.width+x] = Plane;
                }
            }
        }

        private HighlightedFields:{GridPlane:number,field:THREE.Mesh}[] = [];

        /**
         * This gets called from a click/touch Callback if the interescted Element is a Field in this Grid
         * @param userData Stored in the userData of a THREE.Mesh which was generated by this Grid
         * @constructor
         */
        public HighlightField(userData:GridField){
            // 0. Get the Grid of the selected Field
            var grid: THREE.Mesh[];
            var yz = 0;
            switch (userData.GridPlane){
                case 0: // GridY
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
                .filter((f)=>f.GridPlane==userData.GridPlane)   // Get all selected Fields from this GridPlane
                .forEach((e)=>{e.field.material.setValues({transparent:true});}); // Make them transparent again

            this.HighlightedFields = this.HighlightedFields     // Set the Array to the filtered Array :
                .filter((f)=>f.GridPlane!=userData.GridPlane);  // Get all Fields without selected Fields from this GridPlane
                                                                // This removes all Fields from the GridPlane out of this Array
            // 2. Highlight the selected Field
            grid[yz * this.width + userData.x].material.setValues({transparent:false});

            // 3. Store the Change in this Array to remove it later
            this.HighlightedFields.push({GridPlane:userData.GridPlane,field:grid[yz * this.width + userData.x]});
        }

        /**
         * Clears Highlighted Fields
         * @param GridPlane null=>All || 0=>Y Grid (Background) || 1=>Z Grid (Ground)
         * @constructor
         */
        public HighlightClear(GridPlane:number = null){
            // Call this function recursive for all Grid Planes if no one was set
            // This means it clears all grids
            if(GridPlane==null){
                this.HighlightClear(0);
                this.HighlightClear(1);
                return;
            }

            // 0. Get the Grid of the selected Field
            var grid: THREE.Mesh[];
            switch (GridPlane){
                case 0: // GridY
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
                .filter((f)=>f.GridPlane==GridPlane)            // Get all selected Fields from this GridPlane
                .forEach((e)=>{e.field.material.setValues({transparent:true});}); // Make them transparent again

            this.HighlightedFields = this.HighlightedFields     // Set the Array to the filtered Array :
                .filter((f)=>f.GridPlane!=GridPlane);           // Get all Fields without selected Fields from this GridPlane
                                                                // This removes all Fields from the GridPlane out of this Array
        }

        private width: number;
        private height: number;
        private depht: number;

        /**
         * Background Gate
         */
        private GridY: THREE.Mesh[];

        /**
         * Ground Gate
         */
        private GridZ: THREE.Mesh[];
    }
}