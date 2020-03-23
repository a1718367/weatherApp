//check if previous file already existed in local storage
var usersch = JSON.parse(localStorage.getItem("userhx")) || [];
var city = 'adelaide';
var apikey ='5e799cbc4834793851ed4eb3fbe95228';
var key ='0959a518fd93cebc53ed34118e0e9471';



$(document).ready(function(){
    var cday = moment().format('dddd, Do MMM YYYY');
    $('#currentDay').text(cday);
    
    var home = getinfo(city);
    $('#currentCity').text(capitalisefst(city))
    console.log(home, typeof home)


})


//ajax get weather info via API
function getinfo(location){

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid='+key
    $.ajax({
          url: queryURL,
          method: "GET"
          }).then(function(response) {
            
            console.log(response);
            var info = response;
            console.log(response, typeof response);

            var lon = info.coord.lon
            var lat = info.coord.lat
            var queryURL = 'http://api.openweathermap.org/data/2.5/uvi?appid='+key+'&lat='+lat+'&lon='+lon;
            $.ajax({
                  url: queryURL,
                  method: "GET"
                  }).then(function(response) {
                    
                    console.log(response);
                    var uvinfo = response;
                    console.log(uvinfo, typeof uvinfo);
                  });
          });
  }
  
  //Capitalise 1st letter
  function capitalisefst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  