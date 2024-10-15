const http = new XMLHttpRequest();
import config from "./config.js";

console.log("script loaded successfully ");

const getDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);
  const yearInTwoWeeks = twoWeeksLater.getFullYear();
  const monthInTwoWeeks = twoWeeksLater.getMonth() + 1;
  const dayInTwoWeeks = twoWeeksLater.getDate();
  return [
    [year, month, day],
    [yearInTwoWeeks, monthInTwoWeeks, dayInTwoWeeks],
  ];
};

const getConcertData = async (cityName) => {
  const date = getDates();
  const todaysDate = date[0].join("-");
  const endDate = date[1].join("-");
  const url = `https://concerts-artists-events-tracker.p.rapidapi.com/location?name=${cityName}&minDate=${todaysDate}&maxDate=${endDate}&page=1`;
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

    //   added concertDiv
    const concertDiv = document.querySelector(".list");

    const artist = result.data.map((concert) => concert.name.split("@"));
    console.log(artist);

    console.log(result);
    concertList.innerHTML = result.data
      .map(
        (concert, index) =>
          `<div><li class='test-2'><strong class='test'>${artist[index][0]}</strong> @${artist[index][1]} DATE: ${concert.endDate}</li> </div> `
      )
      .join("");

    // Only show the div if there is data in the ol
    if (result.data.length > 0) {
      concertDiv.style.display = "block"; // Show the div containing the ol
    }

    console.log(result.data[10]);
  } catch (error) {
    console.error(error);
  }
};

document.querySelector("#share").addEventListener("click", () => {
  console.log("button Clicked");
  findMyCoordinates();
});
function findMyCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const bdcAPI = `https://api-bdc.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&`;
        getAPI(bdcAPI);
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
      getConcertData(results.locality);
      return results.locality;
    }
  };
}
