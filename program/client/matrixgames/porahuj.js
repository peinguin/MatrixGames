function porahuj(matrix, method, params){
    
    var result = Array();
        
    /* Deleting null-lines */
    matrix = delete_null_lines(matrix);

    /* find dominant colls and rows */
    matrix = find_dominant_colls_and_rows(matrix);

    /* Чи знайдено сідлову точку */
    if(matrix.length == 1 && matrix[0].length == 1){
        result['Game_price'] = matrix[0][0];
    }
    
    /* remove the negative items */
    result = remove_the_negative_items(matrix);
    matrix = result['matrix'];
    var maxNegative = result['maxNegative'];
    
    var basis = Array(matrix.length);
    if(method=='symplex'){
        result = symplex(matrix);
    }else
    if(method=='br'){
        result = BraunRobinson(matrix, params['parties_count']);
    }else
    if(method == "graph"){
        
        result = Nx2xN(matrix);
        client_paint_canvas_graph(result['max'], result['min'], result['maxX'], result['targY'], matrix);
    }
    result['maxNegative'] = maxNegative;
    return result;
}