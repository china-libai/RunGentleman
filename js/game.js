//防止滚动
document.body.style.overflow='hidden';
document.documentElement.style.overflow='hidden';


//获取canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var stopStartPageId = null;//停止开始页面动画的requestAnimationFrame的id
var gameing = false; //是否正在游戏
var otherObjArray = new Array(25);//其他人物存放数组（其他人物个数不能超过位置数组总个数）
var leftSiteObjArray = new Array(28);//定义左侧位置数组(人物会随机分配到对应的位置上)
var rightSiteObjArray = new Array(28);//定义右侧位置数组(人物会随机分配到对应的位置上)
var randomOtherChangeCampNum = 6; //其他人物随机变动阵营的人数最大值+1
var havingItem = false;//是否正在答题
var countDown = 5;//答题的倒计时数字

//定义背景图片对象
var bgImageObj = {
	img: bgImage,
	x: 0,
	y: 0
}

//定义位置对象（把画布分割成一个个小网格，每一个小网格就是一个位置对象）
var siteObj = {
	arrIdx:0, //所在数组的序号
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

//定义a按钮对象
var aButton = {
    img: buttonImage0,
    x: 20,
    y: canvas.height-100,
    endX: 20 + 150, //x+150 图片横向的像素值是150
    endY: canvas.height-100 + 49  //y+49 图片纵向的像素值是49
}

//定义b按钮对象
var bButton = {
    img: buttonImage0,
    x: canvas.width-(170+20),
    y: canvas.height-100,
    endX: canvas.width/2-125 + 250, //x+250 图片横向的像素值是250
    endY: canvas.height-100 +49  //y+100 图片纵向的像素值是100
}

//定义我的人物
var me = {
	x: 0,
	y: 0,
	camp: null,//所在阵营（left 或 right）
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
    camp: null,//所在阵营（left 或 right）
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
        stopStartPageId = requestAnimationFrame(drawStart);
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
	//画出题目和选项
	//if(havingItem){
	if(true){
		//题目背景图
        ctx.drawImage(titleImage, canvas.width/2-150, 20);
        //画出底部a,b选项按钮
        ctx.drawImage(aButton.img, aButton.x, aButton.y);
        ctx.drawImage(bButton.img, bButton.x, bButton.y);
        //画出试题
        ctx.fillStyle="rgb(0,0,0)";
        ctx.font="24px Helvetica";
        ctx.textAlign="left";
        ctx.textBaseline="top";
        ctx.fillText(items[0].title,canvas.width/2-150+12,20+45);
        //画出选项
        ctx.textAlign="center";
        ctx.fillText(items[0].a,aButton.x+150/2, aButton.y+8);
        ctx.fillText(items[0].b,bButton.x+150/2, bButton.y+8);
        //画出倒计时数字
        ctx.fillStyle="rgb(255,0,0)";
        ctx.fillText(countDown,canvas.width/2-2, 29);
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
		siteObjTemp.y = 2*canvas.height/3 - 40*shang;
		siteObjTemp.used = false;
        siteObjTemp.arrIdx = i;
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
		siteObjTemp.y = 2*canvas.height/3 - 40*shang;
		siteObjTemp.used = false;
        siteObjTemp.arrIdx = i;
		rightSiteObjArray[i]=siteObjTemp;
	}
	
	//初始化我的人物属性(随机分配左右两边)
	var siteTemp;
	if(Math.random()>=0.5){
		siteTemp=generateLeftUnusedSitObj();
        me.camp='left';
	}else{
		siteTemp=generateRightUnusedSitObj();
        me.camp='right';
	}
	me.x=siteTemp.x;
	me.y=siteTemp.y;
    me.siteObjArrayIdx=siteTemp.arrIdx;
	siteTemp.used = true;

	//初始化其他人物属性
	for(var i=0;i<otherObjArray.length;i++){
		var otherTemp = {};
		
		//初始化其他人物位置(随机分配左右两边)
		var siteOtherTemp;
		if(Math.random()>=0.5){
			siteOtherTemp=generateLeftUnusedSitObj();
            otherTemp.camp='left';
		}else{
			siteOtherTemp=generateRightUnusedSitObj();
            otherTemp.camp='right';
		}
		otherTemp.x=siteOtherTemp.x;
		otherTemp.y=siteOtherTemp.y;
        otherTemp.siteObjArrayIdx=siteOtherTemp.arrIdx;
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

//让我的对象跑起来（就是切换对象图片）
var runMeObj = function(){
	//更新我的人物图片
	me.currentZhenIndex ++;
	if(me.currentZhenIndex>=me.imgChangeCount){
		me.currentZhenIndex = 0;
		me.currentImgIndex ++;
		if(me.currentImgIndex >= me.imgArray.length){
			me.currentImgIndex = 0;
		}
	}
	requestAnimationFrame(runMeObj);
}
//让其他对象跑起来（就是切换对象图片）
var runOtherObj = function(){
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
    requestAnimationFrame(runOtherObj);
}

/**
 * 移动人物到新位置
 * @param obj 人物对象
 */
var moveObjToNewSit = function(obj){
	//是否到达终点
	var xReached=false;
    var yReached=false;
	//要移动的新位置
    var siteObjTemp;
    //移动x轴方向
    if(obj.camp == 'left'){
        siteObjTemp = rightSiteObjArray[obj.siteObjArrayIdx];
        obj.x +=obj.speed;
        if(obj.x>=siteObjTemp.x){
            obj.x = siteObjTemp.x
            xReached = true;
		}
	}else{
        siteObjTemp = leftSiteObjArray[obj.siteObjArrayIdx];
        obj.x -=obj.speed;
        if(obj.x<=siteObjTemp.x){
            obj.x = siteObjTemp.x
            xReached = true;
        }
	}
	//移动y轴方向
	if(obj.y<siteObjTemp.y){
        obj.y +=obj.speed;
        if(obj.y>=siteObjTemp.y){
            obj.y = siteObjTemp.y
            yReached = true;
        }
	}else{
        obj.y -=obj.speed;
        if(obj.y<=siteObjTemp.y){
            obj.y = siteObjTemp.y
            yReached = true;
        }
	}

    if( !(xReached&&yReached) ){
        requestAnimationFrame(function() {
            moveObjToNewSit(obj)
        });
	}else{
        if(obj.camp == 'left'){
            obj.camp = 'right';
        }else{
            obj.camp = 'left';
		}
	}
}

//变动我的人物阵营
var changeMeObjCamp = function(meOjb){
    if(meOjb.camp == 'left'){//左侧阵营的变换到右侧阵营
        //释放左侧阵营的位置
        var siteObjTemp=leftSiteObjArray[meOjb.siteObjArrayIdx];
        siteObjTemp.used=false;
        //获取右侧阵营的空闲位置
        var rightSiteObjTemp=generateRightUnusedSitObj();
        if(rightSiteObjTemp != undefined){//还有空的话才移动
            meOjb.siteObjArrayIdx=rightSiteObjTemp.arrIdx;
            rightSiteObjTemp.used=true;
            //移动这个人物到新的位置
            moveObjToNewSit(meOjb);
        }
    }else{//右侧阵营变换到左侧阵营
        //释放右侧阵营的位置
        var siteObjTemp=rightSiteObjArray[meOjb.siteObjArrayIdx];
        siteObjTemp.used=false;
        //获取左侧阵营的空闲位置
        var leftSiteObjTemp=generateLeftUnusedSitObj();
        if(leftSiteObjTemp != undefined){//还有空的话才移动
            meOjb.siteObjArrayIdx=leftSiteObjTemp.arrIdx;
            leftSiteObjTemp.used=true;
            //移动这个人物到新的位置
            moveObjToNewSit(meOjb);
        }
    }
}
//随机变动其他人物的阵营
var changeOtherObjCamp = function(){
	//确定随机的人数
	var randomNum = parseInt(Math.random()*randomOtherChangeCampNum);
    for(var i=0;i<randomNum;i++){
    	//随机出是哪个其他人物
		var otherObjIdx = parseInt(Math.random()*otherObjArray.length);
        var otherTemp = otherObjArray[otherObjIdx];
        //释放出这个人物的位置used=false
		if(otherTemp.camp == 'left'){//左侧阵营的变换到右侧阵营
			//释放左侧阵营的位置
			var siteObjTemp=leftSiteObjArray[otherTemp.siteObjArrayIdx];
            siteObjTemp.used=false;
			//获取右侧阵营的空闲位置
            var rightSiteObjTemp=generateRightUnusedSitObj();
            if(rightSiteObjTemp != undefined){//还有空的话才移动
                otherTemp.siteObjArrayIdx=rightSiteObjTemp.arrIdx;
                rightSiteObjTemp.used=true;
                //移动这个人物到新的位置
                moveObjToNewSit(otherTemp);
			}
		}else{//右侧阵营变换到左侧阵营
			//释放右侧阵营的位置
            var siteObjTemp=rightSiteObjArray[otherTemp.siteObjArrayIdx];
            siteObjTemp.used=false;
            //获取左侧阵营的空闲位置
            var leftSiteObjTemp=generateLeftUnusedSitObj();
            if(leftSiteObjTemp != undefined){//还有空的话才移动
                otherTemp.siteObjArrayIdx=leftSiteObjTemp.arrIdx;
                leftSiteObjTemp.used=true;
                //移动这个人物到新的位置
                moveObjToNewSit(otherTemp);
            }
		}
    }
}
initStart();
drawStart();
runMeObj();
