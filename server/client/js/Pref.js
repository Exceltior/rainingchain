//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
"use strict";
(function(){ //}
var Song = require4('Song'), Main = require4('Main'), Message = require4('Message'), Input = require4('Input');
var Pref = exports.Pref = {};

var VOL_MASTER = 25; //30
Pref.create = function(id,name,initValue,min,max,description,displayType,func){
	var tmp = {
		id:id||ERROR(3,'id missing'),
		name:name||'',
		initValue:initValue || 0,
		min:min||0,
		max:max||0,
		description:description||'',
		func:func||null,
		displayType : displayType || Pref.DisplayType(),
	}
	if(min === 0 && max === 1)
		tmp.displayType = Pref.DisplayType('boolean');
	
	DB[id] = tmp;
}

var DB = Pref.DB = {};

Pref.get = function(id){
	if(!id) return DB;
	return DB[id] || null;
}

Pref.DisplayType = function(type,option){
	var a = {
		type:type || 'number',
		option:option || null	
	}
	if(!['boolean','number','string','slider'].$contains(a.type)) 
		return ERROR(4,'invalid type',a.type);
	return a;
}


Pref.create('volumeMaster','Volume Master',VOL_MASTER,0,100,'Volume Master. 0:Mute',Pref.DisplayType('slider'),function(){ Song.updateVolume(); });	//cant direct cuz id need song to be loaded
Pref.create('volumeSong','Volume Song',5,0,100,'Volume Song.',Pref.DisplayType('slider'),function(){ Song.updateVolume(); });
Pref.create('volumeSfx','Volume Effects',75,0,100,'Volume Sound Effects.',Pref.DisplayType('slider'));
Pref.create('enableLightingEffect','Enable Lighting Effects',1,0,1,'Enable Lighting Effects. Turning this off will improve performance.');
Pref.create('enableWeather','Enable Weather',1,0,1,'Enable Weather like rain, sun and night. Turning this off will improve performance.');
Pref.create('maxWidth','Max Screen Width',1280,1000,1920,'The Max Screen Width in pixel. Setting a large width can create frame drops on slow computers.',undefined,function(){ Input.onResize(); });
Pref.create('clientPredictionThreshold','Latency Threshold',200,75,10000,'BETA. Activate Client Prediction if latency (in ms) is above this value.');
Pref.create('displayStrike','Display AoE',0,0,1,'Display Damage Zone For Strikes.');
Pref.create('strikeTarget','Highlight Target',0,0,3,'Display Damage Zone For Strikes.',
	Pref.DisplayType('string',['Red Border','Red Rect','Red Skin','None']));
Pref.create('displayFPS','Display FPS',1,0,1,'Display FPS Performance.');
Pref.create('overheadHp','Overhead Hp',0,0,1,'Display HP Bar and Status Effect over player head.');
Pref.create('chatHeadTimer','Chat Head Timer',10,2,60,'How long chat messages are displayed above their heads (in seconds).');
Pref.create('highlightHover','Highlight Hover',0,0,1,'Highlight actor sprite under mouse.');
Pref.create('signNotification','Notify Log In',1,0,2,'Notify you if someone logs in or out of the game.',
	Pref.DisplayType('string',['None','Text','Sound']));
Pref.create('puush','Allow Puush Link',2,0,2,'Allow Puush Link in chat.',
	Pref.DisplayType('string',['Never','Friends Only','Always']));
Pref.create('chatTimePublic','Chat Time',120,15,999,'Time in seconds before chat box messages disappear.');
Pref.create('mapRatio','Map Ratio',6,4,7,'Minimap Size');
Pref.create('orbAmount','X- Orb',1000,1,9999999999,'Amount of orbs used with X- option');
Pref.create('controller','Enable Controller',0,0,1,'Play the game with a Xbox 360 Controller.');
Pref.create('displayMiddleSprite','Display Center Sprite',0,0,1,'Display a dot in the middle of actor sprites. 0=false, 1=true');
Pref.create('minimizeChat','Minimize Chat',0,0,1,'Minimize chat. 0=false, 1=true');
Pref.create('displayServerPosition','Display Server Position',1,0,1,'Display Server Position (Black Circle) when Client Prediction is active. 0=false, 1=true');




Pref.strikeTarget = {
	RED_BORDER:0,
	RED_RECT:1,
	RED_SKIN:2,
	NONE:3
}

Pref.RESET = 'reset';

Pref.verify = function(name,value){
	var req = DB[name];

	value = +value; 
	if(isNaN(value)) return false;
	
	return value.mm(req.min,req.max);	
}
Pref.getDefaultValue = function(pref){
	var a = {};
	for(var i in DB)
		a[i] = DB[i].initValue;
	for(var i in pref)
		if(a[i] !== undefined) 
			a[i] = pref[i];
	return a;
}

Pref.set = function(name,value){
	if(name === Pref.RESET){
		main.pref = Main.Pref();
		return Message.add(null,'Preferences reset to default.');
	}
	
	if(main.pref[name] === undefined) return Message.add(null,'Invalid name.');
	value = Pref.verify(name,value);
	if(value === false) return Message.add(null,'Invalid value.');
	
	main.pref[name] = value;
	if(DB[name].func) DB[name].func(value);
	localStorage.setItem('pref',JSON.stringify(main.pref));
}

})();