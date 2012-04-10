/* This function needs node-o3-canvas

git://github.com/ajaxorg/node-o3-canvas.git*/

function nodejs_paint_canvas_graph(max, min, maxX, targY, matrix){

    /* Check for 2*n or n*2 */
    if((matrix.length == 2 && matrix[0].length > 1) || (matrix[0].length == 2 && matrix.length>1)){
        
        var Canvas = require('canvas')
            , canvas = new Canvas(300,400)
            , ctx = canvas.getContext('2d');
        
        max    = parseFloat(max);
        min    = parseFloat(min);
        maxX   = parseFloat(maxX);
        targY  = parseFloat(targY);

        if (canvas.getContext){
            
            ctx.fillStyle="#000";
              
            ctx.moveTo(20,20);
            ctx.lineTo(20,390);
            ctx.moveTo(20,20);
            ctx.lineTo(17,27);
            ctx.moveTo(20,20);
            ctx.lineTo(23,27);
            ctx.font = "15px Arial";
            ctx.fillText("u", 0, 30);
                
            ctx.moveTo(280,20);
            ctx.lineTo(280,390);
           
            var price = 280/(max-min);
            if(max>0 && min<0){
                ctx.moveTo(0,  380+min*price);
                ctx.lineTo(300,380+min*price);
                ctx.moveTo(300,380+min*price);
                ctx.lineTo(287,380+min*price-3);
                ctx.moveTo(300,380+min*price);
                ctx.lineTo(287,380+min*price+3);
            }
                
            for(i=0;i<2;i++)
                for(j=0;j<matrix[i].length;j++){
                    ctx.moveTo(20+i*260-3,380+(-matrix[i][j]+min)*price);
                    ctx.lineTo(20+i*260+3,380+(-matrix[i][j]+min)*price);
                    ctx.fillText(matrix[i][j], 20+i*260-20,380+(-matrix[i][j]+min)*price);
                }
            
            if(matrix[0].length == 2 && matrix.length != 2)
                matrix = transpose(matrix);
            
            for(i=0;i<matrix[0].length;i++){
                ctx.moveTo(20,380+(-matrix[0][i]+min)*price);
                ctx.lineTo(280,380+(-matrix[1][i]+min)*price);
            }
    
            ctx.fillStyle="#ff0000";
    
            ctx.moveTo(280*maxX+11, 380+(-targY+min)*price);
            ctx.arc(280*maxX+11, 380+(-targY+min)*price, 3, 0, 2*Math.PI, false);
            ctx.stroke();
            ctx.fill();
        }

        return  "\n\n"+
                "<img style=\"display:block\" alt=\"Embedded Image\" src=\""+
                    canvas.toDataURL()
                +"\" />"
    }
}

exports.nodejs_paint_canvas_graph = nodejs_paint_canvas_graph;