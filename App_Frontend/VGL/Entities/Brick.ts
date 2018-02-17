/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */

namespace VGL.Entities{
    export class Brick extends VGL.Entity{
        private Mesh: THREE.Mesh;

        /**
         * Returns current Mesh
         * @returns {THREE.Mesh}
         */
        public getMesh():THREE.Mesh{
            return this.Mesh;
        }
        
        /**
         * @param Mesh
         * @param Parent
         */
        constructor(Mesh:THREE.Mesh, Parent:Entity = null){
            super(Parent);
            this.Mesh = Mesh;
            // Mark this Mesh as a Brick
            this.Mesh.userData.isBrick = true;
            if(super.getScene()!=null)super.getScene().add(this.Mesh);
        }

        /**
         * Returns editable Position Vector
         * @returns {THREE.Vector3}
         */
        public get Position () {
            return this.Mesh.position;
        }

        /**
         * Clones the given Position and sets this Position to it
         * @param val
         * @constructor
         */
        public set Position (val:THREE.Vector3){
            this.Mesh.position = val.clone();
        }

        /**
         * Checks if this Brick is the searched Mesh
         * If not then ask Child Entities
         * @param Mesh
         * @returns {boolean}
         */
        public hasMesh(Mesh:THREE.Mesh){
            if(this.Mesh.uuid == Mesh.uuid) return true;
            return super.hasMesh(Mesh);
        }

        public clone(){
            return new Brick(this.Mesh.clone(),this.getParent());
        }
    }
}