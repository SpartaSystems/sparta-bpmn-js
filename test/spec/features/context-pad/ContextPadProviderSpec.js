'use strict';

require('bpmn-js/test/TestHelper');

/* global bootstrapViewer, inject */

var contextPadModule = require('../../../../lib/features/context-pad'),
    coreModule = require('bpmn-js/lib/core'),
    modelingModule = require('bpmn-js/lib/features/modeling'),
    connectModule = require('../../../../lib/features/connect');


describe('features - context-pad', function() {

    var diagramXML = require('../../../fixtures/bpmn/SpartaRules2.bpmn');

    var testModules = [coreModule, modelingModule, contextPadModule, connectModule];

    beforeEach(bootstrapViewer(diagramXML, {
        modules: testModules
    }));

    describe('bootstrap', function() {

        it('should bootstrap', inject(function(contextPadProvider) {
            expect(contextPadProvider).toBeDefined();
        }));

    });

    describe('variable context pad items ', function() {

        var container;
        beforeEach(function() {
            container = jasmine.getEnv().getTestContainer();
        });

        it('should not display delete button for "locked-down" items ',
            inject(function(elementRegistry, contextPad) {

                // given
                var element = elementRegistry.get('CreateComplaint');
                var contextPadEntries = contextPad.getEntries(element);

                expect(Object.keys(contextPadEntries).length).toBe(1);
                expect(contextPadEntries['delete']).not.toBeDefined();

                element = elementRegistry.get('DistributeAcknowledge');
                contextPadEntries = contextPad.getEntries(element);

                expect(Object.keys(contextPadEntries).length).toBe(1);
                expect(contextPadEntries['delete']).not.toBeDefined();

                element = elementRegistry.get('SubmitRCA');
                contextPadEntries = contextPad.getEntries(element);

                expect(Object.keys(contextPadEntries).length).toBe(1);
                expect(contextPadEntries['delete']).not.toBeDefined();
            }));

        it('should display delete button for allowed droppable items items ',
            inject(function(elementRegistry, contextPad) {

                // given
                var element = elementRegistry.get('CallActivity_18jo0ii');
                var contextPadEntries = contextPad.getEntries(element);

                expect(Object.keys(contextPadEntries).length).toBe(2);
                expect(contextPadEntries['delete']).toBeDefined();
            }));
    });
});