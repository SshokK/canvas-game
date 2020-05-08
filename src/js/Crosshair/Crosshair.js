import * as Three from 'three';

class Crosshair extends Three.Object3D {
  constructor() {
    super();

    this.material = new Three.LineBasicMaterial({ color: 0x23ff02 });

    this.xLenght = 0.0007;
    this.yLenght = 0.005;
    this.zLenght = 0.0;
    this.crosshairPos = 0.0075;

    this.crosshair = null;

    this.crosshair = this.createRoot();
    this.add(this.crosshair);
  }

  // It creates de tree's root
  createRoot = () => {
    const root = new Three.Object3D();
    root.castShadow = false;
    root.autoUpdateMatrix = false;
    root.updateMatrix();
    root.add(this.createCrosshair('U'));
    root.add(this.createCrosshair('D'));
    root.add(this.createCrosshair('L'));
    root.add(this.createCrosshair('R'));
    return root;
  }

  // It creates one of the four crosshair parts
  createCrosshair = (part) => {
    let rectangle = new Three.Mesh(new Three.BoxGeometry(this.xLenght, this.yLenght, this.zLenght), this.material);

    rectangle.castShadow = false;
    rectangle.autoUpdateMatrix = false;

    switch (part) {
      case 'U':
        rectangle.geometry.applyMatrix(new Three.Matrix4().makeTranslation(0, this.crosshairPos, 0));
        break;
      case 'D':
        rectangle = new Three.Mesh(new Three.BoxGeometry(this.xLenght, this.yLenght, this.zLenght), this.material);
        rectangle.geometry.applyMatrix(new Three.Matrix4().makeTranslation(0, -this.crosshairPos, 0));
        break;
      case 'L':
        rectangle = new Three.Mesh(new Three.BoxGeometry(this.yLenght, this.xLenght, this.zLenght), this.material);
        rectangle.geometry.applyMatrix(new Three.Matrix4().makeTranslation(-this.crosshairPos, 0, 0));
        break;
      case 'R':
        rectangle = new Three.Mesh(new Three.BoxGeometry(this.yLenght, this.xLenght, this.zLenght), this.material);
        rectangle.geometry.applyMatrix(new Three.Matrix4().makeTranslation(this.crosshairPos, 0, 0));
        break;
    }

    rectangle.updateMatrix();

    return rectangle;
  }
}

export default Crosshair
