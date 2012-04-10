function symplex(matrix, params){
    
    var result = {};
    
    result['output'] = '';
    result['output'] += 'Resolving:' + "\n";
    result['output'] += "\n";
    result['output'] += 'For first player:' + "\n";
    result['output'] += 'F = ';
    for(i=0;i<matrix.length;i++)
        result['output'] += (i>0?'+':'')+' x<sub>'+(i+1)+'</sub> ';
    result['output'] += ' → min' + "\n";
    result['output'] += "\n";
    result['output'] += 'With constraints:' + "\n";
    result['output'] += "\n";
    for(i=0;i<matrix[0].length;i++){
        for(j=0;j<matrix.length;j++)
            result['output'] += matrix[j][i]+'x<sub>'+(j+1)+'</sub>' + ((j+1)<matrix.length?" + ":'');
        result['output'] += ' >= 1' + "\n";
    }
    result['output'] += 'x<sub>j</sub> >= 0. j = 1..' + j + "\n";
    result['output'] += "\n";
    result['output'] += 'For secong player:' + "\n";
    result['output'] += 'Ф = ';
    for(i=0;i<matrix.length;i++)
        result['output'] += (i>0?'+':'')+' y<sub>'+(i+1)+'</sub> ';
    result['output'] += '→ max' + "\n";
    result['output'] += "\n";
    result['output'] += 'With constraints:' + "\n";
    result['output'] += "\n";
    for(i=0;i<matrix.length;i++){
        for(j=0;j<matrix[i].length;j++)
            result['output'] += matrix[i][j]+'y<sub>'+(j+1)+'</sub>' + ((j+1)<matrix[i].length?" + ":'');
        result['output'] += ' <= 1' + "\n";
    }
    result['output'] += 'y<sub>j</sub> >= 0. j = 1..' + j + "\n";
    result['output'] += "\n";
    
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
    
    if(params['show_steps'] == 1){
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
            if(matrix[i][matrix[i].length-1]<0){
                if(matrix[i][matrix[i].length-1] < 0){
                    is_neg = false;
                    for(j=0;j<matrix[i].length-1;j++){
                        if(matrix[i][j]<0){
                            is_neg = true;
                            break;
                        }
                    }
                    if(is_neg && minRow == undefined || max<Math.abs(matrix[i][matrix[i].length-1])){
                        max = Math.abs(matrix[matrix.length-1][i]);
                        minRow = i;
                    }
                }
            }

        var min     = undefined; // minimal division
        var minCell = undefined; // row with minimal division
        
        if(minRow == undefined){
            result = Array();
            result['error'] = 'Has no solution by simplex method';
            return result;
        }

        for(j=0;j<matrix[minRow].length-1;j++){
            if(matrix[minRow][j] < 0){
                if(minCell == undefined || min>Math.abs(matrix[matrix.length-1][j]/matrix[minRow][j])){
                    min = Math.abs(matrix[matrix.length-1][j]/matrix[minRow][j]);
                    minCell = j;
                }
            }
        }
        if(params['show_steps'])
            $("#resultArea").html($("#resultArea").html()+'<p>'+minRow+' '+minCell+"</p>");
        
        basis[minRow] = minCell;
        //Next step
        var tmpMatrix = clone(matrix);
        for(i=0;i<matrix.length;i++)
            for(j=0;j<matrix[i].length;j++){
                if(i != minRow)
                    matrix[i][j] = (tmpMatrix[i][j]*tmpMatrix[minRow][minCell]-tmpMatrix[minRow][j]*tmpMatrix[i][minCell])/tmpMatrix[minRow][minCell];
                else
                    matrix[i][j] = tmpMatrix[i][j]/tmpMatrix[minRow][minCell];
            }
        
        //Show steps
        if(params['show_steps'] == 1){
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
    
    result['Game_price'] = 0;
    result['player2_strategies'] = Array(significant_elements);
    for(i=0;i<significant_elements;i++)
        result['player2_strategies'][i] = 0;
    for(i=0;i<matrix.length;i++){
        if(basis[i]<significant_elements){
            result['player2_strategies'][basis[i]] = matrix[i][matrix[i].length-1];
            result['Game_price'] += matrix[i][matrix[i].length-1];
        }
    }

    player1_strategies_len = matrix[0].length-significant_elements-1;
    result['player1_strategies'] = Array(player1_strategies_len);
    for(i=0;i<player1_strategies_len;i++)
        result['player1_strategies'][i] = -matrix[matrix.length-1][significant_elements+i];

    result['Game_price'] = 1/result['Game_price'];
        
    for(i=0;i<significant_elements;i++)
        result['player2_strategies'][i] = Math.round((result['Game_price'] * result['player2_strategies'][i] )*100)/100;
    for(i=0;i<player1_strategies_len;i++)
        result['player1_strategies'][i] = Math.round((result['Game_price'] * result['player1_strategies'][i] )*100)/100;

    result['Game_price'] = Math.round(result['Game_price']*100)/100;
    
    /*if(maxNegative<0){
        result['Game_price'] -= summand;
    }*/
    
    return result;
}