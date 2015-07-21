'use strict';


var assign = require('lodash/object/assign'),
  is = require('bpmn-js/lib/util/ModelUtil').is;

function ContextPadProvider(contextPad, modeling, elementFactory, create) {

  contextPad.registerProvider(this);

  this._contextPad = contextPad;
  this._modeling = modeling;
  this._elementFactory = elementFactory;
  this._create = create;
}

ContextPadProvider.$inject = [
  'contextPad',
  'modeling',
  'elementFactory',
  'create'
];

ContextPadProvider.prototype.getContextPadEntries = function(element) {

  var modeling = this._modeling,
    elementFactory = this._elementFactory,
    create = this._create;

  var actions = {};

  if (element.type === 'label') {
    return actions;
  }

  function removeElement(e) {
    if (element.waypoints) {
      modeling.removeConnection(element);
    } else {
      modeling.removeShape(element);
    }
  }

  function appendAction(type, className, options) {

    function appendListener(event, element) {

      var shape = elementFactory.createShape(assign({
        type: type
      }, options));
      create.start(event, shape, element);
    }

    var shortType = type.replace(/^bpmn\:/, '');

    return {
      group: 'model',
      className: className,
      title: 'Append ' + shortType,
      action: {
        dragstart: appendListener,
        click: appendListener
      }
    };
  }

  if (is(element, 'bpmn:FlowNode') || is(element, 'bpmn:InteractionNode')) {

    assign(actions, {
      'append.text-annotation': appendAction('bpmn:TextAnnotation', 'icon-text-annotation'),
    });
  }

  if (element.businessObject.get('ssi:droppable') === 'true' || is(element, 'bpmn:TextAnnotation')) {
    assign(actions, {
      'delete': {
        group: 'edit',
        className: 'icon-trash',
        title: 'Remove',
        action: {
          click: removeElement,
          dragstart: removeElement
        }
      }
    });
  }

  return actions;
};


module.exports = ContextPadProvider;