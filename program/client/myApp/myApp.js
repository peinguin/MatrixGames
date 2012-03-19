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
        
        /* Deleting null-lines */
        for(i=matrix.length-1;i>=0;i--){
            free = true;
            for(j=0;j<matrix[i].length;j++)
                if(matrix[i][j] != 0) free = false;
            if(free)
                matrix.splice(i, 1);
        }
        
        for(i=matrix[0].length-1;i>=0;i--){
            free = true;
            for(j=0;j<matrix.length;j++)
                if(matrix[j][i] != 0) free = false;
            if(free)
                for(j=0;j<matrix.length;j++)
                    matrix[j].splice(i, 1);
        }
  
        /* find infinity */
        /*var infinity = 0;
        for(i=0;i<matrix.length;i++)
            for(j=0;j<matrix[i].length;j++)
                if(matrix[i][j]>infinity)infinity = matrix[i][j];
        infinity++;*/

        var method = $('#params_method input[type="radio"]:checked').val();
        
        var output = '<pre>';
        
        var basis = Array(matrix.length);
        if(method=='symplex'){
            
            output += 'Resolving:' + "\n";
            output += "\n";
            output += 'For first player:' + "\n";
            output += 'F = ';
            for(i=0;i<matrix.length;i++)
                output += (i>0?'+':'')+' x<sub>'+(i+1)+'</sub> ';
            output += ' → min' + "\n";
            output += "\n";
            output += 'With constraints:' + "\n";
            output += "\n";
            for(i=0;i<matrix[0].length;i++){
                for(j=0;j<matrix.length;j++)
                    output += matrix[j][i]+'x<sub>'+(j+1)+'</sub>' + ((j+1)<matrix.length?" + ":'');
                output += ' >= 1' + "\n";
            }
            output += 'x<sub>j</sub> >= 0. j = 1..' + j + "\n";
            output += "\n";
            output += 'For secong player:' + "\n";
            output += 'Ф = ';
            for(i=0;i<matrix.length;i++)
                output += (i>0?'+':'')+' y<sub>'+(i+1)+'</sub> ';
            output += '→ max' + "\n";
            output += "\n";
            output += 'With constraints:' + "\n";
            output += "\n";
            for(i=0;i<matrix.length;i++){
                for(j=0;j<matrix[i].length;j++)
                    output += matrix[i][j]+'y<sub>'+j+'</sub>' + ((j+1)<matrix[i].length?" + ":'');
                output += ' <= 1' + "\n";
            }
            output += 'y<sub>j</sub> >= 0. j = 1..' + j + "\n";
            output += "\n";
            
            //Приведем систему ограничений к системе неравенств смысла ≤, умножив соответствующие строки на (-1).
            for(i=0;i<matrix.length;i++)
                for(j=0;j<matrix[i].length;j++)
                    matrix[i][j] *= -1;
            //Transpose (for dual simplex method)
            matrix = transpose(matrix);
            
            var basis = Array(matrix.length);
            var F = Array(matrix.length);
            var l = matrix.length;
            var significant_elements = matrix[0].length;
            for(i=0;i<l;i++)
                for(j=0;j<l;j++){
                    if(j==i){
                        matrix[i].push(1);
                        basis[i] = significant_elements+j;
                    }else
                        matrix[i].push(0);
                    if(j==(l-1))
                        matrix[i].push(-1);
                }
            var arr = Array(matrix[0].length);
            for(i=0;i<matrix[0].length;i++)
                if(i<significant_elements)arr[i] = -1;
                else arr[i] = 0;
            matrix.push(arr);
            
            function is_FcoefPositive(Arr){
                for(i=0;i<Arr.length;i++){
                    if(Arr[i][Arr[i].length-1]<0) return false;
                }
                return true;
            }
            
           //alert(dump(matrix));
            
            if(show_steps == 1){
                var str = "<table border=1>";
                
                for(i=0;i<matrix.length;i++){
                    str += "<tr>";
                    str += "<td>"+basis[i]+"</td>";
                    str += "<td>";
                    str += matrix[i].map(function(x){return Math.round(x*100)/100;}).join('</td><td>');
                    str += "</td></tr>";
                }
                str += "</table>";
                $("#resultArea").html($("#resultArea").html()+str+"<br />");
            }
            
            while(!is_FcoefPositive(matrix)){
                
                var max    = undefined; // minimal coefficient
                var minRow = undefined; // column to search minimal division
                
                for(i=0;i<matrix.length-1;i++)
                    if(matrix[i][matrix[i].length-1]<0)
                        if(minRow == undefined || max<Math.abs(matrix[i][matrix[i].length-1])){
                            max = Math.abs(matrix[matrix.length-1][i]);
                            minRow = i;
                        }

                var min     = undefined; // minimal division
                var minCell = undefined; // row with minimal division

                for(j=0;j<matrix[minRow].length-1;j++){
                    if(matrix[minRow][j] < 0){
                        if(minCell == undefined || min>Math.abs(matrix[matrix.length-1][j]/matrix[minRow][j])){
                            min = Math.abs(matrix[matrix.length-1][j]/matrix[minRow][j]);
                            minCell = j;
                        }
                    }
                }
                
                $("#resultArea").html($("#resultArea").html()+'<p>'+minRow+' '+minCell+"</p>");
                
                basis[minRow] = minCell;
                //Next step
                var tmpMatrix = $.extend(true, [], matrix);
                for(i=0;i<matrix.length;i++)
                    for(j=0;j<matrix[i].length;j++){
                        if(i != minRow)
                            matrix[i][j] = (tmpMatrix[i][j]*tmpMatrix[minRow][minCell]-tmpMatrix[minRow][j]*tmpMatrix[i][minCell])/tmpMatrix[minRow][minCell];
                        else
                            matrix[i][j] = tmpMatrix[i][j]/tmpMatrix[minRow][minCell];
                    }
                
                //Show steps
                if(show_steps == 1){
                    var str = "<table border=1>";
                    for(i=0;i<matrix.length;i++){
                        str += "<tr>";
                        str += "<td>"+basis[i]+"</td>";
                        str += "<td>";
                        str += matrix[i].map(function(x){return Math.round(x*100)/100;}).join('</td><td>');
                        str += "</td></tr>";
                    }
                    str += "</table>";
                    $("#resultArea").html($("#resultArea").html()+str+"<br />");
                }
            }
            
            alert(dump(matrix));
            
            var player1_strategies = Array(matrix.length-1);
            for(i=0;i<matrix.length-1;i++)
                player1_strategies[i] = 0;
            for(i=0;i<matrix.length-1;i++)
                if(basis[i]<significant_elements)
                    player1_strategies[basis[i]] = Math.round((matrix[i][matrix[i].length-1] )*100)/100;
            
            player2_strategies_len = matrix[0].length-matrix.length+1;
            var player2_strategies = Array(player2_strategies_len);
            for(i=0;i<player2_strategies_len;i++)
                player2_strategies[i] = -Math.round((matrix[matrix.length-1][significant_elements+i])*100)/100;
                
            var Game_price = Math.round(matrix[matrix.length-1][0]*100)/100;
    
        }else
        if(method=='br'){
            
            var parties_count = 10000;
            
            var player1_strategy = undefined;
            var player2_strategy = undefined;
            var u = undefined;
            var w = undefined;
            
            var player1_strategies = Array(matrix[0].length);
                for(i=0;i<player1_strategies.length;i++)player1_strategies[i] = 0;
            var player2_strategies = Array(matrix.length);
                for(i=0;i<player2_strategies.length;i++)player2_strategies[i] = 0;
                
            var player1_sums = Array(matrix.length);
                for(i=0;i<player1_sums.length;i++)player1_sums[i] = 0;
            var player2_sums = Array(matrix[0].length);
                for(i=0;i<player2_sums.length;i++)player2_sums[i] = 0;
                
            var part_number;
            for(part_number=0;part_number<parties_count;part_number++){
                
                var max = 0;
                if(player1_strategy == undefined){
                    for(i=0;i<matrix.length;i++)
                        for(j=0;j<matrix[i].length;j++)
                            if(matrix[i][j]>max){
                                player2_strategy = i;
                                max = matrix[i][j];
                            }
                    player1_strategy = 0;
                }else{
                    for(i=0;i<player1_sums.length;i++)
                        if(player1_sums[i]>player1_sums[player2_strategy]){
                            player2_strategy = i;
                        }
                }
                
                player2_strategies[player2_strategy]++;
                for(i=0;i<matrix[player2_strategy].length;i++)
                    player2_sums[i]+=matrix[player2_strategy][i];
                
                for(i=0;i<player2_sums.length;i++){
                    if(player2_sums[i]<player2_sums[player1_strategy]){
                        player1_strategy = i;
                    }
                }
                
                player1_strategies[player1_strategy]++;
                    
                for(i=0;i<matrix.length;i++)
                    player1_sums[i]+=matrix[i][player1_strategy];
            }

            player1_strategies = player1_strategies.map(function(x){return Math.round((x/parties_count)*100)/100;});
            player2_strategies = player2_strategies.map(function(x){return Math.round((x/parties_count)*100)/100;});
            var Game_price = (Math.round(((Math.max.apply(null, player2_sums) + Math.min.apply(null, player1_sums))/(parties_count*2))*100)/100);
        }else
        if(method == "graph"){
            /* Check for 2*n or n*2 */
            if(matrix.length == 2 || matrix[0].length == 2){
                /*  */
                var n2 = false;
                if(matrix[0].length == 2 && matrix.length != 2){
                    n2 = true;
                    matrix = transpose(matrix);
                }
                
                var min = (Math.min.apply(null, matrix[0].concat(matrix[1])));
                var max = (Math.max.apply(null, matrix[0].concat(matrix[1])));
                
                var maxX;
                var maxY = min-1;
                var ActiveStrategy1, ActiveStrategy2;
                
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
               
                    var price = 280/(max-min);
                    if(max>0 && min<0){
                        ctx.moveTo(0,  380+min*price);
                        ctx.lineTo(300,380+min*price);
                        setTimeout(function() {ctx.stroke();},2500);
                        ctx.moveTo(300,380+min*price);
                        ctx.lineTo(287,380+min*price-3);
                        ctx.moveTo(300,380+min*price);
                        ctx.lineTo(287,380+min*price+3);
                        setTimeout(function() {ctx.stroke();},3000);
                    }
                    
                    for(i=0;i<2;i++)
                        for(j=0;j<matrix[i].length;j++){
                            ctx.moveTo(20+i*260-3,380+(-matrix[i][j]+min)*price);
                            ctx.lineTo(20+i*260+3,380+(-matrix[i][j]+min)*price);
                            ctx.fillText(matrix[i][j], 20+i*260-20,380+(-matrix[i][j]+min)*price);
                            setTimeout(function() {ctx.stroke();},3500+500*i);
                        }
                        
                    for(i=0;i<matrix[0].length;i++){
                        ctx.moveTo(20,380+(-matrix[0][i]+min)*price);
                        ctx.lineTo(280,380+(-matrix[1][i]+min)*price);
                        setTimeout(function() {ctx.stroke();},4000+500*i);
                    }
                    
                    /* find all points of intersection */
                    for(i=0;i<matrix[0].length;i++){
                        for(j=0;j<matrix[0].length;j++){
                            if(i!=j){
                                /* not parallel */
                                if(matrix[0][i]-matrix[0][j] != matrix[1][i]-matrix[1][j]){
                                    var x1 = 0;
                                    var x2 = 1;
                                    var x3 = 0;
                                    var x4 = 1;
                                    
                                    var y1 = matrix[0][i];
                                    var y2 = matrix[1][i];
                                    var y3 = matrix[0][j];
                                    var y4 = matrix[1][j];
                                    
                                    var x = ((x1*y2-x2*y1)*(x4-x3)-(x3*y4-x4*y3)*(x2-x1))/((y1-y2)*(x4-x3)-(y3-y4)*(x2-x1));
                                    var y = ((y3-y4)*x-(x3*y4-x4*y3))/(x4-x3);

                                    /* in minimals */
                                    var in_minimals = true;
                                    for(k=0;k<matrix[0].length;k++){
                                        var x1 = 0;
                                        var x2 = 1;
                                        
                                        var y1 = matrix[0][k];
                                        var y2 = matrix[1][k];
                                        
                                        if(((y1-y2)*x-(x1*y2-x2*y1))/(x2-x1) < y || -x<0 || -x>1)
                                            in_minimals = false;
                                    }

                                    if(in_minimals && y>maxY){
                                        maxY = y;
                                        maxX = -x;
                                        ActiveStrategy1 = i;
                                        ActiveStrategy2 = j;
                                    }
                                }
                            }
                        }
                    }
                    ctx.fillStyle="#ff0000";

                    ctx.moveTo(280*maxX+11, 380+(-maxY+min)*price);
                    ctx.arc(280*maxX+11, 380+(-maxY+min)*price, 3, 0, 2*Math.PI, false);
                    setTimeout(function() {ctx.fill();},4500);
                    var player1_strategies = Array();
                    player1_strategies.push(1-Math.round(maxX*100)/100);
                    player1_strategies.push(Math.round(maxX*100)/100);
                    var Game_price = Math.round(maxY*100)/100;
                    
                    var player2_strategies = Array(matrix[0].length);
                    for(i=0;i<matrix[0].length;i++)
                        player2_strategies[i] = 0;
                    
                    
                    delta  = matrix[0][ActiveStrategy1]*matrix[1][ActiveStrategy2]-matrix[0][ActiveStrategy2]*matrix[1][ActiveStrategy1];
                    deltax = Game_price*matrix[1][ActiveStrategy2]-matrix[0][ActiveStrategy2]*Game_price;
                    deltay = Game_price*matrix[0][ActiveStrategy1]-matrix[1][ActiveStrategy1]*Game_price;
                    
                    player2_strategies[ActiveStrategy2] = Math.round(deltay*100/delta)/100;
                    player2_strategies[ActiveStrategy1] = Math.round(deltax*100/delta)/100;;
                    
                    /*player2_strategies[ActiveStrategy2] = Math.round((-(Game_price-matrix[0][ActiveStrategy1]*(Game_price/matrix[1][ActiveStrategy1]))/(matrix[0][ActiveStrategy1]*(matrix[1][ActiveStrategy2]/matrix[1][ActiveStrategy1])+matrix[0][ActiveStrategy2]))*100)/100;
                    player2_strategies[ActiveStrategy1] = Math.round(((Game_price-matrix[1][ActiveStrategy2]*player2_strategies[ActiveStrategy2])/matrix[1][ActiveStrategy1])*100)/100;*/
 
                    if(n2){
                        var tmp = $.extend(true, [], player1_strategies);
                        player1_strategies = player2_strategies;
                        player2_strategies = tmp;
                    }
                }  
            }else{
                output += 'The system has not the form 2*n or n*2' + "\n";
            }
        }
        
        if(method=='br'){
            output += 'Using Braun-Robinson method' + "\n";
            output += 'After ' + parties_count + ' iterations we have:' + "\n";
        }else if(method=='symplex'){
            output += 'Using symplex method' + "\n";
            output += "\n"+'Result:' + "\n";
        }
        if(player1_strategies != undefined)
            output += 'x<sup>*</sup>(' + player1_strategies.join('; ')+ ')'+"\n";
        if(player2_strategies != undefined)
            output += 'y<sup>*</sup>(' + player2_strategies.join('; ')+ ')'+"\n";
        if(Game_price != undefined)
            output += 'Game price = ' + Game_price + "\n";

        //output += '' + "\n";
        if(!show_steps)
            $('#resultArea').html(output+'</pre>');
    });
});