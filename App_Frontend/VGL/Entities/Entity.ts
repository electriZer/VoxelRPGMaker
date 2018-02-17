/**
 * (C) Copyright 2016 by Jiyan Akgül.
 */

namespace VGL{
    export class Entity{
        private static ID_Counter;
        private Parent:Entity;
        private ChildEntities:Entity[] = [];
        private Scene : THREE.Scene;
        private ID:number;

        /**
         * @param parent The Parent Entity if this is a child (default=null)
         * @param canCreateScene Create a new Scene if no Parent is defined (default:false)
         */
        constructor(parent:Entity = null,canCreateScene = false){
            this.ID = ++Entity.ID_Counter;
            this.Parent = parent;

            if(this.Parent!=null){
                this.Parent.addChild(this);
                this.Scene = this.Parent.getScene();
            }else{
                if(canCreateScene){
                    this.Scene = new THREE.Scene();
                }else{
                    this.Scene = null;
                }
            }
        }

        /**
         * Returns Current Scene or false if no Scene is set
         * @returns {THREE.Scene}
         */
        public getScene():THREE.Scene{
            if(this.Scene!=null)return this.Scene;
            else if(this.getParent() != null )return this.getParent().getScene();
        }


        public addChild (Child: Entity){
            if(!this.hasChild(Child)) {
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
        public removeChild(Child:Entity,DeepSearch = false, destroy:boolean = false){
            for(var i=0;i<this.ChildEntities.length;i++){
                if(this.ChildEntities[i].ID == Child.ID){
                    // ToDo : Check if 'delete' removes the object also from array
                    if(destroy){
                        delete this.ChildEntities[i];
                    }
                    this.ChildEntities.splice(i,1);
                    break;
                }else if(DeepSearch&&this.ChildEntities[i].hasChild(Child,true)){
                    this.ChildEntities[i].removeChild(Child);
                }
            }
        }

        /**
         * Check if this has the searched Entity as Parent
         * @param Parent Searched Entity or null to check if this Entity has any Parent
         * @returns {boolean}
         */
        public hasParent(Parent:Entity = null){
            if(this.Parent == Parent)return false;
            return true;
        }

        /**
         * Checks if contains searched Child Entity
         * @param Child Searched Entity
         * @param DeepSearch Asks Child Entities and their Childs for searched Entity
         * @returns {boolean}
         */
        public hasChild(Child:Entity, DeepSearch = false){
            for(var i=0;i<this.ChildEntities.length;i++){
                if(this.ChildEntities[i].ID == Child.ID)return true;
                else if(DeepSearch && this.ChildEntities[i].hasChild(Child)) return true;
            }
            return false;
        }

        /**
         * Ask Child Entities if they have the searched Mesh
         * @param Mesh
         * @returns {boolean}
         */
        public hasMesh(Mesh:THREE.Mesh){
            for(var i=0;i<this.ChildEntities.length;i++){
                if(this.ChildEntities[i].hasMesh(Mesh))return true;
            }
            return false;
        }

        /**
         * Returns Entity containing the Mesh or 'false'
         * @param Mesh
         * @returns {any}
         */
        public getEntityByMesh(Mesh:THREE.Mesh) : Entity|boolean{
            for(var i=0;i<this.ChildEntities.length;i++){
                if(this.ChildEntities[i].hasMesh(Mesh))return this.ChildEntities[i];
            }
            return false;
        }

        /**
         * Returns Mesh of this Entity (if there is one)
         * @returns {null}
         */
        public getMesh():THREE.Mesh{
            console.error("Not Implemented ");
            return null;
        }

        /**
         * Returns Parent of this Entity
         * @returns {Entity}
         */
        public getParent(){
            return this.Parent;
        }

        /**
         * Returns Parent of the Parent (of the Parent...)
         * @returns {VGL.Entity}
         */
        public getRoot(){
            return (this.Parent==null)?this:this.Parent.getRoot();
        }

        public appendTo(Parent:Entity){
            this.Parent = Parent;
            Parent.addChild(this);
            return this;
        }

        public clone(){
            return new Entity(this.Parent);
        }

        /**
         * Returns editable Position Vector
         * @returns {THREE.Vector3}
         */
        public get Position  () : THREE.Vector3{
            console.error("Not Implemented");
            return null;
        }

        public set Position (pos:THREE.Vector3){
            console.error("Not Implemented");
        }


    }
}


