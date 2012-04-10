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
        {tag: 'p', attributes: {id: 'info'}, content: 'Drag one or more file to the blue square to upload them.<br>Or click the square to select multiple files to upload.'}
    ]
});

new enyo.Control({
    name: 'inputs',
    components: [
        matrix,
        {tag: 'span', content: 'or select a file'},
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
                { tag: 'label', content: 'Symplex' }
            ]},
            { components:[
                {tag: 'input type="radio" name="method" value="br"' },
                { tag: 'label', content: 'Braun-Robinson' }
            ]},
            { components:[
                {tag: 'input type="radio" name="method" value="graph"' },
                { tag: 'label', content: 'Graphical method' }
            ]}
        ]},
        {name:"where",
        tag: "div",
        components: [
            { components:[
                { tag: 'input type="radio" name="where" value="device" checked="checked"' },
                { tag: 'label', content: 'Device' }
            ]},
            { components:[
                {tag: 'input type="radio" name="where" value="server"' },
                { tag: 'label', content: 'Server' }
            ]}
        ]}
    ]
}).write();

goButton = new enyo.Control({
    tag: 'Button',
    name: 'GoButton',
    classes: 'GoButton',
    content: 'Resolve'
});

goButton.write();

resultArea = new enyo.Control({
    tag: 'div',
    name: 'resultArea',
    classes: 'resultArea',
    content:'&nbsp'
});

resultArea.write();

function writeResult(result, method){
    var output = '<pre>';
    output += result['output'];
    if(method=='br'){
        output += 'Using Braun-Robinson method' + "\n";
        output += 'After ' + params['parties_count'] + ' iterations we have:' + "\n";
    }else if(method=='symplex'){
        output += 'Using symplex method' + "\n";
        output += "\n"+'Result:' + "\n";
    }
    if(result['player1_strategies'] != undefined)
        output += 'x<sup>*</sup>(' + result['player1_strategies'].join('; ')+ ')'+"\n";
    if(result['player2_strategies'] != undefined)
        output += 'y<sup>*</sup>(' + result['player2_strategies'].join('; ')+ ')'+"\n";
    if(result['Game_price'] != undefined)
        output += 'Game price = ' + (result['Game_price']-result['maxNegative']) + "\n";

    if(!params['show_steps'])
        $('#resultArea').html(output+'</pre>');
}

$(document).ready(function(){
    
    $('#params_where input[type="radio"]').change(function(){computation_place = $(this).val();});
    $('#params_method input[type="radio"]').change(function(){computation_place = $(this).val();});
    
    computation_place = $('#params_where input[type="radio"]:checked').val();
    method = $('#params_method input[type="radio"]:checked').val();

    var socket = io.connect('http://localhost:8888');

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
        $(document.body).text('Your browser does not support Drag & Drop uploading.');
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
            alert('Dropping files is not supported by your browser.');
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
            
            var result = porahuj(matrix, method, params);
            
            if(method == "graph"){
                client_paint_canvas_graph(result['max'], result['min'], result['maxX'], result['targY'], matrix, result['n2']);
            }
            
            writeResult(result, method);
        }else if(computation_place == 'server'){
            socket.emit('porahuj', { 'matrix': JSON.stringify(matrix), 'method': method,  params: JSON.stringify(params) });
        }
    });
});