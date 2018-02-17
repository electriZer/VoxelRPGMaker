/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */
/// <reference path="File.ts"/>
namespace VGL.Loaders{
    import Brick = VGL.Entities.Brick;
    export interface BrickLoaderSetting{
        [BrickName:string]:{
            TextureImages:string[];
            TextureMapping:number[];
            Cache:THREE.Mesh;
        };
    }
    export class CubeMeshLoader{
        private TextureLoader : THREE.CubeTextureLoader;
        private ImageLoader : THREE.TextureLoader;
        private Bricks:BrickLoaderSetting;
        private TextureCache:{[k:string]:THREE.MeshLambertMaterial};
        private ErrorBrick;
        private ImagePath: string = "";

        constructor(LoaderSetting: BrickLoaderSetting, DataURL: { ImagePath: string }) {
            this.TextureLoader = new THREE.CubeTextureLoader();
            this.ImageLoader = new THREE.TextureLoader();
            this.ImagePath = DataURL.ImagePath;
            this.TextureLoader.setPath(this.ImagePath);
            this.ImageLoader.setPath(this.ImagePath);

            this.Bricks = LoaderSetting;
            // The Error Brick for fallback is just plain red
            this.ErrorBrick = new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial( {color:0xFF0000} ));

            this.TextureCache = {};
        }

        public loadBrick(TypeName:string,Size=[1,1]){
             // Check if TypeName is valid
            if (!this.Bricks.hasOwnProperty(TypeName)) return this.ErrorBrick.clone();
            
            var BrickSetting = this.Bricks[TypeName];

            /* Check if the Mesh was already created and cached */
            if(!BrickSetting.hasOwnProperty("Cache")) {
                /* Load all needed Textures and Materials to create the Cube Mesh */
                var Mappings:THREE.Material[] = new Array(BrickSetting.TextureMapping.length);
                for (var i = 0; i < BrickSetting.TextureMapping.length; i++) {
                    var texture = this.ImageLoader.load(BrickSetting.TextureImages[BrickSetting.TextureMapping[i]]);
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(4,1);
                    Mappings[i] = new THREE.MeshBasicMaterial({map:texture});
                }
                BrickSetting.Cache = new THREE.Mesh(new THREE.BoxBufferGeometry(2 * Size[0], 2 , 2 * Size[1]), new THREE.MultiMaterial(Mappings));

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
        public load(TypeName:string) {
            // ToDo : Return Fallback Brick instead of false or null
            if (!this.Bricks.hasOwnProperty(TypeName)) return this.ErrorBrick.clone();
            
            var BrickSetting = this.Bricks[TypeName];

            /* Check if the Mesh was already created and cached */
            if(!BrickSetting.hasOwnProperty("Cache")) {
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
        private prepareTextures(TextureFiles:string[]){
            var ReturnBuffer:THREE.MeshLambertMaterial[] = new Array(TextureFiles.length);
            for(var i =0; i < TextureFiles.length;i++){
                // Check if Texture is already loaded
                if (!this.TextureCache.hasOwnProperty(TextureFiles[i])) {
                    this.TextureCache[TextureFiles[i]] = new THREE.MeshLambertMaterial({color:0xFF0000});
                    // Load Texture into Cache
                    this.ImageLoader.load(this.ImagePath + TextureFiles[i],
                        ((_cache_class, _cache_name) => {
                            return (texture : THREE.Texture)=> {
                                texture.mapping = THREE.CubeReflectionMapping;
                                _cache_class.TextureCache[_cache_name].setValues({color:0xFF0000,map:texture}); // = texture;
                            }
                        })
                        (this, TextureFiles[i])
                    );
                }
                // Get Texture from Cache and store in Return Buffer
                ReturnBuffer[i] = this.TextureCache[TextureFiles[i]];
            }
            return ReturnBuffer;
        }

    }
}