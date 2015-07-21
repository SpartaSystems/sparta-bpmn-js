'use strict';

/* global bootstrapModeler, inject */

require('bpmn-js/test/TestHelper');

var rulesModule = require('../../../../lib/features/rules'),
    connectModule = require('../../../../lib/features/connect'),
    modeling = require('bpmn-js/lib/features/modeling'),
    coreModule = require('bpmn-js/lib/core');

describe('features/rules - SpartaRules', function() {

    var testModules = [coreModule, rulesModule, modeling, connectModule];
    var testXML = require('../../../fixtures/bpmn/SpartaRules.bpmn');

    beforeEach(bootstrapModeler(testXML, {
        modules: testModules
    }));

    it('Call activity can be dropped on sequence that allows it (ssi:allowDrop="bpmn:CallActivity")',
        inject(function(rules, elementFactory, elementRegistry) {
            var shape = elementFactory.create('shape', {
                type: 'bpmn:CallActivity'
            });
            shape.businessObject.set('ssi:droppable', 'true');

            var target = elementRegistry.get('SequenceFlow_2');
            var context = {
                parent: target,
                shape: shape
            };

            expect(rules.allowed('shape.create', context)).toBe(true);
        }));

    it('Other shapes cannot be dropped on the sequence that allows only Call Activity ',
        inject(function(rules, elementFactory, elementRegistry) {
            var shape = elementFactory.create('shape', {
                type: 'bpmn:Task'
            });
            var target = elementRegistry.get('SequenceFlow_2');
            var context = {
                parent: target,
                shape: shape
            };

            expect(rules.allowed('shape.create', context)).toBe(false);
        }));

    it('Nothing can be dropped on sequences that do not configure "ssi:allowDrop" attribute',
        inject(function(rules, elementFactory, elementRegistry) {
            var shape = elementFactory.create('shape', {
                type: 'bpmn:Task'
            });
            var target = elementRegistry.get('SequenceFlow_3');
            var context = {
                parent: target,
                shape: shape
            };

            expect(rules.allowed('shape.create', context)).toBe(false);
        }));

    it('Connection starts cannot be assigned to a different target',
        inject(function(rules, elementRegistry) {
            var connection = elementRegistry.get('SequenceFlow_3');
            var target = elementRegistry.get('Closed-NoCAPA');
            var context = {
                hover: target,
                connection: connection
            };

            expect(rules.allowed('connection.reconnectStart', context)).toBe(false);
        }));

    it('Connection ends cannot be assigned to a different target',
        inject(function(rules, elementRegistry) {
            var connection = elementRegistry.get('SequenceFlow_3');
            var target = elementRegistry.get('SubmitRCA');
            var context = {
                hover: target,
                connection: connection
            };

            expect(rules.allowed('connection.reconnectEnd', context)).toBe(false);
        }));
});