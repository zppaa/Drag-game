function Emiter(){	
}
Emiter.prototype.on=function(type,fn){
	if(!this["self"+type]){
		this["self"+type]=[];
	}
	var a=this["self"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;
	}
	a.push(fn);
}
Emiter.prototype.fire=function(type,e){
	var a=this["self"+type];
	if(a)
	for(var i=0;i<a.length;i++){
		a[i].call(this.ele,e);
	}
}
Emiter.prototype.off=function(type,fn){
	var a=this["self"+type];
	if(a)
	for(var i=0;i<a.length;i++){
		if(a[i]==fn){
			a[i]=null;
			return;
		}
	}
}

function Drag(ele){
	this.ele=ele;
	 
	this.x=null;
	this.y=null;
	this.mx=null;
	this.my=null;
	this.DOWN=processThis(this,this.down)
	this.MOVE=processThis(this,this.move);
	this.UP=processThis(this,this.up);
	on(this.ele,"mousedown",this.DOWN);
}
Drag.prototype=new Emiter;
Drag.prototype.down=function(e){
	//设计原则是：每个原型上的方法里的this，在运行的时候是当前的实例才行。
	this.x=this.ele.offsetLeft;
	this.y=this.ele.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	if(this.ele.setCapture){
		this.ele.setCapture();
		on(this.ele,"mousemove",this.move);
		on(this.ele,"mouseup",this.UP);
	}else{
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	e.preventDefault();
	this.fire("dragstart",e);//通知的作用。"dragstart"是自定义的这个事件的标识符。e是系统的事件对象
}
Drag.prototype.move=function(e){
	if(typeof this.oLimited==="undefined"){
		this.ele.style.left=e.pageX-this.mx+this.x+"px";
		this.ele.style.top=e.pageY-this.my+this.y+"px";
	}else{
		if(e.pageX-this.mx+this.x>=this.oLimited.right-this.ele.offsetWidth){//右过界判断
			this.ele.style.left=this.oLimited.right-this.ele.offsetWidth+"px";
		}else if(e.pageX-this.mx+this.x<=this.oLimited.left){//左过界判断
			this.ele.style.left=this.oLimited.left+"px";
		}else{//正常情况
			this.ele.style.left=e.pageX-this.mx+this.x+"px";
		}
		
		if(e.pageY-this.my+this.y>=this.oLimited.bottom-this.ele.offsetHeight){
			this.ele.style.top=this.oLimited.bottom-this.ele.offsetHeight+"px";
		}else if(e.pageY-this.my+this.y<=this.oLimited.top){
			this.ele.style.top=this.oLimited.top+"px";
		}else{
			this.ele.style.top=e.pageY-this.my+this.y+"px";
		}
		
		
	}
	this.fire("dragging",e);
};
Drag.prototype.up=function(e){
	if(this.ele.releaseCapture){
		off(this.ele,"mousemove",this.MOVE);
		off(this.ele,"mouseup",this.UP);
		this.ele.releaseCapture();	
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);	
	}
	this.fire("dragend",e);
}
 
Drag.prototype.limited=function(obj){
	this.oLimited=obj;
}