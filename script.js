const http = new XMLHttpRequest();
let result = document.querySelector("#result");
const bdcAPI = `https://api-bdc.net/data/reverse-geocode-client?`;

document.querySelector("#share").addEventListener("click", () => {
    findMyCoordinates();
});

function findMyCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const url = `${bdcAPI}latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
                getAPI(url);
            },
            (err) => {
                alert(err.message);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function getAPI(url) {
    http.open("GET", url);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            result.innerHTML = this.responseText;
            const results = JSON.parse(this.responseText);
            console.log(results.locality);
        }
    };
}
