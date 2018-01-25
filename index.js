function text(dragonBonesData) {
    var stage = this.stage = new Hilo.Stage({
        renderType: 'CANVAS',
        width: 800,
        height: 800,
        scaleX: 0.7,
        scaleY: 0.7,
        container: 'animContainer'
    });
    // 新建龙骨动画
    function addDragonBonesAni(textureImage, textureData, skeletonData, xy) {
        var dragonbonesFactory = new dragonBones.HiloFactory();
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
        armature.animation.gotoAndPlay(this.armature.animation._animationList[1],-1,-1,0)
        return armatureDisplay;
    }

    var ticker = new Hilo.Ticker(60);
    console.log(dragonBonesData)
    for (var i = 0; i < dragonBonesData.length; i++) {
        this.armatureDisplay = new addDragonBonesAni(dragonBonesData[i].textureImage, dragonBonesData[i].textureData, dragonBonesData[i].skeletonData, dragonBonesData[i].xy);
        console.log(this.armatureDisplay)
        stage.xy = dragonBonesData[i].xy;
        stage.enableDOMEvent('mousedown', true)
        var _this = this;
        this.armatureDisplay.on('mousedown', function (e) {
            // console.log(stage)
            console.log(e.eventTarget)
        })

        stage.addChild(this.armatureDisplay);
        Hilo.Tween.to(this.armatureDisplay,{
            x:200*Math.random(),
            y:500,
            alpha:1
        }, {
            duration:1000,
            delay:500,
            ease:Hilo.Ease.Linear.EaseIn,
            onComplete:function(){
               console.log('进场完成')
            }
        })
    }
    ticker.addTick(Hilo.Tween);
    ticker.addTick(stage);
   
    ticker.addTick(dragonBones);
    ticker.start();
}