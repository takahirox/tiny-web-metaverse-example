import {
  addComponent,
  addEntity,
  IWorld
} from "bitecs";
import { AmbientLight } from "three";
import {
  avatarKeyControlsSystem,
  fpsCameraSystem,
  gltfAssetRecenterSystem,
  gltfAssetResizeSystem
} from "@tiny-web-metaverse/addons/src";
import {
  addObject3D,
  App,
  Avatar,
  createNetworkedEntity,
  EntityObject3D,
  EntityObject3DProxy,
  GltfLoader,
  GltfLoaderProxy,
  InScene,
  KeyEventListener,
  NetworkedPosition,
  NetworkedType,
  registerPrefab,
  SceneObject,
  SystemOrder
} from "@tiny-web-metaverse/client/src";

const sceneAssetUrl = 'assets/scene.glb';
const avatarAssetUrl = 'assets/Duck.gltf';

const roomId = '1234';
const canvas = document.createElement('canvas');

const app = new App({ canvas, roomId });
document.body.appendChild(canvas);

const world = app.getWorld();

const sceneObjectEid = addEntity(world);
addComponent(world, InScene, sceneObjectEid);
addComponent(world, SceneObject, sceneObjectEid);
addComponent(world, GltfLoader, sceneObjectEid);
GltfLoaderProxy.get(sceneObjectEid).allocate(sceneAssetUrl);

const light = new AmbientLight(0x888888);
const lightEid = addEntity(world);
addComponent(world, InScene, lightEid);
addObject3D(world, light, lightEid);

const AvatarPrefab = (world: IWorld): number => {
  const eid = addEntity(world);
  addComponent(world, Avatar, eid);
  addComponent(world, InScene, eid);
  addComponent(world, NetworkedPosition, eid);
  addComponent(world, GltfLoader, eid);
  GltfLoaderProxy.get(eid).allocate(avatarAssetUrl);
  addComponent(world, EntityObject3D, eid);
  EntityObject3DProxy.get(eid).allocate();
  return eid;
};

registerPrefab(world, 'avatar', AvatarPrefab);

const avatarEid = createNetworkedEntity(world, NetworkedType.Local, 'avatar');
EntityObject3DProxy.get(avatarEid).root.position.set(0.0, 0.75, 2.0);
addComponent(world, KeyEventListener, avatarEid);

app.registerSystem(gltfAssetResizeSystem, SystemOrder.Setup + 1);
app.registerSystem(gltfAssetRecenterSystem, SystemOrder.Setup + 2);
app.registerSystem(avatarKeyControlsSystem, SystemOrder.BeforeMatricesUpdate);
app.registerSystem(fpsCameraSystem, SystemOrder.MatricesUpdate - 1);

app.start();
