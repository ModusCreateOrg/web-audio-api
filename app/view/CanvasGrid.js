/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 4/25/13
 * Time: 10:12 AM
 */
Ext.define('TNR.view.CanvasGrid', {
    extend               : 'Ext.Panel',
    xtype                : 'canvasgrid',
    requires             : ['Ext.util.HashMap'],
    config               : {
        cls              : 'canvas-grid',
        styleHtmlContent : true,
        tpl              : ''.concat(
            '<div class="outer">',
                '<div class="controls left">',
                    '<div class="reset">',
                        '<div class="button pictos-button clear" data-eventname="resetGrid">D</div>',
                        '<h3 class="label">Reset</h3>',
                    '</div>',
                    '<div class="bpm">',
                        '<h3>BPM</h3>',
                        '<div class="bpm-display">{bpm}</div>',
                        '<div class="bpm-adjust">',
                            '<span class="button pictos-button plus" data-eventname="adjustBPM">+</span>',
                            '<span class="button pictos-button minus" data-eventname="adjustBPM">-</span>',
                        '</div>',
                    '</div>',
                    '<div class="record">',
                        '<div class="button pictos-button toggle record" data-eventname="record">m</div>',
                        '<h3 class="label">Record</h3>',
                    '</div>',
                '</div>',
                '<div class="controls mid">',
                    '<canvas width="720px" height="720px" id="canvas-grid"></canvas>',
                '</div>',
                '<div class="controls right">',
                    '<div class="frequency">',
                        '<h3>Frequency:</h3>',
                        '<div class="button freq-button toggle pressed" data-eventname="frequencyDivideChange">2</div>',
                        '<div class="button freq-button toggle" data-eventname="frequencyDivideChange">3</div>',
                        '<div class="button freq-button toggle" data-eventname="frequencyDivideChange">4</div>',
                    '</div>',
                    '<div class="waveform">',
                        '<h3>Waveform:</h3>',
                        '<div class="button waveform-button pressed" data-eventname="waveformChange" data-value="0">Sine</div>',
                        '<div class="button waveform-button" data-eventname="waveformChange" data-value="1">Square</div>',
                        '<div class="button waveform-button" data-eventname="waveformChange" data-value="2">Sawtooth</div>',
                        '<div class="button waveform-button" data-eventname="waveformChange" data-value="3">Triangle</div>',
                    '</div>',
                    '<div class="filter">',
                        '<h3>Filter:</h3>',
                        '<div class="button filter-button pressed" data-eventname="filterChange" data-value="0">LowPass</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="1">HighPass</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="2">BandPass</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="3">LowShelf</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="4">HighShelf</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="5">Peaking</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="6">Notch</div>',
                        '<div class="button filter-button" data-eventname="filterChange" data-value="7">AllPass</div>',
                    '</div>',
                    '<div class="save">',
                        '<h3 class="label">Save:</h3>',
                        '<div class="button save-btn" data-eventname="saveGrid"></div>',
                    '</div>',
            '</div>'
        ),
        bpm              : 120,
        stage            : null,
        cells            : null,
        frequencyDivide  : 2,
        waveformType     : 0,
        filterType       : 0,
        recording        : null,
        positions        : []
    },
    initialize           : function () {
        var me = this;
        me.setData({
            bpm : me.getBpm()
        });
        me.on({
            painted : me.renderGrid,
            scope   : me
        });
        me.element.on({
            tap        : me.onTap,
            touchstart : me.onTouchStart,
            touchend   : me.onTouchEnd,
            scope      : me
        });
        me.callParent();
    },
    onTap                : function (evtObj) {
        var button    = evtObj.getTarget(".button", null, true),
            buttonDom = button && button.dom,
            eventName;

        if (button) {
            eventName = buttonDom.dataset.eventname;
            eventName && this.fireEvent(eventName, button);
        }
    },
    onTouchStart         : function (evtObj) {
        var btn = evtObj.getTarget('.button', null, true);
        if (btn && !btn.hasCls("pressed")) {
            btn.addCls("pressed");
        }
    },
    onTouchEnd           : function (evtObj) {
        var btn = evtObj.getTarget('.button', null, true);
        if (btn && !btn.hasCls("toggle")) {
            btn.removeCls("pressed");
        }
    },
    renderGrid           : function () {
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
                shape              = new createjs.Shape();
                shape.pressed      = false;
                shape.pressedStyle = pressedStyle;
                shape.defaultStyle = fillStyle;
                shape.logicalPos   = {
                    x : x,
                    y : y
                };
                shape.physicalPos = {
                    x : (10 + (width * x * 1.75)),
                    y : (10 + (height * y * 1.75))
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
    resetGrid            : function () {
        var stage        = this.getStage(),
            shapes       = stage.children,
            shapesLength = shapes.length,
            shape,
            i = 0;

        for (; i < shapesLength; i++) {
            shape = shapes[i];
            if (shape.pressed = true) {
                shape.pressed = false;
                if (shape.physicalPos) {
                    shape.graphics.clear().beginFill(shape.defaultStyle).drawRoundRect(shape.physicalPos.x, shape.physicalPos.y, 35, 35, 10).endFill();
                }
            }
        }
        stage.update();
    },
    onCellTap            : function (e) {
        this.toggleCellPressed(e.target);
    },
    toggleCellPressed    : function (shape) {
        var fillStyle = (shape.pressed) ? shape.defaultStyle : shape.pressedStyle;
        shape.graphics.clear().beginFill(fillStyle).drawRoundRect(shape.physicalPos.x, shape.physicalPos.y, 35, 35, 10).endFill();
        shape.pressed = !shape.pressed;
        if (shape.pressed)  {
           this.getPositions().push({x:shape.physicalPos.x, y:shape.physicalPos.y});
        }
        this.getStage().update();
    },
    startTicker          : function () {
        var me         = this,
            stage      = me.getStage(),
            cells      = me.getCells(),
            step       = 0,
            cellsIndex = 16,
            currentBar,
            stepCells,
            currentCell,
            fps,
            i,
            time;

        function draw() {
            fps = (me.getBpm() / 60);
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

                currentBar.graphics.clear().setStrokeStyle(2).beginStroke('#00465c').drawRoundRect(currentCell.physicalPos.x - 5, 5, 45, 705, 10);
                stage.update();

                step++;
                if (step == 16) {
                    step = 0;
                }
            }, 1000 / fps);
        }

        draw();

    },
    isRecording          : function () {
        return this.getRecording();
    },
    applyRecording       : function (newValue) {
        var recordButton = this.element.down('.button.record');
        if (recordButton) {
            if (!newValue) {
                recordButton.removeCls("pressed");
            }
        }
        return newValue;
    },
    applyBpm             : function (newBPM) {
        var bpmDisplay = this.element.down('.bpm-display');
        bpmDisplay && bpmDisplay.setHtml(newBPM);
        return newBPM;
    },
    applyFrequencyDivide : function (newValue) {
        var frequency = this.element.down('.frequency');
        frequency && this.setPressedInGroup(frequency, newValue, false);
        return parseInt(newValue, 10);
    },
    applyWaveformType    : function (newValue) {
        var waveform = this.element.down('.waveform');
        waveform && this.setPressedInGroup(waveform, newValue, true);
        return parseInt(newValue, 10);
    },
    applyFilterType    : function (newValue) {
        var filter = this.element.down('.filter');
        filter && this.setPressedInGroup(filter, newValue, true);
        return parseInt(newValue, 10);
    },

    setPressedInGroup : function (parent, value, asValueAttrib) {
        var choices      = parent.query('.button'),
            choiceLength = choices.length,
            i            = 0,
            choice,
            choiceEl,
            valueMatch;

        for (; i < choiceLength; i++) {
            choice = choices[i];
            choiceEl = Ext.fly(choice);
            valueMatch = (asValueAttrib) ? (choice.dataset.value == value) : (choice.innerHTML == value);
            if (valueMatch) {
                if (!choiceEl.hasCls("pressed")) {
                    choiceEl.addCls("pressed");
                }
            } else {
                choiceEl.removeCls("pressed");
            }

        }
    }
});