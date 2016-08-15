import t from 'three';


export const run = ({canvas}) => {
  const scene = new t.Scene();

  const camera = new t.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  const geometry = new t.BoxGeometry(200, 200, 200);
  const material = new t.MeshBasicMaterial({color: 0xff0000, wireframe: true});

  const mesh = new t.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new t.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);


  const update = () => {
    mesh.rotation.x = mesh.rotation.x + 0.01;
    mesh.rotation.y = mesh.rotation.y + 0.02;
  };

  let raf = null;
  const animate = () => {
    raf = requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
  };

  animate();

  return {raf};
};
