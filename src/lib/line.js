import * as THREE from 'three';
import TWEEN from 'tween.js';


export const line = ([srcLat, srcLon], [dstLat, dstLon], width, color = 0x00ff00) => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({color, transparent: true, opacity: 0});
  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(srcLon, srcLat, 0),
    new THREE.Vector3(dstLon, dstLat, 0)
  );
  const attack = new THREE.Line(geometry, material);

  attack.fadeOut = new TWEEN.Tween({opacity: 1})
    .to({opacity: 0}, 1000)
    .interpolation(TWEEN.Interpolation.CatmullRom);
  attack.fadeIn = new TWEEN.Tween({opacity: 0})
    .to({opacity: 1}, 1000)
    .interpolation(TWEEN.Interpolation.CatmullRom);
  attack.updater = function () {
    Object.assign(material, {opacity: this.opacity});
  };
  attack.fadeOut.onUpdate(attack.updater);
  attack.fadeIn.onUpdate(attack.updater);
  group.add(attack);

  attack.fadeIn.start();

  group.destroy = callback => {
    let all = group.children.length;
    const onComplete = () => {
      all = all - 1;
      if (all > 0) {
        return;
      }
      callback();
    };
    group.children.forEach(l => {
      l.fadeIn.stop();
      l.fadeOut.onComplete(onComplete).start();
    });
  };

  return group;
};
