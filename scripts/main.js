// Mode 0 = City Name
// Mode 1 = Latitude and Longitude
// Unit 0 = Imperial
// Unit 1 = Metric

// This API key is provided by OpenWeatherMap.org
// You can get your own API key by signing up for a FREE FOREVER account on https://home.openweathermap.org/users/sign_up
const APIKEY = "84b3fab687879f825802c0ad57147510";
const cookiesExpiresDays = 1;
const debugMode = false;

// Load the weather on the home page
function home() {
    if (getCookie("latitude") != "" && getCookie("longitude") != "") {
        getWeather(0, latitude = getCookie("latitude"), longitude = getCookie("longitude"), mode = 1).then(
            city => {
                displayWeather(city);
            }
        );

    } else {
        getLocation();
    }
}
// Load the weather on the search page 
function search() {
    const urlParams = new URLSearchParams(window.location.search);
    let cityName = urlParams.get('city');

    document.title = "Search " + cityName.charAt(0).toUpperCase() + cityName.slice(1) + " - IvanWeather";

    getWeather(cityName, mode = 0).then(
        city => {
            displayWeather(city);
        }
    );
}

// Get the weather from the API
async function getWeather(cityName, latitude = 0, longitude = 0, mode = 0, unit = -1) {
    if (unit == -1) {
        unit = Number(getCookie("unit"));
        updateUnit(unit);
    }

    // Get the data from the cache
    let data = sessionStorage.getItem(unit + "-" + cityName);
    if (data) {
        return data;
    }

    let url = "https://api.openweathermap.org/data/2.5/weather?lang=en&appid=" + APIKEY
    
    if (mode == 0) {
        url += "&q=" + cityName;
    } else {
        url += "&lat=" + latitude + "&lon=" + longitude;
    }
    
    if (unit == 0) {
        url += "&units=imperial";
    } else if (unit == 1) {
        url += "&units=metric";
    }

    if (debugMode) {
        url = "/debug_data.json";
    }

    let city = await fetch(url);
    city = await city.text();

    // Cache the data
    sessionStorage.setItem(unit + "-" + cityName, city);
    return city;
}

// Display the weather in the container
function displayWeather(city) {
    unit = Number(getCookie("unit"));

    city = JSON.parse(city);

    document.getElementById("spCity").innerHTML = city["name"];
    document.getElementById("spCountry").innerHTML = city["sys"]["country"];
    document.getElementById("spMax").innerHTML = city[""];
    document.getElementById("spMax").innerHTML = city["main"]["temp_max"];
    document.getElementById("spMin").innerHTML = city["main"]["temp_min"];
    document.getElementById("spTemp").innerHTML = city["main"]["temp"];
    document.getElementById("spFelt").innerHTML = city["main"]["feels_like"];
    document.getElementById("spWeather").innerHTML = city["weather"][0]["main"];
    document.getElementById("spDescription").innerHTML = city["weather"][0]["description"];
    document.getElementById("spClouds").innerHTML = city["clouds"]["all"];
    document.getElementById("spHumidity").innerHTML = city["main"]["humidity"];

    if (unit == 0) { // Imperial
        document.getElementById("spVisibility").innerHTML = (city["visibility"] * 0.0006213712).toFixed(2); // Miles
        document.getElementById("spPressure").innerHTML = (city["main"]["pressure"] * 0.0295299831).toFixed(2); // Inches of mercury
        document.getElementById("spWind").innerHTML = city["wind"]["speed"]; // Miles per hour

        document.getElementById("spVisibilityUnit").innerHTML = "mi";
        document.getElementById("spPressureUnit").innerHTML = "in";
        document.getElementById("spWindUnit").innerHTML = "mph";
    } else { // Metric
        document.getElementById("spVisibility").innerHTML = city["visibility"] / 1000; // Km
        document.getElementById("spPressure").innerHTML = city["main"]["pressure"]; // hPa
        document.getElementById("spWind").innerHTML = (city["wind"]["speed"] * 3.6).toFixed(2); // Km/h

        document.getElementById("spVisibilityUnit").innerHTML = "km";
        document.getElementById("spPressureUnit").innerHTML = "hPa";
        document.getElementById("spWindUnit").innerHTML = "km/h";
    }

    document.getElementById("spDewPoint").innerHTML = (city["main"]["temp"] - ((100 - city["main"]["humidity"]) / 5)).toFixed(2);

    let sunrise = new Date((parseInt(city["sys"]["sunrise"]) + parseInt(city["timezone"])) * 1000);
    let formatted = sunrise.getUTCHours() + ":" + sunrise.getUTCMinutes() + ":" + sunrise.getUTCSeconds();
    document.getElementById("spSunrise").innerHTML = formatted;

    let sunset = new Date((parseInt(city["sys"]["sunset"]) + parseInt(city["timezone"])) * 1000);
    formatted = sunset.getUTCHours() + ":" + sunset.getUTCMinutes() + ":" + sunset.getUTCSeconds();
    document.getElementById("spSunset").innerHTML = formatted;

    document.getElementById("spImg").innerHTML = "<img src='https://openweathermap.org/img/wn/" + city['weather'][0]['icon'] + ".png' alt='Icon' style='width: 50px; height: 50px;'>";

    let placeholders = Array.from(document.getElementsByClassName("placeholder"));
    for (let i = 0; i < placeholders.length; i++) {
        placeholders[i].classList.remove("placeholder");
        placeholders[i].classList.remove("w-25");
        placeholders[i].classList.remove("w-50");
        placeholders[i].classList.remove("w-75");
        placeholders[i].classList.add("w-100");
    }
}

// Set the unit in a cookie
function setUnit(unit) {
    if (unit == 0) {
        setCookie("unit", "0", 364);
    } else {
        setCookie("unit", "1", 364);
    }
    location.reload();
}

function updateUnit(unit) {
    if (unit == 0) {
        document.getElementById("radioFahrenheit").checked = true;
    } else if (unit == 1) {
        document.getElementById("radioCelsius").checked = true;
    }
}

// Set a cookie
function setCookie(name, value, additionalDays = 0) {
    const d = new Date();
    d.setTime(d.getTime() + ((cookiesExpiresDays + additionalDays) * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
// Get a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Get the location of the user from the browser
function getLocation() {
    if (!navigator.geolocation) {
        document.getElementById("card-header").innerHTML = "Geolocation is not supported by your browser";
        document.getElementById("card-body").innerHTML = "<img src='/img/cat-error.jpg' class='w-100'>";
     } else {
        document.getElementById("card-header").innerHTML = "Getting your location...";
        document.getElementById("card-body").innerHTML = "<img src='/img/loading.gif' class='w-100'>";
        navigator.geolocation.getCurrentPosition((position) => {
            // Success
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            setCookie("latitude", latitude);
            setCookie("longitude", longitude);
            location.reload();
        }, (error) => {
            // Error
            document.getElementById("card-body").innerHTML = "<img src='/img/cat-error.jpg' class='w-100'>";
            if (error.code == error.PERMISSION_DENIED) {
                document.getElementById("card-header").innerHTML = "Permission denied";
            } else if (error.code == error.POSITION_UNAVAILABLE) {
                document.getElementById("card-header").innerHTML = "Location unavailable";
            } else if (error.code == error.TIMEOUT) {
                document.getElementById("card-header").innerHTML = "Request timed out";
            }
        });
     } 
 }