// today variables
var todayName = document.getElementById("today-date-day-name");
var todayNumber = document.getElementById("today-date-day-num");
var todayMonth = document.getElementById("today-date-month");
var todayLocation = document.getElementById("today-location");
var todayTemp = document.getElementById("today-temp");
var todayConditionImg = document.getElementById("today-condition-img");
var todayConditionText = document.getElementById("today-condition-text");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var windDirection = document.getElementById("wind-direction");

// next Data
var nextDay = document.getElementsByClassName("next-day-name");
var nextMaxTemp = document.getElementsByClassName("next-max-temp");
var nextMinTemp = document.getElementsByClassName("next-min-temp");
var nextConditionImg = document.getElementsByClassName("next-condition-img");
var nextConditionText = document.getElementsByClassName("next-condition-text");

// search input
var searchInput = document.getElementById("search");

// fetch api data
async function getWeatherData(cityName) {
    var weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a0c9e4c0f6384179b39135135252608&q=${cityName}&days=7`);
    var weatherData = await weatherResponse.json();
    return weatherData;
}

// start app
async function startApp(city = "cairo") {
    var weatherData = await getWeatherData(city);
    if (!weatherData.error) {
        displayTodayData(weatherData);
        displayNextData(weatherData);
    }
}

startApp(); // default cairo




// display today data
function displayTodayData(data) {
    var todayDate = new Date();

    todayName.innerHTML = todayDate.toLocaleDateString("en-US", { weekday: "long" });
    todayMonth.innerHTML = todayDate.toLocaleDateString("en-US", { month: "long" });
    todayNumber.innerHTML = todayDate.getDate();

    todayLocation.innerHTML = data.location.name;
    todayTemp.innerHTML = data.current.temp_c ;
    todayConditionImg.setAttribute("src", "https:" + data.current.condition.icon);
    todayConditionText.innerHTML = data.current.condition.text;
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + " km/h";
    windDirection.innerHTML = data.current.wind_dir;
}



// display next days data
function displayNextData(data) {
    var forecastData = data.forecast.forecastday;
    for (var i = 0; i < 2; i++) {   
        let nextDate = new Date(forecastData[i+1].date);
        nextDay[i].innerHTML = nextDate.toLocaleDateString("en-US", { weekday: "long" });

        nextMaxTemp[i].innerHTML = forecastData[i+1].day.maxtemp_c;
        nextMinTemp[i].innerHTML = forecastData[i+1].day.mintemp_c;
        nextConditionImg[i].setAttribute("src", "https:" + forecastData[i+1].day.condition.icon);
        nextConditionText[i].innerHTML = forecastData[i+1].day.condition.text;
    }
}

 
var todayDate = new Date();
todayDate.toLocaleDateString("en-Us", {
  weekday: "long",
});
todayDate.toLocaleDateString("en-Us", {
  month: "long",
});
console.log(todayDate);
 
searchInput.addEventListener("input", function () {
  startApp(searchInput.value);
});