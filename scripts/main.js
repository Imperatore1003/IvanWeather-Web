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
        document.getElementById("container").style.display = "block";
        
        // let city = await getWeather(0, latitude = getCookie("latitude"), longitude = getCookie("longitude"), mode = 1);
        // displayWeather(city);
        
        getWeather(0, latitude = getCookie("latitude"), longitude = getCookie("longitude"), mode = 1).then(
            city => {
                displayWeather(city);
            }
        );

    } else {
        document.getElementById("status").style.display = "block";
        document.getElementById("container").style.display = "none";

        getLocation();
    }
}
// Load the weather on the search page 
function search() {
    cityName = GetParameter("city");

    document.title = "Search " + capitalizeFirstLetter(cityName) + " - IvanWeather";
    
    document.getElementById("container").style.display = "block";

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

    document.getElementById("spImg").innerHTML = '<img src="https://openweathermap.org/img/wn/' + city["weather"][0]["icon"] + '.png" alt="Icon" style="width: 50px; height: 50px;">';
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
        document.getElementById("flexRadioDefault1").checked = true;
    } else if (unit == 1) {
        document.getElementById("flexRadioDefault2").checked = true;
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
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Function to display a message
function mystatus(status) {
    document.getElementById('status').innerHTML = "<p>" + status + "</p>";
}
// Function to get the location
function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    setCookie("latitude", latitude);
    setCookie("longitude", longitude);
    location.reload();
}
// Display an error message if the location cannot be retrieved
function error() {
    mystatus('Unable to retrieve your location');
}

// Get the location of the user from the browser
function getLocation() {
    if (!navigator.geolocation) {
         mystatus('Geolocation is not supported by your browser');
     } else {
         mystatus("Getting your location...");
         navigator.geolocation.getCurrentPosition(success, error);
     } 
 }

// Get a parameter from the URL
function GetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}