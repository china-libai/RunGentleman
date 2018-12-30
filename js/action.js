//动作执行类


document.addEventListener('touchstart',touch,false);
document.addEventListener('touchmove',touch,false);
document.addEventListener('touchend',touch,false);     

function touch (event){
    var event = event || window.event;
    switch (event.type) {
        case "onclick":
            console.log("onclick:" + event.touches[0].clientX + "," + event.touches[0].clientY);
        case "touchstart":
            console.log("touchstart:" + event.touches[0].clientX + "," + event.touches[0].clientY);
            actionStartGameButton(event.touches[0].clientX, event.touches[0].clientY);
            break;
        case "touchend":
            //console.log("touchend:"+event.touches[0].clientX +"," + event.touches[0].clientY );
            break;
        case "touchmove":
            event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
            console.log("touchmove:" + event.touches[0].clientX + "," + event.touches[0].clientY);
            break;
        default:
            event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
    }
}

/**
 * 判断是否点击按钮
**/
var actionStartGameButton = function(touchX,touchY){
    //判断点击的是开始按钮
	if(touchX >= startGameButton.x && touchX <= startGameButton.endX && touchY >= startGameButton.y && touchY <=startGameButton.endY){
		//alert("点击了开始按钮。");
		if(!gameing){
            gameing = true ;
            window.cancelAnimationFrame(stopStartPageId);
            initGaming();
            runOtherObj();
            drawGaming();
		}else{
            changeOtherObjCamp();
            havingItem = true;
		}
	}
	//判断点击了底部a按钮
	if(touchX >= aButton.x && touchX <= aButton.endX && touchY >= aButton.y && touchY <=aButton.endY){
        // console.log("点击了a按钮");
	    if(havingItem){
            aButton.img = buttonImage1;
            bButton.img = buttonImage0;
            if(me.x>=canvas.width/2){
                changeMeObjCamp(me);
            }
        }
    }
    //判断点击了底部b按钮
    if(touchX >= bButton.x && touchX <= bButton.endX && touchY >= bButton.y && touchY <=bButton.endY){
        // console.log("点击了b按钮");
        if(havingItem){
            aButton.img = buttonImage0;
            bButton.img = buttonImage1;
            if(me.x<=canvas.width/2){
                changeMeObjCamp(me);
            }
        }
    }
}