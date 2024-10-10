const http = new XMLHttpRequest();
let result = document.querySelector("#result");
import { config } from "./config";

const getConcertData = async (cityName) => {
  console.log(cityName);
  const url = `https://concerts-artists-events-tracker.p.rapidapi.com/location?name=${cityName}&minDate=2024-10-01&maxDate=2024-10-18&page=1`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": config.CONCERT_API_KEY,
      "x-rapidapi-host": "concerts-artists-events-tracker.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const concertList = document.getElementById("concerts");
    console.log(result);
    concertList.innerHTML = result.data
      .map((concert) => `<li>${concert.name} DATE: ${concert.endDate} </li> `)
      .join("");

    console.log(result.data[10]);
  } catch (error) {
    console.error(error);
  }
};

document.querySelector("#share").addEventListener("click", () => {
  findMyCoordinates();
});
function findMyCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const bdcAPI = `https://api-bdc.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&`;
        getAPI(bdcAPI);
        console.log(bdcAPI);
        return bdcAPI;
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
      console.log(results.locality);
      getConcertData(results.locality);
      return results.locality;
    }
  };
}
