//动作执行类


document.addEventListener('touchstart',touch,false);
document.addEventListener('touchmove',touch,false);
document.addEventListener('touchend',touch,false);     

function touch (event){
		
    var event = event || window.event;
    switch(event.type){
 				case "onclick":
 						console.log("onclick:"+event.touches[0].clientX +"," + event.touches[0].clientY );
        case "touchstart":
            console.log("touchstart:"+event.touches[0].clientX +"," + event.touches[0].clientY );
 						actionStartGameButton(event.touches[0].clientX,event.touches[0].clientY);
            break;
        case "touchend":
            //console.log("touchend:"+event.touches[0].clientX +"," + event.touches[0].clientY );
            break;
        case "touchmove":
 						event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
						console.log("touchmove:"+event.touches[0].clientX +"," + event.touches[0].clientY );
            break;
 				default:
 				   event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
    }
 
}

/**
 * 判断是否点击开始游戏按钮
**/
var actionStartGameButton = function(touchX,touchY){
	if(touchX >= startGameButton.x && touchX <= startGameButton.endX && touchY >= startGameButton.y && touchY <=startGameButton.endY){
		//alert("点击了开始按钮。");
		gameing = true ;
		initGaming();
		drawGaming();
	}
}