Begun.Autocontext.Customization.setTpls({
	"begun_html_tpls": [
		{"block_vertical": '\
<span class="begun_adv_span">\
<table id="{{begun_warn_id}}" class="begun_adv begun_adv_ver banners_count_{{banners_count}} banners_vertical_banners_count_{{banners_count}}"{{block_hover}} style="width:{{block_width}}">\
<tr>\
<td class="begun_adv_cell">\
<div class="begun_adv_common {{block_scroll_class}}" id="{{scroll_div_id}}">\
<table class="begun_adv_table {{css_thumbnails}}" id="{{scroll_table_id}}">\
{{banners}}\
</table>\
</div>\
<div class="begun_adv_sys_logo" style="display:{{logo_display}}"><div><a href="{{begun_url}}" target="_blank" class="snap_noshots">begun</a></div></div>\
{{block_warn}}\
</td>\
</tr>\
</table>\
</span>\
'},
		{'banner_vertical': '\
<tr>\
<td class="begun_adv_cell" title="{{fullDomain}}" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
{{thumb}}\
<div class="begun_adv_block {{css_favicon}}" {{favicon}} title="{{fullDomain}}">\
<div class="begun_adv_title">{{cross}}<a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}" {{favicon}}{{styleTitle}}>{{title}}</a>{{bnnr_warn}}</div>\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a></div>\
<div class="begun_adv_contact"{{styleContact}}>{{contact}}</div>\
</div>\
</td>\
</tr>\
'},
		{'banner_vertical_rich': '\
<tr>\
<td class="begun_adv_cell begun_adv_rich" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
{{picture}}\
<div class="begun_adv_block {{css_favicon}}" {{favicon}} title="{{fullDomain}}">\
<div class="begun_adv_title"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleTitle}}>{{title}}</a></div>\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a></div>\
<div class="begun_adv_contact"{{styleContact}}>{{contact}}</div>\
</div>\
</td>\
</tr>\
'},
		{'banner_vertical_rich_mini': '\
<tr>\
<td class="begun_adv_cell begun_adv_rich" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
<div class="begun_adv_title"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleTitle}}>{{title}}</a></div>\
{{picture}}\
<div class="begun_adv_block {{css_favicon}}" {{favicon}} title="{{fullDomain}}">\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a></div>\
</div>\
</td>\
</tr>\
'},
		{'banner_vertical_rich_exp': '\
<tr>\
<td class="begun_adv_cell begun_adv_rich_exp" onclick="{{onclick}}" _url="{{url}}" _banner_id="{{banner_id}}">\
<div class="begun_adv_block {{css_favicon}}" {{favicon}} title="{{fullDomain}}">\
<div class="begun_adv_title"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleTitle}}>{{title}}</a></div>\
{{picture}}\
<div class="begun_adv_text"><a class="snap_noshots" target="_blank" href="{{url}}" onmouseover="status=\'{{status}}\';return true" onmouseout="status=\'\';return true" title="{{fullDomain}}"{{styleText}}>{{descr}}</a></div>\
</div>\
</td>\
</tr>\
'}
	],
	"begun_css_tpls": [
		{"block_vertical": '\
#begun_block_{{block_id}} .begun_adv {\
	border-collapse: collapse !important;\
}\
#begun_block_{{block_id}} .begun_adv_ver .begun_adv_cell .begun_adv_cell {\
    padding: 5px 2px 4px 5px !important;\
}\
#begun_block_{{block_id}} .begun_adv .begun_adv_common .begun_adv_table {\
	width: 100% !important;\
}\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common table {\
	height:180px !important;\
}\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_thumb,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_thumb *,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common .begun_adv_rich ,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common .begun_adv_rich  * {\
	font-size:13px !important;\
	line-height:14px !important;\
}\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_thumb .begun_adv_text,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_thumb .begun_adv_text *,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common .begun_adv_rich .begun_adv_text,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common .begun_adv_rich .begun_adv_text *{\
	font-size:14px !important;\
	line-height:16px !important;\
}\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_thumb .begun_adv_title,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_thumb .begun_adv_title *,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common .begun_adv_rich .begun_adv_title,\
#begun_block_{{block_id}}.begun_auto_rich .begun_vertical_banners_count_1 .begun_adv_common .begun_adv_rich .begun_adv_title * {\
	font-size:16px !important;\
	line-height:18px !important;\
}\
#begun_block_{{block_id}}.begun_auto_rich .begun_adv .begun_adv_thumb .begun_adv_block {margin-left:80px !important;}\
#begun_block_{{block_id}}.begun_auto_rich .begun_adv .begun_adv_thumb .begun_thumb {margin-left:14px !important;margin-top:0 !important;}\
#begun_block_{{block_id}}.begun_auto_rich .begun_adv_cell .begun_adv_cell {padding:8px !important;}\
\
\
#begun_block_{{block_id}} .begun_adv_cell .begun_adv_table .begun_adv_rich_exp .begun_adv_cell {padding: 5px 2px 4px !important;}\
#begun_block_{{block_id}} .begun_adv_cell .begun_adv_table .begun_adv_rich_exp .begun_adv_block {margin: 0 !important;}\
#begun_block_{{block_id}} .begun_adv_rich_exp * {font:normal 11px/14px Tahoma !important;}\
#begun_block_{{block_id}} .begun_adv_rich_exp .begun_adv_title {text-align: center !important;}\
#begun_block_{{block_id}} .begun_adv_rich_exp .begun_adv_image {margin: 10px 0 !important;text-align: center !important;}\
#begun_block_{{block_id}} .begun_adv_rich_exp .begun_adv_image img {width:200px; height:200px;-moz-border-radius:10px 5px 5px 5px !important;border:5px solid #efefef !important;}\
#begun_block_{{block_id}} .begun_adv_rich_exp .begun_adv_text {text-align: center !important;padding:0 0 2px 0 !important;}\
\
#begun_block_{{block_id}} .begun_adv .begun_warn_message {\
	padding: 5px 7px !important;\
	font-size:11px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_title {\
	margin-bottom: 4px !important;\
}\
#begun_block_275206553.begun_rich_mini .begun_adv_title,\
#begun_block_275206553.begun_rich_mini .begun_adv_title *,\
#begun_block_275205885.begun_rich_mini .begun_adv_title,\
#begun_block_275205885.begun_rich_mini .begun_adv_title * {\
	line-height: 12px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv .begun_adv_rich .begun_adv_block {\
	margin-left: 69px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv_cell .begun_adv_cell {\
	padding-bottom: 2px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_block .begun_adv_text {\
	padding: 0 !important;\
	line-height: 1.1 !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_block .begun_adv_text * {\
	line-height: 1.1 !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_image {\
	top: 1px !important;\
	width: 60px !important;\
	height: 60px !important;\
	margin-right: 9px !important;\
}\
#begun_block_{{block_id}}.begun_rich_mini .begun_adv .begun_adv_cell img {\
	image-rendering:optimizeQuality;\
	-ms-interpolation-mode:bicubic;\
	width:60px;\
	height:60px;\
}\
\
#begun_block_275206553.begun_rich_mini .begun_adv_cell .begun_adv_cell,\
#begun_block_275205885.begun_rich_mini .begun_adv_cell .begun_adv_cell {\
	padding:5px 8px !important;\
}\
#begun_block_275206553.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_block .begun_adv_text *,\
#begun_block_275205885.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_block .begun_adv_text * {\
	line-height: 14px !important;\
}\
#begun_block_275206553.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_block .begun_adv_text,\
#begun_block_275205885.begun_rich_mini .begun_adv .begun_adv_cell .begun_adv_block .begun_adv_text {\
	max-height: 56px !important;\
	overflow: hidden !important;\
}\
#begun_block_275206553.begun_rich_mini .begun_adv .begun_adv_sys_logo,\
#begun_block_275206553.begun_rich_mini .begun_adv .begun_adv_sys_logo *,\
#begun_block_275205885.begun_rich_mini .begun_adv .begun_adv_sys_logo,\
#begun_block_275205885.begun_rich_mini .begun_adv .begun_adv_sys_logo * {\
	line-height: 8px !important;\
	height: 12px !important;\
}\
\
'}
	]
});
/*$LastChangedRevision: 55785 $*/
Begun.Autocontext.tplLoaded("begun_tpl_block_vertical");
