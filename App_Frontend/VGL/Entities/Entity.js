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
//# sourceMappingURL=Entity.js.map