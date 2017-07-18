$(document).ready(function() {
    //            localStorage.clear();
//                if (navigator.geolocation) {
//                    navigator.geolocation.getCurrentPosition(showPosition);
//                }
//                else {
//                    alert("Geolocation is not supported in this Browser");
//                };
//            function showPosition(position)
//            {
//            //    alert(position.coords.latitude + " " + position.coords.longitude);
//            }
//        localStorage.clear();
        $.ajaxSetup({ cache: true });
        angular.bootstrap(document.getElementById("mimePie"), ['mimePie']);
        angular.bootstrap(document.getElementById("licensePie"), ['licensePie']);
        search();
    });

    function search() {

      var mimePie = angular.element(document.getElementById("mimePieCtr")).scope();
      var licensePie = angular.element(document.getElementById("licensePieCtr")).scope();

      // Refresh Charts
      mimePie.$apply(function() {
        mimePie.refreshPieChart(10);
      });
      licensePie.$apply(function() {
        licensePie.refreshPieChartLicense();
      });

    }

    //Clear the form
    var app = angular.module('myApp', []);
    app.controller('formCtrl', function($scope) {
        $scope.master = {keyword:""};
        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
        };
        $scope.reset();
    });

    var app1 = angular.module("slideApp",["ng-animate"]);
    app1.controller("slideCtrl", function($scope){
        $scope.hValue = false;
    });

    $(document).ready(function(){
        $("#clear").click(function(){
            window.location.reload();
        });
    });

