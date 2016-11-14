function iconAnimator(){
	var strPath = '../icons/icon16.png';
	var icon = document.createElement("img");
	icon.setAttribute('src', strPath);
	var canvas = document.createElement("canvas");
	canvas.setAttribute('width', '19');
	canvas.setAttribute('height', '19');
	var canvasContext = canvas.getContext('2d');
	var time = 0;
	
	this.set = function() {
		chrome.browserAction.setIcon({path: { "19": strPath }});
	}
	
	function ease(x) {
		return (1-Math.sin(Math.PI/2+x*Math.PI))/2;
	}
	
	this.rotate = function() {
		var rotation = 0;
		var animationFrames = 60;
		var animationSpeed = 5;
		
		function drawIconAtRotation() {
			var width = canvas.width -2;
			var height = canvas.height-2;
			canvasContext.save();
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			canvasContext.translate( Math.ceil(canvas.width/2), Math.ceil(canvas.height/2));
			canvasContext.rotate(2*Math.PI*ease(rotation));
			canvasContext.drawImage(icon,  -Math.ceil(width/2), -Math.ceil(height/2), width, height);
			canvasContext.restore();
			chrome.browserAction.setIcon({imageData:canvasContext.getImageData(0, 0, canvas.width,canvas.height)});
		}
		
		function Do(){
			rotation += 1/animationFrames;
			drawIconAtRotation();
			if (rotation <= 1) {
				setTimeout(Do, animationSpeed);
			} else {
				rotation = 0;
				chrome.browserAction.setIcon({path: { "19": icon.src }});
			}
		}
	Do();	
	}
	
	this.pulse = function() {
		var rotation = -3;
		var animationFrames = 60;
		var animationSpeed = 2;
		
		function drawIconAtRotation() {
			canvasContext.save();
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			canvasContext.translate( Math.ceil(canvas.width/2), Math.ceil(canvas.height/2));
			canvasContext.scale(ease(rotation),ease(rotation));
			canvasContext.drawImage(icon,  -Math.ceil(canvas.width/2), -Math.ceil(canvas.height/2), canvas.width, canvas.height);
			canvasContext.restore();
			chrome.browserAction.setIcon({imageData:canvasContext.getImageData(0, 0, canvas.width,canvas.height)});
		}
		
		function Do(){
			rotation += 1/animationFrames;
			drawIconAtRotation();
			if (rotation <= 1) {
				setTimeout(Do, animationSpeed);
			} else {
				rotation = -3;
				chrome.browserAction.setIcon({path: { "19": icon.src }});
			}
		}
		Do();
	};
}

function makeRequest() {
	
	
	if (window.XMLHttpRequest) {
		//for firefox, opera and safari browswers
		var httpRequest = new XMLHttpRequest();
		var imgHttpRequest = new XMLHttpRequest();
	}
	
	
	httpRequest.onreadystatechange = function() { proccess(httpRequest)};
	httpRequest.open('GET', 'http://www.meteoclub.kz/meteoXML.php', true);

	var contentType = "text/xml; charset=windows-1251";
	if (httpRequest.overrideMimeType) httpRequest.overrideMimeType(contentType);
	
	
	httpRequest.setRequestHeader('Content-type', contentType);
	httpRequest.send('');
	
	
	imgHttpRequest.open('GET', 'http://www.meteoclub.kz/imageterm.php', true);
	 var contentType2 = "text/plain; charset=x-user-defined";
	 imgHttpRequest.setRequestHeader('Content-Type', contentType2);
	 imgHttpRequest.overrideMimeType(contentType2);
	
	
	imgHttpRequest.onreadystatechange = function() { proccessImg(imgHttpRequest)};
	
	imgHttpRequest.send('');
}

function proccessImg(imgHttpRequest){

if (imgHttpRequest.readyState == 4) {
		
		if (imgHttpRequest.status == 200) {

			
            
            var txt= encode64(imgHttpRequest.response);
			console.log(txt);
			IMG = "<a href='http://www.meteoclub.kz/'><img src='data:image/png;charset=windows-1251;base64," + txt  + "'/></a>";
			
									
		} else {

			document.getElementById("2").innerHTML="<center>Connection problem</center>";
		}
	}

}


function proccess(httpRequest) {
	
	
	if (httpRequest.readyState == 4) {
		
		if (httpRequest.status == 200) {

	
            
            var xmlDoc= httpRequest.responseXML;
			
			var element=xmlDoc.getElementsByTagName("point_1");
			
			var temperature = (element.item(0).getAttribute("temperature").toString());
			
			var upd_time = (element.item(0).getAttribute("time").toString());
			
            //console.dir(xmlDoc);
            
                        
 			//htmlka=reg.exec(text);
			
		var currentTime = new Date();
		var hours = currentTime.getHours();
		var minutes = currentTime.getMinutes();
		var seconds = currentTime.getSeconds();
		
		var my_time =hours+":"+minutes+":"+seconds;
		
		
		console.log("Temperature: " + temperature+ "; Last update: "+my_time);
		
		var animation = new iconAnimator();
		animation.set();
		
		animation.pulse();

		chrome.browserAction.setBadgeText({ text: temperature } );
		
		THERMO = new Image();
		THERMO.src = "http://www.meteoclub.kz/imageterm.php";
		console.dir(THERMO);
		
		HTML="<br><center><font size=5>"+temperature+"°C</font><br><font size=1>"+my_time+"</font></center>";
				
			
		} else {

			document.getElementById("2").innerHTML="<center>Connection failed</center>";
		}
	}
	

}


//--------------------------------------------------
function encode64(inputStr) 
{
   var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var outputStr = "";
   var i = 0;
   
   while (i<inputStr.length)
   {
      //all three "& 0xff" added below are there to fix a known bug 
      //with bytes returned by xhr.responseText
      var byte1 = inputStr.charCodeAt(i++) & 0xff;
      var byte2 = inputStr.charCodeAt(i++) & 0xff;
      var byte3 = inputStr.charCodeAt(i++) & 0xff;

      var enc1 = byte1 >> 2;
      var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
	  
	  var enc3, enc4;
	  if (isNaN(byte2))
	   {
		enc3 = enc4 = 64;
	   }
	  else
	  {
      	enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
		if (isNaN(byte3))
		  {
           enc4 = 64;
		  }
		else
		  {
	      	enc4 = byte3 & 63;
		  }
	  }

      outputStr +=  b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
   } 
   
   return outputStr;
}

var HTML;
var THERMO;
var IMG;
var INTERVAL;
makeRequest();


setInterval(function(){ makeRequest() }, 640000);


