'use strict';
var inherits = require('inherits');
var Modeler = require('bpmn-js/lib/Modeler');
var Viewer = require('bpmn-js/lib/Viewer');

function RestrictedModeler(options) {
  Viewer.call(this, options);
}

inherits(RestrictedModeler, Viewer);

RestrictedModeler.prototype.createDiagram = Modeler.prototype.createDiagram;
RestrictedModeler.prototype.createModdle = Modeler.prototype.createModdle;

RestrictedModeler.prototype._interactionModules = [
  require('./features/rules'),
  require('bpmn-js/lib/features/label-editing'),
  require('diagram-js/lib/navigation/zoomscroll'),
  require('diagram-js/lib/navigation/movecanvas'),
  require('diagram-js/lib/navigation/touch')
];

RestrictedModeler.prototype._modelingModules = [
  require('diagram-js/lib/features/move'),
  require('diagram-js/lib/features/bendpoints'),
  require('diagram-js/lib/features/resize'),
  require('diagram-js/lib/features/space-tool'),
  require('diagram-js/lib/features/lasso-tool'),
  require('bpmn-js/lib/features/keyboard'),
  require('bpmn-js/lib/features/snapping'),
  require('bpmn-js/lib/features/modeling'),
  require('./features/context-pad'),
  require('./features/palette'),
  require('./features/connect'),
  require('./features/modeling')
];

RestrictedModeler.prototype._modules = [].concat(
  RestrictedModeler.prototype._modules,
  RestrictedModeler.prototype._interactionModules,
  RestrictedModeler.prototype._modelingModules);

module.exports = {
  OpenModeler: Modeler,
  RestrictedModeler: RestrictedModeler
};