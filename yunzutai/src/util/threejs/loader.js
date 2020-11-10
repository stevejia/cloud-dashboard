import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2.js";
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
class ChintThreeLoader {
  loadObjModel(path, modelName, callback) {
    path = path || "static/3d/models/female/";
    modelName = modelName || "female02";
    console.log(MTLLoader);
    console.log(OBJLoader2);
    let objLoader = new OBJLoader2();
    let onLoadMtl = materials => {
      objLoader.setModelName(modelName);
      objLoader.addMaterials(
        MtlObjBridge.addMaterialsFromMtlLoader(materials),
        true
      );
      objLoader.setLogging(true, true);
      objLoader.load(`${path}${modelName}.obj`, onLoadObj, null, null, null);
    };
    let onLoadObj = model => {
      callback && callback(model);
    };
    let mtlLoader = new MTLLoader();
    mtlLoader.load(`${path}${modelName}.mtl`, onLoadMtl);
  }
}

export default ChintThreeLoader;
