var stage = this.stage = new Hilo.Stage({
    renderType: 'CANVAS',
    width: 800,
    height: 800,
    scaleX: 0.7,
    scaleY: 0.7,
    container: 'animContainer'
});
var ticker = new Hilo.Ticker();

function INDEX(textureImage, textureData, skeletonData, xy, index) {
    function init(textureImage, textureData, skeletonData, xy) {
        // 新建龙骨动画
        var dragonbonesFactory = this.dragonbonesFactory = new dragonBones.HiloFactory();
        // 添加龙骨动画
        dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(textureImage, textureData));
        // 添加龙骨的关节信息
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        // 获取第一个龙骨动画
        var armature = this.armature = dragonbonesFactory.buildArmature(skeletonData.armature[0].name);
        // 获取龙骨动画的详细信息
        var armatureDisplay = this.armatureDisplay = armature.getDisplay();
        // 设定距离边距多少距离
        armatureDisplay.x = xy.x;
        armatureDisplay.y = xy.y;
        // 监听龙骨动画的启动
        armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function (e) {
            // console.log(dragonBones);
        }, armature);
        // 将龙骨动画添加到动画时钟里
        dragonBones.WorldClock.clock.add(armature);
        armature.animation.gotoAndPlay(this.armature.animation._animationList[1])
        // armature.animation.gotoAndStop(this.armature.animation._animationList[1],1)

        stage.xy = xy;
        stage.enableDOMEvent('mousedown', true)
        var _this = this;
        this.armatureDisplay.on('mousedown', function (e) {
            // console.log(e.eventCurrentTarget.getChildAt())
            // _this.removeChild(0)
            console.log(stage)
            console.log(e.eventCurrentTarget.getChildIndex())
        })
        stage.addChild(this.armatureDisplay);
        // stage.removeChildAt()
        ticker.addTick(stage);
        ticker.addTick(dragonBones);
        
    }
    init(textureImage, textureData, skeletonData, xy);
}
ticker.start();
