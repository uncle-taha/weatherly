const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".cards");
const apiKey = "51f6af5f5db3bcabe944d3b34ca356a1";
const googleMapsApi = "AIzaSyCj8MYLa9RYHOolNCG4Iac922ZYq1AcNq4";

let previousCity = "";
let clockInterval;

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      if (city !== previousCity) {
        clearPreviousData(); // Clear previous data and intervals
        previousCity = city; // Update previousCity to the new city
      }
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please Enter a city!");
  }
});

function clearPreviousData() {
  // Clear previous clock interval
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
    console.log("Previous clock interval cleared.");
  }

  // Remove previous clock UI elements
  const existingClockDiv = document.getElementById("clockDiv");
  if (existingClockDiv) {
    existingClockDiv.remove();
    console.log("Previous clock UI removed.");
  }
}

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      "Could not fetch weather data! Please type proper city name"
    );
  }
  return await response.json();
}
let timeZoneId = null;

function displayWeatherInfo(data) {
  const {
    coord: { lat, lon },
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  let latD = lat;
  let lonD = lon;
  let cityN = city;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  const digitalClock = document.createElement("div");
  const row1 = document.createElement("div");
  const row2 = document.createElement("div");
  const row3 = document.createElement("div");
  const lastline1 = document.createElement("div");
  const lastline2 = document.createElement("div");
  const map1 = document.createElement("div");

  const clearCard = document.createElement("span");
  clearCard.textContent = "×";
  clearCard.classList.add("clearCard");
  clearCard.addEventListener("click", function () {
    card.style.display = "none";
  });

  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");
  row1.classList.add("row1");
  row2.classList.add("row2");
  row3.classList.add("row3");
  map1.classList.add("map");
  map1.style.height = "350px";
  map1.style.width = "100%";
  map1.id = "map";

  lastline1.classList.add("lastline1");
  lastline2.classList.add("lastline2");

  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
  tempDisplay.classList.add("tempDisplay");

  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");

  descDisplay.textContent = description;
  descDisplay.classList.add("descDisplay");

  lastline1.append(weatherEmoji);
  lastline2.append(descDisplay, tempDisplay, humidityDisplay);

  const weatherIcon = getWeatherEmoji(id);
  lastline1.appendChild(weatherIcon);
  weatherEmoji.classList.add("weatherEmoji");

  weatherIcon.textContent = weatherEmoji;
  lastline1.appendChild(weatherEmoji);
  row3.append(lastline1, lastline2);
  row2.appendChild(map1);
  card.append(clearCard, row1, row2, row3);

  function initMap() {
    // Example initialization; update with actual data if needed
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: lat, lng: lon },
      zoom: 13,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      scaleControl: false,
      disableDefaultUI: true,
    });
    new google.maps.Marker({
      position: { lat: latD, lng: lonD },
      map: map,
      label: `${cityN}`,
      title: `${cityN}`,
      animation: google.maps.Animation.DROP,
    });
  }

  initMap();

  // Update clock related functions

  async function getLocationData(latt, lonn) {
    const timestamp = Math.floor(Date.now() / 1000);
    const Googleurl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latt},${lonn}&timestamp=${timestamp}&key=${googleMapsApi}`;

    try {
      const response = await fetch(Googleurl);
      const timeData = await response.json();

      console.log("API Response:", timeData); // See what we get

      // Check if the response is valid
      if (timeData.status === "OK" && timeData.timeZoneId) {
        return timeData;
      } else {
        // If API fails, just use UTC
        console.log("API failed, using UTC");
        return { timeZoneId: "UTC" };
      }
    } catch (error) {
      console.log("API error, using UTC");
      return { timeZoneId: "UTC" };
    }
  }

  function createClockUI(cityN) {
    const clockDiv = document.createElement("div");
    clockDiv.id = "clockDiv";
    row1.append(cityDisplay, clockDiv);
    clockDiv.innerHTML = `
<div class="clock-card-fetch">
  <div class="clock-dial">
    <div class="classicclock">
      <div class="point"></div>
      <!-- Hours -->
      <div class="hour hour-1">1</div>
      <div class="hour hour-2">2</div>
      <div class="hour hour-3">3</div>
      <div class="hour hour-4">4</div>
      <div class="hour hour-5">5</div>
      <div class="hour hour-6">6</div>
      <div class="hour hour-7">7</div>
      <div class="hour hour-8">8</div>
      <div class="hour hour-9">9</div>
      <div class="hour hour-10">10</div>
      <div class="hour hour-11">11</div>
      <div class="hour hour-12">12</div>
      <div class="city-name">${cityN || "Unknown City"}</div>

      <!-- Clock Hands -->
      <div class="minute-hand-wrapper" id="place-minute-hand">
        <div class="minute-hand" style="transform: rotate(deg);">
          <div class="hand"></div>
          <div class="arrow">v</div>
        </div>
      </div>
      <div class="hour-hand-wrapper" id="place-hour-hand">
        <div class="hour-hand" style="transform: rotate(deg);">
          <div class="hand"></div>
          <div class="arrow">v</div>
        </div>
      </div>
      <div class="second-hand-wrapper" id="place-second-hand">
        <div class="second-hand" style="transform: rotate(deg);">
          <div class="hand"></div>
        </div>
      </div>
    </div>
    <!-- below clock -->
    <div id="belowclock">
              <div id="placedigitalclock">00:00:00</div>
            </div>

  </div>
