'use strict';

require('bpmn-js/test/TestHelper');

var TestContainer = require('mocha-test-container-support');

var SpartaModeler = require('../../lib/SpartaModeler');


describe('SpartaModeler', function() {

    var container;

    beforeEach(function() {
        container = TestContainer.get(this);
    });


    function createModeler(xml, done) {
        var modeler = new SpartaModeler.RestrictedModeler({
            container: container
        });

        modeler.importXML(xml, function(err, warnings) {
            done(err, warnings, modeler);
        });
    }


    it.only('test', function(done) {
        var xml = require('../fixtures/bpmn/SpartaRules.bpmn');
        createModeler(xml, done);
    });


});