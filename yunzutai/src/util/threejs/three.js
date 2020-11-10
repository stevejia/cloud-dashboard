import "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ChintThreeLoader from "./loader";
class ChintThree {
  constructor(element, showGrid = true) {
    this.initConfig(showGrid);
    // this.init3D(element);
  }

  initConfig(showGrid) {
    this.showGrid = showGrid;
    this.loader = new ChintThreeLoader();
    /**
     * 相机的配置
     */
    this.cameraDefaults = {
      posCamera: new THREE.Vector3(0.0, 175.0, 500.0),
      posCameraTarget: new THREE.Vector3(0, 0, 0),
      near: 0.1,
      far: 10000,
      fov: 45
    };
    this.aspectRatio = 1;
    this.cameraTarget = this.cameraDefaults.posCameraTarget;
  }
  init3D(element) {
    /**
     * 创建场景对象Scene
     */
    this.scene = new THREE.Scene();

    let texture = new THREE.TextureLoader().load("static/3d/scenery.jpg");

    let sphereGeometry = new THREE.SphereGeometry(2000, 50, 50);
    sphereGeometry.scale(-1, 1, 1);

    let sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    this.scene.add(sphere);

    this.initGrid();

    this.loadObjModel();

    // this.scene.remove(sphere);

    //创建相机对象
    this.camera = new THREE.PerspectiveCamera(
      this.cameraDefaults.fov,
      this.aspectRatio,
      this.cameraDefaults.near,
      this.cameraDefaults.far
    );
    /**
     * 创建渲染器对象
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    let width = element.clientWidth; //窗口宽度
    let height = element.clientHeight; //窗口高度

    this.renderer.setSize(width, height);
    /**
     * 将渲染器的Dom添加到元素中
     */
    element.appendChild(this.renderer.domElement);
    /**
     * 添加3DChange事件
     */
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener("change", this.render3D.bind(this));
  }

  /**
   * 渲染场景
   * @param {*} config 渲染场景所需要的配置信息
   */
  render3D(config) {
    console.log(config);
    // this.renderer.clear(true, true, true);

    this.renderer.render(this.scene, this.camera);
  }

  init(element) {
    this._init(element);
    this.initGrid();

    // this.initThree(element);
    // this.initScene();
    // this.initLight();
    // this.initCamera(element);
    // this.initObject();
    this.render();
  }
  initGrid() {
    if (!this.showGrid) {
      return;
    }
    let helper = new THREE.GridHelper(
      2500,
      50,
      0xff4444,
      "rgba(102, 191, 216, 1)"
    );
    this.scene.add(helper);
    // let geometry = new THREE.Geometry();
    // geometry.vertices.push(new THREE.Vector3(-2000, 0, 0));
    // geometry.vertices.push(new THREE.Vector3(2000, 0, 0));
    // for (let i = 0; i <= 100; i++) {
    //   let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xB2DDFF, opacity: 0.2 }));
    //   line.position.z = (i * 40) - 2000;
    //   this.scene.add(line);

    //   let rLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xB2DDFF, opacity: 0.2 }));
    //   rLine.position.x = (i * 40) - 2000;
    //   rLine.rotation.y = 90 * Math.PI / 180;
    //   this.scene.add(rLine);
    // }
  }
  _init(element) {
    /**
     * 创建场景对象Scene
     */
    this.scene = new THREE.Scene();

    // let skyBoxGeometry = new THREE.SphereGeometry(2000);
    // // let skyBoxGeometry = new THREE.BoxGeometry(5000, 5000, 5000);

    // let texture = new THREE.TextureLoader().load("https://img-blog.csdn.net/20180824101338237?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2l0aGFubWFuZw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70");

    // let skyBoxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });

    // let skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

    // this.scene.add(skyBox);

    let texture = new THREE.TextureLoader().load("static/3d/scenery.jpg");

    let sphereGeometry = new THREE.SphereGeometry(2000, 50, 50);
    sphereGeometry.scale(-1, 1, 1);

    let sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    this.scene.add(sphere);

    // /**
    //  * 创建网格模型
    //  */
    // //   let geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
    // let geometry = new THREE.BoxGeometry(200, 200, 200); //创建一个立方体几何对象Geometry
    // let material = new THREE.MeshLambertMaterial({
    //   color: 0xffffff
    // }); //材质对象Material
    // let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    // mesh.position.y = 0;
    // this.scene.add(mesh); //网格模型添加到场景中
    this.loadObjModel();
    /**
     * 光源设置
     */
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(100, 200, 300); //点光源位置
    this.scene.add(point); //点光源添加到场景中
    //环境光
    let ambient = new THREE.AmbientLight(0xffff00, 1);
    this.scene.add(ambient);
    // console.log(scene)
    // console.log(scene.children)
    /**
     * 相机设置
     */

    let width = element.clientWidth; //窗口宽度
    let height = element.clientHeight; //窗口高度
    // let k = width / height; //窗口宽高比
    // let s = 300; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);

    this.camera = new THREE.PerspectiveCamera(
      this.cameraDefaults.fov,
      this.aspectRatio,
      this.cameraDefaults.near,
      this.cameraDefaults.far
    );
    this.resetCamera();
    // this.camera.position.set(0, 200, 600); //设置相机位置
    // this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染器对象
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height); //设置渲染区域尺寸
    // this.renderer.setClearColor(0x2b2e37, 1); //设置背景颜色
    this.renderer.setClearColor(0x050505);

