'use strict';

var inherits = require('inherits');
var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

/**
 * Call Activity specific remove behavior
 */
function RemoveDroppableBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  this.preExecute('shape.delete', function(context) {
    var shape = context.shape;

    if (shape.businessObject.get('ssi:droppable') === 'true') {

      var incoming = shape.incoming[0];
      var outgoing = shape.outgoing[0];
      var incomingWaypoints = incoming.waypoints.slice();
      var outgoingWaypoints = outgoing.waypoints.slice();
      var target = outgoing.target;
      var newWaypoints;

      //remove waypoints that connected between the call activity element
      incomingWaypoints.pop();
      outgoingWaypoints.shift();
      newWaypoints = incomingWaypoints.concat(outgoingWaypoints);

      //reconnect incoming connection's target to the call activity's outgoing connection's target
      modeling.reconnectEnd(incoming, target, newWaypoints);
    }

  }, true);
}

RemoveDroppableBehavior.$inject = ['eventBus', 'modeling'];

inherits(RemoveDroppableBehavior, CommandInterceptor);

module.exports = RemoveDroppableBehavior;