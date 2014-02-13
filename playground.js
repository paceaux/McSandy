	function createAssets(){
		var meyerReset = "html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{border:0;font-size:100%;font:inherit;vertical-align:baseline;margin:0;padding:0}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:none}table{border-collapse:collapse;border-spacing:0}";
	var jqueryRef = $('#jquery').prop("src");
	if (localStorage.getItem("reset") == null){
		localStorage.setItem("reset",meyerReset);

	};
	if (localStorage.getItem("jquery") == null){
		localStorage.setItem("jquery",jqueryRef);
	};
};
	function clearStorage(){
		var answer = confirm ("Are you sure you want to delete all your work")
		if (answer){
			localStorage.clear();
			$('#saveditems').empty();
			alert ("Local storage has been cleared");
			$('#name').val().empty();
		} else{
			alert("local storage untouched");
			};
	};
	function clearThis(){
		var key = $('#name').val();
		var keyID = "#"+key;
			localStorage.removeItem(key);
			$(keyID).remove();
			$('#name').val("");
			//TODO: clear the content in the center
	};
	function save(){
		var key = $('#name').val();
		var markup = $('#content').text();
		var styles = $('#css').text() ;
		var jscript =  $('#js').text();
		var content = new Array(markup, styles, jscript); //take the whole bundle, turn it to an array
		//create the result
		var result = '<head><style type=\"text\/css\">' + localStorage.getItem("reset") + content[1] + "<\/style><script type=\"text\/javascript\" src=\"" + localStorage.getItem("jquery") +"\"><\/script><\/head><body>" + content[0] + "<script type=\"text\/css\">" + content[2] +"<\/script>";
		content = JSON.stringify(content); //now stringify our array
			if (!localStorage.getItem(key)){
				$('#saveditems').append('<option id=">'+ key + '">' + key +'</option>');
			}
		localStorage.setItem(key, content); 
		createFrame(result);

			$('#save').css('background','#3f67f8');	
			$("#save").html('Saved!');
	};
	function loadItems(){
		var savedItems = $('#saveditems').val();
		var savedContent = JSON.parse(localStorage.getItem(savedItems)); //parse the stored item
		//create the result for the load event
		var result = '<head><style type=\"text\/css\"> '+ localStorage.getItem("reset") + savedContent[1] + "<\/style><script type=\"text\/javascript\" src=\"" + localStorage.getItem("jquery") +"\"><\/script><\/head><body>" + savedContent[0] + '<script type=\"text\/javascript\"> ' + savedContent[2] + '<\/script><\/body><\/html>';
			$('#content').text(savedContent[0]);
			$('#css').text(savedContent[1]);
			$('#js').text(savedContent[2]);
			$('#name').val(savedItems);
		createFrame(result);
};
	function refreshFrame(){
		var key = $('#name').val();
		var markup = $('#content').text();
		var styles = $('#css').text() ;
		var jscript =  $('#js').text();
		var content = new Array(markup, styles, jscript); //take the whole bundle, turn it to an array
		//create the result
		var result = '<head><style type=\"text\/css\"> '+ localStorage.getItem("reset") + content[1] + "<\/style><script type=\"text\/javascript\" src=\"" + localStorage.getItem("jquery") +"\"><\/script><\/head><body>" + content[0] + "<script type=\"text\/css\">" + content[2] +"<\/script>";
		createFrame(result);		
};
$('#content, #js, #css').bind('keyup',function(e){
	refreshFrame();
});
//keyboard controls
$(window).keyup(function(e){
	if (e.which == 17) isCtrl = false;
}).keydown(function(e){
	if(e.which == 17) isCtrl=true;
	if(e.which == 192 && isCtrl == true){
		$('section#editrange').slideToggle('fast');
		$('section#result').toggleClass('fullscreen');
		return false;
	}
	if(e.which == 190 && isCtrl == true){
		$('section#result').slideToggle('fast');
		$('section#editrange').toggleClass('fullscreen');
		return false;
	}
	if(e.which == 186 && isCtrl == true){
		$('#main').slideToggle('fast');
		$('#settings').slideToggle('fast');
		return false;
	}
});	
$('#saveditems').blur(function(event){
	loadItems();
});
$(window).load(function(event){
	createAssets();
	loadItems();
});
function createFrame(result){
	if (window.URL) {
		var bb = new window.MozBlobBuilder() || new window.BlobBuilder();	
		bb.append(result);
		var iframeSrc = window.URL.createObjectURL(bb.getBlob('text/html'));
	} 
	else if (window.webkitURL) {
 		var bb = new window.WebKitBlobBuilder();
		bb.append(result);
		var iframeSrc = window.webkitURL.createObjectURL(bb.getBlob('text/html'));
		}
	else if (!window.URL && !window.webkitURL){
		console.log("Sad Day. No Blob for you!");
		$('#result h1').text("Doesn\'t look like your browser is supported");
		}
		$('#result iframe').prop("src", iframeSrc );
};
	var numberItems = localStorage.length;
		for (i = 0; i <= numberItems - 1 ; i++)
			{
			if(localStorage.key(i) != "reset"){
				if(localStorage.key(i) != "jquery"){
					$('#saveditems').append('<option id="'+localStorage.key(i) + '"> ' + localStorage.key(i) + '</option>');
					}
				}
			};
		$('#content').keyup(function(event){
		$('#save').css('background', '#f83f42', 'border-color',"#f83f42").html('Save');
});	