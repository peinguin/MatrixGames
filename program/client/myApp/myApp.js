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
    /*handlers: {
        init: "initHandler"
    },*/
    components: [
        { tag: "div", classes: "blankblock", content: '&nbsp' },
        { tag: "div", classes: "label1", content: 'Player A' },
        { tag: "div", classes: "label2", content: 'B' },
        { name:'matrixTable', tag: "table", components: [
            {tag: 'tr', components: [
                {tag: 'td', components: [{tag: 'input'}]},
                {tag: 'td', components: [{tag: 'input'}]}
            ]},
            {tag: 'tr', components: [
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
                { tag: 'label', content: 'symplex' }
            ]},
            { components:[
                {tag: 'input type="radio" name="method" value="br"' },
                { tag: 'label', content: 'Braun-Bobinson' }
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
                arr.push($(this).children('input').val());
            });
            matrix.push(arr);
        });
        
        var method = $('#method input[type="radio"]:checked').val();

        
        var output = '<pre>';
        output += 'Resolving:' + "\n";
         output += "\n";
        output += 'For first player:' + "\n";
        output += 'F=-y1-y2-y3-y4→max' + "\n";
         output += "\n";
        output += 'For secong player:' + "\n";
        output += 'F=y1+y2+y3+y4→min' + "\n";
         output += "\n";
        output += 'With constraints:' + "\n";
        output += "\n";
        for(i=0;i<matrix.length;i++){
            for(j=0;j<matrix[i].length;j++)
                output += matrix[i][j]+'y<sub>'+j+'</sub>' + ((j+1)<matrix[i].length?" + ":'');
            output += ' >= 1' + "\n";
        }
        output += 'x<sub>j</sub> >= 0. x = 1..' + j + "\n";
        output += "\n";
        
        if(method=='br')output += 'Using Braun-Robinson method' + "\n";
        else if(method=='symplex')output += 'Using symplex method' + "\n";
        //output += '' + "\n";
        $('#resultArea').html(output+'</pre>');
    });
});