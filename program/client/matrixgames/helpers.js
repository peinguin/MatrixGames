function delete_null_lines(matrix){
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
    
    return matrix;
}

function find_dominant_colls_and_rows(matrix){
    for(i=0;i<matrix.length;i++){
        for(k=0;k<matrix.length;k++){
            if(i!=k){
                dominant = true;
                for(j=0;j<matrix[i].length;j++){
                    if(matrix[i][j] > matrix[k][j]){
                        dominant = false;
                        break;
                    }
                }
                if(dominant){
                    matrix.splice(k, 1);
                    k = k - 1;
                    if(i>k)i--;
                }
            }
        }
    }
    for(i=0;i<matrix[0].length;i++){
        for(k=0;k<matrix[0].length;k++){
            if(i!=k){
                dominant = true;
                for(j=0;j<matrix.length;j++){
                    if(matrix[j][i] > matrix[j][k]){
                        dominant = false;
                        break;
                    }
                }
                if(dominant){
                    for(j=0;j<matrix.length;j++){
                        matrix[j].splice(k, 1);
                    }
                    k = k - 1;
                    if(i>k)i--;
                }
            }
        }
    }
    return matrix;
}

function remove_the_negative_items(matrix){
    var result = Array();
    var maxNegative = 0;
    for(i=0;i<matrix.length;i++){
        for(j=0;j<matrix[i].length;j++){
            if(matrix[i][j]<0 && matrix[i][j]<maxNegative)
                maxNegative = matrix[i][j];
        }
    }
    
    if(maxNegative<0){
        var summand = -maxNegative;
        for(i=0;i<matrix.length;i++){
            for(j=0;j<matrix[i].length;j++){
                matrix[i][j]+= summand;
            }
        }
    }
    result['matrix'] = matrix;
    result['maxNegative'] = maxNegative;
    return result;
}