var demo = {
    init:function(animName){
        var that = this;
        utils.loadRes(
            'https://hiloteam.github.io/Hilo/src/extensions/dragonbones/demo/data/' + animName + '/texture.png',
            'https://hiloteam.github.io/Hilo/src/extensions/dragonbones/demo/data/' + animName + '/texture.js',
            'https://hiloteam.github.io/Hilo/src/extensions/dragonbones/demo/data/' + animName + '/skeleton.js',
            function(textureImage, textureData, skeletonData){
                var width = 1200;
                var height = 900;
                var scale = 0.7;
                that.initArmature(textureImage, textureData, skeletonData);
                that.initForHilo(width, height, scale);
            }
        );
    },
    initArmature:function(textureImage, textureData, skeletonData){
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
        console.log(armatureDisplay)
        // 设定距离边距多少距离
        armatureDisplay.x = demo.pos[0];
        armatureDisplay.y = demo.pos[1];
        // 监听龙骨动画的启动
        armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function(e){
            console.log(dragonBones);
        }, armature);
        // 将龙骨动画添加到动画时钟里
        dragonBones.WorldClock.clock.add(armature);
        this.play();
    },
    initForHilo:function(gameWidth, gameHeight, scale){
        console.log('initForHilo');
        var stage = this.stage = new Hilo.Stage({
            renderType:'CANVAS',
            width:gameWidth,
            height:gameHeight,
            scaleX:scale,
            scaleY:scale,
            container:'animContainer'
        });
        
        stage.addChild(this.armatureDisplay);

        var ticker = new Hilo.Ticker(60);
        ticker.addTick(stage);
        ticker.addTick(dragonBones);
        ticker.start();
        var that = this;
        that.stage.enableDOMEvent(Hilo.event.POINTER_START,true);
        this.armatureDisplay.on(Hilo.event.POINTER_START, function(e){
            if(that.armature.animation._animationList.length > 1){
                that.play();
            }
        })
    },
    play:function(){
        // 播放当前动画 
        this.armature.animation.gotoAndPlay(this.getNextAnimationName(), -1, -1, 0);
    },
    // 绑定点击事件
    bindEvent:function(){
        var that = this;
        console.log(this)
        
        // window.onclick = window.ontouchstart = function(){
           
        // };
    },
    getNextAnimationName:function(){
        this._index = this._index||0;
        var list = this.armature.animation._animationList;
        return list[(this._index++)%list.length];
    }
};

demo.bindEvent();