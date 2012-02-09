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
    /*handlers: {
        init: "initHandler"
    },*/
    components: [
        { tag: "div", classes: "blankblock", content: '&nbsp' },
        { tag: "div", classes: "label1", content: 'Player A' },
        { tag: "div", classes: "label2", content: 'B' },
        { name:'matrixTable', tag: "table", components: [
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]},
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]}
        ]} ,
        { name: 'addV', tag: "button", classes:'addV', content: "+" },
        { name: 'addH', tag: "button", classes:'addH', content: "+" },
    ]
});

matrix.write();

new enyo.Control({
    name: 'params',
    components: [
        {name:"method",
        tag: "div",
        components: [
            { components:[
                { tag: 'input type="radio" name="method" value="symplex"' },
                { tag: 'label', content: 'symplex' }
            ]},
            { components:[
                {tag: 'input type="radio" name="method" value="br"' },
                { tag: 'label', content: 'Braun-Robinson' }
            ]}
        ]},
        {name:"where",
        tag: "div",
        components: [
            { components:[
                { tag: 'input type="radio" name="where" value="device"' },
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

$(document).ready(function(){
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
                arr.push($(this).children('input').val());
            });
            matrix.push(arr);
        });
        
        var method = $('#params_method input[type="radio"]:checked').val();

        if(method=='br'){}
        else if(method=='symplex'){
            
            var basis = Array(matrix.length);
            var F = Array(matrix.length);
            var l = matrix.length;
            for(i=0;i<l;i++)
                for(j=0;j<l;j++){
                    if(j==i){
                        matrix[i].push(1);
                        basis[i] = j+l;
                    }else
                        matrix[i].push(0);
                    if(j==(l-1))
                        matrix[i].push(1);
                }
            var arr = Array(matrix[0].length);
            for(i=0;i<matrix[0].length;i++)
                if(i<l)arr[i] = -1;
                else arr[i] = 0;
            matrix.push(arr);
            
            function is_FcoefPositive(Arr){
                for(i=0;i<Arr.length;i++)
                    if(Arr[i]<0) return false;
                return true;
            }
            
            while(!is_FcoefPositive(matrix[matrix.length-1])){
                var min = matrix[matrix.length-1][0];
                
                for(i=1;i<matrix[matrix.length-1].length;i++)
                    if(min<matrix[matrix.length-1][i])
                        min = matrix[matrix.length-1][i];
                        

            }
            alert(dump(matrix));
        }
        
        var output = '<pre>';
        output += 'Resolving:' + "\n";
        output += "\n";
        output += 'For first player:' + "\n";
        output += 'F=-y1-y2-y3-y4→max' + "\n";
        output += "\n";
        output += 'For secong player:' + "\n";
        output += 'F=y1+y2+y3+y4→min' + "\n";
        output += "\n";
        output += 'With constraints:' + "\n";
        output += "\n";
        for(i=0;i<matrix.length;i++){
            for(j=0;j<matrix[i].length;j++)
                output += matrix[i][j]+'y<sub>'+j+'</sub>' + ((j+1)<matrix[i].length?" + ":'');
            output += ' >= 1' + "\n";
        }
        output += 'x<sub>j</sub> >= 0. x = 1..' + j + "\n";
        output += "\n";
        
        if(method=='br')output += 'Using Braun-Robinson method' + "\n";
        else if(method=='symplex')output += 'Using symplex method' + "\n";
        //output += '' + "\n";
        $('#resultArea').html(output+'</pre>');
    });
});