</div>
`;
  }

  function updatesClock() {
    if (!timeZoneId) return;
    const placeTime = new Date().toLocaleString("en-US", {
      timeZone: `${timeZoneId}`,
      hour12: false,
    });
    const placeDate = new Date(placeTime);
    document.getElementById("placedigitalclock").textContent =
      placeDate.toLocaleTimeString("en-US", { hour12: false });
    placesClock(
      placeDate.getHours(),
      placeDate.getMinutes(),
      placeDate.getSeconds(),
      "place"
    );
  }

  function placesClock(hour, minute, second, cityPrefix) {
    const secondDegree = second * 6; // 360 / 60
    const minuteDegree = minute * 6; // 360 / 60
    const hourDegree = (hour % 12) * 30 + Math.round(minute / 2); // 360 / 12 + 30 degree for each hour

    document.getElementById(cityPrefix + "-second-hand").style.transform =
      "rotate(" + secondDegree + "deg)";
    document.getElementById(cityPrefix + "-minute-hand").style.transform =
      "rotate(" + minuteDegree + "deg)";
    document.getElementById(cityPrefix + "-hour-hand").style.transform =
      "rotate(" + hourDegree + "deg)";
  }

  async function fetchAndUpdateClock(lat, lon) {
    try {
      const timeData = await getLocationData(lat, lon);
      timeZoneId = timeData.timeZoneId;

      // Clear old interval
      if (clockInterval) {
        clearInterval(clockInterval);
      }

      // Start clock
      updatesClock();
      clockInterval = setInterval(updatesClock, 1000);
    } catch (error) {
      console.log("Clock error, using UTC");
      timeZoneId = "UTC";
      updatesClock();
      clockInterval = setInterval(updatesClock, 1000);
    }
  }
  createClockUI(cityN);
  fetchAndUpdateClock(lat, lon);
  console.log(cityN, lat, lon);
} //end function

function getWeatherEmoji(weatherId) {
  const weatherIcon = document.createElement("img");

  // Add error handling
  weatherIcon.onerror = function () {
    console.error("Failed to load image:", this.src);
    this.style.display = "none";
  };

  weatherIcon.onload = function () {
    console.log("Successfully loaded image:", this.src);
  };

  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      weatherIcon.src = "images/thunderstorms.gif"; // Remove "docs/" prefix
      break;
    case weatherId >= 300 && weatherId < 400:
      weatherIcon.src = "images/rain.gif";
      break;
    case weatherId >= 500 && weatherId < 600:
      weatherIcon.src = "images/drizzle.gif";
      break;
    case weatherId >= 600 && weatherId < 700:
      weatherIcon.src = "images/snow.gif";
      break;
    case weatherId >= 700 && weatherId < 800:
      weatherIcon.src = "images/fog.gif";
      break;
    case weatherId === 800:
      weatherIcon.src = "images/sunny.svg";
      break;
    case weatherId >= 801 && weatherId < 810:
      weatherIcon.src = "images/cloudy.png";
      break;
    default:
      weatherIcon.src = "images/default.jpg";
  }

  weatherIcon.style.width = "50px";
  weatherIcon.style.height = "50px";
  weatherIcon.alt = "Weather icon";

  return weatherIcon;
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

function analogClock(hour, minute, second, cityPrefix) {
  const secondDegree = second * 6; // 360 / 60
  const minuteDegree = minute * 6; // 360 / 60
  const hourDegree = (hour % 12) * 30 + Math.round(minute / 2); // 360 / 12 + 30 degree for each hour

  document.getElementById(cityPrefix + "-second-hand").style.transform =
    "rotate(" + secondDegree + "deg)";
  document.getElementById(cityPrefix + "-minute-hand").style.transform =
    "rotate(" + minuteDegree + "deg)";
  document.getElementById(cityPrefix + "-hour-hand").style.transform =
    "rotate(" + hourDegree + "deg)";
}
// index times
function updateClock() {
  // Seoul time
  const seoulTime = new Date().toLocaleString("en-US", {
    timeZone: `Asia/Seoul`,
    hour12: false,
  });
  const seoulDate = new Date(seoulTime);
  document.getElementById("digitalclockSeoul").textContent =
    seoulDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    seoulDate.getHours(),
    seoulDate.getMinutes(),
    seoulDate.getSeconds(),
    "seoul"
  );

  // New York time
  const nyTime = new Date().toLocaleString("en-US", {
    timeZone: `America/New_York`,
    hour12: false,
  });
  const nyDate = new Date(nyTime);
  document.getElementById("digitalclockNewYork").textContent =
    nyDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    nyDate.getHours(),
    nyDate.getMinutes(),
    nyDate.getSeconds(),
    "newyork"
  );

  // London time
  const londonTime = new Date().toLocaleString("en-US", {
    timeZone: `Europe/London`,
    hour12: false,
  });
  const londonDate = new Date(londonTime);
  document.getElementById("digitalclockLondon").textContent =
    londonDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    londonDate.getHours(),
    londonDate.getMinutes(),
    londonDate.getSeconds(),
    "london"
  );

  // Tashkent time
  const tashkentTime = new Date().toLocaleString("en-US", {
    timeZone: `Asia/Tashkent`,
    hour12: false,
  });
  const tashkentDate = new Date(tashkentTime);
  document.getElementById("digitalclockTashkent").textContent =
    tashkentDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    tashkentDate.getHours(),
    tashkentDate.getMinutes(),
    tashkentDate.getSeconds(),
    "tashkent"
  );
}

setInterval(updateClock, 1000);

// clockDiv.innerHTML = `
// <div class="clock-card">
//   <div class="clock-dial">
//     <div class="classicclock">
//       <div class="point"></div>
//       <!-- Hours -->
//       <div class="hour hour-1">1</div>
//       <div class="hour hour-2">2</div>
//       <div class="hour hour-3">3</div>
//       <div class="hour hour-4">4</div>
//       <div class="hour hour-5">5</div>
//       <div class="hour hour-6">6</div>
//       <div class="hour hour-7">7</div>
//       <div class="hour hour-8">8</div>
//       <div class="hour hour-9">9</div>
//       <div class="hour hour-10">10</div>
//       <div class="hour hour-11">11</div>
//       <div class="hour hour-12">12</div>
//       <div class="city-name">${cityName || "Unknown City"}</div>
//       <!-- Clock Hands -->
//       <div class="minute-hand-wrapper" id="place-minute-hand">
//         <div class="minute-hand" style="transform: rotate(deg);">
//           <div class="hand"></div>
//           <div class="arrow">v</div>
//         </div>
//       </div>
//       <div class="hour-hand-wrapper" id="place-hour-hand">
//         <div class="hour-hand" style="transform: rotate(deg);">
//           <div class="hand"></div>
//           <div class="arrow">v</div>
//         </div>
//       </div>
//       <div class="second-hand-wrapper" id="place-second-hand">
//         <div class="second-hand" style="transform: rotate(deg);">
//           <div class="hand"></div>
//         </div>
//       </div>
//     </div>
//     <!-- below clock -->