//  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    function FB_post(profile_pic, name1)
    {
    //    alert(profile_pic);
    //    alert(name);
            FB.ui
            (
                {
                    app_id: '311830855919311',
                    method: 'feed',
            //        link: 'https://www.facebook.com/',
                    link: window.location.href,
                    picture: profile_pic,
                    name: name1,
            //        display: 'popup',
                    caption: 'FB SEARCH FROM USC CSCI571',
                },
                function(response)
                {
                //    alert(response);
                    if(response && !response.error_message)
                    {    alert("Message Posted");    }
                    else
                    {
                    //    console.log(response.error_message);
                        alert("Message Not Posted");
                    }
                }
            );
    }
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    function backFavPage()
    {
        $(document).ready(function(){
                $("#fav_album").empty();
                $("#fav_posts").empty();
                $("#fav_detail").hide();
                $("#fav_div").show();
        });
    }

    function printFavDetails(id)
    {
        $.ajax({
            type: 'GET',
            url: "homework8.php",
            data: {id: id},
            datatype: 'json',
            success: function(data){
                var jsObj = JSON.parse(data);
//                console.log(jsObj);

        if(jsObj.hasOwnProperty("albums"))
        {
            var final = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backFavPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
            var content = [];
            var album_data_count = jsObj.albums.data.length;
            for(i=0;i<album_data_count;i++)
            {
                if(jsObj.albums.data[i].hasOwnProperty("photos"))
                {
                    if(i == 0)
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">";
                    }
                    else
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse\"><div class=\"panel-body\">";
                    }
                    photo_count = jsObj.albums.data[i].photos.data.length;
                    for(j=0;j<photo_count;j++)
                    {
                        var pic_url = jsObj.albums.data[i].photos.data[j].picture;
                        content[i] += "<img src=\""+pic_url+"\" height=\"100px\" width=\"100px\">";
                    }
                    content[i] += "</div></div></div>";
                }
            }

            for(i=0;i<album_data_count;i++)
            {
                final += content[i];
            }
            final += "</div>";

            $(document).ready(function(){
                    $("#fav_album").append(final);
                    $("#fav_div").hide();
                    $("#fav_detail").show();
                });
        }
        else
        {
            $(document).ready(function(){
                var content = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backFavPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
                content += "<br/><br/>No Albums Found";
                $("#fav_album").append(content);
                $("#fav_div").hide();
                $("#fav_detail").show();
            });
        }
        if(jsObj.hasOwnProperty("posts"))
        {
            var name = jsObj.name;
            var t_id = jsObj.id;
            var profile_pic = jsObj.picture.data.url;
            var post = [];
            var time = [];
            var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
            story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
            story_post += ">Facebook</button>";
            var post_count = jsObj.posts.data.length;
            for(i=0;i<post_count;i++)
            {
                if(jsObj.posts.data[i].hasOwnProperty("message"))
                {
                    post[i] = jsObj.posts.data[i].message;
                    var time_d = new Date(jsObj.posts.data[i].created_time);
                    var year = time_d.getFullYear();
                    var month = time_d.getMonth() + 1;
                    if(month.toString().length == 1)
                    {
                        month = "0" + month;
                    }
                    var date = time_d.getDate();
                    if(date.toString().length == 1)
                    {
                        date = "0" + date;
                    }
                    var hours = time_d.getHours();
                    var minutes = time_d.getMinutes();
                    var seconds = time_d.getSeconds();
                    time[i] = year + "-" + date + "-" + month + " " + hours + ":" + minutes + ":" + seconds;
//                    console.log(time[i]);
                    story_post += "<div class=\"well\"><p><img src=\""+profile_pic+"\" height=\"60px\" width=\"50px\" style=\"float:left;\"><strong>"+name+"</strong><br/>"+time[i]+"</p><br/><p>"+post[i]+"</p></div>";
                }
            }
            $(document).ready(function(){
                    $("#fav_posts").append(story_post);
                });

        }
        else
        {
            $(document).ready(function(){
                var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
                story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
                story_post += ">Facebook</button>";
                var content = "<br/><br/><br/>No Posts Found<br/><br/>";
                $("#fav_posts").append(story_post);
                $("#fav_posts").append(content);
            });
        }

        }
        });
    }



    function addFav(id,pic,name)
    {

        if(typeof(Storage) !== "undefined")
        {
            $("#fav_table").empty();
//            console.log(id);
            if(localStorage.hasOwnProperty(id))
            {
                localStorage.removeItem(id);
            }
            else
            {
                var data = id+","+pic+","+name;
                localStorage.setItem(id,JSON.stringify(data));
            }
            var len = localStorage.length;
            var keys = Object.keys(localStorage);
     //       console.log(keys);
            var content = "<thead><th>#</th><th>Profile Photo</th><th>Name</th><th>Favorite</th><th>Details</th></thead><tbody>";
            for(i=0;i<len;i++)
            {
                var value = localStorage.getItem(keys[i]);
                var vlen = value.length;
                value = value.slice(1,vlen-1);
                var ivalue = value.split(",");
                var f_id = ivalue[0];
                if(f_id != undefined)
                {
       //             console.log(f_id);
                    var f_pic = ivalue[1];
                    var f_name = ivalue[2];
           //         console.log(f_name);
                    content += "<tr>";
                    content += "<td>"+(i+1)+"</td>";
                    content += "<td><img src='"+f_pic+"' style='width:30px; height:30px; border-radius:50%;' onclick=\"window.open('"+f_pic+"')\"></td>";
                    content += "<td>"+f_name+"</td>";
                    content += "<td><button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+f_id+"','"+f_pic+"','"+f_name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button></td>";
                    content += "<td><button type=\"button\" onclick=\"printFavDetails('"+f_id+"')\" class=\"btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-menu-right\"></span></button></td>";
                    content += "</tr>";
                }
            }
            content += "</tbody>";
            $("#fav_table").append(content);
        }
        else
        {
            alert("browser does not support local storage");
        }
    }

    // FIX THIS
    var clicks = 1;
    function changeColor(favBtn)
    {
        if(clicks == 0)
        {
            favBtn.style.color = "#ffc000";
            clicks = 1;
        }
        else
        {
            favBtn.style.color = "black";
            clicks = 0;
        }
    }

    function backUPage()
    {
        $(document).ready(function(){
                $("#user_album").empty();
                $("#user_posts").empty();
                $("#user_detail").hide();
                $("#user_div").show();
        });
    }
    function backPgPage()
    {
        $(document).ready(function(){
                $("#page_album").empty();
                $("#page_posts").empty();
                $("#page_detail").hide();
                $("#page_div").show();
        });
    }
    function backEPage()
    {
        $(document).ready(function(){
                $("#event_album").empty();
                $("#event_posts").empty();
                $("#event_detail").hide();
                $("#event_div").show();
        });
    }
    function backPlPage()
    {
        $(document).ready(function(){
                $("#place_album").empty();
                $("#place_posts").empty();
                $("#place_detail").hide();
                $("#place_div").show();
        });
    }
    function backGPage()
    {
        $(document).ready(function(){
                $("#group_album").empty();
                $("#group_posts").empty();
                $("#group_detail").hide();
                $("#group_div").show();
        });
    }
    function backFPage()
    {
        $(document).ready(function(){
                $("#fav_album").empty();
                $("#fav_posts").empty();
                $("#fav_detail").hide();
                $("#fav_div").show();
        });
    }

    function printPageDetails(id)
    {
        $.ajax({
            type: 'GET',
            url: "homework8.php",
            data: {id: id},
            datatype: 'json',
            success: function(data){
                var jsObj = JSON.parse(data);
      //          console.log(jsObj);

        if(jsObj.hasOwnProperty("albums"))
        {
            var final = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backPgPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
            var content = [];
            var album_data_count = jsObj.albums.data.length;
            for(i=0;i<album_data_count;i++)
            {
                if(jsObj.albums.data[i].hasOwnProperty("photos"))
                {
                    if(i == 0)
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">";
                    }
                    else
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse\"><div class=\"panel-body\">";
                    }
                    photo_count = jsObj.albums.data[i].photos.data.length;
                    for(j=0;j<photo_count;j++)
                    {
                        var pic_url = jsObj.albums.data[i].photos.data[j].picture;
                        content[i] += "<img src=\""+pic_url+"\" height=\"100px\" width=\"100px\">";
                    }
                    content[i] += "</div></div></div>";
                }
            }

            for(i=0;i<album_data_count;i++)
            {
                final += content[i];
            }
            final += "</div>";

            $(document).ready(function(){
                    $("#page_album").append(final);
                    $("#page_div").hide();
                    $("#page_detail").show();
                });
        }
        else
        {
            $(document).ready(function(){
                var content = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backPgPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
                content += "<br/><br/>No Albums Found";
                $("#page_album").append(content);
                $("#page_div").hide();
                $("#page_detail").show();
            });
        }
        if(jsObj.hasOwnProperty("posts"))
        {
            var name = jsObj.name;
            var t_id = jsObj.id;
            var profile_pic = jsObj.picture.data.url;
            var post = [];
            var time = [];
            var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
            story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
            story_post += ">Facebook</button>";
            var post_count = jsObj.posts.data.length;
            for(i=0;i<post_count;i++)
            {
                if(jsObj.posts.data[i].hasOwnProperty("message"))
                {
                    post[i] = jsObj.posts.data[i].message;
                    var time_d = new Date(jsObj.posts.data[i].created_time);
                    var year = time_d.getFullYear();
                    var month = time_d.getMonth() + 1;
                    if(month.toString().length == 1)
                    {
                        month = "0" + month;
                    }
                    var date = time_d.getDate();
                    if(date.toString().length == 1)
                    {
                        date = "0" + date;
                    }
                    var hours = time_d.getHours();
                    var minutes = time_d.getMinutes();
                    var seconds = time_d.getSeconds();
                    time[i] = year + "-" + date + "-" + month + " " + hours + ":" + minutes + ":" + seconds;
         //           console.log(time[i]);
                    story_post += "<div class=\"well\"><p><img src=\""+profile_pic+"\" height=\"60px\" width=\"50px\" style=\"float:left;\"><strong>"+name+"</strong><br/>"+time[i]+"</p><br/><p>"+post[i]+"</p></div>";
                }
            }
            $(document).ready(function(){
                    $("#page_posts").append(story_post);
                });

        }
        else
        {
            $(document).ready(function(){
                var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
                story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
                story_post += ">Facebook</button>";
                var content = "<br/><br/><br/>No Posts Found<br/><br/>";
                $("#page_posts").append(story_post);
                $("#page_posts").append(content);
            });
        }

        }
        });
    }

    function printUserDetails(id)
    {
        $.ajax({
            type: 'GET',
            url: "homework8.php",
            data: {id: id},
            datatype: 'json',
            success: function(data){
                var jsObj = JSON.parse(data);
     //           console.log(jsObj);

        if(jsObj.hasOwnProperty("albums"))
        {
            var final = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backUPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
            var content = [];
            var album_data_count = jsObj.albums.data.length;
            for(i=0;i<album_data_count;i++)
            {
                if(jsObj.albums.data[i].hasOwnProperty("photos"))
                {
                    if(i == 0)
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">";
                    }
                    else
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse\"><div class=\"panel-body\">";
                    }
                    photo_count = jsObj.albums.data[i].photos.data.length;
                    for(j=0;j<photo_count;j++)
                    {
                        var pic_url = jsObj.albums.data[i].photos.data[j].picture;
                        content[i] += "<img src=\""+pic_url+"\" height=\"100px\" width=\"100px\">";
                    }
                    content[i] += "</div></div></div>";
                }
            }

            for(i=0;i<album_data_count;i++)
            {
                final += content[i];
            }
            final += "</div>";

            $(document).ready(function(){
                    $("#user_album").append(final);
                    $("#user_div").hide();
                    $("#user_detail").show();
                });
        }
        else
        {
            $(document).ready(function(){
                var content = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backUPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
                content += "<br/><br/>No Albums Found";
                $("#user_album").append(content);
                $("#user_div").hide();
                $("#user_detail").show();
            });
        }
        if(jsObj.hasOwnProperty("posts"))
        {
            var name = jsObj.name;
            var t_id = jsObj.id;
            var profile_pic = jsObj.picture.data.url;
            var post = [];
            var time = [];
            var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
            story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
            story_post += ">Facebook</button>";
            var post_count = jsObj.posts.data.length;
            for(i=0;i<post_count;i++)
            {
                if(jsObj.posts.data[i].hasOwnProperty("message"))
                {
                    post[i] = jsObj.posts.data[i].message;
                    var time_d = new Date(jsObj.posts.data[i].created_time);
                    var year = time_d.getFullYear();
                    var month = time_d.getMonth() + 1;
                    if(month.toString().length == 1)
                    {
                        month = "0" + month;
                    }
                    var date = time_d.getDate();
                    if(date.toString().length == 1)
                    {
                        date = "0" + date;
                    }
                    var hours = time_d.getHours();
                    var minutes = time_d.getMinutes();
                    var seconds = time_d.getSeconds();
                    time[i] = year + "-" + date + "-" + month + " " + hours + ":" + minutes + ":" + seconds;
        //            console.log(time[i]);
                    story_post += "<div class=\"well\"><p><img src=\""+profile_pic+"\" height=\"60px\" width=\"50px\" style=\"float:left;\"><strong>"+name+"</strong><br/>"+time[i]+"</p><br/><p>"+post[i]+"</p></div>";
                }
            }
            $(document).ready(function(){
                    $("#user_posts").append(story_post);
                });

        }
        else
        {
            $(document).ready(function(){
                var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
                story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
                story_post += ">Facebook</button>";
                var content = "<br/><br/><br/>No Posts Found<br/><br/>";
                $("#user_posts").append(story_post);
                $("#user_posts").append(content);
            });
        }

        }
        });
    }

    function printEventDetails(id,pic,name)
    {
//        $.ajax({
//            type: 'GET',
//            url: "homework8.php",
//            data: {id: id},
//            datatype: 'json',
//            success: function(data){
                    $(document).ready(function(){
                        var content = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backEPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
                        content += "<br/><br/>No Albums Found";
                        $("#event_album").append(content);
                        $("#event_div").hide();
                        $("#event_detail").show();
                        var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+id+"','"+pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
                        story_post += "onclick=\"FB_post('"+pic+"','"+name+"')\"";
                        story_post += ">Facebook</button>";
                        var content = "<br/><br/><br/>No Posts Found<br/><br/>";
                        $("#event_posts").append(story_post);
                        $("#event_posts").append(content);
                    });
    //            }
    //    });

    }


    function printGroupDetails(id)
    {
        $.ajax({
            type: 'GET',
            url: "homework8.php",
            data: {id: id},
            datatype: 'json',
            success: function(data){
                var jsObj = JSON.parse(data);
     //           console.log(jsObj);

        if(jsObj.hasOwnProperty("albums"))
        {
            var final = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backGPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
            var content = [];
            var album_data_count = jsObj.albums.data.length;
            for(i=0;i<album_data_count;i++)
            {
                if(jsObj.albums.data[i].hasOwnProperty("photos"))
                {
                    if(i == 0)
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">";
                    }
                    else
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse\"><div class=\"panel-body\">";
                    }
                    photo_count = jsObj.albums.data[i].photos.data.length;
                    for(j=0;j<photo_count;j++)
                    {
                        var pic_url = jsObj.albums.data[i].photos.data[j].picture;
                        content[i] += "<img src=\""+pic_url+"\" height=\"100px\" width=\"100px\">";
                    }
                    content[i] += "</div></div></div>";
                }
            }

            for(i=0;i<album_data_count;i++)
            {
                final += content[i];
            }
            final += "</div>";

            $(document).ready(function(){
                    $("#group_album").append(final);
                    $("#group_div").hide();
                    $("#group_detail").show();
                });
        }
        else
        {
            $(document).ready(function(){
                var content = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backGPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
                content += "<br/><br/>No Albums Found";
                $("#group_album").append(content);
                $("#group_div").hide();
                $("#group_detail").show();
            });
        }
        if(jsObj.hasOwnProperty("posts"))
        {
            var name = jsObj.name;
            var t_id = jsObj.id;
            var profile_pic = jsObj.picture.data.url;
            var post = [];
            var time = [];
            var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
            story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
            story_post += ">Facebook</button>";
            var post_count = jsObj.posts.data.length;
            for(i=0;i<post_count;i++)
            {
                if(jsObj.posts.data[i].hasOwnProperty("message"))
                {
                    post[i] = jsObj.posts.data[i].message;
                    var time_d = new Date(jsObj.posts.data[i].created_time);
                    var year = time_d.getFullYear();
                    var month = time_d.getMonth() + 1;
                    if(month.toString().length == 1)
                    {
                        month = "0" + month;
                    }
                    var date = time_d.getDate();
                    if(date.toString().length == 1)
                    {
                        date = "0" + date;
                    }
                    var hours = time_d.getHours();
                    var minutes = time_d.getMinutes();
                    var seconds = time_d.getSeconds();
                    time[i] = year + "-" + date + "-" + month + " " + hours + ":" + minutes + ":" + seconds;
       //             console.log(time[i]);
                    story_post += "<div class=\"well\"><p><img src=\""+profile_pic+"\" height=\"60px\" width=\"50px\" style=\"float:left;\"><strong>"+name+"</strong><br/>"+time[i]+"</p><br/><p>"+post[i]+"</p></div>";
                }
            }
            $(document).ready(function(){
                    $("#group_posts").append(story_post);
                });

        }
        else
        {
            $(document).ready(function(){
                var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
                story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
                story_post += ">Facebook</button>";
                var content = "<br/><br/><br/>No Posts Found<br/><br/>";
                $("#group_posts").append(story_post);
                $("#group_posts").append(content);
            });
        }

        }
        });
    }

    function printPlaceDetails(id)
    {
        $.ajax({
            type: 'GET',
            url: "homework8.php",
            data: {id: id},
            datatype: 'json',
            success: function(data){
                var jsObj = JSON.parse(data);
   //             console.log(jsObj);

        if(jsObj.hasOwnProperty("albums"))
        {
            var final = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backPlPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
            var content = [];
            var album_data_count = jsObj.albums.data.length;
            for(i=0;i<album_data_count;i++)
            {
                if(jsObj.albums.data[i].hasOwnProperty("photos"))
                {
                    if(i == 0)
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">";
                    }
                    else
                    {
                        content[i] = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse"+i+"\">"+jsObj.albums.data[i].name+"</a></h4></div><div id=\"collapse"+i+"\" class=\"panel-collapse collapse\"><div class=\"panel-body\">";
                    }
                    photo_count = jsObj.albums.data[i].photos.data.length;
                    for(j=0;j<photo_count;j++)
                    {
                        var pic_url = jsObj.albums.data[i].photos.data[j].picture;
                        content[i] += "<img src=\""+pic_url+"\" height=\"100px\" width=\"100px\">";
                    }
                    content[i] += "</div></div></div>";
                }
            }

            for(i=0;i<album_data_count;i++)
            {
                final += content[i];
            }
            final += "</div>";

            $(document).ready(function(){
                    $("#place_album").append(final);
                    $("#place_div").hide();
                    $("#place_detail").show();
                });
        }
        else
        {
            $(document).ready(function(){
                var content = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"backPlPage()\"><span class=\"glyphicon glyphicon-menu-left\"></span>Back</button><div class=\"panel-group\" id=\"accordion\">";
                content += "<br/><br/>No Albums Found";
                $("#place_album").append(content);
                $("#place_div").hide();
                $("#place_detail").show();
            });
        }
        if(jsObj.hasOwnProperty("posts"))
        {
            var name = jsObj.name;
            var t_id = jsObj.id;
            var profile_pic = jsObj.picture.data.url;
            var post = [];
            var time = [];
            var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
            story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
            story_post += ">Facebook</button>";
            var post_count = jsObj.posts.data.length;
            for(i=0;i<post_count;i++)
            {
                if(jsObj.posts.data[i].hasOwnProperty("message"))
                {
                    post[i] = jsObj.posts.data[i].message;
                    var time_d = new Date(jsObj.posts.data[i].created_time);
                    var year = time_d.getFullYear();
                    var month = time_d.getMonth() + 1;
                    if(month.toString().length == 1)
                    {
                        month = "0" + month;
                    }
                    var date = time_d.getDate();
                    if(date.toString().length == 1)
                    {
                        date = "0" + date;
                    }
                    var hours = time_d.getHours();
                    var minutes = time_d.getMinutes();
                    var seconds = time_d.getSeconds();
                    time[i] = year + "-" + date + "-" + month + " " + hours + ":" + minutes + ":" + seconds;
      //              console.log(time[i]);
                    story_post += "<div class=\"well\"><p><img src=\""+profile_pic+"\" height=\"60px\" width=\"50px\" style=\"float:left;\"><strong>"+name+"</strong><br/>"+time[i]+"</p><br/><p>"+post[i]+"</p></div>";
                }
            }
            $(document).ready(function(){
                    $("#place_posts").append(story_post);
                });

        }
        else
        {
            $(document).ready(function(){
                var story_post = "<button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+t_id+"','"+profile_pic+"','"+name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button><button type=\"button\" id=\"shareBtn\" class=\"btn btn-default btn-sm\"";
                story_post += "onclick=\"FB_post('"+profile_pic+"','"+name+"')\"";
                story_post += ">Facebook</button>";
                var content = "<br/><br/><br/>No Posts Found<br/><br/>";
                $("#place_posts").append(story_post);
                $("#place_posts").append(content);
            });
        }

        }
        });
    }

