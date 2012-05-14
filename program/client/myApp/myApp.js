var params = {};
var computation_place = '';
var method = '';
params['parties_count'] = 1000;
params['show_steps'] = false;

/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

var title = new enyo.Control({
  name: "Title",
  tag: 'h1',
  content: 'Введіть умову гри'
});
title.write();

new enyo.Control({tag: 'p', content:'Стратегії для кожного гравця'}).write();

var matrix = new enyo.Control({
    name:"Matrix",
    tag: "div",
    classes : 'strategies',
    components: [
        { tag: "div", classes: "blankblock", content: '&nbsp' },
        { tag: "div", classes: "label1", content: 'Player A' },
        { tag: "div", classes: "label2", content: 'B' },
        { name:'matrixTable', tag: "table", components: [
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]},
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]},
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]},
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]}
        ]} ,
        { name: 'addV', tag: "button", classes:'addV', content: "+" },
        { name: 'addH', tag: "button", classes:'addH', content: "+" },
    ]
});

var fileuploader = new enyo.Control({
    name : 'upload',
    components: [
        {tag: 'input', id: 'fileupload', attributes: { type: "file", multiple: 'false' }},
        {tag: 'p', attributes: {id: 'info'}, content: 'Перетяніть файл на це поле для його завантаження.<br>Або натисніть сюди для вибору файла.'}
    ]
});

new enyo.Control({
    name: 'inputs',
    components: [
        matrix,
        {tag: 'span', content: 'або виберіть файл'},
        fileuploader
    ]
}).write();

new enyo.Control({
    name: 'params',
    components: [
        {name:"method",
        tag: "div",
        components: [
            { components:[
                { tag: 'input type="radio" name="method" value="symplex" checked="checked"' },
                { tag: 'label', content: 'Симплекс-метод' }
            ]},
            { components:[
                {tag: 'input type="radio" name="method" value="br"' },
                { tag: 'label', content: 'метод Брауна-Робінсона' }
            ]},
            { components:[
                {tag: 'input type="radio" name="method" value="graph"' },
                { tag: 'label', content: 'Графічни метод' }
            ]}
        ]},
        {name:"where",
        tag: "div",
        components: [
            { components:[
                { tag: 'input type="radio" name="where" value="device" checked="checked"' },
                { tag: 'label', content: 'Обрахувати на цьому пристрої' }
            ]},
            { components:[
                {tag: 'input type="radio" name="where" value="server"' },
                { tag: 'label', content: 'Відправити на сервер' }
            ]}
        ]}
    ]
}).write();

goButton = new enyo.Control({
    tag: 'Button',
    name: 'GoButton',
    classes: 'GoButton',
    content: 'Знайти розв’язок'
});

goButton.write();

resultArea = new enyo.Control({
    tag: 'div',
    name: 'resultArea',
    classes: 'resultArea',
    content:'&nbsp'
});

predekat = new enyo.Control({
    name: 'predekat',
    classes: 'predekat',
    components: [
        {tag: "select",
            components: [
                {tag: 'option value="experienced"', content: "досвідчений"},
                {tag: 'option value="inexperienced"',content: "недосвідчений"},
                {tag: 'option value="at risk"',content: "схильний до ризику"},
                {tag: 'option value="cautious"',content: "обережний"},
                {tag: 'option value="gain is too low"',content: "середній виграш надто низький"},
                {tag: 'option value="gain is not too low"',content: "середній виграш не надто низький"},
            ]
        }
    ]
});

strategy = new enyo.Control({
    name: 'strategy',
    classes: 'strategy',
    components: [
        {tag: "select", components: [
            {tag: 'option value="maximizing the maximum"', content: "максимізація максимуму"},
            {tag: 'option value="minimax"', content: "мнімакс"},
            {tag: 'option value="maximizing the average"', content: "максимізація середнього"}
        ]}
    ]
});

rule = new enyo.Control({
    name: 'rule',
    classes: 'rule',
    components: [
        {
            tag: 'p',
            content: 'Якщо'
        },
        predekat,
        {
            tag: 'button',
            name: 'and',
            content:'&amp;',
            classes: 'rule_and'
        },
        {
            tag: 'p',
            content: 'то'
        },
        strategy
    ]
});

