// ================================
// TODAY VARIABLES
// ================================

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


// ================================
// NEXT DAYS VARIABLES
// ================================

var nextDay = document.getElementsByClassName("next-day-name");
var nextMaxTemp = document.getElementsByClassName("next-max-temp");
var nextMinTemp = document.getElementsByClassName("next-min-temp");

var nextConditionImg = document.getElementsByClassName("next-condition-img");
var nextConditionText = document.getElementsByClassName("next-condition-text");


// ================================
// SEARCH VARIABLES
// ================================

var searchInput = document.getElementById("search");
var submitButton = document.getElementById("submit");


// ================================
// API
// ================================

async function getWeatherData(cityName) {

    var apiKey = "a0c9e4c0f6384179b39135135252608";

    var url =
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(cityName)}&days=7`;

    var weatherResponse = await fetch(url);

    var weatherData = await weatherResponse.json();

    // Handle API errors
    if (!weatherResponse.ok || weatherData.error) {
        throw new Error(
            weatherData.error?.message || "Unable to fetch weather data."
        );
    }

    return weatherData;
}


// ================================
// START APP
// ================================

async function startApp(city = "cairo") {

    city = city.trim();

    // Prevent empty search
    if (!city) {
        showMessage("Please enter a city name.");
        return;
    }

    // Loading state
    setLoading(true);

    try {

        var weatherData = await getWeatherData(city);

        displayTodayData(weatherData);
        displayNextData(weatherData);

        clearMessage();

    } catch (error) {

        console.log(error);

        showMessage(
            error.message || "Unable to find this location. Please try again."
        );

    } finally {

        // Stop loading
        setLoading(false);

    }
}


// ================================
// DISPLAY TODAY DATA
// ================================

function displayTodayData(data) {

    var todayDate = new Date();

    // Day name
    todayName.innerHTML =
        todayDate.toLocaleDateString("en-US", {
            weekday: "long"
        });

    // Month
    todayMonth.innerHTML =
        todayDate.toLocaleDateString("en-US", {
            month: "long"
        });

    // Day number
    todayNumber.innerHTML =
        todayDate.getDate();

    // Location
    todayLocation.innerHTML =
        data.location.name;

    // Temperature
    todayTemp.innerHTML =
        Math.round(data.current.temp_c);

    // Weather icon
    todayConditionImg.setAttribute(
        "src",
        "https:" + data.current.condition.icon
    );

    todayConditionImg.setAttribute(
        "alt",
        data.current.condition.text
    );

    // Weather condition
    todayConditionText.innerHTML =
        data.current.condition.text;

    // Humidity
    humidity.innerHTML =
        data.current.humidity + "%";

    // Wind
    wind.innerHTML =
        data.current.wind_kph + " km/h";

    // Wind direction
    windDirection.innerHTML =
        data.current.wind_dir;
}


// ================================
// DISPLAY NEXT DAYS
// ================================

function displayNextData(data) {

    var forecastData =
        data.forecast.forecastday;

    for (var i = 0; i < 2; i++) {

        var nextDate =
            new Date(forecastData[i + 1].date);

        // Day name
        nextDay[i].innerHTML =
            nextDate.toLocaleDateString("en-US", {
                weekday: "long"
            });

        // Maximum temperature
        nextMaxTemp[i].innerHTML =
            Math.round(
                forecastData[i + 1].day.maxtemp_c
            );

        // Minimum temperature
        nextMinTemp[i].innerHTML =
            Math.round(
                forecastData[i + 1].day.mintemp_c
            );

        // Weather icon
        nextConditionImg[i].setAttribute(
            "src",
            "https:" +
            forecastData[i + 1].day.condition.icon
        );

        nextConditionImg[i].setAttribute(
            "alt",
            forecastData[i + 1].day.condition.text
        );

        // Weather condition
        nextConditionText[i].innerHTML =
            forecastData[i + 1].day.condition.text;
    }
}


// ================================
// LOADING STATE
// ================================

function setLoading(isLoading) {

    if (isLoading) {

        submitButton.value = "Loading...";
        submitButton.disabled = true;

        searchInput.disabled = true;

    } else {

        submitButton.value = "Find";
        submitButton.disabled = false;

        searchInput.disabled = false;
    }
}


// ================================
// ERROR / STATUS MESSAGE
// ================================

function showMessage(message) {

    var form = document.querySelector(".find-location");

    if (!form) {
        return;
    }

    var existingMessage =
        document.querySelector(".search-message");

    // Remove old message
    if (existingMessage) {
        existingMessage.remove();
    }

    var messageElement =
        document.createElement("p");

    messageElement.className =
        "search-message";

    messageElement.innerHTML =
        message;

    form.appendChild(messageElement);
}


// ================================
// CLEAR MESSAGE
// ================================

function clearMessage() {

    var existingMessage =
        document.querySelector(".search-message");

    if (existingMessage) {
        existingMessage.remove();
    }
}


// ================================
// FIND BUTTON
// ================================

submitButton.addEventListener(
    "click",
    function () {

        startApp(searchInput.value);

    }
);


// ================================
// ENTER KEY
// ================================

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            startApp(searchInput.value);
        }

    }
);


// ================================
// START DEFAULT CITY
// ================================

startApp("cairo");
