import test from 'tape';
import {GeoVis} from '../src/ThreeBulkhead';


test('GeoVis', t => {
  t.ok(GeoVis instanceof Function, 'should be function');
  t.end();
});
