const cityTitleEl = document.querySelector(".current-city");
const currentDateEl = document.querySelector(".current-date");
const currentTempEl = document.querySelector(".current-temp");
const currentHumidEl = document.querySelector(".current-humid");
const currentWindEl = document.querySelector(".current-wind");
const currentUvEl = document.querySelector(".current-UV");

const boxContainer = document.querySelector(".multi-day-container");

const buttonContainer = document.querySelector(".radio-container");

const defaultButtons = ["Adelaide", "Melbourne", "Sydney", "Brisbane", "Perth", "Hobart", "Darwin", "Canberra"];

const APIKey = "286db46d0db82e1ffb5fc302efdbc0da";
let queryCity = "adelaide";

let currentCityCoords = {lat: "-37.81", lon: "144.96"};

let queryURLWeather = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${APIKey}&units=metric`;

let queryURLUV = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${currentCityCoords.lat}&lon=${currentCityCoords.lon}`;

let queryURLForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${queryCity}&appid=${APIKey}&units=metric`;

let queryURLLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${currentCityCoords.lat}&lon=${currentCityCoords.lon}&appid=${APIKey}&units=metric`;

const createButtons = (cityArray) => {
    cityArray.forEach((city) => {
        let radioWrapper = document.createElement("div");

        let newRadio = document.createElement("input");
        newRadio.setAttribute("type", "radio");
        newRadio.setAttribute("name", "city");
        newRadio.setAttribute("value", city);
        newRadio.setAttribute("id", city);
        
        let newRadioLabel = document.createElement("label");
        newRadioLabel.setAttribute("for", city);
        newRadioLabel.innerText = city;

        radioWrapper.appendChild(newRadio);
        radioWrapper.appendChild(newRadioLabel);

        buttonContainer.appendChild(radioWrapper);

        
    });

    //Check adelaide button by default
    document.querySelector(".radio-container input[value=Adelaide]").checked = true;

}

const handleError = (xhr, status, error) => {
    console.log(`Status: ${status}, Error: ${error}`);
}

const queryApi = () => {
    
    //Query for Main weather details then fill page
    apiCall(queryURLWeather, (response) => {
        console.log(response);
        
        cityTitleEl.innerText = response.name;
        currentDateEl.innerText = moment(response.dt,'X' ).format('DD/MM/YYYY');
        currentTempEl.innerText = response.main.temp + "°C";
        currentHumidEl.innerText = response.main.humidity + " %";
        currentWindEl.innerText = response.wind.speed + " m/s";

        currentCityCoords.lat = response.coord.lat;
        currentCityCoords.lon = response.coord.lon;

        //Update uv url with coords from api response
        queryURLUV = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${currentCityCoords.lat}&lon=${currentCityCoords.lon}`;

        //Query for UV index then fill page
        apiCall(queryURLUV, (response) => {
            console.log(response);
            currentUvEl.innerText = response.value;
        });

        apiCall(queryURLForecast, (response) => {
            console.log(response);

            let intervals = response.list;

            //For each day, need temp, humid and icon
            //Array of objects

            let i = 0;
            let foreCastArray = [];

            intervals.forEach(entry => {
                let timeOfEntry = moment(entry.dt, 'X');

                if(foreCastArray[i]){

                    if(foreCastArray[i].date.isSame(timeOfEntry, 'day')){

                        if(foreCastArray[i].temp < entry.main.temp){
                            foreCastArray[i] = {
                                date: timeOfEntry,
                                dateString: timeOfEntry.format('DD/MM/YYYY'),
                                temp: entry.main.temp,
                                humidity: entry.main.humidity,
                                weather: entry.weather[0].main

                            };
                        }

                    }else{
                        i++;
                        foreCastArray[i] = {
                            date: timeOfEntry,
                            dateString: timeOfEntry.format('DD/MM/YYYY'),
                            temp: entry.main.temp,
                            humidity: entry.main.humidity,
                            weather: entry.weather[0].main
                        };

                    }

                } else {
                    foreCastArray[i] = {
                        date: timeOfEntry,
                        dateString: timeOfEntry.format('DD/MM/YYYY'),
                        temp: entry.main.temp,
                        humidity: entry.main.humidity,
                        weather: entry.weather[0].main
                    };
                }
                
                console.log(`Date: ${timeOfEntry}, Temperature: ${entry.main.temp}`);
            })
            console.log(foreCastArray);

            createBoxes(foreCastArray);

        });

    });



    

    //Query for main weather card
    
}

const createBoxes = (foreCastArray) => {

    foreCastArray.forEach(dateEntry => {
        console.log(dateEntry);

        let container = document.createElement("div");
        container.classList.add("day-container");

        let boxHeading = document.createElement("h3");
        boxHeading.classList.add("box-heading");
        boxHeading.innerText = dateEntry.date.format('dddd');
        container.appendChild(boxHeading);
        
        let boxIcon = document.createElement("p");
        boxIcon.innerText = parseIcon(dateEntry.weather);
        container.appendChild(boxIcon);
        
        let boxTemp = document.createElement("p");
        boxTemp.classList.add("box-temp");
        boxTemp.innerText = dateEntry.temp;
        container.appendChild(boxTemp);
        
        let boxHumid = document.createElement("p");
        boxHumid.classList.add("box-temp");
        boxHumid.innerText = dateEntry.humidity;
        container.appendChild(boxHumid);
        
        boxContainer.appendChild(container);

    });
}

const parseIcon = (stringDesc) => {
    return "Icon here";
}

const apiCall = (url, successFn) => {
    $.ajax({
        url: url,
        method: "GET",
        success: successFn,
        error: handleError
    });
}

const pageLoad = () => {
    createButtons(defaultButtons);
    queryApi();

}

pageLoad();

// setTimeout( () => {
//     apiCall(queryURLLatLon, handleSuccessWeather);
// }, 4000);

// let i = 0;

// const interval = setInterval(() => {

//     if(i >= 10){clearInterval(interval)}

//     coord.lat = Math.random() * 180 - 90;
//     coord.lon = Math.random() * 360 - 180;

//     queryURLLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${APIKey}&units=metric`;

//     console.log(coord);

//     apiCall(queryURLLatLon, handleSuccessWeather);
//     i++

// }, 4000);


/*
{"coord":{
    "lon":138.6,
    "lat":-34.93},
"weather":
    [{"id":803,
    "main":"Clouds",
    "description":"broken clouds",
    "icon":"04n"}],
"base":"stations",
"main":
    {"temp":12.92,
    "feels_like":11.16,
    "temp_min":10.56,
    "temp_max":15,
    "pressure":1022,
    "humidity":76},
"visibility":10000,
"wind":{
    "speed":2.13,
    "deg":109},
"clouds":{"all":84},
"dt":1585238300,
"sys":{
    "type":1,
    "id":9566,
    "country":"AU",
    "sunrise":1585256050,
    "sunset":1585298855},
"timezone":37800,
"id":2078025,
"name":"Adelaide",
"cod":200}

*/