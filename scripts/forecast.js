// Mode 0 = City Name
// Mode 1 = Latitude and Longitude
// Unit 0 = Imperial
// Unit 1 = Metric

// This API key is provided by OpenWeatherMap.org
// You can get your own API key by signing up for a FREE FOREVER account on https://home.openweathermap.org/users/sign_up
const APIKEY = "84b3fab687879f825802c0ad57147510";
const cookiesExpiresDays = 1;
const debugMode = false;

function forecast() {
    getWeather(cityName = 0,latitude = getCookie("latitude"), longitude = getCookie("longitude")).then(
        data => {
            displayWeather(data);
        }
    );
}

function search() {
    const urlParams = new URLSearchParams(window.location.search);
    let cityName = urlParams.get('city');

    document.title = "Search " + cityName.charAt(0).toUpperCase() + cityName.slice(1) + " - IvanWeather";
    document.getElementById("searchCurrentLink").setAttribute("href", "/search?city=" + cityName);

    getWeather(cityName).then(
        data => {
            displayWeather(data);
        }
    );
}

async function getWeather(cityName = 0, latitude = 0, longitude = 0) {
    let units = getUnits();
    updateUnit(units);

    // Get the data from the cache
    let data = sessionStorage.getItem(units + "-f-" + (cityName == 0 ? latitude + "-" + longitude : cityName));
    if (data) {
        return JSON.parse(data);
    }

    let endpoint = "https://api.openweathermap.org/data/2.5/forecast?";

    if (cityName != 0) {
        endpoint += "q=" + cityName;
    } else {
        endpoint += "&lat=" + latitude + "&lon=" + longitude;
    }

    endpoint += "&units=" + (units == 0 ? "imperial" : "metric");

    endpoint += "&appid=" + APIKEY;

    if (debugMode) {
        endpoint = "/debug/forecast.json";
    }

    data = await fetch(endpoint);
    data = await data.text();

    // Cache the data
    sessionStorage.setItem(units + "-f-" + (cityName == 0 ? latitude + "-" + longitude : cityName), data);
    return JSON.parse(data);
}

function displayWeather(data) {
    const accordionParent = document.getElementById("forecastAccordion");

    document.getElementById("cityName").innerHTML = "<b>" + data.city.name + ", " + data.city.country + "</b>";

    for (let i = 0; i < data.list.length; i++) {
        let icon = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
        const date = new Date(data.list[i].dt * 1000);
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let units = getUnits();
        let dateStamp;
        let mainDescription = data.list[i].weather[0].main;
        let temp = data.list[i].main.temp;
        let tempMax = data.list[i].main.temp_max;
        let tempMin = data.list[i].main.temp_min;

        let description = data.list[i].weather[0].description;
        description = description.charAt(0).toUpperCase() + description.slice(1)
        let feelsLike = data.list[i].main.feels_like;
        let pressure = data.list[i].main.pressure;
        let pressureUnit = units ? "hPa" : "in";
        let humidity = data.list[i].main.humidity;
        let wind = data.list[i].wind.speed;
        let windUnit = units ? "Km/s" : "mph";
        let pop = data.list[i].pop * 100;
        let visibility = data.list[i].visibility / 1000;
        let visibilityUnit = units ? "Km" : "mi";
        let cloudiness = data.list[i].clouds.all;
        let sunrise = new Date(data.city.sunrise * 1000);
        let sunset = new Date(data.city.sunset * 1000);
        let dewPoint;
        let unitTemp = units ? "C" : "F";

        let rain = "";
        if (data.list[i].rain) {
            rain = `<h4 class="fs-5">Rain: ${data.list[i].rain["3h"]} mm</h4>`;
        }
        let snow = "";
        if (data.list[i].snow) {
            snow = `<h4 class="fs-5">Snow: ${data.list[i].snow["3h"]} mm</h4>`;
        }
        
        if (units) { // Metric
            dateStamp = weekDays[date.getDay()] + " " + date.getDate() + " - " + date.getHours() + ":00";
            wind = (wind * 3.6).toFixed(2); // CHECKpop
            sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " AM";
            sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " PM";
            dewPoint = (temp - ((100 - humidity) / 5)).toFixed(1);
        } else { // Imperial
            dateStamp = weekDays[date.getDay()] + " " + date.getDate() + " - " + date.toLocaleString('en-US', {hour: 'numeric', hour12: true});
            visibility = (visibility * 0.6213711922).toFixed(2);
            pressure = (pressure * 0.0295299831).toFixed(2);
            sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
            sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
            dewPoint = (((5/9 * (temp - 32)) - ((100 - humidity) / 5)) * (9/5) + 32).toFixed(1);
        }

        accordionParent.innerHTML += `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                    <div class="container m-0 text-center">
                        <div class="row">
                            <div class="col">
                                <img src="${icon}" alt="Icon" class="bg-body rounded-circle">
                            </div>
                            <div class="col">
                                <h3 class="fs-5"><b>${dateStamp}</b></h3>
                            </div>
                            <div class="col forecastDesktop">
                                <h3 class="fs-5">${mainDescription}</h3>
                            </div>
                        
                            <div class="col forecastDesktop">
                                <h3 class="fs-5">${temp}° ${unitTemp}</h3>
                            </div>
                            <div class="col forecastDesktop">
                                <h3 class="fs-5">${tempMax}°/${tempMin}° ${unitTemp}</h3>
                            </div>
                        </div>
                    </div>
                </button>
            </h2>
            <div id="collapse${i}" class="accordion-collapse collapse" data-bs-parent="#forecastAccordion">
                <div class="accordion-body">
                    <h4><b>${description}</b></h4>
                    <h4 class="forecastMobile">Temperature: <b>${temp}° ${unitTemp}</b></h4>
                    <h4 class="forecastMobile">${tempMax}°/${tempMin}° ${unitTemp}</h4>
                    <h4 class="fs-5">Feels like: ${feelsLike}° ${unitTemp}</h4>
                    <h4 class="fs-5">Dew point: ${dewPoint}° ${unitTemp}</h4>
                    <h4 class="fs-5">Cloudiness: ${cloudiness}%</h4>
                    <h4 class="fs-5">Humidity: ${humidity}%</h4>
                    <h4 class="fs-5">Wind: ${wind} ${windUnit}</h4>
                    ${rain}
                    <h4 class="fs-5">Probability of precipitation: ${pop}%</h4>
                    ${snow}
                    <h4 class="fs-5">Pressure: ${pressure} ${pressureUnit}</h4>
                    <h4 class="fs-5">Visibility: ${visibility} ${visibilityUnit}</h4>
                    <h4 class="fs-5">Sunrise: ${sunrise}</h4>
                    <h4 class="fs-5">Sunset: ${sunset}</h4>
                </div>
            </div>
        </div>
        `
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
    } else {
        document.getElementById("radioCelsius").checked = true;
    }
}

function getUnits() {
    return Number(getCookie("unit"));
}

// Set a cookie
function setCookie(name, value, additionalDays = 0) {
    const d = new Date();
    d.setTime(d.getTime() + ((cookiesExpiresDays + additionalDays) * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
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