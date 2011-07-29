var addEvent = function() {
	if (window.addEventListener) {
		return function(element, type, execute) {
			element.addEventListener(type, execute, false);
		};
	} else if (window.attachEvent) {
		return function(element, type, execute) {
			element.attachEvent('on'+type, function() {
				execute.call(element, window.event);
			});
		};
	} else {
		return function(element, type, execute) {
			element['on'+type] = execute;
		}
	}
}();

var getElementsByClassName = function(name, s) {
	var scope = s || document, elements = [], length, i;
	if (scope == document || scope.nodeType == 1) {
		if (document.evaluate) {
			var xpath = document.evaluate('.//*[contains(concat(" ", @class, " "), " ' + name + ' ")]', scope, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			length = xpath.snapshotLength, i = 0;
			for (; i<length; i++) {
				elements.push(xpath.snapshotItem(i));
			}
			return elements;
		} else {
			elements = scope.getElementsByTagName('*');
		}
	} else {
		elements = scope;
	}
	length = elements.length, i = 0;
	var nodes = [], regEx = new RegExp('(^|\\s)' + name + '(\\s|$)');
	for (; i<length; i++) {
		if (elements[i].className.match(regEx)) {
			nodes.push(elements[i]);
		}
	}
	return nodes;
};

var Microformats = function() {
	return {
		getNodeValue: function(node) {
			if (node && node.hasChildNodes()) {
				return node.firstChild.nodeValue;
			}
			return null;
		},
		getNodeAttribute: function(node, attr) {
			if (node && node.attributes) {
				return node.getAttribute(attr) || null;
			}
			return null;
		},
		hCardToJSON: function(card) {
			var vCard = (card instanceof Object) ? card : document.getElementById(card);
			var n = Microformats.getNodeValue(getElementsByClassName('n', vCard)[0]);
			var fn = Microformats.getNodeValue(getElementsByClassName('fn', vCard)[0]);
			var url = Microformats.getNodeAttribute(getElementsByClassName('url', vCard)[0], 'href');
			var org = Microformats.getNodeValue(getElementsByClassName('org', vCard)[0]);
			var photo = Microformats.getNodeAttribute(getElementsByClassName('photo', vCard)[0], 'src');
			var adr = getElementsByClassName('adr', vCard)[0] || null;
			var adrStreetAddress, adrLocality, adrRegion, adrPostalCode, geo, geoLatitude, geoLongitude;
			if (adr) {
				adrStreetAddress = Microformats.getNodeValue(getElementsByClassName('street-address', adr)[0]);
				adrLocality = Microformats.getNodeValue(getElementsByClassName('locality', adr)[0]);
				adrRegion = Microformats.getNodeValue(getElementsByClassName('region', adr)[0]);
				adrPostalCode = Microformats.getNodeValue(getElementsByClassName('postal-code', adr)[0]);
				geo = getElementsByClassName('geo', adr)[0] || null;
				if (geo) {
					geoLatitude = Microformats.getNodeValue(getElementsByClassName('latitude', geo)[0]);
					geoLongitude = Microformats.getNodeValue(getElementsByClassName('longitude', geo)[0]);
				}
			}
			return {"n":n, "fn":fn, "url":url, "photo":photo, "org":org, "adr":{"street-address":adrStreetAddress, "locality":adrLocality, "region":adrRegion, "postal-code":adrPostalCode, "geo":{"latitude":geoLatitude, "longitude":geoLongitude}}, "vCard":vCard}; // "vCard" is a reference back to the DOM element (not part of the hCard standard).
		}
	};
}();

var getDaysLeft = function(dateString) {
	var countdownToDate = new Date(dateString);
	var countdown = (countdownToDate.getTime()-new Date().getTime())/(86400000); // 1000*60*60*24
	return Math.floor(countdown);
}
var init = function() {
	var daysLeft = getDaysLeft('Sat, 17 May 2008 15:00:00 GMT-0600');
	var navCountdownReplace = document.getElementById('nav-countdown-replace');
	navCountdownReplace.innerHTML = ((daysLeft >= 2) ? 'Only '+daysLeft+' Days Left' : ((daysLeft == 1) ? 'Big Day Tomorrow!' : 'We\'re Married!!'));	
};	
// http://www.kryogenix.org/days/2007/09/26/shortloaded
(function(i) {var u =navigator.userAgent;var e=/*@cc_on!@*/false; var st =
setTimeout;if(/webkit/i.test(u)){st(function(){var dr=document.readyState;
if(dr=="loaded"||dr=="complete"){i()}else{st(arguments.callee,10);}},10);}
else if((/mozilla/i.test(u)&&!/(compati)/.test(u)) || (/opera/i.test(u))){
document.addEventListener("DOMContentLoaded",i,false); } else if(e){     (
function(){var t=document.createElement('doc:rdy');try{t.doScroll('left');
i();t=null;}catch(e){st(arguments.callee,0);}})();}else{window.onload=i;}})(init);

//(function(){})();
