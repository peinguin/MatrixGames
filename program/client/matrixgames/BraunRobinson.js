function BraunRobinson(matrix, params){

    var player1_strategy = undefined;
    var player2_strategy = undefined;
    var u = undefined;
    var w = undefined;
    
    var parties_count = params['parties_count'];
    
    var result = {};
    
    result['player1_strategies'] = Array(matrix[0].length);
        for(i=0;i<result['player1_strategies'].length;i++)result['player1_strategies'][i] = 0;
    result['player2_strategies'] = Array(matrix.length);
        for(i=0;i<result['player2_strategies'].length;i++)result['player2_strategies'][i] = 0;
        
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
        
        result['player2_strategies'][player2_strategy]++;
        for(i=0;i<matrix[player2_strategy].length;i++)
            player2_sums[i]+=matrix[player2_strategy][i];
        
        for(i=0;i<player2_sums.length;i++){
            if(player2_sums[i]<player2_sums[player1_strategy]){
                player1_strategy = i;
            }
        }
        
        result['player1_strategies'][player1_strategy]++;
            
        for(i=0;i<matrix.length;i++)
            player1_sums[i]+=matrix[i][player1_strategy];
    }

    result['player1_strategies'] = result['player1_strategies'].map(function(x){return Math.round((x/parties_count)*100)/100;});
    result['player2_strategies'] = result['player2_strategies'].map(function(x){return Math.round((x/parties_count)*100)/100;});
    result['Game_price'] = (Math.round(((Math.min.apply(null, player2_sums) + Math.max.apply(null, player1_sums))/(parties_count*2))*100)/100);
    
    return result;
}