//Prev-Next Page for USERS
    function prevUPage(prev_page)
    {
        $.ajax({
            type: 'GET',
            url: prev_page,
            datatype: 'json',
            success: function(data){
                $("#user_table").empty();
                $("#prev_ubtn").remove();
                $("#next_ubtn").remove();
                printUser(data);
            }
        });
    }

    function nextUPage(next_page)
    {
        $.ajax({
            type: 'GET',
            url: next_page,
            datatype: 'json',
            success: function(data){
                $("#user_table").empty();
                $("#prev_ubtn").remove();
                $("#next_ubtn").remove();
                printUser(data);
            }
        });
    }


// Prev-Next Page for PAGES
    function prevPgPage(prev_page)
    {
        $.ajax({
            type: 'GET',
            url: prev_page,
            datatype: 'json',
            success: function(data){
                $("#page_table").empty();
                $("#prev_pgbtn").remove();
                $("#next_pgbtn").remove();
                printPage(data);
            }
        });
    }

    function nextPgPage(next_page)
    {
//        alert(next_page);
        $.ajax({
            type: 'GET',
            url: next_page,
            datatype: 'json',
            success: function(data){
                $("#page_table").empty();
                $("#prev_pgbtn").remove();
                $("#next_pgbtn").remove();
                printPage(data);
            }
        });
    }

