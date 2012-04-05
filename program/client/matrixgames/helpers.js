function clone(x)
{
    if (x.clone)
        return x.clone();
    if (x.constructor == Array)
    {
        var r = [];
        for (var i=0,n=x.length; i<n; i++)
            r.push(clone(x[i]));
        return r;
    }
    return x;
}


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