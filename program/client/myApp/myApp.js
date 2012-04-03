var show_steps = false;

/**
 * Transposes a given array.
 * @id Array.prototype.transpose
 * @author Shamasis Bhattacharya
 *
 * @type Array
 * @return The Transposed Array
 * @compat=ALL
 */
function transpose(a) {
 
  // Calculate the width and height of the Array
    w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;
 
  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }
 
  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];
 
  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {
 
    // Insert a new row (array)
    t[i] = [];
 
    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {
 
      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }
 
  return t;
};

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

matrix.write();

new enyo.Control({
    name: 'params',
    components: [
        {name:"method",
        tag: "div",
        components: [
            { components:[
                { tag: 'input type="radio" name="method" value="symplex"' },
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
                if($(this).children('input').val()=='')
                    $(this).children('input').val(0);
                arr.push(parseFloat($(this).children('input').val()));
            });
            matrix.push(arr);
        });

        var computation_place = $('#params_where input[type="radio"]:checked').val();
        if(computation_place == 'device'){
            
            /* Deleting null-lines */
            matrix = delete_null_lines(matrix);
        
            /* find dominant colls and rows */
            matrix = find_dominant_colls_and_rows(matrix);
            
    
            /* remove the negative items */
            var maxNegative = 0;
            matrix = remove_the_negative_items(matrix);
    
            var method = $('#params_method input[type="radio"]:checked').val();
            
            var output = '<pre>';
            
            var basis = Array(matrix.length);
            if(method=='symplex'){
                var result = symplex(matrix);
            }else
            if(method=='br'){
                var result = BraunRobinson(matrix);
            }else
            if(method == "graph"){
                
                var result = Nx2xN(marix);

                $.fancybox('<canvas id="graph" width="300" height="400"></canvas>');
                var canvas = document.getElementById('graph');
                var ctx = canvas.getContext('2d');
                if (canvas.getContext){
                      
                    ctx.fillStyle="#000";
                      
                    ctx.moveTo(20,20);
                    ctx.lineTo(20,390);
                    setTimeout(function() {ctx.stroke();},500);
                    ctx.moveTo(20,20);
                    ctx.lineTo(17,27);
                    ctx.moveTo(20,20);
                    ctx.lineTo(23,27);
                    setTimeout(function() {ctx.stroke();},1000);
                    ctx.font = "15px Arial";
                    ctx.fillText("u", 0, 30);
                    setTimeout(function() {ctx.stroke();},1500);
                        
                    ctx.moveTo(280,20);
                    ctx.lineTo(280,390);
                    setTimeout(function() {ctx.stroke();},2000);
                   
                    var price = 280/(result['max']-result['min']);
                    if(result['max']>0 && result['min']<0){
                        ctx.moveTo(0,  380+result['min']*price);
                        ctx.lineTo(300,380+result['min']*price);
                        setTimeout(function() {ctx.stroke();},2500);
                        ctx.moveTo(300,380+result['min']*price);
                        ctx.lineTo(287,380+result['min']*price-3);
                        ctx.moveTo(300,380+result['min']*price);
                        ctx.lineTo(287,380+result['min']*price+3);
                        setTimeout(function() {ctx.stroke();},3000);
                    }
                        
                    for(i=0;i<2;i++)
                        for(j=0;j<matrix[i].length;j++){
                            ctx.moveTo(20+i*260-3,380+(-matrix[i][j]+result['min'])*price);
                            ctx.lineTo(20+i*260+3,380+(-matrix[i][j]+result['min'])*price);
                            ctx.fillText(matrix[i][j], 20+i*260-20,380+(-matrix[i][j]+result['min'])*price);
                            setTimeout(function() {ctx.stroke();},3500+500*i);
                        }
                            
                    for(i=0;i<matrix[0].length;i++){
                        ctx.moveTo(20,380+(-matrix[0][i]+result['min'])*price);
                        ctx.lineTo(280,380+(-matrix[1][i]+result['min'])*price);
                        setTimeout(function() {ctx.stroke();},4000+500*i);
                    }
    
                    ctx.fillStyle="#ff0000";
    
                    ctx.moveTo(280*result['maxX']+11, 380+(-result['targY']+result['min'])*price);
                    ctx.arc(280*result['maxX']+11, 380+(-result['targY']+result['min'])*price, 3, 0, 2*Math.PI, false);
                    setTimeout(function() {ctx.fill();},4500);
                }
                
            }
        }else if(computation_place == 'server'){
            var socket = io.connect('http://localhost');
            socket.on('news', function (data) {
              console.log(data);
              socket.emit('my other event', { my: 'data' });
            });
        }
        
        if(method=='br'){
            output += 'Using Braun-Robinson method' + "\n";
            output += 'After ' + parties_count + ' iterations we have:' + "\n";
        }else if(method=='symplex'){
            output += 'Using symplex method' + "\n";
            output += "\n"+'Result:' + "\n";
        }
        if(result['player1_strategies'] != undefined)
            output += 'x<sup>*</sup>(' + result['player1_strategies'].join('; ')+ ')'+"\n";
        if(result['player2_strategies'] != undefined)
            output += 'y<sup>*</sup>(' + result['player2_strategies'].join('; ')+ ')'+"\n";
        if(result['Game_price'] != undefined)
            output += 'Game price = ' + result['Game_price'] + "\n";

        //output += '' + "\n";
        if(!show_steps)
            $('#resultArea').html(output+'</pre>');
    });
});