// Prev-Next Page for GROUPS
    function prevGPage(prev_page)
    {
        $.ajax({
            type: 'GET',
            url: prev_page,
            datatype: 'json',
            success: function(data){
                $("#group_table").empty();
                $("#prev_gbtn").remove();
                $("#next_gbtn").remove();
                printGroup(data);
            }
        });
    }

    function nextGPage(next_page)
    {
//        alert(next_page);
        $.ajax({
            type: 'GET',
            url: next_page,
            datatype: 'json',
            success: function(data){
                $("#group_table").empty();
                $("#prev_gbtn").remove();
                $("#next_gbtn").remove();
                printGroup(data);
            }
        });
    }

// Prev-Next Page for PLACES
    function prevPlPage(prev_page)
    {
        $.ajax({
            type: 'GET',
            url: prev_page,
            datatype: 'json',
            success: function(data){
                $("#place_table").empty();
                $("#prev_plbtn").remove();
                $("#next_plbtn").remove();
                printPlace(data);
            }
        });
    }

    function nextPlPage(next_page)
    {
//        alert(next_page);
        $.ajax({
            type: 'GET',
            url: next_page,
            datatype: 'json',
            success: function(data){
                $("#place_table").empty();
                $("#prev_plbtn").remove();
                $("#next_plbtn").remove();
                printPlace(data);
            }
        });
    }

