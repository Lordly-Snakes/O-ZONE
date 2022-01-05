'use strict';

$(document).ready(function(){

    $("#start").click(
        function(){
            $('.buttons').hide();
            $('.progr').show();

            $.ajax({
                url: './apiCreate.php',
                type: "GET",
                dataType:"json",
                success: function(data3) {
                        let arrayRes=new Array();
                        let arr = data3.goods;
                        for(let i=0;i<arr.length;i++){
                            if(!(arrayRes.indexOf(arr[i].category)>-1)){
                                arrayRes.push(arr[i].category.toString());
                            }
                            
                        }
                        $.ajax({
                            url: './createDatabase.php?type=addCategory',
                            type: "POST",
                            data: {"data": arrayRes},
                            success: function(data2) {
                                    console.log(data2);
                                    $.ajax({
                                        url: './createDatabase.php?type=addGoods',
                                        type: "POST",
                                        data: {"data": JSON.stringify( arr)},
                                        success: function(data) {
                                                console.log(data);
                                                $('.res').show();
                                                $('.progr').hide();
                                            }
                                        });
                                }
                            });

                    }
                });
        }
    );
    $("#create").click(
        function (param) {  
            $('.buttons').hide();
            $('.progr').show();
        $.ajax({
            url: './createDatabase.php?type=createdb',
            type: "GET",
            success: function(data) {
                    console.log(data);
                    $('.buttons').show();
                    $('.progr').hide();
                    $('#start').show();
                    $('#create').hide();
                    
                }
            })
        }
    );


});
