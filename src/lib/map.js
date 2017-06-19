import * as THREE from 'three';
import {feature} from 'topojson';
import world from '../../world.json';
import earcut from 'earcut';


const blacklist = ['-99'];


const countries = feature(world, world.objects.countries).features
  .filter(({properties: {cc}}) => !blacklist.includes(cc));


const allCountries = countries
  .reduce(
    (result, country) => {
      const {properties: {cc}, geometry: {type, coordinates}} = country;
      if (type === 'Polygon') {
        return result.concat(coordinates.map(points => ({cc, points})));
      } else if (type === 'MultiPolygon') {
        return coordinates
          .reduce((r, polygon) => r.concat(polygon.map(points => ({cc, points}))), result);
      }
      return result;
    },
    []);


const flatten = points => points.reduce((arr, point) => arr.concat(point), []);
const unflatten = (items, dimensions) => {
  const faces = [];
  items.forEach((vertex, k) => {
    const [i, j] = [Math.floor(k / dimensions), k % dimensions];
    if (faces[i] === undefined) {
      faces[i] = [];
    }
    faces[i][j] = vertex;
  });
  return faces;
};


export const map = () => {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 1,
    transparent: true
  });
  const meshMaterial = new THREE.MeshLambertMaterial({color: 0x181f26});

  const normal = new THREE.Vector3(0, 0, 1);
  const color = new THREE.Color(0xffffff);


  const threeCountry = ({cc, points}) => {
    const vertices = points.map(([lng, lat]) => new THREE.Vector3(lng, lat, 0));

    const group = new THREE.Group();
    group.name = cc;

    // Find all triangles for 2D points
    const triangles = earcut(flatten(points), null, 2);

    // Create faces from all triangles
    const faces = unflatten(triangles, 3)
      .map(([a, b, c]) => new THREE.Face3(a, b, c, normal, color));


    const geometry = new THREE.Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, meshMaterial.clone());
    group.add(mesh);

    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = vertices;
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);


    group.select = () => {
      group.selected = true;
      mesh.material.color.set(0x1D242A);
      return group.name;
    };

    group.deselect = () => {
      group.selected = false;
      mesh.material.color.set(0x181f26);
      return group.name;
    };

    return group;
  };


  const mapGroup = new THREE.Group();
  allCountries.map(threeCountry).forEach(country => mapGroup.add(country));

  mapGroup.clearSelection = () =>
    mapGroup.children
      .filter(country => country.selected)
      .map(country => country.deselect());

  return mapGroup;
};
