(function(){
	var init = function() {	
		var countdownToDate = new Date('Sat, 17 May 2008 15:00:00 GMT-0600');
		var daysLeft = Math.floor((countdownToDate.getTime()-new Date().getTime())/86400000);
		var navCountdownReplace = document.getElementById('nav-countdown-replace');
		var navCountdownTextNode = document.createTextNode((daysLeft >= 2) ? 'Only '+daysLeft+' Days Left' : ((daysLeft == 1) ? 'Big Day Tomorrow!' : 'We\'re Married!!'));
		navCountdownReplace.parentNode.replaceChild(navCountdownTextNode, navCountdownReplace);		
	};	
	// http://www.kryogenix.org/days/2007/09/26/shortloaded
	(function(i) {var u =navigator.userAgent;var e=/*@cc_on!@*/false; var st =
	setTimeout;if(/webkit/i.test(u)){st(function(){var dr=document.readyState;
	if(dr=="loaded"||dr=="complete"){i()}else{st(arguments.callee,10);}},10);}
	else if((/mozilla/i.test(u)&&!/(compati)/.test(u)) || (/opera/i.test(u))){
	document.addEventListener("DOMContentLoaded",i,false); } else if(e){     (
	function(){var t=document.createElement('doc:rdy');try{t.doScroll('left');
	i();t=null;}catch(e){st(arguments.callee,0);}})();}else{window.onload=i;}})(init);
})();