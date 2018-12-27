//防止滚动
document.body.style.overflow='hidden';
document.documentElement.style.overflow='hidden';


//获取canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

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
	speed: 5, //移动速度（每帧移动像素）
	imgChangeCount: 5, //每几帧更换一次图片
	currentZhenIndex: 0, //当前帧序号
	imgArray: [], //人物的图片数组
	currentImgIndex: 0 //当前图片序号
}

//画出开始画面
var drawStart = function () {
	ctx.drawImage(bgImage, 0, 0);
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
	//更新我的人物图片
	me.currentZhenIndex ++;
	if(me.currentZhenIndex>=me.imgChangeCount){
		me.currentZhenIndex = 0;
		me.currentImgIndex ++;
		if(me.currentImgIndex >= me.imgArray.length){
			me.currentImgIndex = 0;
		}
	}
	ctx.drawImage(logoImage, canvas.width/2-100, canvas.height/2-200);
	ctx.drawImage(startGameButton.img, startGameButton.x, startGameButton.y);	
	requestAnimationFrame(drawStart);
};

//初始化
var init = function(){
	me.x = canvas.width/2-100;
	me.y = -32;
	me.imgArray = new Array();
	me.imgArray[0] = meImage0;
	me.imgArray[1] = meImage1;
	drawStart();
}

init();

