'use strict';

var assign = require('lodash/object/assign');
var svg;

function SpartaConnect(eventBus, elementRegistry) {

    function createMarker(options) {
        var attrs = assign({
            fill: 'black',
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeDasharray: 'none'
        }, options.attrs);

        var ref = options.ref || {
            x: 0,
            y: 0
        };

        var scale = options.scale || 1;

        // fix for safari / chrome / firefox bug not correctly
        // resetting stroke dash array
        if (attrs.strokeDasharray === 'none') {
            attrs.strokeDasharray = [10000, 1];
        }

        var marker = options.element
            .attr(attrs)
            .marker(0, 0, 20, 20, ref.x, ref.y)
            .attr({
                markerWidth: 20 * scale,
                markerHeight: 20 * scale
            });

        return marker;
    }

    //capture the snap svg instance
    eventBus.on(['canvas.init'], function(event) {
        svg = event.svg;
    });

    //change the color of the connection if the element allows drop via "ssi:allowDrop"
    eventBus.on([
        'connection.added',
        'connection.changed',
        'bendpoint.move.move',
        'bendpoint.move.cleanup'
    ], function(event) {
        var element = event.element || event.connection;
        var bo = element.businessObject;

        if (bo.get('ssi:allowDrop')) {
            var gfx = elementRegistry.getGraphics(element.id);
            var marker = createMarker({
                element: svg.path('M 1 5 L 11 10 L 1 15 Z'),
                ref: {
                    x: 11,
                    y: 10
                },
                scale: 0.5,
                attrs: {
                    fill: 'red'
                }
            });

            //set path color
            gfx.select('g path').attr({
                stroke: 'red',
                markerEnd: marker,
                strokeDasharray: '5 5'
            });
        }
    });
}

SpartaConnect.$inject = ['eventBus', 'elementRegistry'];

module.exports = SpartaConnect;