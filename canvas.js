/*
* @param {object}
*
* */

function CANVAS(canvasData) {
    this.childEl = 0;
    this.canvasData = canvasData;
    var stage = this.stage = new Hilo.Stage({
        renderType: 'CANVAS',
        width: canvasData.width,
        height: canvasData.height,
        scaleX: 1,
        scaleY: 1,
        container: canvasData.container
    });
    this.stage.enableDOMEvent('mousedown', true)
}
/*
{
    textureImage:'***.png',
    textureData : "*.json",
    skeletonData: "*.json",
    postion:[199,199]
}
*/
// 创建龙骨
var CREATEBONES = function (bonseData) {
    // 新建龙骨动画
    var dragonbonesFactory = this.dragonbonesFactory = new dragonBones.HiloFactory();
    // 添加龙骨动画
    dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(bonseData.textureImage, bonseData.textureData));
    // 添加龙骨的关节信息
    dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(bonseData.skeletonData));
    // 获取第一个龙骨动画
    var armature = this.armature = dragonbonesFactory.buildArmature(bonseData.skeletonData.armature[0].name);
    // 获取龙骨动画的详细信息
    var armatureDisplay = this.armatureDisplay = armature.getDisplay();
    // 设定距离边距多少距离
    armatureDisplay.x = bonseData.postion[0];
    armatureDisplay.y = bonseData.postion[1];
    var _this = this;
    armatureDisplay.index = bonseData.index;
    // 监听龙骨动画的启动
    armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function (e) {
    }, armature);
    // 将龙骨动画添加到动画时钟里
    dragonBones.WorldClock.clock.add(armature);
    return { armatureDisplay: armatureDisplay, armature: armature, playAni: this.palyBonesAni, nextAni: this.getNextBonesAni };
}

/*

* @param {object} bonesData 骨骼动画数据
* @param {object} showXY    人物出现的位置
* @param {object} joinAni   人物的入场动画
* @param {object} sceneData 场景数据
*
* */
CANVAS.prototype.init = function (bonesData, sceneData) {
    this.bonseData = bonseData;
    sceneData && this.loadScene(sceneData);
    var ticker = this.ticker = new Hilo.Ticker(60);
    ticker.addTick(dragonBones);
    ticker.addTick(this.stage);
    ticker.start();
};
/*
    @param {Array}  imageArr
    @param {Number} index 
*/
CANVAS.prototype.loadImg = function (imageArr, index) {
    var img = new Image();
    img.src = imageArr[index].src;
    var _this = this;
    (function (index) {
        img.onload = function () {
            var bmp = _this.bmp = new Hilo.Bitmap({
                image: img, rect: imageArr[index].rect, x: imageArr[index].x, y: imageArr[index].y
            })
            // 如果没有定义index 则使用图片默认的位置顺序进行排序
            console.log(index + "IMG")
            _this.stage.addChildAt(bmp, index);
            if (index == (imageArr.length - 1)) {
                _this.getBonseData(_this.bonseData);
            }
        }

    })(index)
}
// 加载场景
CANVAS.prototype.loadScene = function (loadScene) {
    var _this = this;
    for (var i = 0; i < loadScene.length; i++) {
        this.loadImg(loadScene, i);
    }
    return this;
}
// 入场动画
CANVAS.prototype.playAnimation = function () {
};


CANVAS.prototype.palyBonesAni = function () {
};
/*
   audioFun   
    {
        url:'****',
        load:function(){},
        end:function(){}
    }
*/
CANVAS.prototype.palyAudios = function (bgmUrl,callBack) {
    var audio = Hilo.WebSound.getAudio({
        src: bgmUrl,
        loop: false,
        volume: 1
    }).on('load', function (e) {
        // audioFun.load && audioFun.load(e);
        console.log(e);
        callBack(e.target);
    }).on('end', function (e) {
        // audioFun.end && audioFun.end(e);
    }).play();
}
// 对话框气泡
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
    console.log(textData.index + "text")
    this.stage.addChildAt(text, textData.index)
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
    boxHeight = (lineNum * postion.fontSize < maxHeight) ? maxHeight : lineNum * postion.fontSize * 0.85;
    borderRedius = (boxHeight / 4) > 20 ? 20 : boxHeight / 4;
    var g4 = new Hilo.Graphics({
        width: width + 10,
        height: postion.height,
        x: postion.x,
        y: postion.y
    });
    g4.lineStyle(5, "#e5e5e5").beginFill("rgba(0,0,0,0.5)").drawRoundRectComplex(0, 0, boxWidth + 10, boxHeight, borderRedius, borderRedius, borderRedius, 0).endFill();
    console.log(postion.index + "bable")
    this.stage.addChildAt(g4, postion.index)
    this.chatText({
        fontSize: postion.fontSize,
        text: postion.text,
        maxWidth: postion.maxWidth,
        width: 99,
        height: 11,
        index: postion.index + 1,
        x: postion.x + 10,
        y: postion.y + 10
    });
};

var bonseData1 = null;

// 获取单个龙骨动画的数据
CANVAS.prototype.getBonseData = function (bonseDatas) {
    var _this = this;
    for (var i = 0; i < bonseDatas.length; i++) {
        (function (i) {
            var BONSEDATA = new CREATEBONES(bonseDatas[i]);
            BONSEDATA.armatureDisplay.on("mousedown", function (e) {
                bonseData1 = e;
                var bonesIndex = e.eventTarget.parent.index;
                BONSEDATA.playAni(BONSEDATA.armature,BONSEDATA.nextAni(BONSEDATA.armature)=="atc"?1:0)
                console.log(e);
                bonseDatas[i].bgm && _this.palyAudios(bonseDatas[i].bgm,function(audiosData){
                    console.log(audiosData.duration);
                    console.log(BONSEDATA);
                });
            })
            _this.stage.addChildAt(BONSEDATA.armatureDisplay, bonseDatas[i].index);
            BONSEDATA.playAni(BONSEDATA.armature,0);
        })(i)

        this.chatBubble({
            width: 90,
            height: 90,
            x: 5,
            y: 0,
            fontSize: 12,
            maxWidth: 300,
            index: 9,
            text: "你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！"
        });
    }
}

// 获取下一个龙骨动画
CREATEBONES.prototype.getNextBonesAni = function (armature) {
    this._index = this._index || 0;
    var list = armature.animation._animationList;
    return list[(this._index++) % list.length];

};
// 播放龙骨动画
CREATEBONES.prototype.palyBonesAni = function (armature,cycle) {
    var name = this.nextAni(armature);
    armature.animation.gotoAndPlay(name, -1, -1, cycle|| 0);
};