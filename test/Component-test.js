import test from 'tape';
import {ThreeBulkhead} from '../src/ThreeBulkhead';


test('GeoVis', t => {
  t.ok(ThreeBulkhead instanceof Function, 'should be function');
  t.end();
});
