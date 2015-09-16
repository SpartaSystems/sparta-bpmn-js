'use strict';

var inherits = require('inherits'),
    is = require('bpmn-js/lib/util/ModelUtil').is;


var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * Sparta specific modeling rule
 */
function SpartaRules(eventBus) {
    RuleProvider.call(this, eventBus);
}

inherits(SpartaRules, RuleProvider);

SpartaRules.$inject = ['eventBus'];

SpartaRules.prototype.init = function() {

    this.addRule('shape.create', function(context) {
        var target = context.target;
        var shape = context.shape;

        return canCreate(shape, target);
    });

    //connections can only be reconnected to the original connection source/target.
    //this allows users to move the position of a connection around the original source/targets
    //for aesthetic purposes without breaking the process
    this.addRule('connection.reconnectStart', function(context) {
        var target = context.hover;
        var connection = context.connection;

        return canReconnectStart(connection, target);
    });
    this.addRule('connection.reconnectEnd', function(context) {
        var target = context.hover;
        var connection = context.connection;

        return canReconnectEnd(connection, target);
    });
};

//allow NOTHING to be dropped unless the attribute on the
//target, "ssi:allowDrop", is defined and the shape's type
//matches the attribute value.
function canCreate(shape, target) {
    var allowDrop = target.businessObject.get('ssi:allowDrop');
    var droppable = shape.businessObject.get('ssi:droppable');

    if (droppable === 'true') {
        if ((!allowDrop || !is(shape, allowDrop))) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }


}

function canReconnectStart(connection, target) {
    //current target id must match connection's original source id
    return target.id === connection.source.id;
}

function canReconnectEnd(connection, target) {
    //current target id must match connection's original target id
    return target.id === connection.target.id;
}

module.exports = SpartaRules;