'use strict';

var TestHelper = require('bpmn-js/test/TestHelper');

var TestContainer = require('mocha-test-container-support');

var domQuery = require('min-dom/lib/query');

/* global bootstrapViewer, inject */

var contextPadModule = require('bpmn-js/lib/features/context-pad'),
  coreModule = require('bpmn-js/lib/core'),
  modelingModule = require('bpmn-js/lib/features/modeling'),
  behaviorModule = require('../../../../../lib/features/modeling/behavior'),
  connectModule = require('../../../../../lib/features/connect');

describe('features/modeling/behavior - Remove Call Activity', function() {

  var diagramXML = require('../../../../fixtures/bpmn/SpartaRules2.bpmn');

  var testModules = [
    contextPadModule,
    coreModule,
    modelingModule,
    behaviorModule,
    connectModule
  ];

  beforeEach(bootstrapViewer(diagramXML, {
    modules: testModules
  }));


  describe('on delete ', function() {

    var container;
    beforeEach(function() {
      container = TestContainer.get(this);
    });

    it('CallActivity\'s source and target element should automatically reconnect',
      inject(function(elementRegistry, contextPad) {

        // given
        var element = elementRegistry.get('CallActivity_18jo0ii');
        var sourceElement = element.incoming[0].source;
        var targetElement = element.outgoing[0].target;

        contextPad.open(element);

        // mock event
        var event = {
          target: domQuery('[data-action="delete"]', container),
          preventDefault: function() {}
        };

        // when
        contextPad.trigger('click', event);

        // then
        expect(sourceElement.outgoing[0].target).toBe(targetElement);
      }));
  });
});