opponent_info = new enyo.Control({
    name: 'opponent_info',
    components: [
        {
            tag: 'p',
            components: [
                {
                    tag: 'label',
                    content: 'Коефіціент обережності опонента'
                },{
                    tag: 'input',
                    name: 'caution',
                    value: '0'
                }
            ]
        },
        {
            tag: 'p',
            components: [
                {
                    tag: 'label',
                    content: 'Коефціент досвідченості опонента'
                },{
                    tag: 'input',
                    name: 'experience',
                    value: '0'
                }
            ]
        },
        {
            tag: 'p',
            components: [
                {
                    tag: 'label',
                    content: 'Мінімально прийнятна частка максимально можливого виграшу'
                },{
                    tag: 'input',
                    name: 'low_gain',
                    value: '0'
                }
            ]
        }
    ]
});

rules = new enyo.Control({
    name: 'rules',
    components: [
        rule,
        {
            tag: 'button',
            name: 'plus',
            content:'+'
        },
        opponent_info,
        {
            tag: 'button',
            name: 'get_result',
            content:'Отримати результат'
        },
    ]
});

use_opponent_information = new enyo.Control({
    name: 'use_opponent_information',
    tag: 'button',
    content: 'Додаткові відомості про опонента'
}).write();

rules.write();
resultArea.write();

function writeResult(result, method){
    var output = '<pre>';
    output += result['output'];
    if(method=='br'){
        output += 'Після використання методу Брауна-Робінсона' + "\n";
        output += 'Після ' + params['parties_count'] + ' ітерацій ми маємо:' + "\n";
    }else if(method=='symplex'){
        output += 'Використавши симплекс метод' + "\n";
        output += "\n"+'Результат:' + "\n";
    }
    if(result['player1_strategies'] != undefined)
        output += 'x<sup>*</sup>(' + result['player1_strategies'].join('; ')+ ')'+"\n";
    if(result['player2_strategies'] != undefined)
        output += 'y<sup>*</sup>(' + result['player2_strategies'].join('; ')+ ')'+"\n";
    if(result['Game_price'] != undefined)
        output += 'Ціна гри = ' + (result['Game_price']-result['maxNegative']) + "\n";

    if(!params['show_steps'])
        $('#resultArea').html(output+'</pre>');
}

function inialise_rule_and(){
    $('.rule_and').click(function(){
        $(this).parent().children('button').before("<span> & </span>");
        $(this).parent().children('button').before(predekat.generateHtml()); 
    });
}

