/******************************************
上传文件图片

1.引用JS
    <script type="text/javascript" src="../access/js/jquery-3.5.1.js"></script>
	<script type="text/javascript" src="../access/ffwbms/ffwbms.js/ffwbms_upfileimg.js"></script>
2.文件上传代码
	<div class="upfileimg">
		<div class="upimg">
			<p>网站logo</p>
			<!--{if $vtemp['img']==""}-->//img为对应修改值
			<a id="img" href="javascript:;" class="ffwbms_upfile">//img为对应修改值
				选择文件<input type="file" name="img" />//img为对应修改值
			</a>
			<div class="imgshow">
				
			</div>
			<!--{else}-->
			<button type="button" data-id="img" onClick="ffwbms_delupimg(this)">删除图片</button>//img为对应修改值
			<div class="imgshow">
				<img src="<!--{$vtemp['img']}-->" />//img为对应修改值
			</div>
			<!--{/if}-->
		</div>
		...//N个图片
	</div>

******************************************/

//清空file HTML控件的值
$.fn.clearFileInput = function() {
    return this.each(function() {
        if (/MSIE/.test(navigator.userAgent)) {
            $(this).replaceWith($(this).clone(true));
        } else {
            $(this).val('');
        }      
    });
};

//文件大小转换
function ffwbms_bindupChange_conver(limit){  
	var size = "";  
	if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
		size = limit.toFixed(2) + "B";    
	}else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
		size = (limit / 1024).toFixed(2) + "KB";              
	}else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
		size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
	}else{ //其他转化成GB  
		size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
	}  
	  
	var sizestr = size + "";   
	var len = sizestr.indexOf("\.");  
	var dec = sizestr.substr(len + 1, 2);  
	if(dec == "00"){//当小数点后为00时 去掉小数部分  
		return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
	}  
	return sizestr;  
}
//绑定文件域的change事件，可限制文件大小
function ffwbms_bindupChange(){
	$("input[type='file']").bind("change",function(){
		if($(this)[0].files.length>0){
			var max_size=2*1024*1024; //限制文件大小，2M
			var fsize = $(this)[0].files[0].size;
			if(fsize > max_size) {
				$(this).clearFileInput();//清空file HTML控件的值
				var bindupChange_popup = `
				<div id="ffwbms_bindupChange_popup_close" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,.7);pointer-events: auto;"></div>
				<div style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; display: table; font-family: Helvetica,arial,sans-serif; pointer-events: none;">
				<div style="box-sizing: content-box; display: table-cell; vertical-align: middle; text-align: center;">
				<div style="box-sizing: content-box; position: relative; display: inline-block; text-align: left; background-color: #fff; font-size: 14px; border-radius: 5px; box-shadow: 0 0 8px rgb(0 0 0 / 10%); pointer-events: auto; -webkit-overflow-scrolling: touch; -webkit-animation-fill-mode: both; animation-fill-mode: both; -webkit-animation-duration: .2s; animation-duration: .2s; animation-name: layui-m-anim-scale; -webkit-animation-name: layui-m-anim-scale; width: 90%; max-width: 640px;">
				<div style="-webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; padding: 50px 30px; line-height: 22px; text-align: center;">`;
				bindupChange_popup += "上传的图片不能超过" + ffwbms_bindupChange_conver(max_size) + "!" + "</div></div></div></div>";
				d = document.createElement("div");/*创建DIV*/
				d.setAttribute("id", "ffwbms_bindupChange_popup"),
				d.setAttribute("style", "position: relative; z-index: 199911;"),
				d.innerHTML = bindupChange_popup;/*字符串转DIV*/
				document.body.appendChild(d)/*加入页面*/
				$('#ffwbms_bindupChange_popup_close').click(function(){
					$('#ffwbms_bindupChange_popup').remove(); /*关闭弹窗*/
				});
				return false;
			}else{
				//显示上传的图片
				var $eImg = $(this).parent().parent().children(".imgshow")[0];
				var eFile = null;
				if (window.createObjectURL!=undefined) {
					eFile = window.createObjectURL($(this)[0].files[0]) ;
				} else if (window.URL!=undefined) {
					eFile = window.URL.createObjectURL($(this)[0].files[0]) ;
				} else if (window.webkitURL!=undefined) { 
					eFile = window.webkitURL.createObjectURL($(this)[0].files[0]) ;
				}
				//console.log($eImg.getElementsByTagName('img')[0]);
				//如果存在img，则删除
				if($eImg.getElementsByTagName('img')[0]!=undefined){
					$eImg.removeChild($eImg.getElementsByTagName('img')[0]);//删除div下的img
				}
				//创建img元件
				var _img = $('<img>').attr('src' , eFile);
				$eImg.append(_img[0]); //
			}
		}
	});
}

function ffwbms_delupimg(obj) {
	//console.log(obj.parentNode);//父
	//console.log(obj.getAttribute("data-id"));
	var _id = obj.getAttribute("data-id");//获得data-id属性的值
	var _Parent = obj.parentNode;//获得父
	$ppp = $(_Parent.getElementsByTagName('p')[0]); // js对象转jQuery对象
	var _imgDiv = _Parent.getElementsByTagName('div')[0];//获得父下的div
	//console.log(_id);
	//console.log(_Parent);
	//console.log($ppp);
	//console.log(_imgDiv);
	_Parent.removeChild(obj);//删除父下的自己
	_imgDiv.removeChild(_imgDiv.getElementsByTagName('img')[0]);//删除div下的img

	var s = '<a id="'+_id+'" href="javascript:;" class="ffwbms_upfile" >选择文件';
		s += '<input type="file" name="'+_id+'" /></a>';
	//console.log(s);
	$ppp.after(s);//后面增加元件
	ffwbms_bindupChange(); //绑定事件
}

$(document).ready(function () {
	ffwbms_bindupChange(); //绑定事件
})
