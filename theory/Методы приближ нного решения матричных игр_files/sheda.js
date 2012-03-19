var kategorii=null;var jsb=Array();var thb;function loadjs(fn){if(jsb[fn]==null){var o=document.createElement("script");o.setAttribute("type","text/javascript");o.setAttribute("src",fn+'.js');document.getElementsByTagName("head")[0].appendChild(o);if(fn=='snow'){o=document.getElementById('snow_div');o.innerHTML="Всё будет круто!";jsb[fn]=true;}}}
function skch(){if(kategorii==null)return;o=document.getElementById('searchK');if(o!=null){ss='';s=o.value.toLowerCase();kat_move=Array();j=0;for(i=0,l=kategorii.length;i<l;i++){if(kategorii[i][0].indexOf(s)!=-1){kat_move[j++]=kategorii[i][1];kategorii[i][2]=1;}else kategorii[i][2]=0;}
if(kat_move.length>0){for(i=0,l=kategorii.length;i<l;i++){if(!kategorii[i][2])kat_move[j++]=i;}
for(i=0,l=kat_move.length;i<l;i++){kategorii[i][3].innerHTML=kategorii[i][3].title=kategorii[kat_move[i]][4];kategorii[i][3].href=kategorii[kat_move[i]][7];kategorii[i][5].innerHTML=kategorii[kat_move[i]][6];}}}}
var bali=Array(),kat_move=0;function wrapWordsInDescendants(element,tagName,className,k){for(var i=element.childNodes.length;i-->0;){var child=element.childNodes[i];if(child.nodeType==1)
wrapWordsInDescendants(child,tagName,className,k);else if(child.nodeType==3)
wrapWordsInText(child,tagName,className,k);}}
function wrapWordsInText(node,tagName,className,k){var ixs=[];var match;var $i=0;while(match=k.exec(node.data)){ixs.push([match.index,match.index+match[0].length]);$i++;if($i>300)break;}
for(var i=ixs.length;i-->0;){var element=document.createElement(tagName);element.className=className;node.splitText(ixs[i][1]);element.appendChild(node.splitText(ixs[i][0]));node.parentNode.insertBefore(element,node.nextSibling);}}
var code=null,old_data=Array();function highlightstart(){old_s2=document.getElementById('Search1').value;highlight();}
var myk=null;function highlight()
{try{if(myk==null){o=document.getElementById('Search1');if(o!=null){var k=o.value;if((k=='')||(thb==1)){var o2=document.getElementById('Search2');if(o2!=null)k=o2.value;}}else k=$v;if(old_s2!=k)return;}else{k=myk;myk=null;}
if(k.charAt(k.length-1)==' '){k=k.substr(0,k.length-1);}
if(code==null)code=document.getElementsByTagName('ST');k=k+' ';k=k.replace(/(.+(\s|\b))\1+/gi,'$1');k2='';while((k!=k2)&&(k!='')){if(k2!='')k=k2;k2=k.replace(/( |^)[a-zа-яієї]{1,2}( |$)/gi,' ');}
k=k.replace(/(\s+$)|(^\s+)/gi,'');k=k.replace(/[$!,.-]/gi,' ');k=k.replace(/\s+/gi,' ');k=k.replace(/\s/gi,'|');k=k.replace(/[*]/gi,'');if((k.length>2)&&(code!=null))for(i=0,l=code.length;i<l;i++)
{if(old_data[i]==null)old_data[i]=code[i].parentNode.innerHTML;else code[i].parentNode.innerHTML=old_data[i];wrapWordsInDescendants(code[i].parentNode,'font','highlight',new RegExp('('+k+')','gi'));}}catch(err){}}
var xh,old_s='',old_s2='',to_ID=null,to_ID2=null,searchInd=0,a=null,listS=Array;function hid_all(){for(var t=0;t<=10;t++){if(dont_hid[t]==0){var o=document.getElementById("prop"+t);if(o!=null)o.style.visibility="hidden";}}}
var titul_timers=Array(),titul_timers_d=Array(),dont_hid=Array();function show_edit_titul(i){if(titul_timers[i]!=null)clearTimeout(titul_timers[i]);if(titul_timers_d[i]!=null)clearTimeout(titul_timers_d[i]);titul_timers[i]=setTimeout('hid_edit_titul('+i+')',20000);titul_timers_d[i]=setTimeout('can_hid_edit_titul('+i+')',500);dont_hid[i]=1;document.getElementById("prop"+i).style.visibility="visible";}
function can_hid_edit_titul(i){dont_hid[i]=0;}
function hid_edit_titul(i){document.getElementById("prop"+i).style.visibility="hidden";}
function titul_down(i,k){if(titul_timers[i]!=null)clearTimeout(titul_timers[i]);titul_timers[i]=setTimeout('hid_edit_titul('+i+')',20000);}
var titul_s1_old='';function GetXmlHttpObject()
{if(window.XMLHttpRequest)
{return new XMLHttpRequest();}
if(window.ActiveXObject)
{return new ActiveXObject("Microsoft.XMLHTTP");}
return null;}
function roundNumber(num,dec){var result=String(Math.round(num*Math.pow(10,dec))/Math.pow(10,dec));if(result.indexOf('.')<0){result+='.';}
while(result.length-result.indexOf('.')<=dec){result+='0';}
return result;}
var lsT=null;function ch0(){o=document.getElementById('Search1');o2=document.getElementById('googleq');o2.value=o.value;}
var os='';function up0(){highlightstart();if(os!=document.getElementById('Search1').value){if(lsT!=null)clearTimeout(lsT);lsT=setTimeout('ls()',800);}}
function ls(){try{if(xh!=null){xh.onreadystatechange=null;xh.abort;xh.close;}}catch(err){}
xh=GetXmlHttpObject();if(xh==null)return;o=document.getElementById('Search1');var url="/coolreferat/ls.php";xh.open("POST",url,true);xh.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xh.onreadystatechange=sch;xh.send('s='+o.value);os=o.value;}
function sch()
{if(xh.readyState==4){o=document.getElementById("res_list");s=xh.responseText;if(code!=null)for(i=0,l=code.length;i<l;i++)
{if(old_data[i]!=null)code[i].parentNode.innerHTML=old_data[i];}
code=null;old_data=Array();s=s.replace(new RegExp("<st>(.*?)<\/st>",'gi'),'<a class="t1" href="/$1"><ST>$1</ST></a><br>');if(o!=null)o.innerHTML=s;xh.close;old_s2=os;highlight();}}
function find_text(s){try{while((!self.find(s))&&(s.length>4)){s=s.substr(0,s.length-1);}}catch(err){}}
function se(){var a=prompt("Комментарий к жалобе","неправильный текст");xh=GetXmlHttpObject();if(xh==null)return;var url="/coolreferat/user_abus.php";xh.open("POST",url,true);xh.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xh.send('s='+a+'&id='+refid+'&p='+refp);o=document.getElementById('coolerr1');if(o!=null)o.innerHTML='Жалоба отправлена.';}
var tek_kat='';function init(){if(refid!=null){o=document.getElementById('coolerr1');if(o!=null)o.innerHTML='<input type="button" style="font-size:12px;" onclick="se()" value="сообщить об ошибке" /><br /><a target="_blank" rel="nofollow" href="/?редактор='+refid+'"><input type="button" style="font-size:12px;" value="редактировать" /></a><br /><a target="_blank" rel="nofollow" href="/?плагиат=1"><input type="button" style="font-size:12px;" value="уникальный текст" /></a>';}
old_s2=$v;highlight();}