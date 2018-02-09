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
CANVAS.prototype.init = function (bonesData, sceneData) {
    this.bonseData = bonseData;
    sceneData && this.loadScene(sceneData);
    setTimeout(function () {
    }.bind(this), 100);

    var ticker = this.ticker = new Hilo.Ticker(60);
    ticker.addTick(dragonBones);
    ticker.addTick(this.stage);

    ticker.start();

    // 如果场景数据有的话执行加载场景

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
        })
        // 如果没有定义index 则使用图片默认的位置顺序进行排序
        _this.stage.addChildAt(bmp, index);
        if (index >= imageArr.length - 1) {
            _this.getBonseData(_this.bonseData);
            console.log('index')
        }
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
// 入场动画
CANVAS.prototype.playAnimation = function () {
    console.log('playAnimation');
};

// 播放音频
CANVAS.prototype.palyAudios = function () {
    console.log('palyAudios');
};
// 对话框气泡
CANVAS.prototype.chatBubble = function () {
    console.log('chatBubble');
};
// 获取下一个龙骨动画
CANVAS.prototype.getNextBonesAni = function () {

    this._index = this._index || 0;
    var list = this.armature.animation._animationList;
    return list[(this._index++) % list.length];

};



// 播放龙骨动画
CANVAS.prototype.palyBonesAni = function (bonseData) {
    console.log('palyBonesAni');
    console.log(this.armature)
    this.armature.animation.gotoAndPlay(this.getNextBonesAni(), -1, -1, 0);

};

// 获取单个龙骨动画的数据
CANVAS.prototype.getBonseData = function (bonseDatas) {
    for (var i = 0; i < bonseDatas.length; i++) {
        console.log(bonseDatas[i])
        this.createBones(bonseDatas[i])
        this.palyBonesAni();
    }

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
CANVAS.prototype.createBones = function (bonseData) {
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
    this.stage.addChildAt(this.armatureDisplay, 99);
    // 监听龙骨动画的启动
    armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function (e) {
        //console.log(dragonBones);
    }, armature);
    // 将龙骨动画添加到动画时钟里
    dragonBones.WorldClock.clock.add(armature);
    console.log(armature);


}