$(document).ready(function(){
    
   $('#use_opponent_information').click(function(){$('#rules').show(1000)});
   
   // for tests
 /*  $('#rules').html('<div id="rule" class="rule"><p id="rule_control3">IF</p><div id="predekat" class="predekat"><select id="predekat_control15"><option id="predekat_control16" value="experienced">experienced</option><option id="predekat_control17" value="inexperienced" selected="selected">inexperienced</option><option id="predekat_control18" value="at risk">at risk</option><option id="predekat_control19" value="cautious">cautious</option><option id="predekat_control20" value="gain is too low">gain is too low</option><option id="predekat_control21" value="gain is not too low">gain is not too low</option></select></div><button id="rule_and" class="rule_and">&amp;</button><p id="rule_control4">THEN</p><div id="strategy" class="strategy"><select id="strategy_control9"><option id="strategy_control10" value="maximizing the maximum" selected="selected">maximizing the maximum</option><option id="strategy_control11" value="minimax">minimax</option><option id="strategy_control12" value="maximizing the average">maximizing the average</option></select></div></div><div id="rule" class="rule"><p id="rule_control">IF</p><div id="predekat" class="predekat"><select id="predekat_control8"><option id="predekat_control9" value="experienced">experienced</option><option id="predekat_control10" value="inexperienced">inexperienced</option><option id="predekat_control11" value="at risk" selected="selected">at risk</option><option id="predekat_control12" value="cautious">cautious</option><option id="predekat_control13" value="gain is too low">gain is too low</option><option id="predekat_control14" value="gain is not too low">gain is not too low</option></select></div><button id="rule_and" class="rule_and">&amp;</button><p id="rule_control2">THEN</p><div id="strategy" class="strategy"><select id="strategy_control5"><option id="strategy_control6" value="maximizing the maximum" selected="selected">maximizing the maximum</option><option id="strategy_control7" value="minimax">minimax</option><option id="strategy_control8" value="maximizing the average">maximizing the average</option></select></div></div><div id="rule" class="rule"><p id="rule_control">IF</p><div id="predekat" class="predekat"><select id="predekat_control8"><option id="predekat_control9" value="experienced">experienced</option><option id="predekat_control10" value="inexperienced">inexperienced</option><option id="predekat_control11" value="at risk">at risk</option><option id="predekat_control12" value="cautious" selected="selected">cautious</option><option id="predekat_control13" value="gain is too low">gain is too low</option><option id="predekat_control14" value="gain is not too low">gain is not too low</option></select></div><button id="rule_and" class="rule_and">&amp;</button><p id="rule_control2">THEN</p><div id="strategy" class="strategy"><select id="strategy_control5"><option id="strategy_control6" value="maximizing the maximum">maximizing the maximum</option><option id="strategy_control7" value="minimax" selected="selected">minimax</option><option id="strategy_control8" value="maximizing the average">maximizing the average</option></select></div></div><div id="rule" class="rule"><p id="rule_control">IF</p><div id="predekat" class="predekat"><select id="predekat_control8"><option id="predekat_control9" value="experienced" selected="selected">experienced</option><option id="predekat_control10" value="inexperienced">inexperienced</option><option id="predekat_control11" value="at risk">at risk</option><option id="predekat_control12" value="cautious">cautious</option><option id="predekat_control13" value="gain is too low">gain is too low</option><option id="predekat_control14" value="gain is not too low">gain is not too low</option></select></div><span> &amp; </span><div id="predekat" class="predekat"><select id="predekat_control"><option id="predekat_control2" value="experienced">experienced</option><option id="predekat_control3" value="inexperienced">inexperienced</option><option id="predekat_control4" value="at risk">at risk</option><option id="predekat_control5" value="cautious">cautious</option><option id="predekat_control6" value="gain is too low">gain is too low</option><option id="predekat_control7" value="gain is not too low" selected="selected">gain is not too low</option></select></div><button id="rule_and" class="rule_and">&amp;</button><p id="rule_control2">THEN</p><div id="strategy" class="strategy"><select id="strategy_control5"><option id="strategy_control6" value="maximizing the maximum">maximizing the maximum</option><option id="strategy_control7" value="minimax" selected="selected">minimax</option><option id="strategy_control8" value="maximizing the average">maximizing the average</option></select></div></div><div id="rule" class="rule"><p id="rule_control">IF</p><div id="predekat" class="predekat"><select id="predekat_control8"><option id="predekat_control9" value="experienced" selected="selected">experienced</option><option id="predekat_control10" value="inexperienced">inexperienced</option><option id="predekat_control11" value="at risk">at risk</option><option id="predekat_control12" value="cautious">cautious</option><option id="predekat_control13" value="gain is too low">gain is too low</option><option id="predekat_control14" value="gain is not too low">gain is not too low</option></select></div><span> &amp; </span><div id="predekat" class="predekat"><select id="predekat_control"><option id="predekat_control2" value="experienced">experienced</option><option id="predekat_control3" value="inexperienced">inexperienced</option><option id="predekat_control4" value="at risk">at risk</option><option id="predekat_control5" value="cautious">cautious</option><option id="predekat_control6" value="gain is too low" selected="selected">gain is too low</option><option id="predekat_control7" value="gain is not too low">gain is not too low</option></select></div><button id="rule_and" class="rule_and">&amp;</button><p id="rule_control2">THEN</p><div id="strategy" class="strategy"><select id="strategy_control5"><option id="strategy_control6" value="maximizing the maximum">maximizing the maximum</option><option id="strategy_control7" value="minimax">minimax</option><option id="strategy_control8" value="maximizing the average" selected="selected">maximizing the average</option></select></div></div><button id="rules_plus">+</button><div id="opponent_info"><p id="opponent_info_control7"><label id="opponent_info_control8">Opponents caution</label><input id="opponent_info_caution" value="0.7"></p><p id="opponent_info_control9"><label id="opponent_info_control10">Opponents experience</label><input id="opponent_info_experience" value="0.33"></p><p id="opponent_info_control11"><label id="opponent_info_control12">The minimum acceptable value of winning</label><input id="opponent_info_low_gain" value="0.66"></p></div><button id="rules_get_result">Get result</button>');$('#rules').show(1000);*/
    
    inialise_rule_and();
    
    $('#rules_plus').click(function(){
        $(this).parent().children('button').first().before(rule.generateHtml());
        
        inialise_rule_and();
    });
    
    $('#rules_get_result').click(function(){
        var mu = {};
        mu['A'] = $('#opponent_info_experience').val();
        mu['B'] = $('#opponent_info_caution').val();
        
        var matrix = new Array();

        $('#Matrix_matrixTable tr').each(function(){
            var arr = Array();
            $(this).children('td').each(function(){
                if($(this).children('input').val()=='')
                    $(this).children('input').val(0);
                arr.push(parseFloat($(this).children('input').val()));
            });
            matrix.push(arr);
        });
        
        var zmax = undefined;
        
        for(j=0;j<matrix[0].length;j++){
            for(i=0;i<matrix.length;i++){
                if(matrix[i][j]*(-1)>zmax || zmax == undefined)
                    zmax = matrix[i][j]*(-1);
            }
        }
        
        var minimax = undefined;
        var minimaxCols = [];
        
        var maximax = undefined;
        var maximaxCol = [];
        
        var maxiavg = undefined;
        var maxiavgCol = [];
        
        for(j=0;j<matrix[0].length;j++){
            min = undefined;
            for(i=0;i<matrix.length;i++){
                if(matrix[i][j]*(-1)<min || min == undefined)
                    min = matrix[i][j]*(-1);
            }
            
            if(minimax<min || minimax == undefined){
                minimax = min;
                minimaxCols = [j];
            }else if(minimax == min){
                minimaxCols.push(j);
            }
        }
        
        for(j=0;j<matrix[0].length;j++){
            max = undefined;
            for(i=0;i<matrix.length;i++){
                if(matrix[i][j]*(-1)>max || max == undefined)
                    max = matrix[i][j]*(-1);
            }
            
            if(maximax<max || maximax == undefined){
                maximax = max;
                maximaxCols = [j];
            }else if(maximax == max){
                maximaxCols.push(j);
            }
        }
        
        for(j=0;j<matrix[0].length;j++){
            sum = 0;
            for(i=0;i<matrix.length;i++){
                sum += matrix[i][j]*(-1);
            }
            
            if(maxiavg<sum || maxiavg == undefined){
                maxiavg = sum;
                maxiavgCols = [j];
            }else if(maxiavg == sum){
                maxiavgCols.push(j);
            }
        }
        
        var z_minimax_sum = 0;
        
        for(j=0;j<minimaxCols.length;j++)
            for(i=0;i<matrix.length;i++){
                z_minimax_sum += matrix[i][minimaxCols[j]]*(-1);
            }
        
        var z_minimax_avg = z_minimax_sum / (matrix.length*minimaxCols.length);
        
        var low_gain = $('#opponent_info_low_gain').val();
        
        if(z_minimax_avg <= 0) mu['D'] = 0;
        else if(z_minimax_avg > 0 && z_minimax_avg <low_gain*zmax){
            mu['D'] = (low_gain*zmax - z_minimax_avg)/(low_gain*zmax);
        }else{
            mu['D'] = 0;
        }
            
        var strategies = {
            'maximizing the maximum' : 0,
            'minimax'                : 0,
            'maximizing the average' : 0
        };
        
        for (s in strategies){
            $('.rule').each(function(){
                if($(this).find('.strategy option:selected').val() == s){
                    
                    tmp = undefined;
                    
                    $(this).find('.predekat option:selected').each(function(){
                        predekat = $(this).val();
                        
                        val = undefined;
                        
                        if(predekat=='experienced'){
                            val = mu['A'];
                        }else if(predekat=='inexperienced'){
                            val = 1 - mu['A'];
                        }else if(predekat=='at risk'){
                            val = 1 - mu['B'];
                        }else if(predekat=='cautious'){
                            val = mu['B'];
                        }else if(predekat=='gain is too low'){
                            val = mu['D'];
                        }else if(predekat=='gain is not too low'){
                            val = 1 - mu['D'];
                        }
                        
                        if(tmp == undefined || tmp > val){
                            tmp = val;
                        }
                        
                    });
                    
                    if(strategies[s] < tmp){
                       strategies[s] = tmp; 
                    }
                }
            });
        }
        
        sum = 0;
        for (s in strategies){
            sum += parseFloat(strategies[s]);
        }

        for (s in strategies){
            strategies[s] = strategies[s] / sum;
        }
        
        result = Array(matrix.length);
        for(i = 0;i<matrix.length;i++){
            result[i] = 0;
        }
        
        for(i in maximaxCols){
            
            max = undefined;
            otvet = 0;
            for(j=0;j<matrix.length;j++){
                if(max == undefined || matrix[j][maximaxCols[i]] > max){
                    max = matrix[j][maximaxCols[i]];
                    otvet = j;
                }
            }
            
            result[otvet] += strategies['maximizing the maximum'] / maximaxCols.length;
        }
        for(i in minimaxCols){
            
            max = undefined;
            otvet = 0;
            for(j=0;j<matrix.length;j++){
                if(max == undefined || matrix[j][minimaxCols[i]] > max){
                    max = matrix[j][minimaxCols[i]];
                    otvet = j;
                }
            }
            
            result[otvet] += strategies['minimax'] / minimaxCols.length;
        }
        for(i in maxiavgCols){
            
            max = undefined;
            otvet = 0;
            for(j=0;j<matrix.length;j++){
                if(max == undefined || matrix[j][maxiavgCols[i]] > max){
                    max = matrix[j][maxiavgCols[i]];
                    otvet = j;
                }
            }
            
            result[otvet] += strategies['maximizing the average'] / maxiavgCols.length;
        }
        
        result['output'] = 'x* = (' + result.map(function(x){return Math.round((x)*100)/100;}).join('; ') + ')';
        
        writeResult(result, '');
        
    });
    
    $('#params_where input[type="radio"]').change(function(){computation_place = $(this).val();});
    $('#params_method input[type="radio"]').change(function(){method = $(this).val();});
    
    computation_place = $('#params_where input[type="radio"]:checked').val();
    method = $('#params_method input[type="radio"]:checked').val();

    var socket = io.connect('http://matrixgames.org.ua:8888');

    socket.on('connect', function() {
        console.log('connected');
    });

    socket.on('message', function(data) {
        alert(data);
    });
    
    socket.on('result', function(data) {
        result = JSON.parse(data);writeResult(result, method);
    });


    if ($.browser.msie || $.browser.opera) {
        $(document.body).text('Ваш браузер не підтримує передачу файлів через Drag&Drop.');
        return;
    }

    function handleDrag(e) {
        if (e.type == 'dragenter') {
          $('#upload').addClass('drop');
        } else if ((e.type == 'dragleave') || (e.type == 'drop')) {
          $('#upload').removeClass('drop');
        }
        e.stopPropagation();
        e.preventDefault();
    }

    function handleUploads(files) {
        
        if(computation_place == 'device'){
            alert('Завантажувати файл можна тільки на сервер');return false;
        }
        
        for (var i = 0; i < files.length; ++i) {
            var reader = new FileReader();
            reader.onloadend = function(d) {
                socket.send(JSON.stringify({matrix:d.target.result, method: method, params: JSON.stringify(params)}), function(err) {
                    if (!err) {
                        console.log('file uploaded');
                    }
                });
            };
            reader.readAsDataURL(files[i]);
        }
    }

    $('#upload, #fileupload').bind('dragenter', handleDrag).bind('dragleave', handleDrag).bind('dragover', handleDrag);

    $('#upload').get(0).ondrop = function(e) {
        handleDrag(e);
        if (!e.dataTransfer.files) {
            alert('Ваш браузер не підтримує передачу файлів через Drag&Drop.');
            return;
        }
        var files = e.dataTransfer.files;
        handleUploads(files);
    };

    $('#fileupload').change(function(e) {
        handleUploads(this.files);
    }).click(function(e) {
        e.stopPropagation();
    });

    if ($.browser.mozilla) {
        $('#upload').click(function() {
            $('#fileupload').click();
        });
        $('#fileupload').css('display', 'none');
    }
    
    $('#Matrix_addV').click(function(){
        $('#Matrix').width($('#Matrix').width()+24);
        $('#Matrix_matrixTable tr').each(function(){$(this).append('<td><input /></td>');});
    });
    $('#Matrix_addH').click(function(){
        $('#Matrix').height($('#Matrix').height()+24);
        $('#Matrix_matrixTable').append($("#Matrix_matrixTable tr:first").clone());
    });
    $('#GoButton').click(function(){
        
        var matrix = new Array();

        $('#Matrix_matrixTable tr').each(function(){
            var arr = Array();
            $(this).children('td').each(function(){
                if($(this).children('input').val()=='')
                    $(this).children('input').val(0);
                arr.push(parseFloat($(this).children('input').val()));
            });
            matrix.push(arr);
        });

        if(computation_place == 'device'){
            
            var result = calculate(matrix, method, params);
            
            if(method == "graph"){
                client_paint_canvas_graph(result['max'], result['min'], result['maxX'], result['targY'], matrix, result['n2']);
            }
            
            writeResult(result, method);
        }else if(computation_place == 'server'){
            socket.emit('calculate', { 'matrix': JSON.stringify(matrix), 'method': method,  params: JSON.stringify(params) });
        }
    });
});