if(typeof Begun!=="object"){
var Begun={};
}
if(typeof Begun.Error!=="object"){
Begun.Error={};
}
if(typeof Begun.loaderCallbacks==="undefined"){
Begun.loaderCallbacks=[];
}

Begun.DOM_TIMEOUT=1;
Begun.REVISION='$LastChangedRevision: 56219 $';
Begun.VERSION=Begun.REVISION.replace(/\D/g,'');

Begun.loaderCallbacks.push(begun_load_autocontext);

function begun_load_autocontext(){
Begun.Scripts.importAllScripts({"acp/begun_utils.53784.js":true});

if(typeof Begun.Error.send==='undefined'){
Begun.Error.send=function(errorMessage,errorUrl,errorLine,loggerAddress){
var be=Begun.Error;

if(
typeof be.sent[errorMessage]!=='undefined'||
be.excludedErrors[errorMessage]
){
return;
}

var protocol=Begun.Scripts.getConformProtocol();
var defaultErrorLogger=protocol+'//autocontext.begun.ru/log_errors?';
var address=loggerAddress||window.begun_error_url||defaultErrorLogger;

var padId=window.begun_auto_pad;

be.sent[errorMessage]=Begun.Utils.includeImage(
address+'e_msg='+encodeURIComponent(errorMessage)+'&e_url='+
encodeURI(errorUrl)+'&e_line='+errorLine+
'&pad_id='+padId+'&location='+encodeURI(document.URL)+
'&rev='+Begun.VERSION
);
};

Begun.Error.sent={};

Begun.Error.excludedErrors={
'Error loading script':true
};
}

(function(){
if(!Begun.Autocontext){
var errorHandler=window.onerror;
window.onerror=function regErrors(msg,url,line){
if(errorHandler&&errorHandler instanceof Function){
errorHandler();
}
if(typeof url==="string"&&url.search(/autocontext/i)!==-1||typeof msg==="string"&&msg.search(/Begun/i)!==-1){
Begun.Error.send(msg,url,line);
}
};
}
})();

Begun.Scripts.Callbacks['ac']=function(fileName){
if(!Begun.Autocontext&&Begun.Scripts.isLastRequired(fileName)){
Begun.Autocontext=new function(){
var _this=this;
this.dom_change=false;
this.multiple_feed=true;
this.scrollers=[];
this.options={
max_blocks_count:10,
max_scrollers:1,
max_scroll_banners:10,
fake_block_offset:200,
fake_block_high_limit:251
};
this.unhandledDebugs=[];

this.Thumbs=(function(){
var types={
'default':{
'width':42,
'height':42
},
'classic':{
'width':56,
'height':42
}
}
return{
getType:function(pad_id){
var sections=['autocontext','hypercontext'];
var banner=null;
for(var i=0;i<sections.length;i++){
if(_this.getBanner(sections[i],0,pad_id)){
banner=_this.getBanner(sections[i],0,pad_id);
break;
}
}
return _this.getThumbSrc(banner,false).indexOf('classic')!=-1?'classic':'default';
},
getDimentions:function(type){
return types[type];
}
}
})();

_this.Callbacks=new function(){
var ac=_this;
var _callbacks={};
var _extend=function(destination,source){
for(var property in source){
if(typeof source[property]=='object'){
var new_obj={};
for(var property2 in source[property]){
if(typeof source[property][property2]=='function'){
if((typeof destination[property]!=="undefined")&&(typeof destination[property][property2]=='function')){
new_obj[property2]=function(old_func,new_func,property2){
return function(args){
old_func.apply(property2=='click'?this:ac,[args]);
new_func.apply(property2=='click'?this:ac,[args]);
};
}(destination[property][property2],source[property][property2],property2);
}else{
new_obj[property2]=function(func,property2){
return function(args){
func.apply(property2=='click'?this:ac,[args]);
};
}(source[property][property2],property2);
}
}
}
destination[property]=new_obj;
}
}
return destination;
};
this.register=function(callbacks){
_extend(_callbacks,callbacks);
};
this.unregister=function(ns,handler){
if(ns in _callbacks){
if(handler){
delete _callbacks[ns][handler];
}else{
delete _callbacks[ns];
}
}
};
this.dispatch=function(obj,method,context_obj,args){
if(_callbacks[obj]&&typeof _callbacks[obj][method]=='function'){
args=args||[];
_callbacks[obj][method].apply(context_obj||this,args);
}else{
return null;
}
};
this.getCallbacks=function(){
return _callbacks;
};
};

var Module=(function(){
var ext={
"auto_ppcall":"53784",
"auto_scroll":"47322",
"auto_rich":"38635",
"auto_accordion":"30573",
"auto_top":"30573",
"auto_catalog":"30573",
"auto_hyper":"48028",
"auto_photo":"47316",
"auto_turnoff":"35747",
"toolbar":"53784",
"auto_zoom_slider":"55016",
"catalog_tree":"1"
};


_this.Callbacks.register({
'modules':{
'Slider':function(Slider){
Begun.Utils.forEach(
_this.sliderWaiters,
function(waiter){
waiter(undefined,undefined,undefined,Begun.Slider);
}
);
}
}
});

var loaded=[];
return{
updateAnticash:function(link){
var reModule=new RegExp("^"+_this.Strings.urls.base_scripts_url+"(\\w+)\.js$");
var parsed=reModule.exec(link);
if((parsed!==null)&&(parsed.length===2)&&
typeof ext[parsed[1]]!=="undefined"){
return ext[parsed[1]];
}else{
return false;
}
},
isLoaded:function(link){
return Begun.Utils.in_array(loaded,link);
},
load:function(link){
if(!this.isLoaded(link)){
var revNumber=this.updateAnticash(link),
included;

if(revNumber){
included=Begun.Utils.includeScript(
link.replace(
/(.+)\/([^\/]+)\.js$/,
"$1/acp/$2."+revNumber+".js"
)
);
}else{
included=Begun.Utils.includeScript(link);
}

if(included){
loaded.push(link);
}
}
},

baseLoad:function(path){
var base=_this.Strings.urls.base_scripts_url;
this.load(base+path);
},

baseLoadIf:function(flag,path){
if(flag){
this.baseLoad(path);
}
},

getNames:function(what){
switch(what){
case"loaded":
return loaded.toString();
case"all":
default:
var allModules='';
var comma='';
for(var aModule in ext){
if(ext.hasOwnProperty(aModule)){
allModules+=comma+aModule;
comma=',';
}
}
return allModules;
}
},

initInBlock:function(block,pad){
var initExtraModule=function(objName,func,object){
if(objName in Begun){
func(object);
}else{
setTimeout(function(){
initExtraModule(objName,func,object);
},Begun.DOM_TIMEOUT);
}
};

if(
(_this.bannersContainViewType('rich',pad.pad_id,null,block.id)||
_this.bannersContainViewType('pseudorich',pad.pad_id,null,block.id))&&
!_this.isRichExpanded(block)&&
!_this.isRichMini(block)
){
initExtraModule('richBlocks',_this.initAutoRichBlock,block);
}else if(Number(block.options.use_scroll)){
initExtraModule('Scroller',_this.initScrollBlock,block);
}else if(Number(block.options.use_accordion)){
initExtraModule('Accordion',_this.initAccordionBlock,block);
}else if(_this.Blocks.checkType(block,'top')){
initExtraModule('autoTop',_this.initAutoTopBlock,block);
}else if(_this.isTurnOff(block)){
initExtraModule('Turnoff',_this.initTurnoff,block);
}
}
};
})();

this.warningModule={};

(function(warningModule){
var warningText={
"alco":"&#1063;&#1088;&#1077;&#1079;&#1084;&#1077;&#1088;&#1085;&#1086;&#1077;&#32;&#1087;&#1086;&#1090;&#1088;&#1077;&#1073;&#1083;&#1077;&#1085;&#1080;&#1077;&#32;&#1074;&#1088;&#1077;&#1076;&#1085;&#1086;&#46;",
"tobacco":"&#1050;&#1091;&#1088;&#1077;&#1085;&#1080;&#1077;&#32;&#1074;&#1088;&#1077;&#1076;&#1080;&#1090;&#32;&#1074;&#1072;&#1096;&#1077;&#1084;&#1091;&#32;&#1079;&#1076;&#1086;&#1088;&#1086;&#1074;&#1100;&#1102;&#46;",
"medicine":"&#1045;&#1089;&#1090;&#1100;&#32;&#1087;&#1088;&#1086;&#1090;&#1080;&#1074;&#1086;&shy;&#1087;&#1086;&#1082;&#1072;&#1079;&#1072;&#1085;&#1080;&#1103;&#46;&#32;&#1055;&#1086;&#1089;&#1086;&#1074;&#1077;&#1090;&#1091;&#1081;&#1090;&#1077;&#1089;&#1100;&#32;&#1089;&nbsp;&#1074;&#1088;&#1072;&#1095;&#1086;&#1084;&#46;",
"abortion":"&#1045;&#1089;&#1090;&#1100;&#32;&#1087;&#1088;&#1086;&#1090;&#1080;&#1074;&#1086;&shy;&#1087;&#1086;&#1082;&#1072;&#1079;&#1072;&#1085;&#1080;&#1103;&#46;&#32;&#1055;&#1086;&#1089;&#1086;&#1074;&#1077;&#1090;&#1091;&#1081;&#1090;&#1077;&#1089;&#1100;&#32;&#1089;&nbsp;&#1074;&#1088;&#1072;&#1095;&#1086;&#1084;&#46;&#32;&#1042;&#1086;&#1079;&#1084;&#1086;&#1078;&#1077;&#1085;&#32;&#1074;&#1088;&#1077;&#1076;&#32;&#1079;&#1076;&#1086;&#1088;&#1086;&#1074;&#1100;&#1102;&#46;"
};

warningModule.getType=function(banner){
for(var type in warningText){
if(warningText.hasOwnProperty(type)){
if(_this.checkBannerViewType(banner,type)){
return type;
}
}
}
return'';
};

warningModule.getText=function(type){
return warningText[type]||"";
};
}(this.warningModule));

this.tplLoaded=function(tpl){
this.tplLoaded.notFinished[tpl]=false;
if(this.fillBlocks.delayedCall&&!ExtBlockTypes.isLoading()){
this.fillBlocks();
this.fillBlocks.delayedCall=false;
}
};
this.tplLoaded.notFinished={};

var ExtBlockTypes=(function(){
var ext={
"begun_tpl_block_120x600":"48310",
"begun_tpl_block_160x600":"48310",
"begun_tpl_block_200x300":"48310",
"begun_tpl_block_240x400":"56134",
"begun_tpl_block_468x60":"48310",
"begun_tpl_block_728x90":"56185",
"begun_tpl_block_flat":"47278",
"begun_tpl_block_horizontal":"55032",
"begun_tpl_block_square":"47859",
"begun_tpl_block_top":"48310",
"begun_tpl_block_vertical":"55117"
};

return{
isLoading:function(){
var isAny=false;
for(var status in _this.tplLoaded.notFinished){
if(_this.tplLoaded.notFinished.hasOwnProperty(status)){
if(_this.tplLoaded.notFinished[status]){
isAny=true;
break;
}
}
}
return isAny;
},
load:function(tplFileName){
if(typeof ext[tplFileName]==="undefined"){
return;
}
if(typeof _this.tplLoaded.notFinished[tplFileName]==="undefined"){
var included=Begun.Utils.includeScript(_this.Strings.urls.base_scripts_url+"acp/"+
tplFileName+"."+ext[tplFileName]+".js","write");

_this.tplLoaded.notFinished[tplFileName]=included;
}
},
loadAll:function(){
for(var tplFileName in ext){
if(ext.hasOwnProperty(tplFileName)){
this.load(tplFileName);
}
}
}
};
})();

this.getModules=Module.getNames;

var UA_DESKTOP=0,
UA_CLASSIC_MOBILE=1,
UA_RICH_MOBILE=2,
BLOCK_ID_TOP_MOBILE=2,
FAKE_BLOCKS=[BLOCK_ID_TOP_MOBILE];

this.getBlockIdTopMobile=function(){
return BLOCK_ID_TOP_MOBILE;
};


var protocol=Begun.Scripts.getConformProtocol();

this.Strings={
urls:{
begun:protocol+'//www.begun.ru/',
autocontext:protocol+'//autocontext.begun.ru/',
ac_filename:'autocontext2.js',
hostname:'autocontext.begun.ru',
base_scripts_url:protocol+'//autocontext.begun.ru/',
daemon:protocol+'//autocontext.begun.ru/context.jsp?',
video:protocol+'//video.begun.ru/vcp.swf',
thumbs:protocol+'//thumbs.begun.ru/',
blank:protocol+'//autocontext.begun.ru/img/blank.gif',
log_banners_counter:protocol+'//autocontext.begun.ru/blockcounter?log_visibility=1&',
ppcalls_counter:protocol+'//autocontext.begun.ru/ppcallcounter?log_ppcall_visibility=1&',
tns_text_counter:protocol+'//www.tns-counter.ru/V13a**bg{{page_id}}**bg_ru/ru/CP1251/tmsec={{tns_counter_flag}}/',
hyper_shadow_1:protocol+'//autocontext.begun.ru/img/hyper-shadow-1.png',
hyper_shadow_2:protocol+'//autocontext.begun.ru/img/hyper-shadow-2.png',
turnoff_handler:protocol+'//autocontext.begun.ru/hide.jsp?',
integration:'integrations/{{name}}.js',
alter_geo_logger:protocol+'//profile.begun.ru/altergeo.204?token={{token}}',


alter_geo_script:'http://js.p.altergeo.ru/js/altergeo-1.6.3-begun.js'
},
contacts:{
card:'&#1050;&#1086;&#1085;&#1090;&#1072;&#1082;&#1090;&#1099;',
ppcall:'&#1047;&#1074;&#1086;&#1085;&#1080;&#1090;&#1100;'
},
css:{
prefix:'begun',
block_prefix:'begun_block_',
scroll_table_prefix:'begun_adv_table_',
scroll_div_prefix:'begun_adv_common_',
catalog_search_wrapper:'begun_catalog_search_span',
catalog_results_wrapper:'begun_catalog_results_span',
catalog_cloud_wrapper:'begun_catalog_cloud_span',
thumb:'begun_adv_thumb',
thumb_default:'begun_adv_thumb_default',
thumb_classic:'begun_adv_thumb_classic',
favicon:'begun_adv_fav',
scroll:'begun_scroll',
warn_prefix:'begun_warn_',
logo_color:'#622678',
thumb_def_color:'#118F00',
thumb_def_color_hover:'#FF0000',
fix_layout:'begun_fix_layout'
},
js:{
banner_onclick:'Begun.Autocontext.clickBanner(event, this)',
ppcall_show:'Begun.Ppcall.showEnterForm'
}
};

var isBFSApplicable=function(){
return(typeof window.begun_multiple_feed!=="undefined"||_this.multiple_feed)&&!window.begun_block_ids;
};

var addFakeBlocks=function(){
var feed=_this.getFeed();
if(feed.blocks){
var _block=null;
var i=0;
while(_block=feed.blocks[i]){
if((_block)&&_block.id==BLOCK_ID_TOP_MOBILE){
_this.Blocks.add(_block);
}
i++;
}
}
};

var LoadingStrategy=function(){};
LoadingStrategy.prototype={
loadBlock:function(block_id){},
parseFeed:function(){}
};


var DS=function(){};
DS.prototype=new LoadingStrategy();
DS.prototype.loadBlock=function(block_id){
this.block_id=block_id;
if(!_this.initFeedLoad()&&arguments.callee.run){
_this.loadFeedDone();
}
arguments.callee.run=true;
};
DS.prototype.parseFeed=function(){
_this.loadExtraResources();
var feed=_this.getFeed();
if(feed&&feed.blocks&&this.block_id){
addFakeBlocks();
var block=_this.Blocks.getBlockById(this.block_id,feed.blocks);
if(block){
_this.Blocks.push(block);
}
}
};


var FBS=function(){};
FBS.prototype=new LoadingStrategy();
FBS.prototype.parseFeed=function(){
var extendUndefinedFields=function(destination,source){
for(var property in source){
if(source.hasOwnProperty(property)){
if(typeof destination[property]==="undefined"){
destination[property]=source[property];
}else if(typeof destination[property]==="object"&&typeof source[property]==="object"){
destination[property]=extendUndefinedFields(destination[property],source[property]);
}
}
}
return destination;
};
_this.loadExtraResources();
var feed=_this.getFeed();
if(feed&&feed.blocks&&this.block_id){
var block=_this.Blocks.getBlockById(this.block_id,feed.blocks);
if(block){
extendUndefinedFields(block.options,window.begun_extra_block.options);
window.begun_extra_block.id=window.begun_block_id;
_this.Blocks.push(window.begun_extra_block);
}
addFakeBlocks();
}
};
FBS.prototype.loadBlock=function(block_id){
var feed=_this.getFeed();
if(feed&&feed.blocks){
_this.resetBannerIndex();
var sBanners=_this.getShownBanners();
if(typeof sBanners==="object"){
sBanners=sBanners.toString();
}else{
sBanners="";
}
_this.feedLoad({"banner_filter":sBanners});
}
this.block_id=block_id;
};


var BFS=function(){};
BFS.prototype=new LoadingStrategy();
BFS.prototype.loadBlock=function(block_id){
this.block_id=block_id;
var feed=_this.getFeed();
if(feed&&feed.blocks){
_this.resetBannerIndex();
var sBanners=_this.getShownBanners();
if(typeof sBanners==="object"){
sBanners=sBanners.toString();
}else{
sBanners="";
}
_this.feedLoad({"banner_filter":sBanners});
}
};
BFS.prototype.parseFeed=function(){
(new DS).parseFeed.apply(this);
};

this.getLoadingStrategy=function(){
if(window.begun_extra_block){
if(!arguments.callee.fbs){
arguments.callee.fbs=new FBS();
}
return arguments.callee.fbs;
}else if(isBFSApplicable()){
if(!arguments.callee.bfs){
arguments.callee.bfs=new BFS();
}
return arguments.callee.bfs;
}else{
if(!arguments.callee.ds){
arguments.callee.ds=new DS();
}
return arguments.callee.ds;
}
};
this.setOptions=function(options){
Begun.extend(_this.options,options||{});
};

this.requestParams={
"pad_id":'',
"block_id":'',
"n":'',
"lmt":Date.parse(document.lastModified)/1000,
"sense_mode":'custom',
"ut_screen_width":screen.width||0,
"ut_screen_height":screen.height||0,
"json":1,
"jscall":'loadFeedDone',
"condition_id":window.begun_condition_id||'',
"frm_level":'',
"frm_top":'',
"force_js_link":'',
"misc_id":window.begun_misc_id||window.misc_id,
"overridden":'',
"version":'',
"banner_filter":'',
"stopwords":window.stopwords||'',
"begun_self_keywords":window.begun_self_keywords||'',
"ref":document.referrer,
"real_refer":document.URL
};

this.responseParams={};

this.Storage=new function(){
try{
if(!top.Begun){
top.Begun={};
}
var values=top.Begun.storageValues=top.Begun.storageValues||{};
}catch(e){
try{
if(!parent.Begun){
parent.Begun={};
}
var values=parent.Begun.storageValues=parent.Begun.storageValues||{};
}catch(ex){
var values={};
}
}

return{
getV:values,
set:function(prop,data){
if(typeof data!='object'||!values[prop]){
values[prop]=data;
}else{
Begun.extend(values[prop],data);
}
},
erase:function(prop){
values[prop]={};
},
get:function(prop){
return values[prop];
},

incProperty:function(obj,prop){
if(typeof values[obj]!=='object'){
values[obj]={};
values[obj][prop]=0;
}else{
values[obj][prop]=typeof values[obj][prop]=='number'?values[obj][prop]+1:0;
}
}
};
};

this.prepareRequestParams=function(newValues){
var comma="",
begunStorage=_this.Storage,
padId=_this.requestParams.pad_id=window.begun_auto_pad;
if(begunStorage.get('url')&&begunStorage.get('url')!==document.URL){
begunStorage.erase(padId);
begunStorage.set('pageId',false);
}
if(_this.Monitor.setFirst(padId,'requested')){
_this.requestParams.first='1';
}

_this.requestParams.version=Begun.VERSION;
if(typeof(window.begun_js_force_load)!='undefined'&&window.begun_js_force_load){
_this.requestParams.force_js_link=Module.getNames('all');
ExtBlockTypes.loadAll();
var moduleNames=_this.requestParams.force_js_link.split(',');
var baseUrl=_this.Strings.urls.base_scripts_url;
for(var j=0;j<moduleNames.length;j++){
if(moduleNames[j]!=="toolbar"){
Module.load(baseUrl+moduleNames[j]+".js");
}
}
}
var frame_level=(function(){
var level=0;
var _parent=self;
while(_parent!==top&&level<999){
_parent=_parent.parent;
level++;
}
return level;
})();
if(frame_level){
_this.requestParams.frm_level=frame_level;
try{
_this.requestParams.frm_top=top.location.href;
}catch(exc){
_this.requestParams.frm_top='top not accessible';
}
}

if(typeof _this.isNotFirstRequest==="undefined"){
_this.isNotFirstRequest=true;
comma=",";
_this.requestParams.block_id=BLOCK_ID_TOP_MOBILE;
window.altergeo_token_callback=function(obj){
_this.Monitor.sendJSON(
{'token':obj&&obj.token},
_this.Strings.urls.alter_geo_logger
);
};
window.altergeo_token_err_callback=function(){
Begun.Error.send("altergeo slow response or error",document.URL,-1);
};
}

if(window.begun_block_ids){
_this.requestParams.block_id+=comma+window.begun_block_ids.replace(/\s/g,"");
}else{
if(window.begun_block_id&&isBFSApplicable()){
_this.requestParams.block_id+=comma+window.begun_block_id;
}
}

if(window.begun_request_params&&window.begun_request_params.constructor===Object){
window.begun_request_params.overridden=1;
Begun.extend(_this.requestParams,window.begun_request_params);
}
if(newValues){
Begun.extend(_this.requestParams,newValues);
}
begunStorage.incProperty(padId,'rq');
if(!begunStorage.get('pageId')){
begunStorage.set('pageId',(function(){
var ret="",i=0;
while(i<32){
ret+=Math.floor(Math.random()*16).toString(16);i++;
}
return ret.toUpperCase();
})());
begunStorage.set('url',document.URL);
}
_this.requestParams.rq=begunStorage.get(padId)['rq'];
_this.requestParams.rq_sess=begunStorage.get('pageId');

_this.requestParams.protocol=Begun.Scripts.getConformProtocol().replace(':','');
};
this.isEventTrackingOn=function(){
return _this.responseParams["track_events"];
};
this.init=function(){
_this.Customization.init();
_this.Pads.init();
_this.initCurrentBlock();
if(typeof arguments.callee.run==="undefined"){
arguments.callee.run=true;
}
};
this.initToolbar=function(debug){
if(Begun.Toolbar){
var toolbar=Begun.Toolbar.init(debug);
}
};
this.initHypercontextBlock=function(block,pad_id){
if(!Begun.Hypercontext||!block){
return;
}
this.hyperBlock=new Begun.Hypercontext(block,pad_id);
};
this.initPhotocontextBlock=function(block,pad_id){
if(!Begun.Photocontext||!block){
return;
}
this.photoBlock=new Begun.Photocontext(block,pad_id);
};
this.initScrollBlock=function(block){
if(Begun.Scroller){
var setHeight=function(block,scroll_div,scroll_table){
var trs=scroll_table.getElementsByTagName('tr');
var height;
var i;
var banners_count=Number(block.options.banners_count);
if(banners_count===1){
height=trs[0].offsetHeight;
for(i=1;i<trs.length;i++){
if(trs[i].offsetHeight>height){
height=trs[i].offsetHeight;
}
}
}else{
height=0;
for(i=0;i<banners_count;i++){
if(trs[i]){
var h=trs[i].offsetHeight;
height+=h;
}
}
}
scroll_div.style.height=height+'px';
scroll_div.style.overflow='hidden';
};
var init=function(block,scroll_div,scroll_table,is_horizontal){
var banners_count=Number(block.options.banners_count);
var banners_count_coef=Number(block.options.banners_count_coef)||1;
(function(){
if(!scroll_div.offsetHeight){
window.setTimeout(arguments.callee,Begun.DOM_TIMEOUT);
}
var scroller=(new Begun.Scroller(
scroll_table,
{
height:scroll_div.offsetHeight,
banners_count:banners_count,
banners_count_coef:banners_count_coef,
is_horizontal:is_horizontal,
scroll_timeout:(block&&block.options&&block.options.json&&block.options.json.scroll_timeout)||null,
fade_enabled:!Begun.Browser.IE||Begun.Browser.version()>8
}
));

_this.scrollers.push(scroller);
scroller.start();
})();
};
var scroll_div=Begun.$(_this.Strings.css.scroll_div_prefix+block.id);
var scroll_table=Begun.$(_this.Strings.css.scroll_table_prefix+block.id);
var is_horizontal;
if(!block.scrolling&&Number(block.options.use_scroll)&&scroll_div&&scroll_table){
if(_this.Blocks.checkType(block,'horizontal')||_this.Blocks.checkType(block,'728x90')||_this.Blocks.checkType(block,'468x60')){
is_horizontal=true;
}else{
is_horizontal=false;
}
if(_this.Blocks.checkType(block,'vertical')||_this.Blocks.checkType(block,'flat')){
(function(block,scroll_div,scroll_table,is_horizontal){
if(scroll_table.offsetHeight){
setHeight(block,scroll_div,scroll_table);
scroll_div.style.width=scroll_div.offsetWidth+'px';
init(block,scroll_div,scroll_table,is_horizontal);
}else{
var func=arguments.callee;
window.setTimeout(function(){
func(block,scroll_div,scroll_table,is_horizontal);
},Begun.DOM_TIMEOUT);
}
})(block,scroll_div,scroll_table,is_horizontal);
}else if(_this.Blocks.checkType(block,'horizontal')){
(function(block,scroll_div,scroll_table,is_horizontal){
if(scroll_div.offsetHeight){
var recalcScrollBlockHeight=function(scroll_div,scroll_table){
if(!arguments.callee.scrollDivWidth||arguments.callee.scrollDivWidth!=scroll_div.offsetWidth){
arguments.callee.scrollDivWidth=scroll_div.offsetWidth;
scroll_div.style.height='auto';
var tds=scroll_table.getElementsByTagName('td');
var displayProperty=Begun.Browser.IE&&Begun.Browser.version()<8?'':'table-cell';
var getScrollDivHeight=function(firstHalf){
for(var i=0;i<tds.length;i++){
if(i<Math.round(tds.length/2)){
tds[i].style.display=firstHalf?displayProperty:'none';
}else{
tds[i].style.display=firstHalf?'none':displayProperty;
}
tds[i].style.width=Math.floor(100*2/tds.length)+'%';
}
return scroll_div.offsetHeight;
}
var firstHalfShowed=(Begun.Utils.getStyle(tds[0],'display')!=='none');
scroll_div.style.height=Math.max(getScrollDivHeight(!firstHalfShowed),getScrollDivHeight(firstHalfShowed))+'px';
}
window.setTimeout(function(){
recalcScrollBlockHeight(scroll_div,scroll_table);
},1000);
}
recalcScrollBlockHeight(scroll_div,scroll_table);
init(block,scroll_div,scroll_table,is_horizontal);
}else{
var func=arguments.callee;
window.setTimeout(function(){
func(block,scroll_div,scroll_table,is_horizontal);
},Begun.DOM_TIMEOUT);
}
})(block,scroll_div,scroll_table,is_horizontal);
}else{
init(block,scroll_div,scroll_table,is_horizontal);
}
block.scrolling=true;
}
}
};
this.initAccordionBlock=function(block){
if(!Begun.Accordion){
return false;
}
var accordion_div=_this.Blocks.getDomObj(block.id);
if(!block.is_accordion_processing&&Number(block.options.use_accordion)&&accordion_div){
var accordion=(new Begun.Accordion(accordion_div));
accordion.init();
block.is_accordion_processing=true;
}
};
this.initAutoTopBlock=function(block){
if(!Begun.autoTop){
return false;
}
var auto_top_div=_this.Blocks.getDomObj(block.id);
if(!block.is_auto_top_processing&&_this.Blocks.checkType(block,'top')&&auto_top_div){
var divs=auto_top_div.getElementsByTagName('div');
var auto_top_div_inner=null;
for(var i=0,l=divs.length;i<l;i++){
if(Begun.Utils.hasClassName(divs[i],'begun_collapsable')){
auto_top_div_inner=divs[i];
}
}
var body=document.getElementsByTagName('body')&&document.getElementsByTagName('body')[0];
if(Begun.Browser&&Begun.Browser.IE&&(document.documentElement||body)&&auto_top_div_inner){
auto_top_div_inner.style.width=(document.documentElement.clientWidth||body.clientWidth)+'px';
window.onresize=function(){
auto_top_div_inner.style.width=(document.documentElement.clientWidth||body.clientWidth)+'px';
};
if(Begun.Browser.version()<=6){
auto_top_div.style.display='none';
}
}
var auto_top=(new Begun.autoTop(auto_top_div));
auto_top.init();
block.is_auto_top_processing=true;
}
};
this.initTurnoff=function(block){
if(!Begun.Turnoff){
return false;
}
new Begun.Turnoff(block);
};

this.getRichSizes=function(img,max){
var minP='width',
maxP='height',
px='px';

var res={};
res[minP]=img[minP];
res[maxP]=img[maxP];

if(res[maxP]!==res[minP]){
if(res[minP]>res[maxP]){
var sw=maxP;
maxP=minP;
minP=sw;
}

res[minP]=Math.round(max*res[minP]/res[maxP]);
res[maxP]=max;
}else{
res[maxP]=res[minP]=max;
}

img.style[maxP]=res[maxP]+px;
img.style[minP]=res[minP]+px;

return res;
};

this.callRich=function(options,rich_blocks_div,block){
var rich_blocks=(new Begun.richBlocks(rich_blocks_div,options));
rich_blocks.init();
block.is_rich_blocks_processing=true;
};

this.initZoomSlider=function(block){
var blockId=block.id,
blockDiv=this.Blocks.getDomObj(blockId);

var slider=new Begun.Slider(
blockDiv,
blockId,
{
style:'top',
duration:600
}
);


slider.cycle(5e3);

!(function(slider){
var images=slider.container.getElementsByTagName('img'),
len=images.length,i=0,zoom;

while(i<len){
zoom=new Begun.Zoom(
images[i],
slider.container,
{
marginTop:-15,
marginLeft:-15,
duration:150
}
);


zoom.options.shiftLeft=Math.floor((
zoom.container.clientWidth-zoom.endWidth-

(zoom.element.offsetWidth-zoom.element.clientWidth)
)/2)-zoom.startLeft;

i+=1;
}
}(slider));

!(function(slider,utils){
var HOVER_CLASS='begun_hover';

blockDiv.onmouseover=function(){
utils.addClassName(this,HOVER_CLASS);
slider.stopCycling();
};
blockDiv.onmouseout=function(){
utils.removeClassName(this,HOVER_CLASS);

};
}(slider,Begun.Utils));
};

this.initAutoRichBlock=function(block){
if(!Begun.richBlocks){
return false;
}
var rich_blocks_div=_this.Blocks.getDomObj(block.id);
if(!block.is_rich_blocks_processing&&rich_blocks_div){
var options={};
options.is_block_240x400=_this.Blocks.checkType(block,'240x400');

var min=70;
var max=200;

if(typeof _this._big_rich_sizes==="undefined"){
_this._big_rich_sizes={};
}
var small_images=[];
var i;
var l;
var cells=Begun.Utils.getElementsByClassName(rich_blocks_div,'td','begun_adv_rich');
var ln=0;
for(i=0,l=cells.length;i<l;i++){
small_images[i]=Begun.Utils.getElementsByClassName(cells[i],'img','begun_adv_picture')&&Begun.Utils.getElementsByClassName(cells[i],'img','begun_adv_picture')[0];
if(small_images[i]){
ln+=2;
}
}
block.ln=ln;
for(i=0,l=small_images.length;i<l;i++){
if(small_images[i]){
var setSizes=function(num,image,max,key,obj,block){
var sizes=_this.getRichSizes.call(obj,image,max);
obj._big_rich_sizes['img_width_'+key+'_'+num]=sizes.width;
obj._big_rich_sizes['img_height_'+key+'_'+num]=sizes.height;
if(--block.ln==0){
options.num_pics=l;
options.sizes=obj._big_rich_sizes;
obj.callRich(options,rich_blocks_div,block);
image.onload=null;
}
}
var detectImgDimensions=function(img,i,value,key,obj,block){
if(img.complete){
setSizes(i,img,value,key,obj,block);
}else{
window.setTimeout((function(img,i,value,key,obj,block){
return function(){
detectImgDimensions(img,i,value,key,obj,block);
};
})(img,i,value,key,obj,block),Begun.DOM_TIMEOUT);
}
};
detectImgDimensions(small_images[i],i,min,'min',_this,block);

var big=Begun.Utils.includeImage(
small_images[i].getAttribute('_big_photo_src')
);
if(big){
detectImgDimensions(big,i,max,'max',_this,block);
}
}
}
}
};
this.initAutoCatalogBlock=function(block){
if(!Begun.Catalog){
return false;
}
if(!block.is_catalog_processing){
var feed=this.getFeed();
var catalog=(new Begun.Catalog(block,feed));
catalog.init();
block.is_catalog_processing=true;
}
};
this.resetMaxScrollers=function(){
_this.maxScrollers=_this.options.max_scrollers;
};
this.parseLinks=function(){
var feed=_this.getFeed();
if(!feed){
return;
}
var links=feed.links;
if(links){
var i=0;
var link=null;
while(link=links[i]){
switch(link.type){
case'js':
Module.load(link.url);
break;

case'css':
Begun.Utils.includeCSSFile(link.url);
break;

case'frame':
var vars={url:link.url};
document.write((new Begun.Template(_this.Tpls.getHTML('link_iframe'))).evaluate(vars));
break;

case'swf':
var isFlashInstalled=Begun.Utils.checkFlash();
if(isFlashInstalled){
var swf_url=link.url;
Begun.Utils.addEvent(window,'load',function(){
Begun.Utils.includeSWF(swf_url);
});
}
break;

case'img':

default:
Begun.Utils.includeImage(link.url);
break;
};
i++;
}
}
};

this.excludeFakeBanners=function(feed,section){
if(feed.banners){
var isAnyFake=false,
goodBanners=[];

Begun.Utils.forEach(
feed.banners[section],
function(banner){
if(this.checkBannerViewType(banner,'Fake')){
isAnyFake=true;
this.Banners.infoValues.setAll(
banner.block_id,banner
);
this.Banners.infoValues.set(banner.block_id,banner.banner_id,'source',
banner.source);
this.Banners.infoValues.set(banner.block_id,'fake','id',
banner.banner_id);
delete banner;
}else{
goodBanners.push(banner);
}
},
this
);

if(isAnyFake){
feed.banners[section]=goodBanners;
}
}

return feed;
};

this.loadExtraResources=function(){
var feed=_this.getFeed();
if(!feed){
return;
}
var isPpcall;
var isScroll;
var isRich;
var isTop;
var isHyper;
var isCatalog;
var isAccordion;
var isPhoto;
var isTurnoff;
var blocks=feed.blocks;
for(var k=0;k<blocks.length;k++){
if(_this.Blocks.checkType(blocks[k],'top')){
isTop=true;
}
if(_this.Blocks.checkType(blocks[k],'hyper')){
isHyper=true;
}
if(_this.Blocks.checkType(blocks[k],'photo')){
isPhoto=true;
}
if(blocks[k].options){
if(Begun.Utils.inList(blocks[k].options.block_options,'JSCatalog')){
isCatalog=true;
}
if(blocks[k].options.use_scroll){
isScroll=true;
}
if(blocks[k].options.use_accordion){
isAccordion=true;
}
if(_this.isTurnOff(blocks[k])){
isTurnoff=true;
}
}
}
var feedBanners=feed.banners;
for(var bannersGroup in feedBanners){
if(feedBanners.hasOwnProperty(bannersGroup)&&feedBanners[bannersGroup].length){
for(var j=0;j<feedBanners[bannersGroup].length;j++){
if(feedBanners[bannersGroup][j].ppcall){
isPpcall=true;
}
if(this.isNormalRichBanner(feedBanners[bannersGroup][j])){
isRich=true;
}
}
}
}

Module.baseLoadIf(isPpcall,"auto_ppcall.js");
Module.baseLoadIf(isScroll,"auto_scroll.js");
Module.baseLoadIf(isRich,"auto_rich.js");
Module.baseLoadIf(isTop,"auto_top.js");
Module.baseLoadIf(isHyper,"auto_hyper.js");
Module.baseLoadIf(isCatalog,"catalog_tree.js");
Module.baseLoadIf(isCatalog,"auto_catalog.js");
Module.baseLoadIf(isAccordion,"auto_accordion.js");
Module.baseLoadIf(isPhoto,"auto_photo.js");
Module.baseLoadIf(isTurnoff,"auto_turnoff.js");
};

this.draw=function(){
if(!arguments.callee.run){
_this.Blocks.init();
}
arguments.callee.run=true;
if(ExtBlockTypes.isLoading()){
_this.fillBlocks.delayedCall=true;
}else{
_this.fillBlocks();
}
};
this.useBlockIdDistr=function(){
return!!(_this.getBanner('autocontext',0)&&_this.getBanner('autocontext',0)["block_id"]);
};
this.isFakeBlockId=function(block_id){
return block_id<this.options.fake_block_high_limit&&block_id>this.options.fake_block_offset&&this.lastBlockId;
};
this.initCurrentBlock=function(){
var fakeBlockId;
if(typeof window.begun_auto_pad!=="undefined"&&window.begun_auto_pad>0&&
typeof window.begun_block_id!=="undefined"&&window.begun_block_id>0){
if(window.begun_extra_block&&typeof begunAutoRun!=="function"){
var total_banners=window.begun_total_banners||_this.getActualBlockBannersCount();
fakeBlockId=this.options.fake_block_offset+parseInt(total_banners);
this.lastBlockId=window.begun_block_id;
}
if(!window.begun_extra_block||!_this.isOldBlock()){
_this.printBlockPlace(window.begun_block_id);
}
_this.getLoadingStrategy().loadBlock(window.begun_block_id);
if(fakeBlockId){
window.begun_block_id=fakeBlockId;
}
_this.initFeedLoad();
}else if((_this.init.run)||(typeof window.begun_total_banners==="undefined"
&&typeof window.begun_block_ids==="undefined")){
Begun.Error.send("begun_block_id is missing",document.URL,-1);
}
};
this.getActualBlockBannersCount=function(block){
if(typeof block==="undefined"){
if(typeof window.begun_extra_block!=="undefined"){
block=window.begun_extra_block;
}else{
return 0;
}
}
var coef=Math.ceil(Number(block.options.banners_count_coef))||1;
return Number(block.options.banners_count)*coef;
};
this.initFeedLoad=function(){
if(_this.isFeedStarted()){
return false;
}
if(isBFSApplicable()||window.begun_extra_block||!_this.getFeed()){
_this.setFeedStarted();
this.feedLoad();
}
return false;
};
this.feedLoad=function(paramsUpdate){
_this.prepareRequestParams(paramsUpdate);

var params=Begun.Utils.toQuery(_this.requestParams);

var feedURL=(
_this.Strings.urls.daemon+params
).substring(0,1524).replace(/%[0-9a-fA-F]?$/,'');

var included=Begun.Utils.includeScript(
feedURL,
'write',
null,
'begunAds'
);
_this.requestParams.block_id="";
_this.requestParams.begun_self_keywords="";
return included;
};
this.getGraphHTML=function(graph_banner,callback,width,height,block_id){
width=width||240;
height=height||400;

var inlineStyles='',
type='img',
src=graph_banner.source;

if(("swf"==graph_banner.mime)||("application/x-shockwave-flash"==graph_banner.mime)){
type='swf';
inlineStyles='width:'+width+'px;height:'+height+'px;';
}else if(("js"==graph_banner.mime)||("application/x-javascript"==graph_banner.mime)){
type='js';
_this.bindJsBanner();

if(_this.checkBannerViewType(graph_banner,'BrandRich')){
Begun.Utils.forEach(
_this.sliderWaiters,
function(waiter){
var undefined;
waiter(undefined,graph_banner.url);
}
);

Begun.Utils.includeScript(src,'write');
}else{
Begun.Utils.includeScript(src,'append',callback);
}
}else if(!Begun.Browser.Gecko){
inlineStyles='width:'+width+'px;height:'+height+'px;';
}

var vars={
'url':graph_banner.url,
'source':src,
'width':width,
'height':height,
'close_button':_this.getCloseButton(block_id),
'styles':inlineStyles
};

var block=this.Blocks.getBlockById(block_id);
block.banner_id=graph_banner.banner_id;

this.Banners.infoValues.setAll(
block_id,graph_banner
);

return new Begun.Template(
_this.Tpls.getHTML('search_banner_'+type)
).evaluate(vars);
};
this.initFilledBannersData=function(block){
if(block&&!block.filled_banners_data){
block.filled_banners_data={
text:0,
graph:0,
code:0
};
}
};

this.insertNonTextBlock=function(block){
if(_this.Blocks.checkType(block,'hyper')){
return;
}
this.initFilledBannersData(block);
arguments.callee.blocksHandled=arguments.callee.blocksHandled||[];
if(Begun.Utils.in_array(arguments.callee.blocksHandled,block)){
return;
}else{
arguments.callee.blocksHandled.push(block);
}

var feed=_this.getFeed();

if(feed&&!feed.code_patched){
if(feed.code&&feed.banners&&!feed.banners.code){
feed.banners.code=feed.code;
}
feed.code_patched=true;
}
var block_id=block.id;
var codes=this.getBannersByBlockId(block_id,'code');
var graphs=this.getBannersByBlockId(block_id,'graph');

if(codes){
var code,i,l=codes.length,
dot=/\./g,
acSrc=new RegExp([
'\\ssrc=[\'"].*?\\b',
this.Strings.urls.hostname.replace(dot,'\.'),
'/',
this.Strings.urls.ac_filename.replace(dot,'\.'),
'\\b.*?[\'"]'
].join(''));

for(var i=0;i<l;i++){
code=codes[i].js;

if(null!=codes&&code.length){
if(code.match(acSrc)){
code=code.replace(acSrc,'');
Begun.Utils.evalScript(code);
document.write('<script type="text/javascript">Begun.Autocontext.init();</script>');
}else{
Begun.Utils.evalScript(code);
}
block.filled_banners_data.code++;
block.nonTextBannersInserted=true;
}
}
}
var type=block&&block.options&&block.options.dimensions&&block.options.dimensions.type;
if(graphs){
for(var i=0,l=graphs.length;i<l;i++){
if(graphs[i].loaded){
continue;
}

if(block.options.view_type&&block.options.view_type.indexOf('Graph')!=-1){
var blockId=block.id;
var waiter=_this.sliderWaiters[blockId]=Begun.Utils.createWaiter(
_this.printSliderBlock,_this
);
waiter(block);

if(
!arguments.callee.top_mobile_inserted
&&block_id==BLOCK_ID_TOP_MOBILE
&&Begun.Browser.getUaType()!==UA_DESKTOP
){
_this.prepareTopMobileBlock(block.id);
arguments.callee.top_mobile_inserted=true;
}

var size=_this.getGraphDimensions(graphs[i].view_type);

var html=_this.getGraphHTML(graphs[i],function(){
if(window.begunJsBannerString){
var elem=_this.Blocks.getDomObj(block.id);
elem.innerHTML=window.begunJsBannerString;
}
},size.width,size.height,block_id);

block.filled_banners_data.graph++;
block.nonTextBannersInserted=true;
graphs[i].loaded=true;

var block_place=_this.Blocks.getDomObj(block_id);
if(html&&block_place){
block_place.innerHTML=html;

return;
}
}
}
}
if(!arguments.callee.top_mobile_inserted&&block_id==BLOCK_ID_TOP_MOBILE&&Begun.Browser.getUaType()!==UA_DESKTOP&&this.getBannersByBlockId(BLOCK_ID_TOP_MOBILE,'autocontext').length){
_this.prepareTopMobileBlock(block_id);
arguments.callee.top_mobile_inserted=true;
}
};

this.bindJsBanner=function(){
var _this=this,
observer=this.Callbacks,
undefined;

observer.register({
'jsBanner':{
'BrandRich':function(params){
observer.unregister('jsBanner','BrandRich');

Begun.Utils.forEach(
_this.sliderWaiters,
function(waiter){
waiter(undefined,undefined,params,Begun.Slider);
}
);

if(!('Slider'in Begun)){
Module.baseLoad('auto_zoom_slider.js');
}
}
}
});
};

this.getGraphDimensions=function(viewType){
var size=viewType.match(/(\d+)x(\d+)/)||[null,'0','0'];

return{
width:size[1],
height:size[2]
};
};

this.getCloseButton=function(block_id){
return _this.isMobileBottomBlock(block_id)?(new Begun.Template(_this.Tpls.getHTML('close_button'))).evaluate({'block_id':block_id}):'';
};
this.prepareTopMobileBlock=function(block_id){
try{
var vars={id:_this.Strings.css.block_prefix+block_id};
var block_wrapper=top.document.getElementById('begun_top_mobile_block_wrapper');
if(!block_wrapper){
var bo=top.document.getElementsByTagName('BODY');
var block_wrapper=top.document.createElement('div');
block_wrapper.id='begun_top_mobile_block_wrapper';
if(_this.isMobileBottomBlock(block_id)){
block_wrapper.className='begun_top_mobile_bottom';
var isViewportSet=(function(){
var meta_tags=document.getElementsByTagName('meta');
for(var i=0;i<meta_tags.length;i++){
if(meta_tags[i].name&&meta_tags[i].name.toLowerCase()=='viewport'&&meta_tags[i].content){
return true;
}
}
return false;
})();
var recalcMobileBlock=function(isViewportSet){
var block=Begun.$('begun_top_mobile_block_wrapper');
if(block&&block.childNodes.length){
var coef=document.documentElement.clientWidth/(window.orientation==0||window.orientation==180?window.innerWidth:window.innerHeight);
block.style.webkitTextSizeAdjust=100/(isViewportSet?1:coef*0.25)+'%';
Begun.Utils.setStyle(block,"width",window.innerWidth+"px");
Begun.Utils.setStyle(block,"left",window.scrollX+"px");
Begun.Utils.setStyle(block,"top",window.innerHeight+window.pageYOffset-block.offsetHeight+"px");
}
};
Begun.Utils.addEvent(window,'scroll',function(){recalcMobileBlock(isViewportSet)});
Begun.Utils.addEvent(window,'load',function(){recalcMobileBlock(isViewportSet)});
}
bo[0].insertBefore(block_wrapper,bo[0].firstChild);
}
block_wrapper.innerHTML=(new Begun.Template(_this.Tpls.getHTML('blck_place'))).evaluate(vars);
}catch(e){}
};
this.isOldBlock=function(){
var isPadNew=function(params){
if(!params||!window.begun_auto_pad){
return false;
}
return Begun.Utils.in_array(params.split(','),window.begun_auto_pad);
};
if(typeof _this.responseParams['old_blocks']!=="undefined"&&Number(_this.responseParams['old_blocks'])!=0&&typeof begunAutoRun=='function'){
var feed=_this.getFeed();
if(feed&&feed.cookies&&feed.cookies.js_force_new_pads&&isPadNew(feed.cookies.js_force_new_pads)){
return false;
}
return true;
}
return false;
};
this.renderOldBlock=function(){
if(_this.isOldBlock()){
begunAutoRun();
return true;
}
return false;
};

this.loadFeedDone=(function(_this){
var extendVisualOptions=function(newVisualOptions){
Begun.extend(this.options.visual,newVisualOptions);
};

var setBlockBannerComponents=function(componentsParams){
for(var param in componentsParams){
if(componentsParams.hasOwnProperty(param)){
if(typeof this.options.visual[param]!=="object"){
this.options.visual[param]={};
}
if(!componentsParams[param]){
this.options.visual[param]["display"]="none";
}else{
this.options.visual[param]["display"]="";
}
}
}
};

var setThumbParams=function(visualParams){
var mixinThumb={};
for(var param in visualParams){
if(visualParams.hasOwnProperty(param)){
if(typeof mixinThumb.thumbStyles==="undefined"){
mixinThumb.thumbStyles={};
}
mixinThumb.thumbStyles[param]=visualParams[param];
}
}
Begun.extend(this.options.visual,mixinThumb);
};

var includeIntegrationScripts=function(scripts){
for(var j=0;j<scripts.length;j++){
Begun.Utils.includeScript(
new Begun.Template(
_this.Strings.urls.base_scripts_url+_this.Strings.urls.integration
).evaluate({name:scripts[j]}),
"write"
);
}
};

var loadToolbar=function(feed){
if(feed.debug&&feed.debug.request){
Module.baseLoad('toolbar.js');
_this.unhandledDebugs.push(feed.debug);
delete feed.debug;
_this.begunToolbarLoaded();
}
};

var normalize=function(feed){
var GRAPH='graph';

var banners=feed.banners.autocontext,
graphBanners=[],
banner,viewType,i;

for(i=banners.length-1;i>=0;i--){
banner=banners[i];
if(banner){
viewType=banner.view_type||'';
if(viewType.toLowerCase().indexOf(GRAPH)>=0){
banners.splice(i,1);
graphBanners.push(banner);
}
}
}

graphBanners.reverse();
var graphSection=feed.banners.graph;
if(!graphSection||!graphSection.length){
feed.banners.graph=graphBanners;
}else{
graphSection.push.apply(
graphSection,graphBanners
);
}
};

return function(){
var feed=window.begunAds;

if(!feed){
Begun.Error.send(
'Attempted to load an undefined feed.',
document.URL,-1
);
return null;
}

normalize(feed);

this.links_parsed=false;

this.Callbacks.dispatch('feed','load',this,[feed]);

var feedParams=feed.params||{},
isExtraBlock=false,
block,options,banner,i;

var replaceBlockTypeRich=function(options){
if(options.dimensions.type.toLowerCase()=='rich'){
options.dimensions.type='240x400';
if(typeof options.view_type=='string'&&options.view_type.length>0){
options.view_type+=',rich';
}else{
options.view_type='rich';
}
}
};

for(i=0;feed.blocks&&i<feed.blocks.length;i++){
block=feed.blocks[i];
options=block.options;

if(block){
block.setVisualOptions=extendVisualOptions;

if(
options&&
typeof block.options.json=="object"&&
typeof block.options.json.banner_components=="object"
){
setBlockBannerComponents.call(block,block.options.json.banner_components);
}

block.setBannerComponents=setBlockBannerComponents;
block.setThumbOptions=setThumbParams;
_this.initFilledBannersData(block);

if(
options&&
options.dimensions&&
options.dimensions.type
){
replaceBlockTypeRich(options);
ExtBlockTypes.load("begun_tpl_block_"+options.dimensions.type);
}

if(this.isFakeBlockId(block.id)&&window.begun_block_id==block.id){
block.id=this.lastBlockId;
isExtraBlock=true;
}
}
}

if(isExtraBlock){
for(var bannersType in feed.banners){
for(i=0;i<feed.banners[bannersType].length;i++){
banner=feed.banners[bannersType][i];
if(banner.block_id==window.begun_block_id){
banner.block_id=this.lastBlockId;
}
}
}
window.begun_block_id=this.lastBlockId;
}

if(
window.begun_extra_block&&
window.begun_extra_block.options&&
window.begun_extra_block.options.dimensions&&
window.begun_extra_block.options.dimensions.type
){
replaceBlockTypeRich(window.begun_extra_block.options);
ExtBlockTypes.load("begun_tpl_block_"+window.begun_extra_block.options.dimensions.type);
}

if("string"===typeof feedParams.add_integrations){
var addIntegrations=feedParams.add_integrations.replace(/\s+/g,"");
if(addIntegrations){
includeIntegrationScripts(addIntegrations.split(","));
}
}

if(null==arguments.callee.altergeoIncluded&&feedParams.altergeo_needed){
arguments.callee.altergeoIncluded=Begun.Utils.includeScript(
_this.Strings.urls.alter_geo_script,
'append'
);
}

if(typeof Begun.Browser!='undefined'){
Begun.Browser.getUaType=function(){
return feedParams.is_mobile||0;
};
}

if(feedParams.tns_counter){
if(typeof Begun.tns_counters=='undefined'){
Begun.tns_counters=[];
}

var counters=String(feedParams.tns_counter).split(',');
Begun.Utils.forEach(counters,function(counter){
if(!Begun.Utils.in_array(Begun.tns_counters,counter)){
var included=_this.Monitor.sendJSON(
{
"page_id":Begun.pageId,
"tns_counter_flag":counter
},
_this.Strings.urls.tns_text_counter
);
if(included){
Begun.tns_counters.push(counter);
}
}
},this);
}


this.excludeFakeBanners(feed,'graph');
this.excludeFakeBanners(feed,'autocontext');


loadToolbar(feed);


this.setFeed(feed);

Begun.extend(_this.responseParams,_this.getFeed()&&_this.getFeed().params||{});
if(!_this.renderOldBlock()){
_this.getLoadingStrategy().parseFeed();

var visualOptions,j;

for(i=0;i<FAKE_BLOCKS.length;i++){
block=_this.Blocks.getBlockById(FAKE_BLOCKS[i]);
if(block){
if(FAKE_BLOCKS[i]==BLOCK_ID_TOP_MOBILE){
for(j=0;j<_this.getBlocks().length;j++){
if(!Begun.Utils.in_array(FAKE_BLOCKS,_this.getBlocks()[j].id)){
visualOptions={};
Begun.extend(visualOptions,_this.getBlocks()[j].options.visual,true);
Begun.extend(visualOptions,block.options.visual,true);
block.options.visual=visualOptions;
if(block.options.visual.block&&block.options.visual.block.backgroundColor.toLowerCase()=='transparent'){
block.options.visual.block.backgroundColor='#FFF';
block.options.visual.block_hover.backgroundColor='#FFF';
block.options.visual.title.color='#0066DF';
}
break;
}
}
}
_this.insertNonTextBlock(block);
}
}
_this.draw();
}
};
}(this));

this.printBlockPlace=function(block_id){
var vars={id:_this.Strings.css.block_prefix+block_id};
var tmpl=_this.Tpls.getHTML('blck_place');

if(document.body){
document.write((new Begun.Template(tmpl)).evaluate(vars));
}else{
document.write("<body>"+(new Begun.Template(tmpl)).evaluate(vars)+"</body>");
}
};
this.printDefaultStyle=function(){
Begun.Utils.includeStyle(_this.Tpls.getCSS('default'),'write');
};
var getBGColor=function(block){
var bgcolor=Begun.Utils.getStyle(block,'background-color');
while(bgcolor=='transparent'){
if(block.nodeName=='BODY'){
var body_bg=Begun.Utils.getStyle(block,'background-color');
if(body_bg=='transparent'){
bgcolor='#FFFFFF';
}else{
bgcolor=Begun.Utils.getStyle(block,'background-color');
}
break;
}
block=block.parentNode;
bgcolor=Begun.Utils.getStyle(block,'background-color');
}
return bgcolor;
};
this.getLogoColor=function(styles,block_id){
var default_logo_color=_this.Strings.css.logo_color;
var channels;
var r;
var g;
var b;
var ok;
if(styles.block){
var is_logo_transparent=false;
if((styles.block.backgroundColor&&styles.block.backgroundColor.toLowerCase()=='transparent')||!styles.block.backgroundColor){
var block=_this.Blocks.getDomObj(block_id);
var toNumbers=function(str){
var ret=[];
str.replace(/(..)/g,function(str){
ret.push(parseInt(str,16));
});
return ret;
};
var areColorsTooClose=function(c1,c2,delta){
for(var i=0;i<arguments.length;i++){
if(0==arguments[i].indexOf('#')){
arguments[i]=toNumbers(arguments[i].slice(1));
}else{
return false;
}
}
delta=delta||100;
return(Math.sqrt((c1[0]-c2[0])*(c1[0]-c2[0])+(c1[1]-c2[1])*(c1[1]-c2[1])+(c1[2]-c2[2])*(c1[2]-c2[2]))<delta);
};
var convertColor=function(color_string){
if(color_string.charAt(0)=='#'){
color_string=color_string.substr(1,6);
}
color_string=color_string.replace(/ /g,'');
color_string=color_string.toLowerCase();
var simple_colors={aliceblue:'f0f8ff',antiquewhite:'faebd7',aqua:'00ffff',aquamarine:'7fffd4',azure:'f0ffff',beige:'f5f5dc',bisque:'ffe4c4',black:'000000',blanchedalmond:'ffebcd',blue:'0000ff',blueviolet:'8a2be2',brown:'a52a2a',burlywood:'deb887',cadetblue:'5f9ea0',chartreuse:'7fff00',chocolate:'d2691e',coral:'ff7f50',cornflowerblue:'6495ed',cornsilk:'fff8dc',crimson:'dc143c',cyan:'00ffff',darkblue:'00008b',darkcyan:'008b8b',darkgoldenrod:'b8860b',darkgray:'a9a9a9',darkgreen:'006400',darkkhaki:'bdb76b',darkmagenta:'8b008b',darkolivegreen:'556b2f',darkorange:'ff8c00',darkorchid:'9932cc',darkred:'8b0000',darksalmon:'e9967a',darkseagreen:'8fbc8f',darkslateblue:'483d8b',darkslategray:'2f4f4f',darkturquoise:'00ced1',darkviolet:'9400d3',deeppink:'ff1493',deepskyblue:'00bfff',dimgray:'696969',dodgerblue:'1e90ff',feldspar:'d19275',firebrick:'b22222',floralwhite:'fffaf0',forestgreen:'228b22',fuchsia:'ff00ff',gainsboro:'dcdcdc',ghostwhite:'f8f8ff',gold:'ffd700',goldenrod:'daa520',gray:'808080',green:'008000',greenyellow:'adff2f',honeydew:'f0fff0',hotpink:'ff69b4',indianred:'cd5c5c',indigo:'4b0082',ivory:'fffff0',khaki:'f0e68c',lavender:'e6e6fa',lavenderblush:'fff0f5',lawngreen:'7cfc00',lemonchiffon:'fffacd',lightblue:'add8e6',lightcoral:'f08080',lightcyan:'e0ffff',lightgoldenrodyellow:'fafad2',lightgrey:'d3d3d3',lightgreen:'90ee90',lightpink:'ffb6c1',lightsalmon:'ffa07a',lightseagreen:'20b2aa',lightskyblue:'87cefa',lightslateblue:'8470ff',lightslategray:'778899',lightsteelblue:'b0c4de',lightyellow:'ffffe0',lime:'00ff00',limegreen:'32cd32',linen:'faf0e6',magenta:'ff00ff',maroon:'800000',mediumaquamarine:'66cdaa',mediumblue:'0000cd',mediumorchid:'ba55d3',mediumpurple:'9370d8',mediumseagreen:'3cb371',mediumslateblue:'7b68ee',mediumspringgreen:'00fa9a',mediumturquoise:'48d1cc',mediumvioletred:'c71585',midnightblue:'191970',mintcream:'f5fffa',mistyrose:'ffe4e1',moccasin:'ffe4b5',navajowhite:'ffdead',navy:'000080',oldlace:'fdf5e6',olive:'808000',olivedrab:'6b8e23',orange:'ffa500',orangered:'ff4500',orchid:'da70d6',palegoldenrod:'eee8aa',palegreen:'98fb98',paleturquoise:'afeeee',palevioletred:'d87093',papayawhip:'ffefd5',peachpuff:'ffdab9',peru:'cd853f',pink:'ffc0cb',plum:'dda0dd',powderblue:'b0e0e6',purple:'800080',red:'ff0000',rosybrown:'bc8f8f',royalblue:'4169e1',saddlebrown:'8b4513',salmon:'fa8072',sandybrown:'f4a460',seagreen:'2e8b57',seashell:'fff5ee',sienna:'a0522d',silver:'c0c0c0',skyblue:'87ceeb',slateblue:'6a5acd',slategray:'708090',snow:'fffafa',springgreen:'00ff7f',steelblue:'4682b4',tan:'d2b48c',teal:'008080',thistle:'d8bfd8',tomato:'ff6347',turquoise:'40e0d0',violet:'ee82ee',violetred:'d02090',wheat:'f5deb3',white:'ffffff',whitesmoke:'f5f5f5',yellow:'ffff00',yellowgreen:'9acd32'};
for(var key in simple_colors){
if(color_string==key){
color_string=simple_colors[key];
}
}
var color_defs=[
{
re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
example:['rgb(123, 234, 45)','rgb(255,234,245)'],
process:function(bits){
return[
parseInt(bits[1]),
parseInt(bits[2]),
parseInt(bits[3])
];
}
},
{
re:/^(\w{2})(\w{2})(\w{2})$/,
example:['#00ff00','336699'],
process:function(bits){
return[
parseInt(bits[1],16),
parseInt(bits[2],16),
parseInt(bits[3],16)
];
}
},
{
re:/^(\w{1})(\w{1})(\w{1})$/,
example:['#fb0','f0f'],
process:function(bits){
return[
parseInt(bits[1]+bits[1],16),
parseInt(bits[2]+bits[2],16),
parseInt(bits[3]+bits[3],16)
];
}
}
];
for(var i=0;i<color_defs.length;i++){
var re=color_defs[i].re;
var processor=color_defs[i].process;
var bits=re.exec(color_string);
if(bits){
channels=processor(bits);
r=channels[0];
g=channels[1];
b=channels[2];
ok=true;
}
}
r=(r<0||isNaN(r))?0:((r>255)?255:r);
g=(g<0||isNaN(g))?0:((g>255)?255:g);
b=(b<0||isNaN(b))?0:((b>255)?255:b);

var r=r.toString(16);
var g=g.toString(16);
var b=b.toString(16);
if(r.length==1){
r='0'+r;
}
if(g.length==1){
g='0'+g;
}
if(b.length==1){
b='0'+b;
}
return'#'+r+g+b;
};

var getRealBG=function(bgcolor){
var temp_stub=document.createElement('div');
temp_stub.style.height='0';
temp_stub.style.overflow='hidden';
temp_stub.style.backgroundColor=bgcolor;
document.body.appendChild(temp_stub);
var real_color=Begun.Utils.getStyle(temp_stub,'background-color');
temp_stub.parentNode.removeChild(temp_stub);
return real_color;
};
var bgcolor=getBGColor(block);
var temp_logo_color=getRealBG(styles.block.borderColor);
bgcolor=getRealBG(bgcolor);

bgcolor=convertColor(bgcolor);
temp_logo_color=convertColor(temp_logo_color);

if(bgcolor==temp_logo_color||areColorsTooClose(bgcolor,temp_logo_color)){
is_logo_transparent=true;
}
}
var is_default_color=((!styles.block.borderColor||styles.block.borderColor.toLowerCase()=='transparent')||(typeof styles.block.backgroundColor!=="undefined"&&typeof styles.block.borderColor!=="undefined"&&styles.block.backgroundColor.toLowerCase()==styles.block.borderColor.toLowerCase()));
return(is_default_color||is_logo_transparent)?default_logo_color:styles.block.borderColor;
}else{
return default_logo_color;
}
};
var prepareColorStyles=function(styles){
var checkColorDef=function(obj,prop){
if(obj!==null&&typeof obj!=="undefined"){
if(obj[prop]===""){
obj[prop]="transparent";
}
}
}

var checkBgColor=function(obj){
checkColorDef(obj,"backgroundColor");
}

var checkBorderColor=function(obj){
checkColorDef(obj,"borderColor");
}

var mkTransparentBordersForIE=function(obj){
if(obj!==null&&typeof obj!=="undefined"){
obj.filter="font-family:inherit;";
if(Begun.Browser.IE&&Begun.Browser.less(7)&&obj.borderColor&&(obj.borderColor.toLowerCase()=='transparent'||obj.borderColor=='')){
obj.borderColor="white";
obj.filter="filter:chroma(color=white);";
obj.transparentBorders='transparentBorders';
}
}
}

checkBgColor(styles.block_hover);
checkBorderColor(styles.block_hover);

checkBgColor(styles.block);
checkBorderColor(styles.block);

mkTransparentBordersForIE(styles.block);
mkTransparentBordersForIE(styles.block_hover);
};
this.printBlockStyle=function(block_id,styles,pad){
styles=styles||{};
var vars={};
var block=_this.Blocks.getBlockById(block_id,false,pad.pad_id);
vars.block_id=block_id||-1;
vars.phone_margin_top=1;
vars.phone_margin_top=styles.domain&&styles.domain.fontSize?styles.domain.fontSize-9:1;
vars.block_logo_color=this.getLogoColor(styles,block_id);
prepareColorStyles(styles);
for(var key in styles){
if(styles[key]&&styles.hasOwnProperty&&styles.hasOwnProperty(key)){
for(var key2 in styles[key]){
if(styles[key][key2]&&styles[key].hasOwnProperty&&styles[key].hasOwnProperty(key2)){
vars[key+':'+key2]=typeof styles[key][key2]=='number'?styles[key][key2]+'px':styles[key][key2];
}
}
}
}
if((this.Blocks.checkType(block,'horizontal')||this.Blocks.checkType(block,'vertical')||
this.Blocks.checkType(block,'flat'))&&Number(this.responseParams.font_size)){
vars['title:fontSize']='18px';
vars['title:lineHeight']='18px';
vars['title:fontWeight']='normal';
vars['block:fontWeight']='normal';
vars['text:fontSize']='14px';
}
var css_text=(new Begun.Template(_this.Tpls.getCSS('block'))).evaluate(vars);
css_text+=(new Begun.Template(_this.Tpls.getCSS('block_'+block.options.dimensions.type.toLowerCase()))).evaluate(vars);
var css_text_for_ie=(new Begun.Template(_this.Tpls.getCSS('forOperaIE'))).evaluate(vars);
if(Begun.Browser.IE||Begun.Browser.Opera){
css_text+=css_text_for_ie;
}
if(block_id==BLOCK_ID_TOP_MOBILE){
Begun.Utils.includeStyle(css_text,'append','begun-block-css-'+block_id,top);
}else{
Begun.Utils.includeStyle(css_text,'append','begun-block-css-'+block_id);
}
};
this.isFeedStarted=function(){
return!!_this.getPad().feed_started;
};
this.setFeedStarted=function(){
_this.getPad().feed_started=true;
};
this.getBannerIndex=function(pad_id,section,banner_id){
if(!banner_id){
return _this.getPad(pad_id).banner_index;
}else{
section=section||'autocontext';
var banner_index=0;
var banner;
while(banner=_this.getBanner(section,banner_index,pad_id)){
if(banner.banner_id==banner_id){
return banner_index;
}
banner_index++;
}
}
};
this.setBannerIndex=function(index,pad_id){
_this.getPad(pad_id).banner_index=index;
};
this.incBannerIndex=function(pad_id){
_this.setBannerIndex(_this.getBannerIndex(pad_id)+1,pad_id);
};
this.resetBannerIndex=function(pad_id){
_this.setBannerIndex(0,pad_id);
};
this.registerShownBanner=function(shownBanner){
var bannerId=shownBanner&&shownBanner.banner_id;
if(!bannerId){
return;
}
if(!_this.banners){
_this.banners=[bannerId];
}else{
_this.banners.push(bannerId);
}
};
this.getShownBanners=function(){
return _this.banners;
};
this.getPad=function(pad_id){
return _this.Pads.getPad(pad_id||window.begun_auto_pad);
};

this.getFeed=function(pad_id){
var pad=_this.getPad(pad_id);
if(pad){
return pad.feed;
}
};

this.setFeed=function(feed,pad_id){
this.getPad(pad_id).feed=feed;
};

this.getBlock=function(index,pad){
if(typeof pad==="undefined"){
pad=_this.getPad();
}
var padBlocks=pad.blocks;
if(padBlocks.length>index){
return padBlocks[index];
}else{
return null;
}
};
this.getBlocks=function(pad_id){
var blocks=[];
if(pad_id){
blocks=_this.getPad(pad_id).blocks;
}else{
var pads=_this.Pads.getPads();
for(var i=0,l=pads.length;i<l;i++){
for(var j=0,n=pads[i].blocks.length;j<n;j++){
blocks.push(pads[i].blocks[j]);
}
}
}
return blocks;
};
this.getBanner=function(type,index,pad_id){
if(!_this.getFeed(pad_id)||typeof _this.getFeed(pad_id).banners==="undefined"||
typeof _this.getFeed(pad_id).banners[type]==="undefined"||
typeof _this.getFeed(pad_id).banners[type][index]!=="object"){
return null;
}
var banner=_this.getFeed(pad_id).banners[type][index];
banner.setImages=function(newImages){
if(typeof this.images==="undefined"){
this.images={};
}
Begun.extend(this.images,newImages);
};
banner.getThematics=function(){
var allThematics=this.thematics.split(',');
if(allThematics.length>0){
return allThematics;
}else{
return null;
}
};
return banner;
};
this.getBanners=function(pad_id){
var feed=_this.getFeed(pad_id);
return feed&&feed.banners;
};
this.getBannersByBlockId=function(block_id,type,pad_id){
var i=0;
var obj=[];
var banner=null;
while(banner=_this.getBanner(type,i,pad_id)){
if(banner.block_id==block_id){
obj[obj.length]=banner;
}
i++;
}
return obj;
};
this.getRichPictureSrc=function(banner){
var banner_id=banner.banner_id+'';
if(_this.Strings.urls.rich_picture_big&&_this.Strings.urls.rich_picture_small&&banner_id){
var small=(new Begun.Template(_this.Strings.urls.rich_picture_small)).evaluate({banner_id:banner_id});
var big=(new Begun.Template(_this.Strings.urls.rich_picture_big)).evaluate({banner_id:banner_id});
return{
small:small,
big:big
};
}
var protocol=Begun.Scripts.getConformProtocol();
var src=_this.responseParams['thumbs_src']?protocol+'//'+_this.responseParams['thumbs_src']+'/':_this.Strings.urls.thumbs;
var src_s;
var src_b;
if(banner_id&&banner_id.length>3){
src+='rich/';
src+=banner_id.charAt(banner_id.length-2);
src+='/'+banner_id.charAt(banner_id.length-1);
src+='/'+banner_id;
src_s=src+'s';
src_b=src+'b';
}else{
src_s=_this.Strings.urls.blank;
src_b=src_s;
}
if(banner.images&&banner.images.richpreview){
src_s=banner.images.richpreview;
}
if(banner.images&&banner.images.rich){
src_b=banner.images.rich;
}
return{
small:src_s,
big:src_b
};
};
this.getThumbSrc=function(banner,fake){
var protocol=Begun.Scripts.getConformProtocol();
var src=_this.responseParams['thumbs_src']?protocol+'//'+_this.responseParams['thumbs_src']+'/':_this.Strings.urls.thumbs;
var banner_id=banner.banner_id+'';
if(banner_id&&banner_id.length>3){
var bannerThematics=banner.getThematics();
var thematic=bannerThematics?(bannerThematics[0]+''):'1';
src+=banner_id.charAt(banner_id.length-2);
src+='/'+banner_id.charAt(banner_id.length-1);
src+='/'+banner_id+'.jpg';
src+='?t='+thematic+'&r='+banner_id.charAt(banner_id.length-3);
}else{
src=src+'empty.jpg';
}
if(banner.images&&banner.images.thematic){
src=banner.images.thematic;
}
if(Begun.Browser.IE&&Begun.Browser.version()<=6&&fake){
src=_this.Strings.urls.blank;
}
return src;
};
this.getFaviconSrc=function(banner){
var protocol=Begun.Scripts.getConformProtocol();
var src=_this.responseParams['thumbs_src']?protocol+'//'+_this.responseParams['thumbs_src']+'/':_this.Strings.urls.thumbs;
var banner_id=banner.banner_id+'';
if(banner_id&&banner_id.length>3){
src+='favicon/';
src+=banner_id.charAt(banner_id.length-2);
src+='/'+banner_id.charAt(banner_id.length-1);
src+='/'+banner_id+'.jpg';
}else{
src=_this.Strings.urls.blank;
}
if(banner.images&&banner.images.favicon){
src=banner.images.favicon;
}
return src;
};
this.getBannerContacts=function(banner,block,fullDomain,pad_id,section,banner_id){
var result=this.getBannerCardPPcallData(banner,block,pad_id,section,banner_id);
var banner_contacts_names=result.is_url_exist?['domain','geo']:['geo'];
return result.banner_contacts.concat(this.getBannerDomainGeoHTML(banner,block,banner_contacts_names,fullDomain));
};
this.getBannerCardPPcallData=function(banner,block,pad_id,section,banner_id){
var banner_contacts=[];
var is_url_exist=true;
var cards_mode=banner['cards_mode'];
var is_ppcall=banner['ppcall'];
var vars={};
function _card(use_phone){
var tmpl;

vars.card_text=_this.Strings.contacts.card;
vars.url=_this.addMisc2URL(block.options.misc_id,banner.card);

if(use_phone){
vars.phone=(new Begun.Template(
_this.Tpls.getHTML('bnnr_phone')
)).evaluate(vars);
tmpl='bnnr_card';
}else{
tmpl='bnnr_card_no_phone';
}

banner_contacts.push(
(new Begun.Template(
_this.Tpls.getHTML(tmpl)
)).evaluate(vars)
);
}
function _ppcall(use_phone){
vars.ppcall_text=_this.Strings.contacts.ppcall;
vars.link=banner.ppcall_form?banner.ppcall_form:'';
vars.banner_index=_this.getBannerIndex(pad_id,section,banner_id);
vars.pad_id=window.begun_auto_pad||'';
vars.phone=use_phone?(new Begun.Template(_this.Tpls.getHTML('bnnr_phone'))).evaluate(vars):'';
vars.ua_type=Begun.Browser.getUaType();
banner_contacts.push((new Begun.Template(_this.Tpls.getHTML('bnnr_ppcall'))).evaluate(vars));
}
if(cards_mode=='Card'&&is_ppcall==false){
_card(true);
is_url_exist=false;
}else if(cards_mode=='Card'&&is_ppcall==true){
_ppcall(true);
_card(false);
is_url_exist=false;
}else if(cards_mode=='Url'&&is_ppcall==false){

}else if(cards_mode=='Url'&&is_ppcall==true){
_ppcall(true);
}else if(cards_mode=='Card, Url'&&is_ppcall==false){
_card(true);
}else if(cards_mode=='Card, Url'&&is_ppcall==true){
_ppcall(true);
_card(false);
}
return{
banner_contacts:banner_contacts,
is_url_exist:is_url_exist
};
};
this.getBannerDomainGeoHTML=function(banner,block,banner_contacts_names,fullDomain){
var banner_contacts=[];
var i=0;
var banner_contacts_name=null;
var vars={};
while(banner_contacts_name=banner_contacts_names[i]){
vars[banner_contacts_name]=banner[banner_contacts_name];
vars.status=banner.status;
vars.url=_this.addMisc2URL(block.options.misc_id,banner.url);
vars.fullDomain=fullDomain;
if(vars[banner_contacts_name]){
banner_contacts.push((new Begun.Template(_this.Tpls.getHTML('bnnr_'+banner_contacts_name))).evaluate(vars));
}
i++;
}
return banner_contacts;
};
this.addMisc2URL=function(misc_id,url){
return(misc_id>0?url+'&misc2='+(Number(misc_id)<<8):url);
};
this.clickBanner=function(click_event,orig_elem){
click_event=click_event||window.event;
if(click_event.done){
return;
}
var curr_elem=click_event.target||click_event.srcElement;
var isInsideTag=function(child_elem,parent_tag){
var child_elem_parent=child_elem;
do{
if(child_elem_parent.tagName&&child_elem_parent.tagName.toUpperCase()==parent_tag.toUpperCase()){
return true;
}
}while(child_elem_parent=child_elem_parent.parentNode);
return false;
};
if(curr_elem.tagName.toUpperCase()=='A'||isInsideTag(curr_elem,'A')){
click_event.done=true;
_this.Callbacks.dispatch('banner','click',curr_elem);
if(this.isEventTrackingOn()){
_this.clickHandler(orig_elem).apply(_this);
}
}else if(orig_elem.getAttribute('_url')){
var anyLink=curr_elem.getElementsByTagName("a")[0];
if(anyLink&&typeof anyLink.click!=="undefined"){
if(typeof click_event.preventDefault!=="undefined"){
click_event.preventDefault();
}else{
click_event.returnValue=false;
}
if(typeof click_event.stopPropagation!=="undefined"){
click_event.stopPropagation();
}else{
click_event.cancelBubble=true;
}
anyLink.click();
}else{
_this.Callbacks.dispatch('banner','click',curr_elem);
if(this.isEventTrackingOn()){
_this.clickHandler(orig_elem).apply(_this);
}
window.open(orig_elem.getAttribute('_url'));
}
}
};

this.prepareBannerMode=function(banner){
if(!banner||(!banner['url']&&!banner['card'])){
return null;
}

var possible_cards_modes=['Card, Url','Card','Url'];
if(
(!banner['cards_mode'])||
!Begun.Utils.in_array(possible_cards_modes,banner['cards_mode'])
){
banner['cards_mode']='Card, Url';
}
if(!banner['url']&&banner['card']){
banner['cards_mode']='Card';
}
if(banner['url']&&!banner['card']){
banner['cards_mode']='Url';
}
if(banner['cards_mode']=='Card'){
banner['url']=banner['card'];
}
return banner;
};

this.sliderWaiters={};

this.printSliderBlock=function(block,bannerUrl,sliderParams,_){
var DEFAULT_BRAND='amag',
TYPE_PREFIX='BrandRich_';

var blockType=TYPE_PREFIX+this.Blocks.getBlockType(block),
blockDiv=this.Blocks.getDomObj(block.id),
blockId=block.id,
sliderBlockId=sliderParams.block_id;


delete this.sliderWaiters[blockId];

var callbackName='sliderLoad_'+Begun.Utils.getRandomId();

this[callbackName]=function(){
var sliderBlock;
Begun.Utils.forEach(window.begunAds.blocks,function(block){
if(block.id===sliderBlockId){
sliderBlock=block;
return false;
}
});

if(!sliderBlock){
return;
}

var v=sliderBlock.options.visual;
var css=new Begun.Template(
this.Tpls.getCSS(blockType)
).evaluate({
block_id:blockId,
title_color:v.title&&v.title.color,
hover_title_color:v.title_hover&&v.title_hover.color,
descr_color:v.text&&v.text.color,
price_color:v.domain&&v.domain.color,
bg_color:v.block&&v.block.backgroundColor,
border_color:v.block&&v.block.borderColor,
hover_bg_color:v.block_hover&&v.block_hover.backgroundColor,
hover_border_color:v.block_hover&&v.block_hover.borderColor,
base_scripts_url:this.Strings.urls.base_scripts_url,
brand:sliderParams.brand||DEFAULT_BRAND
});

Begun.Utils.includeStyle(css);

var bannersHtml=this.getSliderBanners(sliderBlock,blockType);

var blockTmpl=new Begun.Template(
this.Tpls.getHTML('block_'+blockType)
);
blockDiv.innerHTML=blockTmpl.evaluate({
block_id:blockId,
banners:bannersHtml,
url:bannerUrl,
brand:sliderParams.brand||DEFAULT_BRAND
});


var ac=this;
var interval=setInterval(function(){
if(blockDiv.clientWidth&&blockDiv.clientHeight){
clearInterval(interval);
ac.initZoomSlider(block);
}
},Begun.DOM_TIMEOUT);
};

var params=Begun.extend({},this.requestParams);
params.pad_id=sliderParams.pad_id;
params.block_id=sliderBlockId;
params.jscall=callbackName;

var feedUrl=this.Strings.urls.daemon+Begun.Utils.toQuery(params);

Begun.Utils.includeScript(feedUrl);
};

this.getSliderBanners=function(block,blockType){
var banners;
try{
banners=window.begunAds.banners.autocontext;
}catch(e){}

var bannersHtml=[],banner;
if(banners){
var len=block.options.banners_count,i=0;
while(i<len){
banner=banners[i];
if(banner&&banner.block_id===block.id){
bannersHtml.push(
this.getSliderBannerHTML(banner,blockType)
);
}
i+=1;
}
}
return bannersHtml.join('');
};

this.getSliderBannerHTML=function(banner,blockType){
var vars={

small_img_src:banner.images.rich,
big_img_src:banner.images.rich,
title:banner.title,
descr:banner.descr,
price:banner.domain,
url:banner.url
};

var bannerType='banner_'+blockType;

return new Begun.Template(
this.Tpls.getHTML(bannerType)
).evaluate(vars);
};

this.getBannerHTML=function(banner,block,block_banner_count){
banner=this.prepareBannerMode(banner);

if(!banner){
return'';
}

if(banner.domain){
banner.domain=banner.domain.replace(/[<]wbr[>]/ig,'');
banner.fullDomain=banner.domain;
banner.status='http://'+banner.domain+'/';
banner.domain=Begun.Utils.unescapeTruncateDomain(banner.domain);
}else{
banner.fullDomain=banner.domain=banner.status='';
}
banner.domain=banner.domain.replace(/\./g,'.<wbr>');
banner.title=banner.title.replace(/\,/g,',<wbr>');
banner.title=banner.title.replace(/-<(i|b)>/g,'-<wbr><$1>');
var banner_contacts=_this.getBannerContacts(banner,block,banner.fullDomain);
var vars={};
Begun.extend(vars,banner);
vars.styleTitle=vars.styleText=vars.styleContact="";
if(block.options.visual.title&&block.options.visual.title.display&&block.options.visual.title.display=="none"){
vars.styleTitle=" style=\"display: none\"";
}
if(block.options.visual.text&&block.options.visual.text.display&&block.options.visual.text.display=="none"){
vars.styleText=" style=\"display: none\"";
}
if(block.options.visual.contact&&block.options.visual.contact.display&&block.options.visual.contact.display=="none"){
vars.styleContact=" style=\"display: none\"";
}
vars.url=_this.addMisc2URL(block.options.misc_id,banner.url);
vars.cross=_this.isTurnOff(block)?_this.Tpls.getHTML('bnnr_close'):'';
vars.onclick=_this.isTurnOff(block)?'':_this.Strings.js.banner_onclick;
vars.block_id=block.id;
vars.banner_id=banner.banner_id;
vars.id=block_banner_count||0;
vars.descr=vars.descr.replace(/(\,|\.|\?|\!|\:)(\S\D)/g,'$1 $2');
vars.descr=vars.descr.replace(/-<(i|b)>/g,'-<wbr><$1>');
vars.banner_width=Math.round(100/Number(_this.getActualBlockBannersCount(block)))+'%';
if(_this.Blocks.checkType(block,'square')&&block.options.json&&block.options.json.col){
vars.banner_width=Math.round(100/Number(block.options.json.col))+'%';
}
vars.bnnr_warn=_this.warningModule.getType(banner)?(new Begun.Template(_this.Tpls.getHTML('bnnr_warn_attn'))).evaluate({}):'';
var is_use_rich='';

vars.css_favicon=Number(block.options.show_favicons)?_this.Strings.css.favicon:'';
vars.favicon=Number(block.options.show_favicons)&&!_this.isMobileBottomBlock(block.id)?'style="zoom:1;background-image:url('+_this.getFaviconSrc(banner)+') !important;background-repeat:no-repeat !important;"':'';
vars.thumb='';
vars.picture='';
var getThumbAdditionalStyles=function(){
var DEFAULT_STYLE="";
if(!block.options.visual.thumbStyles){
return DEFAULT_STYLE;
}
var styleString=" ";
for(visualParam in block.options.visual.thumbStyles){
if(block.options.visual.thumbStyles.hasOwnProperty(visualParam)){
styleString+=visualParam+":"+block.options.visual.thumbStyles[visualParam]+" !important;";
}
}
if(styleString===""){
styleString=DEFAULT_STYLE;
}
return styleString;
};
if(!vars.favicon){
if(
_this.checkBannerViewType(banner,'rich')||
_this.checkBannerViewType(banner,'pseudorich')||
_this.isRichExpanded(block)
){
var pictures=_this.getRichPictureSrc(banner);
vars.picture=(new Begun.Template(_this.Tpls.getHTML('bnnr_picture'))).evaluate({src:_this.isRichExpanded(block)?pictures.big:pictures.small,big_photo_src:pictures.big,url:banner.url});

is_use_rich='_rich';
if(_this.isRichExpanded(block)){
is_use_rich+='_exp';
}else if(_this.isRichMini(block)){
is_use_rich+='_mini';
}
}else{
vars.thumb=Number(block.options.show_thumbnails)?(new Begun.Template(_this.Tpls.getHTML('bnnr_thumb'))).evaluate({
url:banner.url,
src:_this.getThumbSrc(banner,true),
bgcolor:_this.Thumbs.getType()=='classic'?((typeof block.options.visual.thumb!='undefined')?block.options.visual.thumb.backgroundColor:_this.Strings.css.thumb_def_color):'transparent',
width:_this.Thumbs.getDimentions(_this.Thumbs.getType()).width,
height:_this.Thumbs.getDimentions(_this.Thumbs.getType()).height,
pngfix:(Begun.Browser.IE&&Begun.Browser.version()<=6)?'style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''+_this.getThumbSrc(banner,false)+'\', sizingMethod=\'image\');"':'',
additionalStyles:getThumbAdditionalStyles(),
mouse_events:_this.Thumbs.getType()=='classic'?'onmouseover="this.style.background = \''+((typeof block.options.visual.thumb_hover!='undefined')?block.options.visual.thumb_hover.backgroundColor:_this.Strings.css.thumb_def_color_hover)+'\'" onmouseout="this.style.background = \''+((typeof block.options.visual.thumb!='undefined')?block.options.visual.thumb.backgroundColor:_this.Strings.css.thumb_def_color)+'\'"':''
}):'';
vars.picture=vars.thumb;
}
}

if(_this.isRichMini(block)){
vars.contact='';
}else{
vars.contact=banner_contacts.join(_this.Tpls.getHTML('bnnr_glue'));
}

var is_use_accordion=Number(block.options.use_accordion)?'_use_accordion':'';

var bannerType='banner_'+
block.options.dimensions.type.toLowerCase()+
is_use_rich+
is_use_accordion;

return(new Begun.Template(
_this.Tpls.getHTML(bannerType)
)).evaluate(vars);
};

this.checkBannerViewType=function(banner,viewtype){
return Begun.Utils.inList(banner.view_type,viewtype);
};

this.addBannerViewType=function(banner,viewtype){
if(!this.checkBannerViewType(banner,viewtype)){
banner.view_type+=(banner.view_type?',':'')+viewtype;
}
};
this.removeBannerViewType=function(banner,viewtype){
if(this.checkBannerViewType(banner,viewtype)){
var reg=new RegExp('(,?\\s?|^)'+viewtype+'(,?\\s?|$)');
banner.view_type=banner.view_type.replace(reg,',');
}
};

this.bannersContainViewType=function(view_type,pad_id,section,block_id){
if(null==section){
section='autocontext';
}

var banners;

if(null==block_id){
banners=this.getBanners(pad_id);

if(banners){
banners=banners[section];
}
}else{
banners=this.getBannersByBlockId(block_id,section,pad_id);
}

return Begun.Utils.in_array(
banners,
function(item){
return this.checkBannerViewType(item,view_type);
},
this
);
};

this.getTableWithAds=function(blockId){
var getSingleTable=function(id){
var element=_this.Blocks.getDomObj(id);
if(!element){
return undefined;
}
var tables=element.getElementsByTagName("table");
for(var i=0;i<tables.length;i++){
if(tables[i].className&&tables[i].className.indexOf("begun_adv_table")>-1){
return tables[i];
}
}
return undefined;
};
switch(typeof blockId){
case"number":
case"string":
return getSingleTable(blockId);
default:
var blocks=_this.getBlocks();
var res=[];
for(var i=0;i<blocks.length;i++){
var tbl=getSingleTable(blocks[i].id);
if(tbl){
res.push(tbl);
}
}
return(res.length>0?res:undefined);
}
};

this.updateUrlParamInTd=(function(){
var updateParamInLink=function(td,link,param,value){
var hrefText=link.getAttribute('href');

if(hrefText.indexOf('http://')==-1&&hrefText.indexOf('https://')==-1){
return false;
}

var newHref='';

if(hrefText.indexOf('?')===-1){
hrefText=hrefText+'?addingParams';
}

if(hrefText.indexOf('&'+param+'=')===-1){
newHref=hrefText+'&'+param+'='+value;
}else{
var firstPosition=hrefText.indexOf('&'+param+'=')+param.length+1,
lastPosition=hrefText.indexOf('&',firstPosition+1);

if(lastPosition===-1){
newHref=hrefText.substring(0,firstPosition+1)+value;
}else{
newHref=hrefText.substring(0,firstPosition+1)+value+hrefText.slice(lastPosition);
}
}


var linkText=firstText(link);

if(null==linkText){
linkText='';
}

link.setAttribute('href',newHref);


firstText(link,linkText);

td.setAttribute('_url',newHref);
};

var firstText=function(el,txt){
var fc=el.firstChild;


if(fc&&3===fc.nodeType){
if(null==txt){
return fc.nodeValue;
}else{
fc.nodeValue=txt;
}
}
};

return function(td,param,value){
var linksInTd=td.getElementsByTagName('a');
for(var i=0,len=linksInTd.length;i<len;i++){
updateParamInLink(td,linksInTd[i],param,value);
}
};
}());

this.getBlockHTML=function(banners_html_arr,block,pad){
if(!banners_html_arr){
return'';
}
var banners_html=banners_html_arr.join('');
var logo_display='';
if(block.options&&(typeof block.options.json!='undefined')&&(typeof block.options.json.logo!='undefined')){
logo_display=(Number(block.options.json.logo))?'':'none';
}
var extended_block_class='';
if(logo_display=='none'){
extended_block_class='begun_extended_block';
}

var rich_nopics_class='';

if((_this.Blocks.checkViewType(block,'rich')||_this.Blocks.checkViewType(block,'pseudorich'))&&block.options.show_favicons!=1){
var elem=_this.Blocks.getDomObj(block.id);
if(elem){
Begun.Utils.addClassName(elem,'begun_auto_rich');

if(_this.isRichMini(block)){
Begun.Utils.addClassName(elem,'begun_rich_mini');
}
}
if(!_this.bannersContainViewType('rich',pad.pad_id,null,block.id)&&!_this.bannersContainViewType('pseudorich',pad.pad_id,null,block.id)){
rich_nopics_class=' begun_rich_nopics';
}
}

var vars={};
var block_hover_html='';
var block_opts=block.options.visual||{};
if(block_opts.block&&block_opts.block_hover&&block_opts.block_hover.backgroundColor&&block_opts.block_hover.borderColor){
vars.bgcolor_over=block_opts.block_hover.backgroundColor;
vars.brdcolor_over=block_opts.block_hover.borderColor;
vars.bgcolor_out=block_opts.block.backgroundColor||'transparent';
vars.brdcolor_out=block_opts.block.borderColor||'transparent';
vars.block_id=block.id;
block_hover_html=(new Begun.Template(_this.Tpls.getHTML('blck_hover'))).evaluate(vars);
}
var pad_id=pad.pad_id;

vars={
block_id:block.id,
block_hover:block_hover_html,
banners:banners_html,
banners_count:banners_html_arr.length,

scroll_div_id:_this.Strings.css.scroll_div_prefix+block.id,
scroll_table_id:_this.Strings.css.scroll_table_prefix+block.id,
block_width:Number(block.options.dimensions.width)?Number(block.options.dimensions.width)+'px':'',
block_scroll_class:Number(block.options.use_scroll)?_this.Strings.css.scroll:'',
begun_url:_this.Strings.urls.begun,
css_thumbnails:(Number(block.options.show_thumbnails)&&!Number(block.options.show_favicons)?_this.Strings.css.thumb+' '+(_this.Thumbs.getType()=='classic'?_this.Strings.css.thumb_classic:_this.Strings.css.thumb_default):'')+rich_nopics_class,
logo_display:logo_display,
close_button:_this.getCloseButton(block.id),
extended_block_class:extended_block_class,
block_warn:block.warning_type?(new Begun.Template(_this.Tpls.getHTML('block_warn'))).evaluate({"text":_this.warningModule.getText(block.warning_type),"type":block.warning_type}):'',
begun_warn_id:block.warning_type?_this.Strings.css.warn_prefix+block.id:'',
transparent_borders_class:(block_opts&&((block_opts.block&&block_opts.block.transparentBorders)||(block_opts.block_hover&&block_opts.block_hover.transparentBorders)))?'transparentBorders':'',
fix_layout:(Begun.Browser.IE&&Begun.Browser.version()<8&&document.compatMode&&document.compatMode=="CSS1Compat"&&_this.Blocks.isBlockFixed(block))?_this.Strings.css.fix_layout:''
};
var block_type=block.options.dimensions.type.toLowerCase();
if(Number(block.options.use_accordion)){
block_type+='_use_accordion';
}

var tmpl=_this.Tpls.getHTML('block_'+block_type);
return(new Begun.Template(tmpl)).evaluate(vars);
};

this.clickHandler=function(targetTd){
return function(){
var nowTime=(new Date).valueOf();
this.updateUrlParamInTd(targetTd,"click_time",nowTime);
this.updateUrlParamInTd(targetTd,"frame_level",_this.requestParams.frm_level);
};
};
this.printBlock=function(banners_html,block,pad){
if(_this.isOldBlock()){
return;
}
if(banners_html.length){
var regEvents=function(){
if(!_this.isEventTrackingOn()){
return undefined;
}
var mouseOverHandler=function(targetTd){
return function(e){
if(!e){
var e=window.event;
}
var relTarget=e.relatedTarget||e.fromElement;
if(relTarget===targetTd){
return;
}
var tdElements=targetTd.getElementsByTagName("*");
for(var i=0;i<tdElements.length;i++){
if(tdElements[i]===relTarget){
return;
}
}
if(!arguments.callee.count){
arguments.callee.count=1;
}
var nowTime=(new Date).valueOf();
_this.updateUrlParamInTd(targetTd,"mouseover_time",nowTime);
_this.updateUrlParamInTd(targetTd,"mouseover_count",arguments.callee.count++);
};
};
var mouseDownHandler=function(targetTd){
return function(){
var nowTime=(new Date).valueOf();
_this.updateUrlParamInTd(targetTd,"mousedown_time",nowTime);
};
};
var tds=_this.getTableWithAds(block.id).getElementsByTagName("td");
var showTime=(new Date).valueOf();
for(var i=0;i<tds.length;i++){
_this.updateUrlParamInTd(tds[i],"show_time",showTime);
Begun.Utils.addEvent(tds[i],"mouseover",mouseOverHandler(tds[i]));
Begun.Utils.addEvent(tds[i],"mousedown",mouseDownHandler(tds[i]));
}
};
var elem=_this.Blocks.getDomObj(block.id);


if(!elem){
return false;
}
this.setExtraBlockResponseParams(block);
_this.dom_change=true;
var html=_this.getBlockHTML(banners_html,block,pad),
show,showDefault;

show=showDefault=function(elem,html){
elem.innerHTML=html;
_this.dom_change=false;
regEvents();
};


if(Begun.Browser.IE){
show=function(elem,html){
var n=elem.cloneNode(true);
n.innerHTML=html;
elem.parentNode.insertBefore(n,elem);
elem.parentNode.removeChild(elem);
_this.dom_change=false;
regEvents();
};
var appendTableCell=function(tr,elem){
if(tr.offsetHeight){
var td=document.createElement('td');
tr.appendChild(td);
td.innerHTML=elem.outerHTML;
show(td.firstChild,html);
elem.parentNode.removeChild(elem);
}else{
var func=arguments.callee;
window.setTimeout(function(){
func(tr,elem);
},Begun.DOM_TIMEOUT);
}
};
var parent=null;
if((parent=elem.parentNode)&&(parent.tagName)&&(Begun.Utils.in_array(['ol','ul','li'],parent.tagName.toLowerCase()))){
window.setTimeout(function(){
var parent2=parent.parentNode;
parent2.insertBefore(elem,parent);
showDefault(elem,html);
},Begun.DOM_TIMEOUT);
}else if((parent)&&(parent=elem.parentNode.parentNode)&&(parent.tagName)){
try{
show(elem,html);
}catch(e){
switch(parent.tagName.toLowerCase()){
case'table':
var tr=document.createElement('tr');
window.setTimeout(function(){
parent.lastChild.appendChild(tr);
appendTableCell(tr,elem);
},Begun.DOM_TIMEOUT);
break;
case'tr':
window.setTimeout(function(){
appendTableCell(parent,elem);
},Begun.DOM_TIMEOUT);
break;
case'thead':
case'tbody':
case'tfoot':
var tr=document.createElement('tr');
window.setTimeout(function(){
parent.appendChild(tr);
appendTableCell(tr,elem);
},Begun.DOM_TIMEOUT);
break;
default:
_this.dom_change=false;
}
}
}else{
try{
show(elem,html);
}catch(e){
_this.dom_change=false;
}
}
}else{
show(elem,html);
}
return true;
}else{
return false;
}
};
this.hideBlock=function(block_id){
var elem=_this.Blocks.getDomObj(block_id);
if(elem){
elem.innerHTML='';
}
};
this.dispatchBlockDrawCallback=function(block){
if(block&&!block.drawCallbackDispatched){
_this.Callbacks.dispatch('block','draw',_this,[block]);
block.drawCallbackDispatched=true;
this.Monitor.prepare()&&this.Monitor.count();
}
};

this.fillBlocks=(function(_this){
var repeat=function(fn){
Begun.Utils.repeat(fn,Begun.DOM_TIMEOUT);
};

var initAutoCatalog=function(block){
repeat(function(){
var css=_this.Strings.css;

if(
!_this.dom_change&&
Begun.Catalog&&
Begun.$(css.catalog_search_wrapper)&&
Begun.$(css.catalog_results_wrapper)&&
Begun.$(css.catalog_cloud_wrapper)
){
_this.initAutoCatalogBlock(block);
return true;
}
});
};

var initHypercontext=function(block,pad_id){
repeat(function(){
if(!_this.dom_change&&Begun.Hypercontext){
_this.initHypercontextBlock(block,pad_id);
return true;
}
});
};

var initPhotocontext=function(block,pad_id){
repeat(function fn(){
if(!_this.dom_change&&Begun.Photocontext){
_this.initPhotocontextBlock(block,pad_id);
return true;
}
});
};

var isValidSquareBlock=function(block){
return(
_this.Blocks.checkType(block,'square')&&
block.options.json&&
block.options.json.row&&
block.options.json.col
);
};

var addHTML=function(block,banner,banners_html,block_banner_count){
banner&&_this.Banners.infoValues.setAll(
banner.block_id,banner
);

block.warning_type=block.warning_type||
_this.warningModule.getType(banner);

var banner_html=_this.getBannerHTML(
banner,block,(block_banner_count+1)
);

if(isValidSquareBlock(block)){
if(!(block_banner_count%block.options.json.col)){
banner_html='<tr>'+banner_html;
}

if(!((block_banner_count+1)%block.options.json.col)){
banner_html+='</tr>';
}
}

if(banner_html){
banners_html.push(banner_html);

block.filled_banners_data.text++;

_this.Callbacks.dispatch(
'banner','draw',_this,[banner]
);

_this.registerShownBanner(banner);
}
};

var fillBlocks=function(){
var pad=this.getPad(),
pad_id=pad.pad_id,
block_index=0,
out_of_banners=false,
block;
var loadFakeBanners=function(id){
var bannerId=_this.Banners.infoValues.get(id,'fake','id');
if(bannerId){
var srcUrl=_this.Banners.infoValues.get(id,bannerId,'source');
if(srcUrl){
Begun.Utils.includeImage(srcUrl);
}
}
};

if(!fillBlocks.blocksHandled){
fillBlocks.blocksHandled=[];
}

while(
!out_of_banners&&
(block=this.getBlock(block_index,pad))
){
loadFakeBanners(block.id);
if(!this.Blocks.getDomObj(block.id)){
block_index++;

continue;
}

if(!Begun.Utils.in_array(fillBlocks.blocksHandled,block)){
this.Callbacks.dispatch(
'block','predraw',this,[block]
);

if(block.options&&block.options.visual){
this.printBlockStyle(
block.id,block.options.visual,pad
);
}

fillBlocks.blocksHandled.push(block);
}

if(block.loaded||this.Blocks.isDeleted(block)){
block_index++;

continue;
}else if(block.nonTextBannersInserted){
this.dispatchBlockDrawCallback(block);
block_index++;

continue;
}else if(Begun.Utils.inList(
block.options&&block.options.block_options,
'JSCatalog'
)){
initAutoCatalog(block);
block.loaded=true;
block_index++;

continue;
}else if(this.Blocks.checkType(block,'hyper')){
initHypercontext(block,pad_id);
block.loaded=true;
block_index++;

continue;
}else if(this.Blocks.checkType(block,'photo')){
initPhotocontext(block,pad_id);
block.loaded=true;
block_index++;

continue;
}

var banners_html=[],
block_banner_count=0,
banner;

this.setExtraBlockResponseParams(block);

if(
block.options.use_scroll*1&&
(block.options.use_accordion*1||
this.Blocks.checkType(block,'top')||
this.Blocks.checkViewType(block,'rich'))
){
block.options.use_scroll=0;
}

var banners_count,banner_html;

if(this.useBlockIdDistr()){
var i=0;

banners_count=this.getActualBlockBannersCount(block);

while(banner=this.getBanner(
'autocontext',i,pad_id
)){
this.Callbacks.dispatch(
'banner','predraw',this,[banner]
);

if(
banner.block_id&&
!banner.disabled&&
(this.lastBlockId&&
this.lastBlockId==block.id||
banner.block_id==block.id)
){
addHTML(
block,
banner,
banners_html,
block_banner_count
);

block_banner_count++;
}

i++;
}
}else{
banners_count=this.getActualBlockBannersCount(block);

while(block_banner_count<banners_count){
banner=this.getBanner(
'autocontext',
this.getBannerIndex(pad_id),
pad_id
)||null;

if(banner){
this.Callbacks.dispatch(
'banner','predraw',this,[banner]
);

addHTML(
block,
banner,
banners_html,
block_banner_count
);
}else{
out_of_banners=true;
break;
}

block_banner_count++;

this.incBannerIndex(pad_id);
}
}

if(
block_banner_count<banners_count&&
block_banner_count!=0&&
isValidSquareBlock(block)
){
while(block_banner_count<banners_count){
var banner_html='';

if(!(
block_banner_count%
block.options.json.col
)){
banner_html+='<tr>';
}

banner_html+='<td>&nbsp;</td>';

if(!(
(block_banner_count+1)%
block.options.json.col
)){
banner_html+='</tr>';
}

banners_html.push(banner_html);

block_banner_count++;
}
}

if(this.printBlock(banners_html,block,pad)){
block.loaded=true;
}

this.dispatchBlockDrawCallback(block);

Module.initInBlock(block,pad);

block_index++;
}

if(!this.links_parsed){
this.parseLinks();
this.links_parsed=true;
}
};

fillBlocks.delayedCall=false;

return fillBlocks;
})(this);

this.begunToolbarLoaded=function(){
if(!Begun.Toolbar||!Begun.Toolbar.init){
return;
}
while(this.unhandledDebugs.length>0){
Begun.Toolbar.init(this.unhandledDebugs.pop());
}
};
this.nullGlobalBlockParams=function(){
window.begun_block_id=null;
window.begun_extra_block=null;
};
this.setExtraBlockResponseParams=function(block){
block.options.use_scroll=typeof block.options.use_scroll!='number'?Number(_this.responseParams['autoscroll']):block.options.use_scroll;
block.options.show_thumbnails=typeof block.options.show_thumbnails!='number'||isNaN(block.options.show_thumbnails)?Number(_this.responseParams['thumbs']):block.options.show_thumbnails;
};
this.isMobileBottomBlock=function(block_id){
return false;

};
this.isTurnOff=function(block){
return block&&Begun.Utils.inList(block.options.block_options,'HideAd')&&!(Begun.Browser.IE&&Begun.Browser.less(7)&&!_this.Blocks.isBlockFixed(block));
};
this.isRichExpanded=function(block){
return block&&Begun.Utils.inList(block.options.block_options,'RichExpanded');
};
this.isRichMini=function(block){
if('string'===typeof block){
block=this.Blocks.getBlockById(block);
}

return block&&block.options&&Begun.Utils.inList(
block.options.block_options,'RichMini'
);
};
this.isNormalRichBanner=function(banner){
return(
banner.view_type&&
banner.view_type.toLowerCase().indexOf("rich")>-1&&
(
!banner.block_id||
!this.isRichMini(banner.block_id)
)
);
};
};

(function(Begun){
var ac=Begun.Autocontext;

ac.Monitor=new function(){
var _this=this;
this.init=function(){
var onLoad=function(){
_this.prepare()&&_this.count();
};

if(ac.domContentLoaded){
onLoad();
}else{
ac.onContent(onLoad);
}

Begun.Utils.addEvent(window,'unload',function(){
if(_this.data){
_this.sendHidden(_this.data);
}
});
Begun.Utils.addEvent(window,'scroll',function(){
_this.count();
});
Begun.Utils.addEvent(window,'resize',function(){
_this.count();
});
};

this.prepare=function(){
var pads=ac.Pads.getPads();

if(pads.length===0){
Begun.Error.send("begun_auto_pad is missing",document.URL,-1);
return;
}

for(var n=0,ln=pads.length;n<ln;n++){
for(var i=0,length=pads[n].blocks.length;i<length;i++){
var block=pads[n].blocks[i];

var dom_obj=ac.Blocks.getDomObj(block.id),
conditions=[],
kwtypes=[];

var fakeBannerId=ac.Banners.infoValues.get(block.id,'fake','id');
if(fakeBannerId){
var fakeConditionId=ac.Banners.infoValues.get(
block.id,fakeBannerId,'condition_id'
);

if(null!=fakeConditionId){
conditions.push(conditionId);
}
var fakeKwtype=ac.Banners.infoValues.get(
block.id,fakeBannerId,'kwtype'
);

if(null!=fakeKwtype){
kwtypes.push(kwtype);
}
}

if(ac.Blocks.isDeleted(block)||!dom_obj){
if(conditions.length){
block.condition_id=conditions;
block.kwtype=kwtypes;
}
continue;
}
var tds=dom_obj.getElementsByTagName('td'),
tdsLen=tds.length;

block.hidden=false;
block.dom_obj=dom_obj;

if(tdsLen){
for(var k=0;k<tdsLen;k++){
var td=tds[k],
bannerId=td.getAttribute('_banner_id');

if(bannerId){
var conditionId=ac.Banners.infoValues.get(
block.id,bannerId,'condition_id'
);

if(null!=conditionId){
conditions.push(conditionId);
}
var kwtype=ac.Banners.infoValues.get(
block.id,bannerId,'kwtype'
);

if(null!=kwtype){
kwtypes.push(kwtype);
}
}
}
}else{
var graphCondition=ac.Banners.infoValues.get(
block.id,block.banner_id,'condition_id'
);

graphCondition&&
conditions.push(graphCondition);
var graphKwtype=ac.Banners.infoValues.get(
block.id,block.banner_id,'kwtype'
);

graphKwtype&&
kwtypes.push(graphKwtype);
}

block.condition_id=conditions;
block.kwtype=kwtypes;
}
}

return true;
};

this.count=function(){
var data=[],
pads=ac.Pads.getPads(),
wSize=Begun.Utils.countWindowSize(),
wScroll=Begun.Utils.getScrollXY(),
_this=this;
var sendShowUrl=function(blockId,bannerId){
var showUrl=ac.Banners.infoValues.get(
blockId,bannerId,'show_url'
);
if(showUrl){
_this.send('',showUrl);
}
};

for(var n=0,ln=pads.length;n<ln;n++){
var padId=pads[n].pad_id;

for(var i=0,l=pads[n].blocks.length;i<l;i++){
var block=pads[n].blocks[i],
conditionIds=block.condition_id,
condLen=conditionIds&&conditionIds.length,
kwtypes=block.kwtype,
kwtypesLen=kwtypes&&kwtypes.length,
dom_obj=block.dom_obj,
k;
if(condLen&&dom_obj){
var logData=[
{block_id:block.id}
];
for(k=0;k<condLen;k++){
logData.push(
{condition_id:conditionIds[k]}
);
}
for(k=0;k<kwtypesLen;k++){
logData.push(
{kwtype:kwtypes[k]}
);
}
var fakeBannerId=ac.Banners.infoValues.get(block.id,'fake','id');
if(fakeBannerId){
var fakeCond=ac.Banners.infoValues.get(block.id,fakeBannerId,'condition_id'),
fakeKwtype=ac.Banners.infoValues.get(block.id,fakeBannerId,'kwtype');
logData.push(
{condition_id:fakeCond},
{kwtype:fakeKwtype}
);
}

if(!block.alreadySeen){
var blockVisible=this.isVisible(dom_obj,wSize,wScroll);

if(blockVisible){
block.alreadySeen=true;

sendShowUrl(block.id,block.banner_id);
if(fakeBannerId&&fakeBannerId!=block.banner_id){
sendShowUrl(block.id,fakeBannerId);
}

block.hidden=false;

this.sendVisible({
pad_id:padId,
data:logData
});

}else{
block.hidden=true;

data.push(
{pad_id:padId},
logData
);
}
}
}
}

}
this.data=data.length?data:null;
};

this.isVisible=function(dom_obj,wSize,wScroll){
var COMPULSORY_PART=2/3;
if(!dom_obj.offsetHeight){
var els=dom_obj.childNodes,
elsLen=els.length;

for(var i=0;i<elsLen;i++){
var el=els[i];

if(1===el.nodeType&&dom_obj!==el.offsetParent){
dom_obj=el;
break;
}
}
}

var pos=Begun.Utils.findPos(dom_obj),
blockHeight=dom_obj.offsetHeight;

return(pos&&(pos.top<wSize.height+wScroll.y-
blockHeight*COMPULSORY_PART)&&(pos.left<wSize.width+wScroll.x));
};

this.sendVisible=function(data,url){
var padId=data.pad_id,
visValue='visible';

data.first=+this.setFirst(padId,visValue);

data.visibility=visValue;

return this.send(data,url);
};

this.sendHidden=function(data,url){
data.push({
visibility:'hidden'
});

this.send(data,url);
};

this.setFirst=function(padId,eventType){
var stored=ac.Storage.get(padId);

if(!stored||!stored[eventType]){
stored=stored||{};
stored[eventType]=true;

ac.Storage.set(
padId,stored
);

return true;
}

return false;
};

this.send=function(data,url){
url=url||ac.Strings.urls.log_banners_counter;
data=Begun.Utils.serialize(data);

if(data){
var last=url.substring(url.length-1),
delim=(last==='?'||last==='&')?'':'?';

url+=delim+data;
}

return Begun.Utils.includeImage(url);
};

this.sendJSON=function(data,url){
return Begun.Utils.includeCounter(url,data);
};

};

ac.Pads=new function(){
var pads=[];
this.init=function(){
if(typeof window.begun_auto_pad!=="undefined"&&!this.getPad()){
this.push(window.begun_auto_pad);
}
};
this.push=function(pad_id){
pads[pads.length]={
pad_id:pad_id,
feed:null,
blocks:[],
banner_index:0,
feed_started:false
};
};
this.getPad=function(pad_id){
pad_id=pad_id||window.begun_auto_pad;
for(var i=0,l=pads.length;i<l;i++){
if(pads[i].pad_id==pad_id){
return pads[i];
}
}
return null;
};
this.getPads=function(){
return pads;
};
};

ac.Banners={
infoValues:{
ids:{},

set:function(blockId,bannerId,type,value){
if(null==value){
return value;
}
var block=this.ids[blockId];
if(!block){
block=this.ids[blockId]={};
}

if(!block[bannerId]){
block[bannerId]={};
}
block[bannerId][type]=value;

return value;
},

setAll:function(blockId,banner){
var properties=['condition_id','kwtype','show_url'],
i=properties.length;
while(i--){
this.set(blockId,banner.banner_id,properties[i],banner[properties[i]]);
}
},

get:function(blockId,bannerId,type){
var block=this.ids[blockId];
return block&&block[bannerId]&&block[bannerId][type];
}
}
};

ac.Blocks=new function(){
this.init=function(){
ac.resetBannerIndex();
ac.resetMaxScrollers();
};
this.add=function(elem,pad_id){
var blocks=ac.getPad(pad_id).blocks;
blocks[blocks.length]=elem;
};
this.push=function(elem,pad_id){
var blocks=ac.getPad(pad_id).blocks;
if(window.begun_extra_block){
blocks[0]=elem;
}else{
blocks[blocks.length]=elem;
}
if(!ac.isFeedStarted()){
ac.initFeedLoad();
}else if(!!ac.getFeed()){
ac.insertNonTextBlock(elem);
ac.draw();
}
ac.nullGlobalBlockParams();
};
this.del=function(block_id,pad_id){
var block=null;
var i=0;
var blocks=ac.getPad(pad_id).blocks;
while(block=blocks[i]){
if(block.id==block_id){
blocks[i].id=-1;
blocks[i].options.banners_count=0;
break;
}
i++;
}
};

this.deleteAll=function(pad_id){
var pad=ac.getPad(pad_id),
blocks=pad&&pad.blocks;

if(blocks&&blocks.length){
blocks.length=0;
}
};

this.isDeleted=function(block){
block.id==-1&&block.options.banners_count==0;
};

this.pushAll=function(blocks,pad_id){
this.deleteAll(pad_id);
this.init();

var block=null;
var i=0;
while(block=blocks[i]){
this.push(block);
i++;
}
};

this.getBlockById=function(block_id,blocks,pad_id){
var block=null;
var i=0;
blocks=blocks||ac.getPad(pad_id).blocks;
while(block=blocks[i]){
if(block.id==block_id){
return block;
}
i++;
}
return null;
};

this.deleteBlockById=function(block_id,blocks,pad_id){
blocks=blocks||ac.getPad(pad_id).blocks;

for(var i=0;i<blocks.length;i++){
if(blocks[i].id===block_id){
blocks.splice(i,1);
return true;
}
}

return false;
};

this.getDomObj=function(block_id){
var resultBlock;
if(ac.getBlockIdTopMobile()==block_id){
try{
resultBlock=top.document&&top.document.getElementById(ac.Strings.css.block_prefix+block_id);
}catch(e){}
}
return resultBlock||Begun.$(ac.Strings.css.block_prefix+block_id)||null;
};
this.checkType=function(block,type){
return(this.getBlockType(block)==type);
};

this.checkTypeContains=function(block,substring){
return this.getBlockType(block).indexOf(substring)>=0;
};

this.checkViewType=function(block,viewtype){
return Begun.Utils.inList((block.options&&block.options.view_type),viewtype);
};

this.getBlockType=function(block){
return block&&block.options&&block.options.dimensions&&block.options.dimensions.type&&block.options.dimensions.type.toLowerCase()||"";
};
this.isBlockFixed=function(block){
return(/(\d+)x(\d+)/.test(this.getBlockType(block)));
};
};

ac.Tpls=new function(){
var css={};
css['default']='\
#begun-default-css {display:none !important;}\
';
css['block']='.begun_adv * {clear:none !important;color:#000 !important;float:none !important;margin:0 !important;padding:0 !important;letter-spacing:normal !important;word-spacing:normal !important;z-index:auto !important;font-size:12px !important;font:normal normal 12px Arial,sans-serif !important;text-transform:none !important;list-style:none !important;position:static !important;text-indent:0 !important;visibility:visible !important;white-space:normal !important;}.begun_adv .begun_adv_common tr,.begun_adv .begun_adv_common td,.begun_adv .begun_adv_common a,.begun_adv .begun_adv_common b,.begun_adv .begun_adv_common div,.begun_adv .begun_adv_common span {background:none !important;border:none !important;}#begun_block_{{block_id}} {height:auto !important;width:auto !important;line-height:normal !important;margin:0 !important;padding:0 !important;}#begun_block_{{block_id}} wbr {display:inline-block !important;}#begun_block_{{block_id}} .begun_adv_span {display:inline-block !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;}#begun_block_{{block_id}} .begun_adv {font:12px/18px Arial,sans-serif !important;color:#000 !important;text-align:left !important;width:auto !important;margin:0 !important;padding:0 !important;-moz-box-sizing:border-box !important;-webkit-box-sizing:border-box !important;box-sizing:border-box !important;}#begun_block_{{block_id}} .begun_adv *:after,#begun_block_{{block_id}} .begun_adv *:before {content:normal !important;}#begun_block_{{block_id}} .begun_adv b {font-weight:bold !important;font-weight:{{block:fontWeight}} !important;display:inline !important;}#begun_block_{{block_id}} .begun_adv td {font-size:11px !important;}#begun_block_{{block_id}} .begun_adv,#begun_block_{{block_id}} .begun_adv table,#begun_block_{{block_id}} .begun_adv td,#begun_block_{{block_id}} .begun_adv div {padding:0 !important;text-align:left !important;table-layout:auto !important;}#begun_block_{{block_id}} .begun_adv table {border:none !important;border-collapse:collapse !important;}#begun_block_{{block_id}} .begun_adv td {vertical-align:middle !important;}#begun_block_{{block_id}} .begun_adv_cell {text-align:left !important;}#begun_block_{{block_id}} .begun_adv_bullit {color:#aaa !important;}#begun_block_{{block_id}} .begun_adv_title,#begun_block_{{block_id}} .begun_adv_text {display:block !important;}#begun_block_{{block_id}} .begun_adv_title,#begun_block_{{block_id}} .begun_adv_title * {font-weight:bold !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_sys_logo {height:16px !important;padding-right:5px !important;padding-bottom:2px !important;}#begun_block_{{block_id}} .begun_adv_fix_hor .begun_adv_sys_logo {position:absolute !important;right:0 !important;bottom:0 !important;z-index:1 !important;} #begun_block_{{block_id}} .begun_adv .begun_adv_sys_logo,#begun_block_{{block_id}} .begun_adv .begun_adv_sys_logo * {font-size:13px !important;line-height:16px !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_sys_logo div {vertical-align:middle !important;text-align:right !important;}#begun_block_{{block_id}} .begun_adv_sys_logo a:link,#begun_block_{{block_id}} .begun_adv_sys_logo a:visited,#begun_block_{{block_id}} .begun_adv_sys_logo a:hover,#begun_block_{{block_id}} .begun_adv_sys_logo a:active {color:{{block_logo_color}} !important;text-decoration:none !important;font-weight:bold !important;font-style:italic !important;}#begun_block_{{block_id}} .begun_adv_flat .begun_adv_cell .begun_adv_cell,#begun_block_{{block_id}} .begun_collapsable .begun_adv_cell .begun_adv_cell {padding:5px 2px 4px 5px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_cell {padding:0 5px 0 9px !important;}#begun_block_{{block_id}} .begun_adv_fix .banners_count_1 .begun_adv_cell,#begun_block_{{block_id}} .begun_adv_fix .begun_adv_thumb .begun_adv_cell,#begun_block_{{block_id}} .begun_adv_fix .begun_adv_rich {padding-left:5px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_cell,#begun_block_{{block_id}} .begun_adv_fix .begun_adv_cell * {font-size:11px !important;line-height:11px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_title {font-size:12px !important;line-height:13px !important;margin-bottom:2px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_title * {font-size:12px !important;line-height:13px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_text,#begun_block_{{block_id}} .begun_adv_fix .begun_adv_text * {font-size:11px !important;line-height:12px !important;}#begun_block_{{block_id}} .begun_adv_fix .begun_adv_common {overflow:hidden !important;}#begun_block_{{block_id}}.begun_auto_rich .begun_adv_fix .begun_adv_common {overflow:visible !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_text {padding:2px 0 !important;}#begun_block_{{block_id}} .begun_adv_fix_hor .begun_adv_cell {padding:0 0 0 9px !important;}#begun_block_{{block_id}} .begun_adv_fix_hor .begun_adv_thumb .begun_adv_cell,#begun_block_{{block_id}} .begun_adv_fix_hor .begun_adv_rich {padding:0 0 0 5px !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_fav {padding-left:22px !important;background-position:left 1px !important;background-repeat:no-repeat !important;}#begun_block_{{block_id}} .begun_adv .banners_count_1 .begun_adv_fav {margin-left:0 !important;padding-left:0 !important;background-position:-1000px -1000px !important;}#begun_block_{{block_id}} .begun_adv_fav .begun_adv_title a {background-position:-1000px -1000px !important;}#begun_block_{{block_id}} .begun_adv_block {border:none !important;cursor:pointer !important;cursor:hand !important;}#begun_block_{{block_id}} .begun_scroll {position:relative !important;overflow:hidden !important;}#begun_block_{{block_id}} .begun_adv_fix_ver .begun_scroll .begun_adv_block {margin:5px 0 !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_title a.begun_cross {float:right !important;margin-left:8px !important;font-size:18px !important;text-decoration:none !important;font-weight:normal !important;line-height:14px !important;color:{{domain:color}} !important;opacity:0.25 !important;filter:alpha(opacity=25) !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_title a.begun_cross:hover {color:{{domain:color}} !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_cell .begun_adv_phone * {font-size:1px !important;}#begun_block_{{block_id}} .begun_adv_phone {width:12px !important;margin:1px 3px 0 0 !important;position:absolute !important;top:0 !important;left:0 !important;}#begun_block_{{block_id}} .begun_adv_phone_wrapper {padding-left:15px !important;white-space:nowrap !important;position:relative !important;display:inline-block !important;_display:inline !important;zoom:1 !important;}#begun_block_{{block_id}} .begun_adv_phone_wrapper.begun_adv_phone_no_icon {padding-left:0 !important;}#begun_block_{{block_id}} div.begun_adv_contact > .begun_adv_phone {margin:0 5px 0 0 !important;}#begun_block_{{block_id}} .begun_adv_phone b {border:#000 solid 0 !important;height:1px !important;font-size:1px !important;line-height:1px !important;display:block !important;overflow:hidden !important;}#begun_block_{{block_id}} .begun_adv_phone .p0,#begun_block_{{block_id}} .begun_adv_phone .p1,#begun_block_{{block_id}} .begun_adv_phone .p3,#begun_block_{{block_id}} .begun_adv_phone .p5,#begun_block_{{block_id}} .begun_adv_phone .p8 {background-color:#000 !important;}#begun_block_{{block_id}} .begun_adv_phone .p1,#begun_block_{{block_id}} .begun_adv_phone .p7,#begun_block_{{block_id}} .begun_adv_phone .p8 {margin:0 1px !important;}#begun_block_{{block_id}} .begun_adv_phone .p2,#begun_block_{{block_id}} .begun_adv_phone .p7 {border-width:0 4px !important;}#begun_block_{{block_id}} .begun_adv_phone .p3,#begun_block_{{block_id}} .begun_adv_phone .p6 {margin:0 2px !important;}#begun_block_{{block_id}} .begun_adv_phone .p0 {margin:0 3px !important;}#begun_block_{{block_id}} .begun_adv_phone .p4 {border-width:0 3px !important;}#begun_block_{{block_id}} .begun_adv_phone .p5 {margin:0 4px !important;}#begun_block_{{block_id}} .begun_adv_phone .p6 {border-width:0 2px !important;}#begun_block_{{block_id}} .begun_adv_phone .p8 {height:2px !important;}#begun_block_{{block_id}} .begun_adv_phone b {border-color:{{domain:color}} !important;}#begun_block_{{block_id}} .begun_adv_phone .p0,#begun_block_{{block_id}} .begun_adv_phone .p1,#begun_block_{{block_id}} .begun_adv_phone .p3,#begun_block_{{block_id}} .begun_adv_phone .p5,#begun_block_{{block_id}} .begun_adv_phone .p8 {background-color:{{domain:color}} !important;}#begun_block_{{block_id}} .begun_adv_phone {font-size:11px !important;line-height:11px !important;margin-top:{{phone_margin_top}} px !important;}#begun_block_{{block_id}} .begun_adv_title a,#begun_block_{{block_id}} .begun_adv_title a * {color:{{title:color}} !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_title a:hover,#begun_block_{{block_id}} .begun_adv .begun_adv_title a:hover * {color:#f00 !important;color:{{title_hover:color}} !important;}#begun_block_{{block_id}} .begun_adv_title,#begun_block_{{block_id}} .begun_adv_title * {font-size:{{title:fontSize}} !important;font-weight:{{title:fontWeight}} !important;line-height:{{title:lineHeight}} !important;}#begun_block_{{block_id}} .begun_adv_text,#begun_block_{{block_id}} .begun_adv_text * {color:#000 !important;color:{{text:color}} !important;font-size:{{text:fontSize}} !important;text-decoration:none !important;}#begun_block_{{block_id}} div.begun_adv_contact {*position:relative !important;*top:3px !important;*margin-top:-3px !important;}#begun_block_{{block_id}} .begun_adv_contact,#begun_block_{{block_id}} .begun_adv_contact a,#begun_block_{{block_id}} .begun_adv_contact span {color:{{domain:color}} !important;font-size:{{domain:fontSize}} !important;}#begun_block_{{block_id}} .begun_adv_contact span {padding-right:2px !important;}#begun_block_{{block_id}} .begun_adv_contact a {color:{{domain:color}} !important;text-decoration:none !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_thumb .begun_thumb {float:left !important;display:block !important;_display:inline !important;z-index:1 !important;overflow:hidden !important;zoom:1 !important;margin:0 auto 5px 7px !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_thumb .begun_thumb img {z-index:20 !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_rich {overflow:visible !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_rich .begun_adv_image {float:left !important;margin-right:10px !important;_margin-right:7px !important;top:0 !important;width:70px !important;height:70px !important;position:relative !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_thumb .begun_adv_block {margin-left:60px !important;_zoom:1 !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_thumb_default .begun_adv_block {margin-left:60px !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_thumb_classic .begun_adv_block {margin-left:74px !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_rich .begun_adv_block {margin-left:80px !important;_margin-left:77px !important;}#begun_block_{{block_id}} .begun_adv_accordion .accordion_section .begun_adv_cell .begun_adv_block .begun_adv_title,#begun_block_{{block_id}} .begun_adv_accordion .accordion_section .begun_adv_cell .begun_adv_block .section {border:1px solid transparent !important;_border:none !important;}#begun_block_{{block_id}} .begun_adv_accordion .accordion_section .begun_adv_cell {vertical-align:top !important;}#begun_block_{{block_id}} .begun_adv_accordion .begun_adv_block {margin:5px 0 0 !important;}#begun_block_{{block_id}}.begun_auto_rich .begun_adv .banners_count_1 .begun_adv_cell,#begun_block_{{block_id}}.begun_auto_rich .begun_adv .banners_count_1 .begun_adv_cell *,#begun_block_{{block_id}}.begun_auto_rich .begun_adv .banners_count_1 .begun_adv_text,#begun_block_{{block_id}}.begun_auto_rich .begun_adv .banners_count_1 .begun_adv_text *,#begun_block_{{block_id}}.begun_auto_rich .begun_adv .banners_count_1 .begun_adv_title,#begun_block_{{block_id}}.begun_auto_rich .begun_adv .banners_count_1 .begun_adv_title * {text-align:left !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_cell .begun_adv_phone_wrapper .begun_adv_phone *,#begun_block_{{block_id}}.begun_auto_rich .begun_adv .begun_adv_cell .begun_adv_phone_wrapper .begun_adv_phone *,#begun_block_{{block_id}} #begun_warn_{{block_id}}.begun_adv .banners_count_3 .begun_adv_cell .begun_adv_phone * {font-size:1px !important;}#begun_block_{{block_id}} .begun_adv_ver .begun_adv_phone {margin-top:3px !important;}#begun_block_{{block_id}} .begun_adv .begun_warn_message {padding:12px 10px 15px 20px !important;position:relative !important;top:0 !important;font-size:9px !important;line-height:10px !important;color:#333333 !important;text-transform:uppercase !important;background-color:#F0F0F0 !important;}#begun_block_{{block_id}} .begun_adv .begun_warn_message span.begun_warn_asterisk,#begun_block_{{block_id}} .begun_adv .begun_adv_title span.begun_warn_asterisk {color:#FF0000 !important;}#begun_block_{{block_id}} .begun_adv .begun_warn_message span.begun_warn_asterisk {left:10px !important;position:absolute !important;top:10px !important;}#begun_block_{{block_id}} .begun_adv .begun_adv_title span.begun_warn_asterisk {margin-left:5px !important;font-weight:bold !important;}#begun_block_{{block_id}} .begun_adv_ver .begun_warn_message {padding:10px 7px 10px 7px !important;}#begun_block_{{block_id}} .begun_adv_ver .begun_warn_message span.begun_warn_asterisk {position:static !important;top:0 !important;left:0 !important;margin-right:5px !important;}\
#begun_block_{{block_id}} .begun_adv a { /* .begun_adv increases the selectors specifity. #id a {display: block} - common pattern #6453, #6620 */\
display: inline;\
vertical-align: baseline;\
text-decoration: underline;\
opacity: 1 !important;\
}\
#begun_block_{{block_id}} .begun_adv {\
background-color: {{block:backgroundColor}}; /* no !important for hover */\
border: 1px solid {{block:borderColor}}; /* no !important for hover */\
{{block:filter}} /* no !important for hover */\
}\
#begun_block_{{block_id}} .begun_adv *, .begun_adv *:hover {\
width: auto; /* no !important for rich-images */\
height: auto; /* no !important for rich-images */\
background: none; /* no !important for hover */\
border: none; /* no !important for hover */\
}\
#begun_block_{{block_id}} .begun_adv.begun_hover {\
background-color: {{block_hover:backgroundColor}}; /* no !important for hover */\
border: 1px solid {{block_hover:borderColor}}; /* no !important for hover */\
{{block_hover:filter}} /* no !important for hover */\
}\
#begun_block_{{block_id}} td {\
overflow: visible;\
}\
#begun_block_{{block_id}} .begun_adv .begun_adv_rich .begun_active_image {\
z-index:1000;\
}\
#begun_block_{{block_id}} .begun_adv .begun_adv_rich .begun_active_image img {\
z-index:1000 !important;\
}\
#begun_block_{{block_id}} .begun_adv .begun_adv_rich .begun_adv_image img {\
border:1px solid {{block:borderColor}};\
position:absolute !important;\
background:#fff !important;\
top:0;\
left:0;\
z-index:20;\
cursor:pointer;\
}\
#begun_block_{{block_id}} .begun_adv .begun_adv_rich .begun_adv_picture {\
/*width:70px;\
height:70px;*/\
position:absolute !important;\
z-index:20;\
}\
#begun_block_{{block_id}} .begun_adv_accordion .begun_adv_table tr.accordion_section .section {\
padding-top:1px;\
height:1px;\
overflow:hidden;\
position:relative !important;\
}\
#begun_block_{{block_id}} .begun_adv.begun_adv_accordion .begun_adv_common .begun_adv_table tr.accordion_section.expanded td {\
background-color:{{accordion:backgroundColor}} !important;\
}\
#begun_block_{{block_id}} .begun_collapsed {\
height:45px !important;\
overflow:hidden !important;\
}\
#begun_block_{{block_id}} .begun_collapsed .begun_adv_title {\
margin-bottom:30px !important;\
}\
';
css['forOperaIE']='\
#begun_block_{{block_id}} .begun_adv_contact span.begun_adv_phone {\
float:none !important;\
position:static !important;\
vertical-align: top;\
display:inline-block !important;\
}\
#begun_block_{{block_id}} .begun_adv_phone_wrapper {\
padding-left:0 !important;\
position:static !important;\
display:inline !important;\
}\
';
var html={};
html['blck_place']='<div id="{{id}}"></div>';
html['link_iframe']='<iframe src="{{url}}" style="height:0;width:0;border:0"></iframe>';
html['bnnr_glue']=' <span class="begun_adv_bullit"> &#149; </span> ';
html['bnnr_close']='<a href="javascript:void(0);" class="begun_cross" title="&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;">&times;</a>';
html['bnnr_phone']='\
<span class="begun_adv_phone"><b class="p0"></b><b class="p1"></b><b class="p2"></b><b class="p4"><b class="p3"></b></b><b class="p5"></b><b class="p6"><b class="p1"></b></b><b class="p7"></b><b class="p8"></b></span>\
';
html['bnnr_card']='\
<span class="begun_adv_phone_wrapper"><a target="_blank" href="{{url}}" class="snap_noshots">{{phone}}</a><span class="begun_adv_card"><a target="_blank" href="{{url}}" class="snap_noshots">{{card_text}}</a></span></span>\
';
html['bnnr_card_no_phone']='\
<span class="begun_adv_phone_wrapper begun_adv_phone_no_icon"><span class="begun_adv_card"><a target="_blank" href="{{url}}" class="snap_noshots">{{card_text}}</a></span></span>\
';
html['bnnr_ppcall']='\
<span class="begun_adv_phone_wrapper"><a href="javascript:void(0)" onclick="'+ac.Strings.js.ppcall_show+'({{banner_index}}, this, event, {{pad_id}}, \'{{link}}\', {{ua_type}})">{{phone}}<span class="begun_adv_card" title="&#1047;&#1074;&#1086;&#1085;&#1086;&#1082;&#32;&#1073;&#1077;&#1089;&#1087;&#1083;&#1072;&#1090;&#1085;&#1099;&#1081;">{{ppcall_text}}</span></a></span>\
';
html['bnnr_domain']='\
<span class="begun_adv_contact"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}">{{domain}}</a></span> \
';
html['bnnr_geo']='\
<span class="begun_adv_city"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}">{{geo}}</a></span>\
';
html['bnnr_thumb']='\
<a href="{{url}}" class="begun_thumb snap_noshots" style="width:{{width}}px !important;height:{{height}}px !important;{{additionalStyles}}" target="_blank"><img src="{{src}}" {{pngfix}} {{mouse_events}} width="{{width}}" height="{{height}}" alt="" style="width:{{width}}px !important;background-color:{{bgcolor}};" /></a>\
';
html['bnnr_picture']='\
<div class="begun_adv_image"><a href="{{url}}" class="snap_noshots" target="_blank"><img src="{{src}}" _big_photo_src="{{big_photo_src}}" _small_photo_src="{{src}}" class="begun_adv_picture" alt="" /></a></div>\
';
html['block_warn']='\
<div class="begun_warn_message begun_warn_{{type}}"><span class="begun_warn_asterisk">*</span>{{text}}</div>\
';
html['bnnr_warn_attn']='\
<span class="begun_warn_asterisk">*</span>\
';
html['blck_hover']=' onmouseover="Begun.Utils.addClassName(this, \'begun_hover\');" onmouseout="Begun.Utils.removeClassName(this, \'begun_hover\');"';
html['search_banner_swf']='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{{width}}" height="{{height}}"><param name="movie" VALUE="{{source}}&link1={{url}}"><param name="wmode" value="opaque"><param name="allowScriptAccess" value="always"><param name="quality" VALUE="high"><embed src="{{source}}&link1={{url}}" quality="high" width="{{width}}" height="{{height}}" style="{{styles}}" type="application/x-shockwave-flash" wmode="opaque"></embed></object>';
html['search_banner_js']='';

html['search_banner_img']='<a href="{{url}}" target="_blank"><img src="{{source}}&redir=1" border="0" width="{{width}}" height="{{height}}" style="{{styles}}" /></a>{{close_button}}';

html['close_button']='<a href="javascript:void(0);" class="begun_close_button" onclick="document.getElementById(\'begun_block_{{block_id}}\').parentNode.removeChild(document.getElementById(\'begun_block_{{block_id}}\'));" title="&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;">&#215;</a>';

this.getCSS=function(type){
return css[type];
};
this.getHTML=function(type){
return html[type];
};
this.addTpls=function(newTpls){
var types=['html','css'];
var i=0;
var type=null;
var is_default_css_override=false;
if(css['default']&&window['begun_css_tpls']&&window['begun_css_tpls']['default']&&css['default']!=window['begun_css_tpls']['default']){
is_default_css_override=true;
}
var tplContainer=typeof newTpls==="undefined"?window:newTpls;
while(type=types[i]){
if(typeof tplContainer['begun_'+type+'_tpls']!=="undefined"){
var j=0;
var tpl=null;
while(tpl=tplContainer['begun_'+type+'_tpls'][j]){
Begun.extend(eval(type),tpl);
j++;
}
}
i++;
}
return is_default_css_override;
};
};

ac.Customization=new function(){
var _this=this;
this.init=function(){
if(typeof window.begun_urls!=="undefined"){
_this.setURLs(window.begun_urls);
window.begun_urls=null;
}
if(typeof window.begun_callbacks!=="undefined"){
_this.setCallbacks(window.begun_callbacks);
window.begun_callbacks=null;
}
if(_this.setTpls()||!arguments.callee.run){
ac.printDefaultStyle();
arguments.callee.run=true;

}
};
this.setURLs=function(urls){
Begun.extend(ac.Strings.urls,urls||{});
};
this.setCallbacks=function(callbacks){
ac.Callbacks.register(callbacks||{});
};
this.setTpls=function(newTpls){
ac.Tpls.addTpls(newTpls);
};
};
})(Begun);

(function(){
var ac=Begun.Autocontext;

ac.onContent=function(f){
var u=navigator.userAgent,
e=false,
CHECK_TIME;
if(/webkit/i.test(u)){
setTimeout(function(){
var dr=document.readyState;
if(dr=="loaded"||dr=="complete"){
f()
}else{
setTimeout(arguments.callee,CHECK_TIME);
}
},CHECK_TIME);
}else if((/mozilla/i.test(u)&&!/(compati)/.test(u))||(/opera/i.test(u))){
document.addEventListener("DOMContentLoaded",f,false);
}else if(e){
(function(){
var t=document.createElement('doc:rdy');
try{
t.doScroll('left');
f();
t=null;
}catch(e){
setTimeout(arguments.callee,0);
}
})();
}else{
Begun.Utils.addEvent(window,'load',function(){
f();
});
}
}

function logPpcalls(){
var ppcalls=(function(){
var pagePads=ac.Pads.getPads(),
isAnyPpcallAd=false,
pads=[],
i,pad,
j,blockId,blockElement,links,quantity,
k,onClickAttr;

for(i=0;i<pagePads.length;i++){
pad=[];
pad.push({
pad_id:pagePads[i].pad_id
});

for(j=0;j<pagePads[i].blocks.length;j++){
blockId=pagePads[i].blocks[j].id;
blockElement=ac.Blocks.getDomObj(blockId);

if(!blockElement){
continue;
}

links=blockElement.getElementsByTagName('a');
quantity=0;

for(k=0;k<links.length;k++){
onClickAttr=links[k].getAttribute('onclick');

if(
onClickAttr&&
onClickAttr.toString().indexOf(ac.Strings.js.ppcall_show)!==-1
){
quantity++;
}
}

if(!isAnyPpcallAd&&quantity){
isAnyPpcallAd=true;
}

pad.push(
{block_id:blockId},
{ppcall_count:quantity}
);
}

pads.push(pad);
}

return isAnyPpcallAd?pads:null;
}());

if(ppcalls){
ac.Monitor.send(
ppcalls,
ac.Strings.urls.ppcalls_counter
);
}
}

ac.onContent(function(){
ac.Callbacks.dispatch('blocks','draw',ac);
ac.domContentLoaded=true;
logPpcalls();
});

ac.Monitor.init();
})();
Begun.Autocontext.init();
}
}

if(typeof Begun.Autocontext==="object"){
Begun.Autocontext.init();
}

Begun.Scripts.addStrictFunction(Begun.Scripts.Callbacks['ac']);
}

if(typeof Begun.Scripts!=="object"){
(function(){
var scripts={
"begun_scripts":"44517"
};

var protocol=document.location.protocol;

var baseUrl=(function(){
if(window.begun_urls&&window.begun_urls.base_scripts_url){
return window.begun_urls.base_scripts_url;
}else{
return protocol+"//autocontext.begun.ru/";
}
}());

for(var scriptName in scripts){
if(scripts.hasOwnProperty(scriptName)){
document.write("<scr"+"ipt type=\"text/javascript\" src=\""+baseUrl+"acp/"+scriptName+"."+scripts[scriptName]+".js"+"\"></scr"+"ipt>");
}
}
})();
}else{
if(typeof Begun.Scripts.addStrictFunction!=="undefined"){
begun_load_autocontext();
}
}
