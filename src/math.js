/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Latitude/longitude spherical geodesy tools                         (c) Chris Veness 2002-2016  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong.html                                                    */
/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-spherical.html                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


export const toDeg = rad => rad * 180 / Math.PI;
export const toRad = deg => deg * Math.PI / 180;

/**
 * Converts point to Vector3d n-vector (normal to earth's surface).
 *
 * @returns {[Number, Number, Number]} Normalised n-vector representing lat/lon point.
 *
 * @example
 *   const p = new LatLon(45, 45);
 *   const v = p.toVector(); // [0.5000,0.5000,0.7071]
 */
const toVector = point => {
  const φ = toRad(point[0]);
  const λ = toRad(point[1]);

  const x = Math.cos(φ) * Math.cos(λ);
  const y = Math.cos(φ) * Math.sin(λ);
  const z = Math.sin(φ);

  return [x, y, z];
};


export const vector = radius => point => {
  const [x, y, z] = toVector(point);
  return [x * radius, y * radius, z * radius];
};


/**
 * Converts ‘this’ (geocentric) cartesian vector to (spherical) latitude/longitude point.
 *
 * @returns  {LatLon} Latitude/longitude point vector points to.
 *
 * @example
 *   const v = new Vector3d(0.500, 0.500, 0.707);
 *   const p = v.toLatLonS(); // 45.0°N, 45.0°E
 */
const toLatLonS = ([x, y, z]) => {
  const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ = Math.atan2(y, x);

  return [toDeg(φ), toDeg(λ)];
};


/**
 * Returns the distance between points (using haversine formula).
 *
 * @param   {[Number, Number]} from - Latitude/longitude of source point.
 * @param   {[Number, Number]} to - Latitude/longitude of destination point.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {number} Distance between this point and destination point, in same units as radius.
 *
 * @example
 *     const p1 = [52.205, 0.119];
 *     const p2 = [48.857, 2.351];
 *     const d = dist(p1, p2); // 404.3 km
 */
export const distance = function (from, to, radius = 6371e3) {
  const R = radius;
  const φ1 = toRad(from[0]);
  const λ1 = toRad(from[1]);
  const φ2 = toRad(to[0]);
  const λ2 = toRad(to[1]);
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};


/**
 * Returns the point at given fraction between ‘this’ point and specified point.
 *
 * @param   {[Number, Number]} from - Latitude/longitude of source point.
 * @param   {[Number, Number]} to - Latitude/longitude of destination point.
 * @param   {number} fraction - Fraction between the two points (0 = this point, 1 = specified point).
 * @returns {LatLon} Intermediate point between this point and destination point.
 *
 * @example
 *   let p1 = [52.205, 0.119];
 *   let p2 = [48.857, 2.351];
 *   let pMid = intermediatePoint(p1, p2, 0.25); // 51.3721°N, 000.7073°E
 */
export const intermediatePoint = function (from, to, fraction) {
  const φ1 = toRad(from[0]);
  const λ1 = toRad(from[1]);
  const φ2 = toRad(to[0]);
  const λ2 = toRad(to[1]);
  const sinφ1 = Math.sin(φ1);
  const cosφ1 = Math.cos(φ1);
  const sinλ1 = Math.sin(λ1);
  const cosλ1 = Math.cos(λ1);
  const sinφ2 = Math.sin(φ2);
  const cosφ2 = Math.cos(φ2);
  const sinλ2 = Math.sin(λ2);
  const cosλ2 = Math.cos(λ2);

  // distance between points
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const A = Math.sin((1 - fraction) * δ) / Math.sin(δ);
  const B = Math.sin(fraction * δ) / Math.sin(δ);

  const x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
  const y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
  const z = A * sinφ1 + B * sinφ2;

  const φ3 = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ3 = Math.atan2(y, x);

  // normalise lon to −180..+180°
  return [toDeg(φ3), (toDeg(λ3) + 540) % 360 - 180];
};
