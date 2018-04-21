/**
 * Created by ext on 12/19/2016.
 */

var SoundPlayer = SoundPlayer || {};
SoundPlayer._allAudioSource = [];

SoundPlayer._createURL = function (sound) {
    var soundUrl = "res/Sound/" + sound + ".mp3";
    return soundUrl;
};

SoundPlayer.AudioSource = cc.Class.extend({
    ctor: function () {
        SoundPlayer._allAudioSource.push(this);
        this._soundVolume = 1.0;
        this._allSound = [];
        this._soundLoop = {};
    },
    
    destroy: function () {
        this.stopAllSound();
        var idx = SoundPlayer._allAudioSource.indexOf(this);
        if(idx >= 0){
            SoundPlayer._allAudioSource.splice(idx, 1);
        }
    },

    _playSingleSound: function (sound, loop, cb) {
        var soundUrl = SoundPlayer._createURL(sound);
        var thiz = this;
        var finishedCallback = function () {
            if(loop){
                //no remove when loop
            }
            else{
                var idx = thiz._allSound.indexOf(audio);
                if(idx >= 0){
                    thiz._allSound.splice(idx, 1);
                }
            }
            (cb && cb());
        };
        if(cc.sys.isNative){
            var audio = jsb.AudioEngine.play2d(soundUrl, loop, this._soundVolume);
            jsb.AudioEngine.setFinishCallback(audio, finishedCallback);
        }
        else{
            var res = cc.loader.getRes(soundUrl);
            if(res){
                var audio = cc.audioEngine.playEffect(soundUrl, loop, finishedCallback);
                if(audio){
                    audio.setVolume(this._soundVolume);
                }
                else{
                    console.log("cannot load audio: " + soundUrl);
                }
            }
            else{
                console.log("audio is not preload: " + soundUrl);
                var thiz = this;
                cc.loader.load(soundUrl, function (err){
                    if(err){
                    }
                    else{
                        setTimeout(function () {
                            thiz._playSingleSound(sound, loop, cb);
                        }, 0);
                    }
                });
            }
        }
        if(audio !== null){
            this._allSound.push(audio);
        }
        return audio;
    },

    _stopSound: function (soundId) {
        if(cc.sys.isNative){
            jsb.AudioEngine.stop(soundId);
        }
        else{
            cc.audioEngine.stopEffect(soundId);
        }
        var idx = this._allSound.indexOf(soundId);
        if(idx >= 0){
            this._allSound.splice(idx, 1);
        }
    },

    _playMultiSound: function (soundList, index) {
        if(index >= soundList.length){
            return;
        }

        var thiz = this;
        this._playSingleSound(soundList[index], false, function () {
            thiz._playMultiSound(soundList, (index + 1));
        });
    },

    playSound: function (sound, loop) {
        if(cc.isArray(sound)){
            if(sound.length === 1){
                return this._playSingleSound(sound[0], false);
            }
            else{
                return this._playMultiSound(sound, 0);
            }
        }
        else{
            var soundLoop = loop ? true : false;
            if(soundLoop){
                return this.playSoundLoop(sound);
            }
            else{
                return this._playSingleSound(sound, false);
            }
        }
    },

    stopSound : function (soundName) {
        if(soundName){
            var soundId = this._soundLoop[soundName];
            (soundId && this._stopSound(soundId));
        }

        // if(soundId !== null && soundId !== undefined){
        //     this._stopSound(soundId);
        // }
        // else{
        //     if(!cc.sys.isNative){
        //         //stop for web
        //         var soundUrl = SoundPlayer._createURL(soundName);
        //         var ap = cc.audioEngine._audioPool;
        //         for(var p in ap){
        //             var list = ap[p];
        //             for(var i=0; i<list.length; i++){
        //                 var sound = list[i];
        //                 if(sound.src.endsWith(soundUrl)){
        //                     sound.stop();
        //                     return;
        //                 }
        //             }
        //         }
        //     }
        // }
    },

    playSoundLoop: function (soundName) {
        if(this._soundLoop[soundName]){
            return;
        }

        var soundID = this._playSingleSound(soundName, true);
        this._soundLoop[soundName] = soundID;
        return soundID;
    },

    stopSoundLoop: function (sound) {
        if(cc.isString(sound)){
            //soundName
            var soundName = sound;
            this.stopSound(sound);
            this._soundLoop[sound] = null;
        }
        else{
            //soundId -> find soundName
            var map = this._soundLoop;
            for (var key in map) {
                if (!map.hasOwnProperty(key)) continue;
                if(map[key] === sound){
                    var soundName = key;
                }
            }
        }

        this.stopSound(soundName);
        this._soundLoop[soundName] = null;
    },

    stopAllSound: function () {
        for(var i=0;i<this._allSound.length;i++){
            if(cc.sys.isNative){
                jsb.AudioEngine.stop(this._allSound[i]);
            }
            else{
                cc.audioEngine.stopEffect(this._allSound[i]);
            }
            //this._stopSound(this._allSound[i]);
        }
        this._allSound = [];
        this._soundLoop = {};
    },

    setSoundVolume: function (volume) {
        this._soundVolume = volume;
        for(var i=0;i<this._allSound.length;i++){
            var audio = this._allSound[i];
            if(cc.sys.isNative){
                jsb.AudioEngine.setVolume(audio, volume);
            }
            else{
                audio.setVolume(volume);
            }
        }
    }
});

SoundPlayer._globalAudioSource = new SoundPlayer.AudioSource();

SoundPlayer.playSound = function (sound, loop) {
    return SoundPlayer._globalAudioSource.playSound(sound, loop);
};

SoundPlayer.stopSound = function (sound) {
    return SoundPlayer._globalAudioSource.stopSound(sound);
};

SoundPlayer.playSoundLoop = function (sound) {
    return SoundPlayer._globalAudioSource.playSoundLoop(sound);
};

SoundPlayer.stopSoundLoop = function (sound) {
    return SoundPlayer._globalAudioSource.stopSoundLoop(sound);
};

SoundPlayer.stopAllSound = function () {
    //return SoundPlayer._globalAudioSource.stopAllSound();
    SoundPlayer.stopAllAudioSource();
    if(cc.sys.isNative){
        jsb.AudioEngine.stopAll();
    }
    else{
        cc.audioEngine.stopAllEffects();
    }
};

SoundPlayer.setSoundVolume = function (volume) {
   // return SoundPlayer._globalAudioSource.setSoundVolume(volume);
    SoundPlayer.setAllAudioSourceVolume(volume);
};

SoundPlayer.setAllAudioSourceVolume = function (volume) {
    for(var i=0;i<SoundPlayer._allAudioSource.length;i++){
        SoundPlayer._allAudioSource[i].setSoundVolume(volume);
    }
};

SoundPlayer.stopAllAudioSource = function () {
    for(var i=0;i<SoundPlayer._allAudioSource.length;i++){
        SoundPlayer._allAudioSource[i].stopAllSound();
    }
};