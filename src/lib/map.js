import * as THREE from 'three';
import {feature} from 'topojson';
import world from '../../world.json';
import earcut from 'earcut';


const blacklist = ['-99'];

const countries = feature(world, world.objects.countries).features
  .filter(({properties: {cc}}) => !blacklist.includes(cc));

//console.log(`countries`, countries)


const allCountries = countries
  .reduce(
    (result, country) => {
      const {properties: {cc}, geometry: {coordinates}} = country;
      if (coordinates.length === 1) {
        return result.concat([{cc, points: coordinates[0]}]);
      }

      return coordinates.reduce(
        (result2, coords) => {
          // some odd Polygon that is like MultiPolygon, but not exactly. See 'ZA'
          if (coords.length === 1) {
            return result.concat([{cc, points: coords[0]}]);
          }
          return result.concat([{cc, points: coords}]);
        },
        result);
    },
    []);


export const map = () => {
  const lineMaterial = new THREE.LineBasicMaterial({color: 0x666666, linewidth: 2});
  const meshMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
//  var material = new THREE.MeshStandardMaterial( { color : 0x00cc00 } );

  var normal = new THREE.Vector3( 0, 1, 0 ); //optional
  var color = new THREE.Color( 0xffaa00 ); //optional
  var materialIndex = 0; //optional
//  var face = new THREE.Face3( 0, 1, 2, normal, color, materialIndex );


  const threeCountry = ({cc, points}) => {
    const group = new THREE.Group();
    group.name = cc;


//    const unique = points.reduce((result) => []);


    //    const curve = new THREE.CatmullRomCurve3(points);
//    curve.closed = true;

//    const geometry = new THREE.Geometry();
//    geometry.vertices = points;
//
//    const line = new THREE.Line(geometry, lineMaterial);
//    group.add(line);


//    console.log(`points`, points)

    const pointsFlat = points.reduce((arr, point) => arr.concat(point), []);

    const triangles = earcut(pointsFlat, null, 2);
//    console.log(`triangles`, triangles)
    const faces = [];
    let j = 0;
    triangles.forEach(vertex => {
      if (faces[j] && faces[j].length === 3) {
        j++;
      }
      if (faces[j] === undefined) {
        faces[j] = [];
      }
      faces[j].push(vertex);
    });


//    for (let i = 0; i < triangles.length / 3; i++) {
//      if (faces[j].length === 2) {
//        j++;
//      }
//      faces[j].push()
//
////      const j = faces.length * (3 * i);
//      faces.push([
//        triangles[j],
//        triangles[j + 1],
//        triangles[j + 2],
//      ]);
//    }
//    console.log(`faces`, faces)


    const geometry = new THREE.Geometry();
    geometry.vertices = points.map(([lat, lng]) => new THREE.Vector3(lng, 0, lat));


    const normal = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < faces.length; i += 1) {
//      const a = geometry.vertices[faces[i][0]];
//      const b = geometry.vertices[faces[i][1]];
//      const c = geometry.vertices[faces[i][2]];
//      console.log(a, b, c);


//      const a = new THREE.Vector3().fromArray(points[faces[i][0]]);
//      const b = new THREE.Vector3().fromArray(points[faces[i][1]]);
//      const c = new THREE.Vector3().fromArray(points[faces[i][2]]);
//        .crossVectors(
//          new THREE.Vector3().subVectors(b, a),
//          new THREE.Vector3().subVectors(c, a)
//        )
//        .normalize();
//      console.log(`normal`, normal)
      geometry.faces.push(new THREE.Face3(
        faces[i][0], faces[i][1], faces[i][2],
        normal, color, materialIndex
      ));
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    group.add(new THREE.Mesh(geometry, meshMaterial));
//

//    console.log(`deviation`, earcut.deviation(pointsFlat, null, 2, triangles))

//    console.log(`qh(points)`, )


//    console.log(`curve`, curve.points);


//    const geometry1 = new ConvexGeometry( line );
//    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
//    const mesh = new THREE.Mesh( geometry1, material );
//    group.add(mesh);

    return group;
//
//
//    //      .map(v => v.multiplyScalar(scale));
//
//    const curve = new THREE.CatmullRomCurve3(points);
//    curve.closed = true;
//
//
//
//    const mesh = new THREE.Mesh(geometry, meshMaterial);
////    group.add(mesh);
//
//
//    const geometry = new THREE.Geometry();
//    geometry.vertices = curve.getPoints(points.length);
//    const line = new THREE.Line(geometry, lineMaterial);
//    group.add(line);
//
//
//    return group;
  };


  return allCountries.map(threeCountry);
//  return [threeCountry(allCountries[5])];
};