    element.appendChild(this.renderer.domElement);
    /**
     * 添加3DChange事件
     */
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener("change", this.render.bind(this));
  }

  resetCamera() {
    this.camera.position.copy(this.cameraDefaults.posCamera);
    this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);

    this.updateCamera();
  }
  updateCamera() {
    this.camera.aspect = this.aspectRatio;
    this.camera.lookAt(this.cameraTarget);
    this.camera.updateProjectionMatrix();
  }
  initThree(element) {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      element.appendChild(this.renderer.domElement);
    }
    console.log(element);
    let { clientWidth, clientHeight } = element;
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setClearColor(0xb9d3ff, 1.0);
  }
  initCamera(element) {
    if (!this.camera) {
      let { clientWidth, clientHeight } = element;
      let k = clientWidth / clientHeight; //窗口宽高比
      let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
      //创建相机对象
      let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
      camera.position.set(30, 20, 50); //设置相机位置
      camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      // let camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 1, 1000);
      // camera.position.set(50, 0, 200); //设置相机位置
      // camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      // camera.position.x = 0;
      // camera.position.y = 1000;
      // camera.position.z = 0;
      // camera.up.x = 0;
      // camera.up.y = 0;
      // camera.up.z = 1;
      // camera.lookAt({
      //   x: 0,
      //   y: 0,
      //   z: 0
      // });
      this.camera = camera;
    }
  }
  initScene() {
    this.scene = new THREE.Scene();
  }

  initLight() {
    /**
     * 光源设置
     */
    //点光源
    let point = new THREE.PointLight(0x00ffff);
    point.position.set(100, 200, 300); //点光源位置
    this.scene.add(point); //点光源添加到场景中
    //环境光
    let ambient = new THREE.AmbientLight(0x00ff00);
    this.scene.add(ambient);
  }
  initObject() {
    let geometry = new THREE.BoxGeometry(100, 100, 100);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }
  loadObjModel(path, modelName) {
    path = path || "static/3d/models/female/";
    modelName = modelName || "female02";
    this.loader.loadObjModel(path, modelName, model => {
      this.scene.add(model);
      this.render();
    });
  }

  render() {
    console.log(this.camera);
    this.renderer.clear(true, true, true);
    this.renderer.render(this.scene, this.camera);
  }
}

export default ChintThree;
