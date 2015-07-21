'use strict';

require('bpmn-js/test/TestHelper');

var SpartaModeler = require('../../lib/SpartaModeler');


describe('SpartaModeler', function() {

    var container;

    beforeEach(function() {
        container = jasmine.getEnv().getTestContainer();
    });


    function createModeler(xml, done) {
        var modeler = new SpartaModeler.RestrictedModeler({
            container: container
        });

        modeler.importXML(xml, function(err, warnings) {
            done(err, warnings, modeler);
        });
    }


    iit('test', function(done) {
        var xml = require('../fixtures/bpmn/SpartaRules.bpmn');
        createModeler(xml, done);
    });


});