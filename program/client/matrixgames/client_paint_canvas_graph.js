function client_paint_canvas_graph(max, min, maxX, targY, matrix){
    /* Check for 2*n or n*2 */
    if((matrix.length == 2 && matrix[0].length > 1) || (matrix[0].length == 2 && matrix.length>1)){
        
        max    = parseFloat(max);
        min    = parseFloat(min);
        maxX   = parseFloat(maxX);
        targY  = parseFloat(targY);

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
            
            if(matrix[0].length == 2 && matrix.length != 2)
                matrix = transpose(matrix);
            
            for(i=0;i<matrix[0].length;i++){
                ctx.moveTo(20,380+(-matrix[0][i]+min)*price);
                ctx.lineTo(280,380+(-matrix[1][i]+min)*price);
                setTimeout(function() {ctx.stroke();},4000+500*i);
            }
    
            ctx.fillStyle="#ff0000";
    
        
            ctx.moveTo(280*maxX+11, 380+(-targY+min)*price);
            ctx.arc(280*maxX+11, 380+(-targY+min)*price, 3, 0, 2*Math.PI, false);
            setTimeout(function() {ctx.fill();},4500);
        }
    }
}