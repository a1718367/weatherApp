//check if previous file already existed in local storage
var usersch = JSON.parse(localStorage.getItem("userhx")) || [];
var city = 'adelaide';
var apikey ='5e799cbc4834793851ed4eb3fbe95228';




$(document).ready(function(){
    var cday = moment().format('dddd, Do MMM YYYY');
    $('#currentDay').text(cday);
    
    getinfo(city);
    forcast(city);

})
$('#searchbtn').on('click',function(){
  event.preventDefault();
  var newcity = $('#userentry').val();
  console.log(newcity);
  getinfo(newcity)
})

//ajax get weather info via API
function getinfo(location){

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid='+apikey
    $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {
            
            console.log(response);
            var info = response;
            console.log(info, typeof info);
            

            var lon = info.coord.lon
            var lat = info.coord.lat
            var queryURL = 'http://api.openweathermap.org/data/2.5/uvi?appid='+apikey+'&lat='+lat+'&lon='+lon;
            $.ajax({
                  url: queryURL,
                  method: "GET"
                  }).then(function(response) {
                    
                    console.log(response);
                    var uvinfo = response;
                    console.log(uvinfo, typeof uvinfo);
                    displayinfo(info,uvinfo);
                  });
          });
  }

  function forcast(location){
    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q='+location+'&units=metric&appid='+apikey
    $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {
            console.log(response);
            var foreinfo = response;
            console.log(foreinfo, typeof foreinfo);
            
            var date = foreinfo.list;
            for(i=0;i<date.length;i++){
              var x = date[i].dt;
              var dateString = moment.unix(x).format('dddd, Do MMM YYYY');
              console.log(dateString);
            }
            
  })
}


function displayinfo(obj,obj1){
  
  $('#currentCity').text(obj.name);
  var x = Math.round(obj.main.temp)
  $('#temp').text(x + ' °C');
  var y = obj.weather[0].description;
  var z = obj.weather[0].icon;
  var iconurl = 'http://openweathermap.org/img/wn/'+z+'.png';
  $('#desc').text(obj.weather[0].main+" "+capitalisefst(y));
  $('#wicon').attr('src',iconurl)
  $('#humid').text(obj.main.humidity + ' %');
  $('#wind').text(obj.wind.speed + ' m/s');
  
  $('#uvi').text(obj1.value);
  var q = Math.round(obj1.value);
  var r = $('#uvi');
  var s = $('#uvid');
  if(q>=11){r.css('background-color','purple');s.text('Extreme')}
  else if(q<=10 && q>=8){r.css('background-color','red');s.text('Very High')}
  else if(q<=7 && q>=6){r.css('background-color','orange');s.text('High')}
  else if(q<=5 && q>=3){r.css('background-color','yellow');s.text('Moderate')}
  else if(q<=2 && q>=1){r.css('background-color','green');s.text('Low')}
}


  //Capitalise 1st letter
  function capitalisefst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