// Prev-Next Page for EVENTS
    function prevEPage(prev_page)
    {
        $.ajax({
            type: 'GET',
            url: prev_page,
            datatype: 'json',
            success: function(data){
                $("#event_table").empty();
                $("#prev_ebtn").remove();
                $("#next_ebtn").remove();
                printEvents(data);
            }
        });
    }

    function nextEPage(next_page)
    {
//        alert(next_page);
        $.ajax({
            type: 'GET',
            url: next_page,
            datatype: 'json',
            success: function(data){
                $("#event_table").empty();
                $("#prev_ebtn").remove();
                $("#next_ebtn").remove();
                printEvents(data);
            }
        });
    }


    function printUser(users)
    {
        var content = '';
        content = "<thead><th>#</th><th>Profile Photo</th><th>Name</th><th>Favorite</th><th>Details</th></thead><tbody>";
        var count = users.data.length;
        var u_id = [];
        for(i=0;i<count;i++)
        {
            var user_details = users.data[i];
            var photo_url = user_details.picture.data.url;
            u_id[i] = user_details.id;
  //          console.log(u_id[i]);
            var u_name = user_details.name;
  //          console.log(u_name);
        //    console.log(users);
            content += "<tr>";
            content += "<td>"+(i+1)+"</td>";
            content += "<td><img src='"+photo_url+"' style='width:30px; height:30px; border-radius:50%;' onclick=\"window.open('"+photo_url+"')\"></td>";
            content += "<td>"+u_name+"</td>";
            content += "<td><button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+u_id[i]+"','"+photo_url+"','"+u_name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button></td>";
            content += "<td><button type=\"button\" onclick=\"printUserDetails('"+u_id[i]+"')\" class=\"btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-menu-right\"></span></button></td>";
            content += "</tr>";
        }
        content += "</tbody>";
        if(users.hasOwnProperty("paging"))
        {
            if( (users.paging.hasOwnProperty("previous")) && (users.paging.hasOwnProperty("next")) )
            {
                var prev_page = users.paging.previous;
                $("#user_table").append(content);
                content = "<button id=\"prev_ubtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevUPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";

                var next_page = users.paging.next;
                content += "<button id=\"next_ubtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextUPage('"+next_page+"')\"  style=\"margin-left: 2\%;\">Next</button>";
                $("#user_div").append(content);
            }
            if( (!users.paging.hasOwnProperty("previous")) && (users.paging.hasOwnProperty("next")) )
            {
                var next_page = users.paging.next;
                $("#user_table").append(content);
                content = "<button id=\"next_ubtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextUPage('"+next_page+"')\"  style=\"margin-left: 40\%;\">Next</button>";
                $("#user_div").append(content);
            }
            if( (users.paging.hasOwnProperty("previous")) && (!users.paging.hasOwnProperty("next")) )
            {
                var prev_page = users.paging.previous;
                $("#user_table").append(content);
                content += "<button id=\"prev_ubtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevUPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";
                $("#user_div").append(content);
            }
        }
        else
        {
            $("#user_div").append(content);
        }

    }

    function printPage(pages)
    {
        var content = '';
        content = "<thead><th>#</th><th>Profile Photo</th><th>Name</th><th>Favorite</th><th>Details</th></thead><tbody>";
        var count = pages.data.length;
        var p_id = [];
        for(i=0;i<count;i++)
        {
            var page_details = pages.data[i];
            var photo_url = page_details.picture.data.url;
            p_id[i] = page_details.id;
    //        console.log(p_id[i]);
            var p_name = page_details.name;
    //        console.log(p_name);
    //        console.log(pages);
            content += "<tr>";
            content += "<td>"+(i+1)+"</td>";
            content += "<td><img src='"+photo_url+"' style='width:30px; height:30px; border-radius:50%;' onclick=\"window.open('"+photo_url+"')\"></td>";
            content += "<td>"+p_name+"</td>";
            content += "<td><button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+p_id[i]+"','"+photo_url+"','"+p_name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button></td>";
            content += "<td><button type=\"button\" onclick=\"printPageDetails('"+p_id[i]+"')\" class=\"btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-menu-right\"></span></button></td>";
            content += "</tr>";
        }
        content += "</tbody>";
        if(pages.hasOwnProperty("paging"))
        {
            if( (pages.paging.hasOwnProperty("previous")) && (pages.paging.hasOwnProperty("next")) )
            {
                var prev_page = pages.paging.previous;
                $("#page_table").append(content);
                content = "<button id=\"prev_pgbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevPgPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";

                var next_page = pages.paging.next;
                content += "<button id=\"next_pgbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextPgPage('"+next_page+"')\"  style=\"margin-left: 2\%;\">Next</button>";
                $("#page_div").append(content);
            }
            if( (!pages.paging.hasOwnProperty("previous")) && (pages.paging.hasOwnProperty("next")) )
            {
                var next_page = pages.paging.next;
                $("#page_table").append(content);
                content = "<button id=\"next_pgbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextPgPage('"+next_page+"')\"  style=\"margin-left: 40\%;\">Next</button>";
                $("#page_div").append(content);
            }
            if( (pages.paging.hasOwnProperty("previous")) && (!pages.paging.hasOwnProperty("next")) )
            {
                var prev_page = pages.paging.previous;
                $("#page_table").append(content);
                content += "<button id=\"prev_pgbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevPgPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";
                $("#page_div").append(content);
            }
        }
        else
        {
            $$("#page_div").append(content);
        }
    }

    function printEvents(events)
    {
        var content = '';
        content = "<thead><th>#</th><th>Profile Photo</th><th>Name</th><th>Favorite</th><th>Details</th></thead><tbody>";
        var count = events.data.length;
        var e_id = [];
        for(i=0;i<count;i++)
        {
            var event_details = events.data[i];
            var photo_url = event_details.picture.data.url;
            e_id[i] = event_details.id;
    //        console.log(e_id[i]);
            var e_name = event_details.name;
   //         console.log(e_name);
    //        console.log(events);
            content += "<tr>";
            content += "<td>"+(i+1)+"</td>";
            content += "<td><img src='"+photo_url+"' style='width:30px; height:30px; border-radius:50%;' onclick=\"window.open('"+photo_url+"')\"></td>";
            content += "<td>"+e_name+"</td>";
            content += "<td><button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+e_id[i]+"','"+photo_url+"','"+e_name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button></td>";
            content += "<td><button type=\"button\" onclick=\"printEventDetails('"+e_id[i]+"','"+photo_url+"','"+e_name+"')\" class=\"btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-menu-right\"></span></button></td>";
            content += "</tr>";
        }
        content += "</tbody>";
        if(events.hasOwnProperty("paging"))
        {
            if( (events.paging.hasOwnProperty("previous")) && (events.paging.hasOwnProperty("next")) )
            {
                var prev_page = events.paging.previous;
                $("#event_table").append(content);
                content = "<button id=\"prev_ebtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevEPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";

                var next_page = events.paging.next;
                content += "<button id=\"next_ebtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextEPage('"+next_page+"')\"  style=\"margin-left: 2\%;\">Next</button>";
                $("#event_div").append(content);
            }
            if( (!events.paging.hasOwnProperty("previous")) && (events.paging.hasOwnProperty("next")) )
            {
                var next_page = events.paging.next;
                $("#event_table").append(content);
                content = "<button id=\"next_ebtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextEPage('"+next_page+"')\"  style=\"margin-left: 40\%;\">Next</button>";
                $("#event_div").append(content);
            }
            if( (events.paging.hasOwnProperty("previous")) && (!events.paging.hasOwnProperty("next")) )
            {
                var prev_page = events.paging.previous;
                $("#event_table").append(content);
                content += "<button id=\"prev_ebtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevEPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";
                $("#event_div").append(content);
            }
        }
        else
        {
            $$("#event_div").append(content);
        }
    }

    function printGroup(groups)
    {
        var content = '';
        content = "<thead><th>#</th><th>Profile Photo</th><th>Name</th><th>Favorite</th><th>Details</th></thead><tbody>";
        var count = groups.data.length;
        var g_id = [];
        for(i=0;i<count;i++)
        {
            var group_details = groups.data[i];
            var photo_url = group_details.picture.data.url;
            g_id[i] = group_details.id;
     //       console.log(g_id[i]);
            var g_name = group_details.name;
    //        console.log(g_name);
    //        console.log(groups);
            content += "<tr>";
            content += "<td>"+(i+1)+"</td>";
            content += "<td><img src='"+photo_url+"' style='width:30px; height:30px; border-radius:50%;' onclick=\"window.open('"+photo_url+"')\"></td>";
            content += "<td>"+g_name+"</td>";
            content += "<td><button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+g_id[i]+"','"+photo_url+"','"+g_name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button></td>";
            content += "<td><button type=\"button\" onclick=\"printGroupDetails('"+g_id[i]+"')\" class=\"btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-menu-right\"></span></button></td>";
            content += "</tr>";
        }
        content += "</tbody>";
        if(groups.hasOwnProperty("paging"))
        {
            if( (groups.paging.hasOwnProperty("previous")) && (groups.paging.hasOwnProperty("next")) )
            {
                var prev_page = groups.paging.previous;
                $("#group_table").append(content);
                content = "<button id=\"prev_gbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevGPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";

                var next_page = groups.paging.next;
                content += "<button id=\"next_gbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextGPage('"+next_page+"')\"  style=\"margin-left: 2\%;\">Next</button>";
                $("#group_div").append(content);
            }
            if( (!groups.paging.hasOwnProperty("previous")) && (groups.paging.hasOwnProperty("next")) )
            {
                var next_page = groups.paging.next;
                $("#group_table").append(content);
                content = "<button id=\"next_gbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextGPage('"+next_page+"')\"  style=\"margin-left: 40\%;\">Next</button>";
                $("#group_div").append(content);
            }
            if( (groups.paging.hasOwnProperty("previous")) && (!groups.paging.hasOwnProperty("next")) )
            {
                var prev_page = groups.paging.previous;
                $("#group_table").append(content);
                content += "<button id=\"prev_gbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevGPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";
                $("#group_div").append(content);
            }
        }
        else
        {
            $$("#group_div").append(content);
        }
    }

    function printPlace(places)
    {
        var content = '';
        content = "<thead><th>#</th><th>Profile Photo</th><th>Name</th><th>Favorite</th><th>Details</th></thead><tbody>";
        var count = places.data.length;
        var p_id = [];
        for(i=0;i<count;i++)
        {
            var place_details = places.data[i];
            var photo_url = place_details.picture.data.url;
            p_id[i] = place_details.id;
    //        console.log(p_id[i]);
            var p_name = place_details.name;
    //        console.log(p_name);
    //        console.log(places);
            content += "<tr>";
            content += "<td>"+(i+1)+"</td>";
            content += "<td><img src='"+photo_url+"' style='width:30px; height:30px; border-radius:50%;' onclick=\"window.open('"+photo_url+"')\"></td>";
            content += "<td>"+p_name+"</td>";
            content += "<td><button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"addFav('"+p_id[i]+"','"+photo_url+"','"+p_name+"')\"><span class=\"glyphicon glyphicon-star-empty\"></span></button></td>";
            content += "<td><button type=\"button\" onclick=\"printPlaceDetails('"+p_id[i]+"')\" class=\"btn btn-default btn-sm\"><span class=\"glyphicon glyphicon-menu-right\"></span></button></td>";
            content += "</tr>";
        }
        content += "</tbody>";
        if(places.hasOwnProperty("paging"))
        {
            if( (places.paging.hasOwnProperty("previous")) && (places.paging.hasOwnProperty("next")) )
            {
                var prev_page = places.paging.previous;
                $("#place_table").append(content);
                content = "<button id=\"prev_plbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevPlPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";

                var next_page = places.paging.next;
                content += "<button id=\"next_plbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextPlPage('"+next_page+"')\"  style=\"margin-left: 2\%;\">Next</button>";
                $("#event_div").append(content);
            }
            if( (!places.paging.hasOwnProperty("previous")) && (places.paging.hasOwnProperty("next")) )
            {
                var next_page = places.paging.next;
                $("#place_table").append(content);
                content = "<button id=\"next_plbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"nextPlPage('"+next_page+"')\"  style=\"margin-left: 40\%;\">Next</button>";
                $("#place_div").append(content);
            }
            if( (places.paging.hasOwnProperty("previous")) && (!places.paging.hasOwnProperty("next")) )
            {
                var prev_page = places.paging.previous;
                $("#place_table").append(content);
                content += "<button id=\"prev_plbtn\" type=\"button\" class=\"btn btn-default\" onclick=\"prevPlPage('"+prev_page+"')\"  style=\"margin-left: 40\%;\">Previous</button>";
                $("#place_div").append(content);
            }
        }
        else
        {
            $$("#place_div").append(content);
        }
    }

    function checkvalue(myobj)
    {
        var users = myobj[0];
        printUser(users);
        var pages = myobj[1];
        printPage(pages);
        var events = myobj[2];
        printEvents(events);
        var groups = myobj[3];
        printGroup(groups);
        var places = myobj[4];
        printPlace(places);
    }

    $(document).ready(function(){
        $("#submit").click(function(){
//            $("#table_div").css("display", "block");
//            $("#p_bar").css("display", "block");
            $("#user_table").empty();
            $("#page_table").empty();
            $("#place_table").empty();
            $("#event_table").empty();
            $("#group_table").empty();
            $("#prev_ubtn").remove();
            $("#next_ubtn").remove();
            $("#prev_pgbtn").remove();
            $("#next_pgbtn").remove();
            $("#prev_ebtn").remove();
            $("#next_ebtn").remove();
            $("#prev_plbtn").remove();
            $("#next_plbtn").remove();
            $("#prev_gbtn").remove();
            $("#next_gbtn").remove();
//            $("#table_div").css("display", "block");
            $("#p_bar").css("display", "block");
//            $("#p_bar").css("display", "block");
//            function move(){
                var elem = document.getElementById("myBar");
                var width = 0;
                var id = setInterval(frame, 1);
                function frame() {
                    if (width == 100) {
                        clearInterval(id);
                    } else {
                        width++;
                        elem.style.width = width + '%';
                    }
                }
            var value = $( "input[type=text][name=keyword]" ).val();
            //console.log(value);
            $.ajax({
                type: 'GET',
                url: "homework8.php",
                data: {keyword: value},
                datatype: 'json',
                success: function(data){
                    $("#p_bar").css("display", "none");
                    var myobj = JSON.parse(data);
                    //console.log(myobj);
                    checkvalue(myobj);
                }
            });
        });
    });
