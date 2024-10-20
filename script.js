const http = new XMLHttpRequest();
import config from "./config.js";

console.log("script loaded successfully ");

const getDates = () => {
  //this calculates todays date and converts it into a string with the format: YYYY-MM-DD utilizing toISOString method
  const today = new Date();
  const todaysDate = today.toISOString().split("T")[0];
  console.log(todaysDate);
  //this calculates the date from todays date up to 14 days later
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 14);
  const twoWeeksLater = endDate.toISOString().split("T")[0];
  console.log(twoWeeksLater);
  return [todaysDate, twoWeeksLater];
};

const getConcertData = async (cityName) => {
  const date = getDates();
  const todaysDate = date[0];
  const endDate = date[1];
  const cacheKey = "concertData";
  const cacheData = JSON.parse(localStorage.getItem(cacheKey));
  const url = `https://concerts-artists-events-tracker.p.rapidapi.com/location?name=${cityName}&minDate=${todaysDate}&maxDate=${endDate}&page=1`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": config.CONCERT_API_KEY,
      "x-rapidapi-host": "concerts-artists-events-tracker.p.rapidapi.com",
    },
  };

  cleanUpOldCache();

  if (cacheData && cacheData.date === todaysDate) {
    console.log("we accessed the cache instead of making an API call");
    return displayConcertData(cacheData.information);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    //add information to local storage from todays results just in case they do use the extension again it doesn't trigger another API call
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        date: todaysDate,
        information: result,
      })
    );

    displayConcertData(result);
  } catch (error) {
    console.error(error);
  }
};

document.querySelector("#share").addEventListener("click", () => {
  console.log("button Clicked");
  findMyCoordinates();
});

const displayConcertData = (concertData) => {
  //   added concertDiv
  const concertList = document.getElementById("concerts");
  const concertDiv = document.querySelector(".list");
  const artist = concertData.data.map((concert) => concert.name.split("@"));
  concertList.innerHTML = concertData.data
    .map(
      (concert, index) =>
        `<div'><li><strong class='artist-name'>${artist[index][0]}</strong> @${artist[index][1]} DATE: ${concert.endDate}</li> </div> `
    )
    .join("");

  // Only show the div if there is data in the ol
  if (concertData.data.length > 0) {
    concertDiv.style.display = "block"; // Show the div containing the ol
  }
};

//new function to delete cache of request older than one day.
const cleanUpOldCache = () => {
  const cacheKey = "concertData";
  const cacheData = JSON.parse(localStorage.getItem(cacheKey));
  const today = new Date().toISOString().split("T")[0];
  const oneDayInMilliSeconds = 24 * 60 * 60 * 1000;

  if (
    cacheData &&
    new Date(today) - new Date(cacheData.date) > oneDayInMilliSeconds
  ) {
    localStorage.removeItem(cacheKey);
  }
};

function findMyCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const bdcAPI = `https://api-bdc.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&`;
        getAPI(bdcAPI);
      },
      (err) => {
        alert(err.message);
      }
    );
  } else {
    alert("Geolocation is not supported by you're browser");
  }
}

function getAPI(bdcAPI) {
  http.open("GET", bdcAPI);
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const results = JSON.parse(this.responseText);
      getConcertData(results.locality);
    }
  };
}
