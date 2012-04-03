function Nx2xN(matrix){
    var result = Array();
    
    /* Check for 2*n or n*2 */
    if((matrix.length == 2 && matrix[0].length > 1) || (matrix[0].length == 2 && matrix.length>1)){
        var n2 = false;
        if(matrix[0].length == 2 && matrix.length != 2){
            n2 = true;
            matrix = transpose(matrix);
        }
        
        result['min'] = (Math.min.apply(null, matrix[0].concat(matrix[1])));
        result['max'] = (Math.max.apply(null, matrix[0].concat(matrix[1])));
        
        result['maxX'];
        if(!n2){
            result['targY'] = min-1;
        }else{
            result['targY'] = max+1;
        }
        
        var ActiveStrategy1, ActiveStrategy2;
        
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

                        if(!n2){
                            /* in minimals */
                            var cond = true;
                            for(k=0;k<matrix[0].length;k++){
                                var x1 = 0;
                                var x2 = 1;
                                
                                var y1 = matrix[0][k];
                                var y2 = matrix[1][k];
                                
                                if(((y1-y2)*x-(x1*y2-x2*y1))/(x2-x1) < y || -x<0 || -x>1)
                                    cond = false;
                            }
                        }else{
                            /* in maximals */
                            var cond = true;
                            for(k=0;k<matrix[0].length;k++){
                                var x1 = 0;
                                var x2 = 1;
                                
                                var y1 = matrix[0][k];
                                var y2 = matrix[1][k];
                                
                                if(((y1-y2)*x-(x1*y2-x2*y1))/(x2-x1) > y || -x<0 || -x>1)
                                    cond = false;
                            }
                        }
                        if(cond && ((y<result['targY'] && n2) || (y>result['targY'] && !n2))){
                            result['targY'] = y;
                            result['maxX'] = -x;
                            ActiveStrategy1 = i;
                            ActiveStrategy2 = j;
                        }
                    }
                }
            }
        }
        
        result['player1_strategies'] = Array();
        result['player1_strategies'].push(Math.round((1-result['maxX'])*100)/100);
        result['player1_strategies'].push(Math.round(result['maxX']*100)/100);
        result['Game_price'] = Math.round(result['targY']*100)/100;
            
        result['player2_strategies'] = Array(matrix[0].length);
        for(i=0;i<matrix[0].length;i++)
            result['player2_strategies'][i] = 0;
            
            
        delta  = matrix[0][ActiveStrategy1]*matrix[1][ActiveStrategy2]-matrix[0][ActiveStrategy2]*matrix[1][ActiveStrategy1];
        deltax = result['Game_price']*matrix[1][ActiveStrategy2]-matrix[0][ActiveStrategy2]*result['Game_price'];
        deltay = result['Game_price']*matrix[0][ActiveStrategy1]-matrix[1][ActiveStrategy1]*result['Game_price'];
            
        result['player2_strategies'][ActiveStrategy2] = Math.round(deltay*100/delta)/100;
        result['player2_strategies'][ActiveStrategy1] = Math.round(deltax*100/delta)/100;;
            
        if(maxNegative<0){
            result['Game_price'] -= summand;
        }

        if(!n2){
            var tmp = $.extend(true, [], result['player1_strategies']);
            result['player1_strategies'] = result['player2_strategies'];
            result['player2_strategies'] = tmp;
        }
    }else{
        output += 'The system has not the form 2*n or n*2' + "\n";
    }
    
    return result;
}