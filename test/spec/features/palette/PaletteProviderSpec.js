'use strict';

require('bpmn-js/test/TestHelper');

/* global bootstrapModeler, inject */

var modelingModule = require('bpmn-js/lib/features/modeling'),
    paletteModule = require('../../../../lib/features/palette'),
    coreModule = require('bpmn-js/lib/core'),
    connectModule = require('../../../../lib/features/connect');

var domQuery = require('min-dom/lib/query');

describe('features/palette', function() {

  var diagramXML = require('../../../fixtures/bpmn/SpartaRules.bpmn');

  var testModules = [ coreModule, modelingModule, paletteModule, connectModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should provide BPMN modeling palette', inject(function(canvas, palette) {

    // when
    var paletteElement = domQuery('.djs-palette', canvas._container);
    var entries = domQuery.all('.entry', paletteElement);

    // then
    expect(entries.length).toBe(3);
  }));

});
