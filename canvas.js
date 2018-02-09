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
        scaleX: 1,
        scaleY: 1,
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
    this.chatBubble({ width: 90, height: 90, x: 5, y: 0, fontSize: 12, maxWidth: 300, text: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111' });
    console.log("init");

};
/*
    @param {Array}  imageArr
    @param {Number} index 
*/
CANVAS.prototype.loadImg = function (imageArr, index) {
    var img = new Image();
    img.src = imageArr[index].src;
    var _this = this;
    img.onload = function () {
        console.log(index)
        var bmp = _this.bmp = new Hilo.Bitmap({
            image: img, rect: imageArr[index].rect, x: imageArr[index].x, y: imageArr[index].y
        })//.addChild(_this.stage)
        _this.stage.addChildAt(bmp, index);
    }
}
// 加载场景
CANVAS.prototype.loadScene = function (loadScene) {
    console.log("loadScene")
    var _this = this;
    for (var i = 0; i < loadScene.length; i++) {
        this.loadImg(loadScene, i);
    }
    return this;
}

CANVAS.prototype.playAnimation = function () {
    console.log('playAnimation');
};

CANVAS.prototype.palyBonesAni = function () {
    console.log('palyBonesAni');
};
/*
   audioFun   
    {
        url:'****',
        load:function(){},
        end:function(){}
    }
*/
CANVAS.getAudios = function (audioFun) {
    var audio = Hilo.WebSound.getAudio({
        src: audioUrl,
        loop: false,
        volume: 1
    }).on('load', function (e) {
        console.log(e);
        audioFun.load && audioFun.load(e);

    }).on('end', function (e) {
        console.log(e);
        audioFun.end && audioFun.end(e);

    })
    return audio;
}

CANVAS.prototype.palyAudios = function () {
    this.getAudios.play();
};

/*
{
    fontSize:12,
    text:'ooooo',
    maxWidth:99,
    width:99,
    height:11,
    x:0,
    y:0
}
*/

CANVAS.prototype.chatText = function (textData) {
    var font = textData.fontSize + "px arial";

    //text view
    var text = new Hilo.Text({
        font: font,
        color: "#fff",
        text: textData.text,
        width: textData.width,
        height: textData.height,
        maxWidth: textData.maxWidth,
        x: textData.x,
        y: textData.y
    });
    this.stage.addChild(text)
}
/*
{ width: 90, height: 90, x: 5, y: 170,maxWidth:200 fontSize:12, text:'oooooo' }
*/
CANVAS.prototype.chatBubble = function (postion) {
    var maxWidth = postion.maxWidth || 200,
        maxHeight = 40,
        boxWidth = 0,
        boxHeight = 0,
        lineNum = 0,
        borderRedius = 0;
    var width = postion.text.length * postion.fontSize;
    if (width > maxWidth || width < maxWidth) {
        boxWidth = maxWidth;
        lineNum = width / maxWidth;
    }
    boxHeight = (lineNum * postion.fontSize < maxHeight) ?maxHeight:lineNum * postion.fontSize *0.75;
    borderRedius = (boxHeight / 4)>20 ? 20:boxHeight / 4;
    console.log(borderRedius)
    var g4 = new Hilo.Graphics({
        width: width + 10,
        height: postion.height,
        x: postion.x,
        y: postion.y
    });
    g4.lineStyle(5, "#e5e5e5").beginFill("rgba(0,0,0,0.5)").drawRoundRectComplex(0, 0, boxWidth + 10, boxHeight, borderRedius, borderRedius, borderRedius, 0).endFill();
    console.log(g4)

    this.stage.addChild(g4)
    console.log('chatBubble');
    this.chatText({
        fontSize: postion.fontSize,
        text: postion.text,
        maxWidth: postion.maxWidth,
        width: 99,
        height: 11,
        x: postion.x + 10,
        y: postion.y + 10
    });
};

CANVAS.prototype.getNextBonesAni = function () {
    console.log('getNextBonesAni');
};