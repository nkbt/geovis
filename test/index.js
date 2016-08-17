'use strict';

const noop = () => null;

// Skip all extra extensions
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;

require('react-component-template/test');
