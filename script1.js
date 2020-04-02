//check if previous file already existed in local storage
var usersch = JSON.parse(localStorage.getItem("userhx")) || [];
var city = 'adelaide';
var apikey ='5e799cbc4834793851ed4eb3fbe95228';
var key = "0959a518fd93cebc53ed34118e0e9471";


$(document).ready(function(){
    var cday = moment().format('dddd, Do MMM YYYY');
    
    $('#currentDay').text(cday);
    var td = new Date();
    var nw = td.getHours();
    var bgcode = bg(nw);
    $('body').addClass(bgcode);
    
    populate(city);
    displayhx(usersch);
    forcast(city);


    $('body').on('click','.hxbtn',function(){
        var btnclass = $(this).html();
        populate(btnclass);
        forcast(btnclass);
    })

    $('#searchbtn').on('click',function(){
        event.preventDefault();
        var newcity = $('#userentry').val();
        if(newcity==""){
          var a = "Please Enter City"
          modal(a)}
        else{info(newcity);
        document.getElementById('search').reset();
        }  
    });

    $('#refreshBtn').on('click',function() {
        localStorage.clear('userhx');
        usersch=[];
        $('#history').html("");
        //location.reload();
      
      })

})

function populate(location){

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid='+apikey
    $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {
            var info = response;
            
            displayinfo(info)
            
            var lon = info.coord.lon
            var lat = info.coord.lat
            uvi(lat,lon)

          });
  }

function info(city){

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&appid='+apikey
    $.ajax({
          url: queryURL,
          method: "GET",
          success: function(response){
            var result = response;
            var locale = response.name;
            var lon = result.coord.lon
            var lat = result.coord.lat
            displayinfo(result);
            uvi(lat,lon);
            forcast(locale);
            srchhx(locale);
            console.log(result)
                   
          },
          error: function(){
            var msg = "City Not found";
            modal(msg);
          }

})
}

function uvi(lat, lon){
    var queryURL = 'https://api.openweathermap.org/data/2.5/uvi?appid='+apikey+'&lat='+lat+'&lon='+lon;
    $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {            
            var uvinfo = response;
            displayuv(uvinfo);
          });
  }

function forcast(location){
    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q='+location+'&units=metric&appid='+apikey;
    $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {
            var foreinfo = response;
            displayforecast(foreinfo);   
  })
}

function srchhx(city){
    var usrhx = city;
    var g = usersch.indexOf(usrhx);
    if(g==-1){usersch.splice(0,0,usrhx);}
    usersch.splice(5)
    localStorage.setItem("userhx",JSON.stringify(usersch));
    displayhx(usersch);
}


function displayinfo(obj){
  
    $('#currentCity').text(obj.name);
    $('#country').text(obj.sys.country)
    var x = Math.round(obj.main.temp)
    $('#temp').text(x);// + ' °C'
    var y = obj.weather[0].description;
    var z = obj.weather[0].icon;
    var iconurl = 'http://openweathermap.org/img/wn/'+z+'.png';
    var sunrise = moment.unix(obj.sys.sunrise).format('hh:mm a');
    var sunset = moment.unix(obj.sys.sunset).format('hh:mm a');
    $('#desc').text(capitalisefst(y));
    $('#wicon').attr('src',iconurl)
    $('#humid').text(obj.main.humidity + ' %');
    $('#wind').text(obj.wind.speed + ' m/s');
    $('#sunr').text(sunrise);
    $('#suns').text(sunset);
  }

function displayuv(obj){
    $('#uvi').text(obj.value);
    var q = Math.round(obj.value);
    var r = $('#uvi');
    var s = $('#uvid');
    if(q>=11){r.css('background-color','purple');s.text('Extreme')}
    else if(q<=10 && q>=8){r.css('background-color','red');s.text('Very High')}
    else if(q<=7 && q>=6){r.css('background-color','orange');s.text('High')}
    else if(q<=5 && q>=3){r.css('background-color','yellow');s.text('Moderate')}
    else if(q<=2 && q>=1){r.css('background-color','green');s.text('Low')}
  }
  
function displayforecast(obj){
    $('#start').html("");
    for(i=0;i<5;i++){
  
      var frarr = (i*8+7);
      var fdate = obj.list[frarr].dt;
      var dateString = moment.unix(fdate).format('dddd, Do MMM YYYY');
      var ftemp = Math.round(obj.list[frarr].main.temp);
      var ficon = obj.list[frarr].weather[0].icon;
      var ficonurl = 'http://openweathermap.org/img/wn/'+ficon+'.png';
      var fhumid = obj.list[frarr].main.humidity;
      var fblock = $('<div class="card fblock m-2">');
      var finfo = $('<div class="text-white p-2">').text(dateString);
      var fdicon = $('<img src='+ficonurl+' alt="weather icon">');
      var fdtemp = $('<div class="text-white">').text("Temp: "+ftemp+" °C");
      var fdhum = $('<div class="text-white">').text("Humidity: "+fhumid+" %");
      $('#start').append(fblock);
      fblock.append(finfo);
      finfo.append(fdtemp);
      fdtemp.append(fdhum);
      fdhum.append(fdicon);
  
    }
    
  }

function displayhx(usersch){
    $('#history').html("");
    for(j=0;j<usersch.length;j++){
      var scrhx = $('<button type="button" class="hxbtn btn-block fblock text-white "id='+j+'>').text(capitalisefst(usersch[j]));
      $('#history').append(scrhx);
    }
  }

function modal(a){
    $('#mymodal').modal("show");
    $("#msg").text(a);
  }

    //Capitalise 1st letter
function capitalisefst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

function bg(now){
    if(now>=6 && now<14){return "morning"}
    else if(now>=14 && now<20){return "noon"}
    else if(now>=20 && now<24){return "night"}
    else if(now>=0 && now<6){return "night"}
}
