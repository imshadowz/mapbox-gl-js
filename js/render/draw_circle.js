'use strict';

var browser = require('../util/browser');
var mat4 = require('gl-matrix').mat4;

module.exports = drawCircles;

function drawCircles(painter, layer, posMatrix, tile) {
    var gl = painter.gl;

    if (!tile || !tile.buffers) return;
    var elementGroups = tile.elementGroups[layer.ref || layer.id];
    if (!elementGroups) return;

    // Blend to the front, not the back.
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    drawPoints(tile.buffers.circleVertex, elementGroups.icon.groups, posMatrix, 16);

    function drawPoints(vertex, groups, matrix, stride) {
        gl.switchShader(painter.dotShader, matrix);

        gl.uniform1f(painter.dotShader.u_size, 4 * browser.devicePixelRatio);
        gl.uniform1f(painter.dotShader.u_blur, 0.25);
        gl.uniform4fv(painter.dotShader.u_color, [0.1, 0, 0, 0.1]);

        vertex.bind(gl, painter.dotShader, 0);
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            var begin = group.vertexStartIndex;
            var count = group.vertexLength;
            gl.vertexAttribPointer(painter.dotShader.a_pos, 2, gl.SHORT, false, stride, 0);
            gl.drawArrays(gl.POINTS, begin, count);
        }
    }

    // Revert blending mode to blend to the back.
    gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE);
}