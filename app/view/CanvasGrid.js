/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 4/25/13
 * Time: 10:12 AM
 */
Ext.define('TNR.view.CanvasGrid', {
    extend            : 'Ext.Component',
    xtype             : 'canvasgrid',
    requires          : ['Ext.util.HashMap'],
    config            : {
        html  : '<canvas width="800px" height="800px" id="canvas-grid"></canvas>',
        stage : null,
        cells : null
    },
    initialize        : function () {
        var me = this;
        me.on({
            painted : me.renderGrid,
            scope   : me
        });
        me.callParent();
    },
    renderGrid        : function () {
        var me           = this,
            canvas       = me.element.down('#canvas-grid').dom,
            stage        = new createjs.Stage(canvas),
            length       = 16,
            width        = 25,
            height       = 25,
            fillStyle    = '#989a95',
            pressedStyle = '#ffffff',
            cells        = Ext.create('Ext.util.HashMap'),
            shape,
            x,
            y;

        me.setStage(stage);

        for (x = 0; x < length; ++x) {
            cells.add(x, []);
            for (y = 0; y < length; ++y) {
                shape = new createjs.Shape();
                shape.pressed = false;
                shape.pressedStyle = pressedStyle;
                shape.defaultStyle = fillStyle;
                shape.logicalPos = {
                    x : x,
                    y : y
                };
                shape.physicalPos = {
                    x : (5 + (width * x * 1.75)),
                    y : (5 + (height * y * 1.75))
                };
                shape.graphics.beginFill(fillStyle).drawRoundRect(shape.physicalPos.x, shape.physicalPos.y, 35, 35, 10);
                shape.onPress = Ext.bind(me.onCellTap, me);
                stage.addChild(shape);
                cells.get(x).push(shape);
            }
        }
        me.setCells(cells);
        stage.update();
        me.startTicker();
    },
    onCellTap         : function (e) {
        this.toggleCellPressed(e.target);
    },
    toggleCellPressed : function (shape) {
        var fillStyle = (shape.pressed) ? shape.defaultStyle : shape.pressedStyle;
        shape.graphics.clear().beginFill(fillStyle).drawRoundRect(shape.physicalPos.x, shape.physicalPos.y, 35, 35, 10).endFill();
        shape.pressed = !shape.pressed;
        this.getStage().update();
    },
    startTicker       : function () {
        var me         = this,
            stage      = me.getStage(),
            cells      = me.getCells(),
            fps        = 2,
            step       = 0,
            cellsIndex = 16,
            currentBar,
            stepCells,
            currentCell,
            i,
            time;

        function draw() {
            setTimeout(function () {
                requestAnimationFrame(draw);
//                 var now = new Date().getTime(),
//                     dt = now - (time || now);
//
//                time = now;
                stepCells = cells.get(step);

                for (i = 0; i < cellsIndex; i++) {
                    currentCell = stepCells[i];
                    currentCell.pressed && me.fireEvent('playCell', currentCell);
                }


                if (!currentBar) {
                    currentBar = new createjs.Shape();
                    stage.addChild(currentBar);
                }

                currentBar.graphics.clear().setStrokeStyle(1).beginStroke('#f00f00').drawRoundRect(currentCell.physicalPos.x - 5, 0, 45, 705, 10);
                stage.update();

                step++;
                if (step == 16) {
                    step = 0;
                }
            }, 1000 / fps);
        }

        draw();

    }
});