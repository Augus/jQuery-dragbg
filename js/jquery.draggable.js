// jQuery drag background plugin
// Author : Augus
// Date   : 2012/08/03

jQuery.fn.extend({

  dragBg: function(params){
  
    return this.each(function(){

    	function restore() {
    		$dragDiv.css("background-position-y", orignPosY);
    	}

	  	function finish() {
	  		$completeBtn.remove();
			$cancelBtn.remove();
			$(dragDiv).find("*:not('.dragCover')").show();
			$(dragDiv).off("mousedown");
			$(dragDiv).off("mouseup");
			$(dragDiv).off("mousemove");
			$(dragDiv).css("cursor", "default");
	  	}

		var clicked = false,		// 是否按下滑鼠
			startX,					// 滑鼠開始位置X
			startY,					// 滑鼠開始位置Y
			dragDiv = this,			// 要修改背景的Div
			$dragDiv = $(this),		// 要修改背景的Div(jQuery obj)
			bgWidth = 0,			// 背景寬度
			bgHeight = 0,			// 背景高度
			imgWidth = 0,
			imgHeight=  0,
			scaleHeight = 0,
			$completeBtn = $("<button>Finish</button>");
			$cancelBtn = $("<button>Cancel</button>"),
			orignPosY = $dragDiv.css("background-position-y"),
			posY = orignPosY;


		//hide the image & add as bg image
		bgimg = $dragDiv.find("img").first();
		imgWidth = bgimg.width();
		imgHeight = bgimg.height();
		bgHeight = $(dragDiv).height();
		bgWidth = $(dragDiv).width();
		$dragDiv.css('background', "url('"+bgimg.attr('src')+"') no-repeat");
		$dragDiv.css("background-position-y", orignPosY);
		bgimg.css('display', 'none');

		// Hide other element
		$dragDiv.find("*").hide();
		$dragDiv.css("cursor", "move");
		$completeBtn.appendTo($(this));
		$cancelBtn.appendTo($(this));

		$completeBtn.click(function(){
			finish();

			if (orignPosY == posY)
				return;

			// Result data
			var result = {
				posY : posY,
				bgHeight : bgHeight,
				bgWidth : bgWidth
			}
			params.onComplete(result);
		});


		$cancelBtn.click(function(){
			restore();
			finish();
		});			

		//mouse down
		$dragDiv.mousedown(function(e){
			clicked = true;
			startX = Math.round(e.pageX - $(this).eq(0).offset().left);
			startY = Math.round(e.pageY - $(this).eq(0).offset().top);
		});
		
		//mouse up
		$dragDiv.mouseup(function(e){
			clicked = false;
		});

		//mouse move
		$dragDiv.mousemove(function(e){
			$(this).css('cursor', 'move');
			if(clicked){ //as we only want this to work while they have clicked	
				bg = $(this).css('background-position');					
				if(bg.indexOf('%')>1){
					leftpos = ($(this).width()/2) - (imgWidth/2);
					toppos = ($(this).height()/2) - (imgHeight/2);
					currentPosY = ($(this).height()/2);
				}else{
					bg = bg.replace("px", "").replace("px", "").split(" ");
					leftpos = parseInt(bg[0]);
					toppos = parseInt(bg[1]);	
					currentPosY = parseInt(bg[1]);
				}


				var mouse_x = Math.round(e.pageX - $(this).eq(0).offset().left) - startX;
				var mouse_y = Math.round(e.pageY - $(this).eq(0).offset().top) - startY;					
				var x = leftpos + (mouse_x);
				var y = currentPosY + (mouse_y);					
				startX = Math.round(e.pageX - $(this).eq(0).offset().left);
				startY = Math.round(e.pageY - $(this).eq(0).offset().top);	

				var o = imgHeight % bgHeight;
				var n = Math.abs(parseInt(imgHeight / bgHeight) - 1);
				var overflow = n * bgHeight + o;
				
				if (y > 0) y = 0;

				if (-y > overflow) y = -(overflow);
				posY = -y;

				$dragDiv.css('background-position-y', y + "px");			
			}
		});			
    });

  }
});