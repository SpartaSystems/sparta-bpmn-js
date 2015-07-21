'use strict';

var assign = require('lodash/object/assign'),
  labelUtil = require('bpmn-js/lib/features/label-editing/LabelUtil'),
  isObject = require('lodash/lang/isObject'),
  each = require('lodash/collection/each');

/**
 * A palette provider for BPMN 2.0 elements.
 */
function PaletteProvider(palette, create, elementFactory, spaceTool, lassoTool) {

  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;

  palette.registerProvider(this);
}

module.exports = PaletteProvider;

PaletteProvider.$inject = ['palette', 'create', 'elementFactory', 'spaceTool', 'lassoTool'];

PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool;


  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({
        type: type
      }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);

      //set label if option is defined
      if (options.labelText) {
        labelUtil.setLabel(shape, options.labelText);
      }

      //attach moddle attributes
      if (isObject(options.moddleAttrs)) {
        each(options.moddleAttrs, function(val, key) {
          shape.businessObject.set(key, val);
        });

      }
    }

    var shortType = type.replace(/^bpmn\:/, '');

    return {
      group: group,
      className: className,
      title: title || 'Create ' + shortType,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  assign(actions, {
    'lasso-tool': {
      group: 'tools',
      className: 'icon-lasso-tool',
      title: 'Activate the lasso tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'icon-space-tool',
      title: 'Activate the create/remove space tool',
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.call-activity': createAction(
      'bpmn:CallActivity', 'event', 'icon-call-activity', 'Add Investigation Process', {
        labelText: 'Investigation',
        moddleAttrs: {
          calledElement: 'Investigation-800',
          'ssi:droppable': 'true'
        }
      }
    )
  });

  return actions;
};