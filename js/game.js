//防止滚动
document.body.style.overflow='hidden';
document.documentElement.style.overflow='hidden';


//获取canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var gameing = false; //是否正在游戏
var otherObjArray = new Array(25);//其他人物存放数组（其他人物个数不能超过位置数组总个数）
var leftSiteObjArray = new Array(28);//定义左侧位置数组(人物会随机分配到对应的位置上)
var rightSiteObjArray = new Array(28);//定义右侧位置数组(人物会随机分配到对应的位置上)

//定义背景图片对象
var bgImageObj = {
	img: bgImage,
	x: 0,
	y: 0
}

//定义位置对象（把画布分割成一个个小网格，每一个小网格就是一个位置对象）
var siteObj = {
 used: false, //是否已被人物占用
 x: 0,
 y: 0	
}

//定义开始游戏按钮对象
var startGameButton = {
	img: startImage,
	x: canvas.width/2-125, 
	y: canvas.height/2+50,
	endX: canvas.width/2-125 + 250, //x+250 图片横向的像素值是250
	endY: canvas.height/2+50 + 100  //y+100 图片纵向的像素值是100
}

//定义我的人物
var me = {
	x: 0,
	y: 0,
	siteObjArrayIdx: 0,//所在的位置序号
	speed: 5, //移动速度（每帧移动像素）
	directionChange: false, //移动方向是否切换
	imgChangeCount: 4, //每几帧更换一次图片
	currentZhenIndex: 0, //当前帧序号
	imgArray: [], //人物的图片数组
	currentImgIndex: 0 //当前图片序号
}
//定义其他人物
var other = {
	x: 0,
	y: 0,
	siteObjArrayIdx: 0,//所在的位置序号
	speed: 6, //移动速度（每帧移动像素）
	imgChangeCount: 5, //每几帧更换一次图片
	currentZhenIndex: 0, //当前帧序号
	imgArray: [], //人物的图片数组
	currentImgIndex: 0 //当前图片序号
}

//画出开始画面
var drawStart = function () {
	ctx.drawImage(bgImageObj.img, 0, 0);
	ctx.drawImage(me.imgArray[me.currentImgIndex],me.x,me.y);
	//更新我的人物位置
	if(me.directionChange){
		me.x = canvas.width/2 + 100 -16;
		me.y -= me.speed ;	
		if(me.y <= -32){
			me.directionChange = false;
		}
	}else{
		me.y += me.speed ;	
		me.x = canvas.width/2-100-16;
		if(me.y >= canvas.height){
			me.directionChange = true;
		}
	}
	
	ctx.drawImage(logoImage, canvas.width/2-100, canvas.height/2-200);
	ctx.drawImage(startGameButton.img, startGameButton.x, startGameButton.y);
	if(!gameing){
		requestAnimationFrame(drawStart);	
	}
};

//画出游戏画面
var drawGaming = function(){
	bgImageObj.y ++;
	if(bgImageObj.y>=681){ //这里681是图片的高度
		bgImageObj.y = 0;	
	}
	ctx.drawImage(bgImageObj.img, bgImageObj.x, bgImageObj.y);
	ctx.drawImage(bgImageObj.img, bgImageObj.x, bgImageObj.y-681);
	ctx.drawImage(me.imgArray[me.currentImgIndex],me.x,me.y);
	//画出其他人物
	for(var i=0;i<otherObjArray.length;i++){
		var otherTemp = otherObjArray[i];
		ctx.drawImage(otherTemp.imgArray[otherTemp.currentImgIndex],otherTemp.x,otherTemp.y);
	}
	if(gameing){
		requestAnimationFrame(drawGaming);	
	}
}


//初始化开始页面
var initStart = function(){
	//初始化我的人物属性
	me.x = canvas.width/2-100;
	me.y = -32;
	me.imgArray = new Array();
	me.imgArray[0] = meImage0;
	me.imgArray[1] = meImage1;
}

//分配左侧第一个空位置
var generateLeftUnusedSitObj = function(){
	for(var i=0;i<leftSiteObjArray.length;i++){
		if(!leftSiteObjArray[i].used){
			return leftSiteObjArray[i];
		}
	}
}
//分配右侧第一个空位置
var generateRightUnusedSitObj = function(){
	for(var i=0;i<rightSiteObjArray.length;i++){
		if(!rightSiteObjArray[i].used){
			return rightSiteObjArray[i];
		}
	}
}

