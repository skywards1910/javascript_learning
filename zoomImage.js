<h1>
    FabricJS imageHelper</h1>
<label>chich chich</label>
<input type="button" id="btnEnableCache" value="Enable" />
<input type="button" id="btnDisableCache" value="Disable" />

<div id="canvasContainer">
    <canvas id="c" width="1920" height="600"></canvas>
</div>
<br>

<script src='./fabric.min.js'></script>

<script>
    // Copy this helper to annotation.js 
    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    var addImage = function(cv, url) {
        fabric.Image.fromURL(url, function(img) {
            var canvas = cv;

            var zoomLevel = 0;
            var zoomLevelMin = 0;
            var zoomLevelMax = 3;

            img.scale(1);
            var patternCanvas = new fabric.StaticCanvas();
            patternCanvas.setDimensions({
                width: img.width,
                height: img.height
            });
            patternCanvas.add(img);
            patternCanvas.renderAll();

            var panPoint = new fabric.Point(0, 0);
            var zoomPoint = new fabric.Point(img.width / 2, img.height / 2);

            var pattern = new fabric.Pattern({
                source: function() {
                    patternCanvas.renderAll();
                    return patternCanvas.getElement();
                },
                repeat: 'no-repeat',
            });

            var rect = new fabric.Rect({
                left: 0,
                top: 0,
                angle: 0,
                width: patternCanvas.getElement().width,
                height: patternCanvas.getElement().height,
                fill: pattern,
                objectCaching: true
            });

            rect.scale(0.2);
            canvas.add(rect);

            rect.zoomIn = function() {
                if (zoomLevel < zoomLevelMax) {
                    zoomLevel += 0.1;
                    console.log("zoomIn ", zoomLevel);
                    patternCanvas.zoomToPoint(zoomPoint, Math.pow(2, zoomLevel));
                    keepPositionInBounds();
                }
            };

            rect.enableCache = function(isEnable) {
                rect.objectCaching = isEnable;
                patternCanvas.zoomToPoint(zoomPoint, Math.pow(2, zoomLevel));
                keepPositionInBounds();
                //patternCanvas.renderAll();
                //rect.scale(0.2);
            }

            rect.zoomOut = function() {
                zoomLevel -= 0.1;
                if (zoomLevel < 0) zoomLevel = 0;
                if (zoomLevel >= zoomLevelMin) {
                    console.log("zoomOut ", zoomLevel);
                    patternCanvas.zoomToPoint(zoomPoint, Math.pow(2, zoomLevel));
                    keepPositionInBounds();
                }
            };

            rect.pan = function(movePoint) {
                patternCanvas.relativePan(movePoint.multiply(patternCanvas.getZoom()));
                keepPositionInBounds();
            };

            rect.lockRectForZoomPan = function(isLock) {
                rect.selectable = isLock;
                rect.lockScalingFlip = isLock;
                rect.lockRotation = isLock;
                rect.lockScalingX = isLock;
                rect.lockScalingY = isLock;
                rect.lockMovementX = isLock;
                rect.lockMovementY = isLock;
            };

            var keepPositionInBounds = function() {
                console.log("keep position in bound");
                var zoom = patternCanvas.getZoom();
                var xMin = (2 - zoom) * patternCanvas.width / 2;
                var xMax = zoom * patternCanvas.width / 2;
                var yMin = (2 - zoom) * patternCanvas.height / 2;
                var yMax = zoom * patternCanvas.height / 2;

                var point = new fabric.Point(patternCanvas.width / 2, patternCanvas.height / 2);
                var center = fabric.util.transformPoint(point, patternCanvas.viewportTransform);

                var clampedCenterX = clamp(center.x, xMin, xMax);
                var clampedCenterY = clamp(center.y, yMin, yMax);

                var diffX = clampedCenterX - center.x;
                var diffY = clampedCenterY - center.y;

                if (diffX != 0 || diffY != 0) {
                    patternCanvas.relativePan(new fabric.Point(diffX, diffY));
                }
            };

        });
    };



    window.onload = function() {
        var canvas = this.__canvas = new fabric.Canvas('c');

        //addImage(canvas, 'https://arandazzocurlaunah.files.wordpress.com/2013/07/imagen2.png');
        // addImage(canvas, "http://fabricjs.com/article_assets/carMaxCache.png");
        addImage(canvas, "https://images2.alphacoders.com/147/147320.png");
        canvas.on('mouse:wheel', function(option) {

            var imgObj = canvas.getActiveObject();
            if (option.e.deltaY > 0) {
                imgObj.zoomOut();
            } else {
                imgObj.zoomIn();
            }
            canvas.renderAll();

        });

        // var mouseDownPoint;
        // canvas.on('mouse:down', function(options) {
        //     var pointer = canvas.getPointer(options.e, true);
        //     mouseDownPoint = new fabric.Point(pointer.x, pointer.y);
        // });
        // canvas.on('mouse:up', function(options) {
        //     mouseDownPoint = null;
        // });
        // canvas.on('mouse:move', function(options) {
        //     var imgObj = canvas.getActiveObject();

        //     if (imgObj && mouseDownPoint) {
        //         var pointer = canvas.getPointer(options.e, true);
        //         var mouseMovePoint = new fabric.Point(pointer.x, pointer.y);
        //         imgObj.pan(mouseMovePoint.subtract(mouseDownPoint))
        //         mouseDownPoint = mouseMovePoint;
        //         canvas.renderAll();
        //     }
        // });

        document.getElementById("btnEnableCache").onclick = function() {
            var imgObj = canvas.getObjects();
            imgObj[0].enableCache(true);
        };

        document.getElementById("btnDisableCache").onclick = function() {
            var imgObj = canvas.getObjects();
            imgObj[0].enableCache(false);

        };
    };
</script>
