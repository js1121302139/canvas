/*
* @param {object}
*
* */

function CANVAS(canvasData) {
    this.canvasData = canvasData;
    var stage = this.stage = new Hilo.Stage({
        renderType: 'CANVAS',
        width: canvasData.width,
        height: canvasData.height,
        scaleX: 0.7,
        scaleY: 0.7,
        container: canvasData.container
    });
}
/*

* @param {object} bonesData 骨骼动画数据
* @param {object} showXY    人物出现的位置
* @param {object} joinAni   人物的入场动画
* @param {object} sceneData 场景数据
*
* */
CANVAS.prototype.init = function (bonesData, showXY, joinAni, sceneData) {
    var ticker = new Hilo.Ticker(20);
    ticker.addTick(this.stage);
    ticker.start();
    // 如果场景数据有的话执行加载场景
    sceneData && this.loadScene(sceneData);
    console.log("init");
};
/*
    @param {Array}  imageArr
    @param {Number} index 
*/ 
CANVAS.prototype.loadImg=function(imageArr,index){
    var img = new Image();
        img.src = imageArr[index].src;
    var _this = this;
    img.onload = function () {
        console.log(index)
        var bmp = _this.bmp = new Hilo.Bitmap({
            image: img, rect: loadScene[index].rect, x: loadScene[index].x, y: loadScene[index].y
        })//.addChild(_this.stage)
        _this.stage.addChildAt(bmp);
    }
}
// 加载场景
CANVAS.prototype.loadScene = function (loadScene) {
    console.log("loadScene")
    var _this = this;
    for (var i = 0; i < loadScene.length; i++) {
        this.loadImg(loadScene,i);
    }
    return this;
}

CANVAS.prototype.playAnimation = function () {
    console.log('playAnimation');
};

CANVAS.prototype.palyBonesAni = function () {
    console.log('palyBonesAni');
};

CANVAS.prototype.palyAudios = function () {
    console.log('palyAudios');
};

CANVAS.prototype.chatBubble = function () {
    console.log('chatBubble');
};

CANVAS.prototype.getNextBonesAni = function () {
    console.log('getNextBonesAni');
};