//初始化进行游戏
var initGaming = function(){
	/**
	 * 初始化左侧位置数组
	 * ....9 8|
	 * 7 6 5 4|
	 * 3 2 1 0|
	*/
	for(var i=0;i<leftSiteObjArray.length;i++){
		var siteObjTemp = {};
		var shang = parseInt(i/4);//丢弃小数部分,保留整数部分
		var yushu = i%4;//取余数
		siteObjTemp.x = canvas.width/2 - 35*(yushu+1);
		siteObjTemp.y = 2*canvas.height/3 - 35*shang;
		siteObjTemp.used = false;
		leftSiteObjArray[i]=siteObjTemp;
	}
	/**
	 * 初始化右侧位置数组
	 * |8 9 ...
	 * |4 5 6 7 
	 * |0 1 2 3
	*/
	for(var i=0;i<rightSiteObjArray.length;i++){
		var siteObjTemp = {};
		var shang = parseInt(i/4);//丢弃小数部分,保留整数部分
		var yushu = i%4;//取余数
		siteObjTemp.x = canvas.width/2 + 5 + 35*(yushu);
		siteObjTemp.y = 2*canvas.height/3 - 35*shang;
		siteObjTemp.used = false;
		rightSiteObjArray[i]=siteObjTemp;
	}
	
	//初始化我的人物属性(随机分配左右两边)
	var siteTemp;
	if(Math.random()>=0.5){
		siteTemp=generateLeftUnusedSitObj();
	}else{
		siteTemp=generateRightUnusedSitObj();
	}
	me.x=siteTemp.x;
	me.y=siteTemp.y;
	siteTemp.used = true;
	
	//初始化其他人物属性
	for(var i=0;i<otherObjArray.length;i++){
		var otherTemp = {};
		
		//初始化其他人物位置(随机分配左右两边)
		var siteOtherTemp;
		if(Math.random()>=0.5){
			siteOtherTemp=generateLeftUnusedSitObj();
		}else{
			siteOtherTemp=generateRightUnusedSitObj();
		}
		otherTemp.x=siteOtherTemp.x;
		otherTemp.y=siteOtherTemp.y;
		siteOtherTemp.used = true;
		
		otherTemp.speed = other.speed;
		otherTemp.imgChangeCount =other.imgChangeCount;
		otherTemp.currentZhenIndex =other.currentZhenIndex;
		otherTemp.imgArray = new Array();
		if(Math.random()<0.3){
			otherTemp.imgArray[0] = otherImage0_0;
			otherTemp.imgArray[1] = otherImage0_1;	
		}else if(Math.random()>=0.3 && Math.random()<0.66){
			otherTemp.imgArray[0] = otherImage1_0;
			otherTemp.imgArray[1] = otherImage1_1;	
		}else{
			otherTemp.imgArray[0] = otherImage2_0;
			otherTemp.imgArray[1] = otherImage2_1;	
		}
		otherTemp.currentImgIndex =other.currentImgIndex;
		otherObjArray[i] = otherTemp ;
	}
	
}

//让对象跑起来（就是切换对象图片）
var runObj = function(){
	//更新我的人物图片
	me.currentZhenIndex ++;
	if(me.currentZhenIndex>=me.imgChangeCount){
		me.currentZhenIndex = 0;
		me.currentImgIndex ++;
		if(me.currentImgIndex >= me.imgArray.length){
			me.currentImgIndex = 0;
		}
	}
	//更新其他人物图片
	for(var i=0;i<otherObjArray.length;i++){
		var otherObjTemp=otherObjArray[i];
		otherObjTemp.currentZhenIndex ++;
		if(otherObjTemp.currentZhenIndex>=otherObjTemp.imgChangeCount){
			otherObjTemp.currentZhenIndex = 0;
			otherObjTemp.currentImgIndex ++;
			if(otherObjTemp.currentImgIndex >= me.imgArray.length){
				otherObjTemp.currentImgIndex = 0;
			}
		}
	}
	requestAnimationFrame(runObj);	
}

initStart();
initGaming();
drawStart();
runObj();