function processThis(obj,fn){
	return 	function(e){fn.call(obj,e);}
}
function run(){//解决系统的事件问题的
	var e=window.event;
	var a=this["aEvent"+e.type];
	e.stopPropagation=function(){e.cancelBubble=true;};
	e.preventDefault=function(){e.returnValue=false;}
	e.target=e.srcElement;
	e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
	e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
	if(a&&a.length){
		for(var i=0;i<a.length;){
			if(typeof a[i]=="function"){
					 a[i].call(this,e);
					 i++;
			}else{
				a.splice(i,1);
			}
		}
	}
};

function on(ele,type,fn){
	if(/^self/.test(type)){//做了一个约定：所有的自定义事件以self开头
		if(!ele["selfEvent"+type]){
			ele["selfEvent"+type]=[];
		}
		var a=ele["selfEvent"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]===fn)return;	
		}
		a.push(fn);
		return;
	}//以上这些代码是处理自定义事件。这是面向过程的设计模式代码。在面向对象的拖拽里没有用这段代码，不要混淆
	//type.indexOf("self")===0
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;
	}
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];
		 ele.attachEvent("on"+type,function(){run.call(ele)});//写在这个判断里，是为了保证run方法只被绑定一次，而不要重复绑定。run方法和fire方法一样，是起“通知”的作用，只不过要借用系统的attachEvent这个方法来通知（就是把run绑定在type这个事件上）。
	//而自定义事件里的fire方法，是它是在“那件事”里来执行，来达到“通知”的作用。
	}
	var a=ele["aEvent"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn){
			return;	
		}
	}
	a.push(fn);	
}

function off(ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);	
		return;
	}
	var a=ele["aEvent"+type];
	if(a&&a.length){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				return;
			}
		}
	}
}
function fire(type,e){
	var a=this["selfEvent"+type];
	if(a&&a.length){
		for(var i=0;i<a.length;i++){
			a[i].call(this,e);	
		}	
	}
}