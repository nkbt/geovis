import test from 'tape';
import {GeoVis} from '../src/Component';


test('GeoVis', t => {
  t.ok(GeoVis instanceof Function, 'should be function');
  t.end();
});