//   </div>
// </div>
// `;

// const belowclock = document.createElement("div");

// belowclock.classList.add("belowclock");
// digitalClock.classList.add("digitalclock");
// belowclock.appendChild(digitalClock);
// row1.append(cityDisplay, clockDiv);

// function digClock() {
//   // Seoul time
//   const digTime = new Date().toLocaleString("en-US", {
//     timeZone: tmZoneId,
//     hour12: false,
//   });
//   l;

//   digitalClock.textContent = digDate.toLocaleTimeString("en-US", {});
// }
// setInterval(digClock, 1000);

// function placeClock() {
//   // Get current time in specified time zone
//   const placeTime = new Date().toLocaleString("en-US", {
//     timeZone: tmZoneId,
//     hour12: false,
//   });

//   const placeDate = new Date(placeTime);

//   // Update digital clock
//   document.getElementById("digitalclockTashkent").textContent =
//     placeDate.toLocaleTimeString("en-US", { hour12: false });

//   // Calculate rotations for clock hands
//   const hours = placeDate.getHours();
//   const minutes = placeDate.getMinutes();
//   const seconds = placeDate.getSeconds();

//   const hourRotation = (hours % 12) * 30 + minutes * 0.5; // Each hour is 30 degrees, plus a bit for minutes
//   const minuteRotation = minutes * 6; // Each minute is 6 degrees
//   const secondRotation = seconds * 6; // Each second is 6 degrees

//   // Update clock hands rotation
//   document.querySelector(
//     "#place-hour-hand .hand"
//   ).style.transform = `rotate(${hourRotation}deg)`;
//   document.querySelector(
//     "#place-minute-hand .hand"
//   ).style.transform = `rotate(${minuteRotation}deg)`;
//   document.querySelector(
//     "#place-second-hand .hand"
//   ).style.transform = `rotate(${secondRotation}deg)`;
// }

// setInterval(placeClock, 1000);
// }
