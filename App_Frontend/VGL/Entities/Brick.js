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
//# sourceMappingURL=Brick.js.map