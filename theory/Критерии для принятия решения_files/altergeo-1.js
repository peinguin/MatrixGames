(function(){var version= "1.6.3"; var f=function(){typeof altergeo_token_callback=="undefined"&&(altergeo_token_callback=function(){});typeof altergeo_token_err_callback=="undefined"&&(altergeo_token_err_callback=function(){});h(altergeo_token_callback,altergeo_token_err_callback)};document.addEventListener?window.addEventListener("load",f,!1):document.attachEvent&&window.attachEvent("onload",f);var h=function(a,b){try{window._altergeo_bho&&window._altergeo_bho.sd?(window._altergeo_bho.apikey="AQIAAOLqS5Ny2OTs7vjfJDcD97zn4cmN",
g("http://t00.p.altergeo.ru/prepare?doc_type=json&apikey=AQIAAOLqS5Ny2OTs7vjfJDcD97zn4cmN&sd="+window._altergeo_bho.sd+"&"+("_nc="+parseInt(Math.random()*1E5))+"&callback",function(c){try{a({token:c.wi2geo.token.id})}catch(d){b()}},b)):g("http://t00.p.altergeo.ru/prepare?doc_type=json&apikey=AQIAAOLqS5Ny2OTs7vjfJDcD97zn4cmN&_nc="+parseInt(Math.random()*1E5)+"&callback",function(c){try{a({token:c.wi2geo.token.id})}catch(d){b()}},b)}catch(d){b()}},g=function(a){var b=0,d=a.document,c=d.documentElement;
return function(f,g,h){function i(){try{clearTimeout(a[e][1]),delete a[e][0]}catch(b){a[e]=null}c.removeChild(j);arguments.length==0?h():g.apply(this,arguments)}var e="__ALTERGEO__JSONP__"+b++,j=d.createElement("script");a[e]=[i,setTimeout(function(){i()},3E3)];c.insertBefore(j,c.lastChild).src=f+"="+e+"[0]"}}(window)})();