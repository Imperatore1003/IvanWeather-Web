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
    let error = getCookie("error");
    if (error != "") {
        let ipLocation = sessionStorage.getItem("ipLocation");
        if (ipLocation) {
            getWeather(ipLocation, mode = 0).then(
                data => {
                    displayWeather(data);
                }
            );
        } else {
            fetch("https://ipapi.co/json/").then(
                data => {
                    data.json().then(
                        data => {
                            if (data.error != undefined) {
                                getWeather("London, GB", mode = 0).then(
                                data => {
                                    displayWeather(data);
                                }
                            );
                            } else {
                                let location = data.city + ", " + data.country;
                                sessionStorage.setItem("ipLocation", location);
                                getWeather(location, mode = 0).then(
                                    data => {
                                        displayWeather(data);
                                    }
                                );
                            }
                        }
                    );
                }
            );
        }

    } else if (getCookie("latitude") != "" && getCookie("longitude") != "") {
        getWeather(0, latitude = getCookie("latitude"), longitude = getCookie("longitude"), mode = 1).then(
            data => {
                if (data.cod == "404") {
                    document.getElementById("card-header").innerHTML = "City not found";
                    document.getElementById("card-body").innerHTML = `
                    <li class="list-group-item d-flex flex-column justify-content-center">
                        <h5 class="card-title w-100 mx-auto">${cityName}</h5>
                    </li>
                    <li class="list-group-item d-flex flex-column justify-content-center">
                        <h5 class="card-title mx-auto w-100">Cannot find the city you searched for</h5>
                        <h6 class="card-title mx-auto w-100">Make sure you typed it rigth or try adding the country code after a comma</h6>
                    </li>
                    <li class="card-footer d-flex justify-content-center">
                        <h6 class="card-subtitle my-1 text-muted w-100 mx-auto">Weather data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeather</a></h6>
                        <img src="/img/OpenWeather-Master-Logo-RGB.png" alt="OpenWeather logo" class="w-50">
                    </li>`;
                } else {
                    displayWeather(data);
                }
            }
        );

    } else {
        getLocation();
    }
}

function search() {
    const urlParams = new URLSearchParams(window.location.search);
    let cityName = urlParams.get('city');

    document.title = "Search " + cityName.charAt(0).toUpperCase() + cityName.slice(1) + " - IvanWeather";
    document.getElementById("searchCurrentLink").setAttribute("href", "/search?city=" + cityName);

    getWeather(cityName).then(
        data => {
            if (data.cod == "404") {
                document.getElementById("card-header").innerHTML = "City not found";
                document.getElementById("card-body").innerHTML = `
                <li class="list-group-item d-flex flex-column justify-content-center">
                    <h5 class="card-title w-100 mx-auto">${cityName}</h5>
                </li>
                <li class="list-group-item d-flex flex-column justify-content-center">
                    <h5 class="card-title mx-auto w-100">Cannot find the city you searched for</h5>
                    <h6 class="card-title mx-auto w-100">Make sure you typed it rigth or try adding the country code after a comma</h6>
                </li>
                <li class="card-footer d-flex justify-content-center">
                    <h6 class="card-subtitle my-1 text-muted w-100 mx-auto">Weather data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeather</a></h6>
                    <img src="/img/OpenWeather-Master-Logo-RGB.png" alt="OpenWeather logo" class="w-50">
                </li>`;
            } else {
                displayWeather(data);
            }
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

    let lastDay;

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
        let pop = Math.round(data.list[i].pop * 100);
        let visibility = data.list[i].visibility / 1000;
        let visibilityUnit = units ? "Km" : "mi";
        let cloudiness = data.list[i].clouds.all;
        let sunrise = new Date(data.city.sunrise * 1000);
        let sunset = new Date(data.city.sunset * 1000);
        let dewPoint;
        let unitTemp = units ? "C" : "F";
        let windDegrees = data.list[i]["wind"]["deg"];

        let day = weekDays[date.getDay()] + " " + date.getDate();

        let rain = "";
        if (data.list[i].rain) {
            rain = `<h4 class="fs-5">Rain: ${data.list[i].rain["3h"]} mm</h4>`;
        }
        let snow = "";
        if (data.list[i].snow) {
            snow = `<h4 class="fs-5">Snow: ${data.list[i].snow["3h"]} mm</h4>`;
        }
        
        if (units) { // Metric
            dateStamp = date.getHours() + ":00";
            wind = (wind * 3.6).toFixed(2);
            sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " AM";
            sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " PM";
            dewPoint = (temp - ((100 - humidity) / 5)).toFixed(1);
        } else { // Imperial
            dateStamp = date.toLocaleString('en-US', {hour: 'numeric', hour12: true});
            visibility = (visibility * 0.6213711922).toFixed(2);
            pressure = (pressure * 0.0295299831).toFixed(2);
            sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
            sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
            dewPoint = (((5/9 * (temp - 32)) - ((100 - humidity) / 5)) * (9/5) + 32).toFixed(1);
        }

        
        if (day != lastDay) {
            accordionParent.innerHTML += `
            <div class="accordion-item">
                <h2 class="my-0">
                    <div class="m-0 py-3 text-center">
                        <div class="row">
                                <h3 class="fs-5 my-0"><b>${day}</b></h3>
                            </div>
                        </div>
                    </div>
                </h2>
            </div>
            `
            lastDay = day;
        }

        accordionParent.innerHTML += `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                    <div class="container m-0 text-center">
                        <div class="row">
                            <div class="col d-flex align-items-center justify-content-center">
                                <img src="${icon}" alt="Icon" class="bg-body rounded-circle">
                            </div>
                            <div class="col d-flex align-items-center justify-content-center">
                                <h3 class="fs-5"><b>${dateStamp}</b></h3>
                            </div>
                            <div class="col forecastDesktop d-flex align-items-center justify-content-center">
                                <h3 class="fs-5">${mainDescription}</h3>
                            </div>
                            <div class="col forecastDesktop d-flex align-items-center justify-content-center">
                                <h3 class="fs-5">${temp}° ${unitTemp}</h3>
                            </div>
                            <div class="col forecastDesktop d-flex align-items-center justify-content-center">
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
                    <h4 class="fs-5">Wind: ${wind} ${windUnit}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up ms-2" viewBox="0 0 16 16" id="windArrow-${i}">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
                        </svg>
                        ${windDegrees}°
                    </h4>
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

        let windArrow = document.getElementById("windArrow-" + i);
        windDegrees = windDegrees + 180; // The arrow is pointing to the opposite direction because of the meteorological convention
        windArrow.style.mozTransform    = 'rotate('+windDegrees+'deg)';
        windArrow.style.msTransform     = 'rotate('+windDegrees+'deg)';
        windArrow.style.oTransform      = 'rotate('+windDegrees+'deg)';
        windArrow.style.transform       = 'rotate('+windDegrees+'deg)';
    }
    document.getElementById("loadingForecastGif").style.display = "none";
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

// Get the location of the user from the browser
function getLocation() {
    if (!navigator.geolocation) {
        setCookie("error", "not_supported");
        location.reload();
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            // Success
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            setCookie("latitude", latitude);
            setCookie("longitude", longitude);
            location.reload();
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED) {
                setCookie("error", "denied");
            } else if (error.code == error.POSITION_UNAVAILABLE) {
                setCookie("error", "unavailable");
            } else if (error.code == error.TIMEOUT) {
                setCookie("error", "timed_out");
            }
            location.reload();
        });
    }
}