/******************************************
验证 verify
参数：	验证类型
		验证值
返回：	验证成功返回真，失败返回假
用法：
	<input name="sname" type="text" ffwbms_verify="true" data-ffv="nonull" value="" />

	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="ffwbms_verify.js"></script>
	<script type="text/javascript" src="mobile.layer.js"></script>
	<script>
        function 验证提交(){
			var verify_ok = true;
			// 循环验证
			$('input[ffwbms_verify="true"]').each(function(){
				var re =ffwbms_verify($.trim($(this).val()),$(this).attr("data-ffv"));
				if(re["val"]==false){
					$(this).css("border-color","#e53935");
					//提示
					layer.open({
						content: re["note"]
					});
					alert(re["note"]);
					verify_ok = false;
				}
			});

			if(verify_ok){
				$("#submitform").submit();
			}
		}
    </script>
******************************************/
//是否为空，true=空，false=不为空
function IsEmpty(str){
	if(str==""){
		return true;
	}else{
		return false;
	}
}

//是否不为空，false=空，true=不为空
function IsNotEmpty(str){
	if(str==""){
		return false;
	}else{
		return true;
	}
}

//获得并格式化当前日期时间
//var now = new Date(); // 一般传入毫秒时间戳进行初始化
//var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function(fmt){
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
		}
	}
	return fmt;
}
  
function ffwbms_verify(str,type){
	_type = type.toLowerCase(type);
	switch(_type) {
		case 'isnull': //是否为空，true=为空，false=不为空
			var rea = new Array();
			if(str==""){
				rea['val']=true;
			}else{
				rea['val']=false;
			}
			rea['name']="是否为空";
			rea['note']="true=为空，false=不为空";
			return rea;
			break;
		case 'nonull': //不可为空，true=不为空，false=为空
			var rea = new Array();
			if(str==""){
				rea['val']=false;
			}else{
				rea['val']=true;
			}
			rea['name']="不可为空";
			rea['note']="不可为空！";
			return rea;
			break;
		case 'username': //用户名：首字符为字母，长度6-20，字母数字和_.-，可以为空值，不为空则要格式，例：^$|^(\d+|\-){7,}$，"|"后边的是要符合格式。
			var reg=/(admin)|(^$|^[a-zA-Z_]{1}[A-Za-z0-9_.-]{5,19})/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="用户名";
			rea['note']="用户名不合适要求，正确的用户名应该是，首字符为字母，长度6-20，字母数字和_.-的组合";
			return rea;
			break;
		case 'password': //密码：首字符为字母，长度6-20，字母数字和_.-
			var reg=/^$|^[A-Za-z0-9_.-]{6,20}/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="用户名";
			rea['note']="密码不合适要求，正确的密码应该是，首字符为字母，长度6-20，字母数字和_.-的组合";
			return rea;
			break;
		case 'enhancepassword': //高强度密码：长度6-20，包括至少1个大写字母(?=.*[A-Z])，1个小写字母(?=.*[a-z])，1个数字(?=.*\d)，1个特殊字符(?=.*[!@#$%^&*? ])
			var reg=/^$|^.*(?=.{6,20})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="高强度密码";
			rea['note']="密码不合适要求，正确的密码应该是，长度6-20，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符[!@#$%^&*? ]";
			return rea;
			break;
		case 'email': //email地址
			var reg=/^$|[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="email地址";
			rea['note']="email地址应该是账号+@+邮箱域名";
			return rea;
			break;
		case 'telephone': //电话号码: (d+-)?(d{4}-?d{7}|d{3}-?d{8}|^d{7,8})(-d+)?
			var reg=/^$|^[0|00|+|\d]\d{1,5}(\d|-|\.|\ ){6,40}$/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="电话号码";
			rea['note']="电话号码允许加号或减号存在的数字组合";
			return rea;
			break;
		case 'date': //年-月-日: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
			var reg=/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="日期";
			rea['note']="日期格式不对，正确的应该是年-月-日，月日为二位数字，不够时前面加0";
			return rea;
			break;
		case 'number': //数字，不限制小数位数: /(d+-)?([^\d{1,}\.\d{0,}|\d{0,}])/
			var reg=/^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="数字";
			rea['note']="数字格式不对，正确的0-9和任意组合，可以有一个小数点和一个+或-号，有+或-号时，必须在首位";
			return rea;
			break;
		case 'integer': //数字，整数: /(\d{0,})/
			var reg=/^(\d{0,})?$/;
			var rea = new Array();
			rea['val']=reg.test(str);
			rea['name']="整数数字";
			rea['note']="整数数字格式不对，只可以是0-9的任意组合";
			return rea;
			break;

		default:
			return false;
	}
}

//提示弹窗
function show_ffwbms_verify_popup(s){
	var verify_popup = `
		<div id="ffwbms_verify_popup_close" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,.7);pointer-events: auto;"></div>
		<div style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; display: table; font-family: Helvetica,arial,sans-serif; pointer-events: none;">
		<div style="box-sizing: content-box; display: table-cell; vertical-align: middle; text-align: center;">
		<div style="box-sizing: content-box; position: relative; display: inline-block; text-align: left; background-color: #fff; font-size: 14px; border-radius: 5px; box-shadow: 0 0 8px rgb(0 0 0 / 10%); pointer-events: auto; -webkit-overflow-scrolling: touch; -webkit-animation-fill-mode: both; animation-fill-mode: both; -webkit-animation-duration: .2s; animation-duration: .2s; animation-name: layui-m-anim-scale; -webkit-animation-name: layui-m-anim-scale; width: 90%; max-width: 640px;">
		<div style="-webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; padding: 50px 30px; line-height: 22px; text-align: center;">`;
	verify_popup += s + "</div></div></div></div>";
	d = document.createElement("div");/*创建DIV*/
	d.setAttribute("id", "ffwbms_verify_popup"),
	d.setAttribute("style", "position: relative; z-index: 199911;"),
	d.innerHTML = verify_popup;/*字符串转DIV*/
	document.body.appendChild(d)/*加入页面*/
	$('#ffwbms_verify_popup_close').click(function(){
		$('#ffwbms_verify_popup').remove(); /*关闭弹窗*/
	});
}

//页面装载完成时执行
$(document).ready(function() {
	$('input[ffwbms_verify="true"]').blur(function(){
		var re =ffwbms_verify($.trim($(this).val()),$(this).attr("data-ffv"));
		if(re["val"]==true){
			$(this).css("border-color","#4caf50"); // 改变边框色
		}else{
			$(this).css("border-color","#e53935"); // 改变边框色
			show_ffwbms_verify_popup(re["note"]) // 返回提示
		}
	});
});
