var demo = {
    init:function(animName){
        var that = this;
        this.loadRes(
            // 'https://hiloteam.github.io/Hilo/src/extensions/dragonbones/demo/data/' + animName + '/texture.png',
            // 'https://hiloteam.github.io/Hilo/src/extensions/dragonbones/demo/data/' + animName + '/texture.js',
            // 'https://hiloteam.github.io/Hilo/src/extensions/dragonbones/demo/data/' + animName + '/skeleton.js',
            './SwordsMan_tex.png',
            './tex.js',
            './ske.js',
            function(textureImage, textureData, skeletonData){
                var width = 1200;
                var height = 900;
                var scale = 0.7;
                that.initArmature(textureImage, textureData, skeletonData);
                that.initForHilo(width, height, scale);
                
            }
        );
        console.log(this.loadRes)
    },
    loadScript:function(arr, callback){
        arr = arr.forEach?arr:[arr];
        var loadNum = arr.length;
        arr.forEach(function(src){
            var scriptElem = document.createElement('script');
            scriptElem.onload = onload;
            scriptElem.src = src;
            document.body.appendChild(scriptElem);
        });

        function onload(){
            loadNum --;
            if(loadNum === 0){
                callback && callback();
            }
        }
    },
    loadRes:function(textureImage, textureJSON, skeletonJSON, callback){
        var that = this;
        var loadNum = 2;
        var onload = function(){
            loadNum --;
            if(loadNum === 0){
                callback && callback(img, textureData, skeletonData);
            }
        };

        var img = new Image;
        img.onload = onload;
        img.src = textureImage;

        this.loadScript([textureJSON, skeletonJSON], onload);
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
        console.log(demo)
        // 设定距离边距多少距离
        armatureDisplay.x = demo.pos[0]*Math.random();
        armatureDisplay.y = demo.pos[1]*Math.random();
        // 监听龙骨动画的启动
        armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function(e){
            //console.log(dragonBones);
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
        // console.log(ticker.end)
        var that = this;
        that.stage.enableDOMEvent(Hilo.event.POINTER_START,true);
        this.armatureDisplay.on(Hilo.event.POINTER_START, function(e){
            if(that.armature.animation._animationList.length > 1){
                that.play();
            }
            that.getAudio();            
        })
        this.armatureDisplay.on(Hilo.event.POINTER_END, function(e){
            console.log('end')            
        })
    },
    play:function(){
        // 播放当前动画 
        this.armature.animation.gotoAndPlay(this.getNextAnimationName(), -1, -1, 0);
    },
    // 绑定点击事件
    bindEvent:function(){
        var that = this;
       // console.log(this)
        
        // window.onclick = window.ontouchstart = function(){
           
        // };
    },
    getNextAnimationName:function(){
        this._index = this._index||0;
        var list = this.armature.animation._animationList;
        return list[(this._index++)%list.length];
    },
    getAudio:function(){
        console.log('audio')
        var that = this ;
        // 获取音频文件
        var audio = Hilo.WebSound.getAudio({
            src:'./bgm1.mp3',
            loop:false,
            volume:1
        }).on('load',function(e){
            console.log(e)
            
        }).on('end',function(e){
            console.log(e)
          
        }).play();
    }
};

// demo.bindEvent();