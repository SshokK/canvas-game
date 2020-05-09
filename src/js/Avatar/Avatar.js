import * as Three from 'three';
import * as Physijs from 'physijs-webpack';
import State from '../State/State';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';

class Avatar {
  constructor(camera, scene) {
    const mat = Physijs.createMaterial(new Three.MeshPhongMaterial({ color: 0x000000 }), 1, 0);
    this.avatar = new Three.Mesh(new Three.BoxGeometry(5, 5, 5), mat);
    this.avatar.material.transparent = true;
    this.avatar.material.opacity = 0.0;
    this.avatar.position.y = 2.5;
    this.avatar.__dirtyPosition = true;
    scene.add(this.avatar);
    this.camera = camera;
    this.activeWeapon = null;
    this.goingUp = true;
    this.recoil = true;
    this.posLimite = 82;
    this.shotgun = null;
    this.rifle = null;

    this.avatar.add(this.camera);
  }

  getPosition() {
    const pos = new Three.Vector3();
    pos.x = this.avatar.position.x;
    pos.y = this.avatar.position.y;
    pos.z = this.avatar.position.z;
    return pos;
  }

  setInitialPosition() {
    this.avatar.position.set(0, 2.5, 0);
  }

  getActiveWeapon() {
    return this.activeWeapon;
  }

  jump() {
    const state = new State();

    if (this.goingUp) {
      if (this.avatar.position.y > 15) {
        this.goingUp = false;
      } else {
        this.avatar.position.y += 0.5;
      }
    } else {
      if (this.avatar.position.y >= 2 && this.avatar.position.y <= 2.5) {
        state.jumping = false;
        this.goingUp = true;
      } else {
        this.avatar.position.y -= 0.5;
      }
    }
  }

  updateControls() {
    const state = new State();
    state.controls.getObject().position.set(this.avatar.position.x, this.avatar.position.y + 5, this.avatar.position.z);
  }

  moveForward() {
    const target = this.camera.getWorldDirection();
    let nextPosition = target.x + this.avatar.position.x;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateX(target.x);
    }
    nextPosition = target.z + this.avatar.position.z;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateZ(target.z);
    }
  }

  moveBackward() {
    const target = this.camera.getWorldDirection();
    let nextPosition = -target.x + this.avatar.position.x;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateX(-target.x);
    }
    nextPosition = -target.z + this.avatar.position.z;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateZ(-target.z);
    }
  }

  moveLeft() {
    const target = this.camera.getWorldDirection();
    let nextPosition = target.z + this.avatar.position.x;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateX(target.z);
    }
    nextPosition = -target.x + this.avatar.position.z;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateZ(-target.x);
    }
  }

  moveRight() {
    const target = this.camera.getWorldDirection();
    let nextPosition = -target.z + this.avatar.position.x;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateX(-target.z);
    }
    nextPosition = target.x + this.avatar.position.z;
    if (nextPosition <= this.posLimite && nextPosition >= -this.posLimite) {
      this.avatar.translateZ(target.x);
    }
  }

  changeWeapon() {
    if (this.activeWeapon === 0) {
      this.rifle.material.transparent = true;
      this.rifle.material.opacity = 0.0;
      this.shotgun.material.transparent = false;
      this.shotgun.material.opacity = 1.0;
      this.activeWeapon = 1;
    } else if (this.activeWeapon === 1) {
      this.shotgun.material.transparent = true;
      this.shotgun.material.opacity = 0.0;
      this.rifle.material.transparent = false;
      this.rifle.material.opacity = 1.0;
      this.activeWeapon = 0;
    }
  }

  animateWeapon() {
    const state = new State();

    console.log('animate')

    if (this.activeWeapon === 0) {
      if (this.recoil) {
        if (this.rifle.rotation.x >= 0.2) this.recoil = false;
        else this.rifle.rotation.x += 0.1;
      } else {
        if (this.rifle.rotation.x >= 0 && this.rifle.rotation.x <= 0.1) {
          state.shooting = false;
          this.recoil = true;
        } else this.rifle.rotation.x -= 0.1;
      }
    } else if (this.activeWeapon === 1) {
      if (this.recoil) {
        if (this.shotgun.rotation.x >= 1.8) this.recoil = false;
        else this.shotgun.rotation.x += 0.1;
      } else {
        if (this.shotgun.rotation.x >= 0 && this.shotgun.rotation.x <= 0.1) {
          state.shooting = false;
          this.recoil = true;
        } else this.shotgun.rotation.x -= 0.1;
      }
    }
  }

  loadWeapons = () => {
    const thatCamera = this.camera;
    const that = this;

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    let texture = null;

    mtlLoader.setPath('./models');
    mtlLoader.load('material.mtl', function(materials) {
      materials.preload();

      objLoader.setMaterials(materials);
      objLoader.setPath('models/');
      objLoader.load('m4a1.obj', function(object) {
        texture = Three.ImageUtils.loadTexture('./models/m4a1.png');
        object.children[1].material = new Three.MeshLambertMaterial({ map: texture });

        object.children[1].position.set(0, 0, 0);
        object.children[1].scale.set(0.2, 0.2, 0.2);
        object.children[1].rotation.set(0.1, 3.4, 0);
        object.children[1].position.set(2, -0.8, -2);
        that.rifle = object.children[1];
        thatCamera.add(that.rifle);
        that.activeWeapon = 0;
      });
    });

    mtlLoader.setPath('models/');
    mtlLoader.load('material.mtl', function(materials) {
      materials.preload();

      objLoader.setMaterials(materials);
      objLoader.setPath('models/');
      objLoader.load('shotgun.obj', function(object) {
        texture = Three.ImageUtils.loadTexture('./models/shotgun.png');
        object.children[0].material = new Three.MeshLambertMaterial({ map: texture });

        object.children[0].position.set(0, 0, 0);
        object.children[0].scale.set(0.4, 0.4, 0.4);
        object.children[0].rotation.set(0.2, -1.2, 0);
        object.children[0].position.set(2, -1.4, -6);
        object.children[0].material.transparent = true;
        object.children[0].material.opacity = 0.0;
        that.shotgun = object.children[0];
        thatCamera.add(that.shotgun);
      });
    });
  };
}

export default Avatar
