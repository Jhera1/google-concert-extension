const http = new XMLHttpRequest()
let result = document.querySelector("#result")

document.querySelector("#share").addEventListener
("click", () => {
    findMyCoordinates()
})
function findMyCoordinates() {
     if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition
        ((position) => {
            const bdcAPI = `https://api-bdc.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&`
            getAPI(bdcAPI)
        },
        (err) => {
           alert(err.message)
        })
     } else {
        alert("Geolocation is not supported by you're browser")
     }
}

function getAPI(bdcAPI) {
    http.open("GET", bdcAPI)
    http.send()
    http.onreadystatechange = function() {
        if(this.readyState == 4 && this.status ==200) {
            result.innerHTML = this.responseText
            const results = JSON.parse(this.responseText)
            console.log(results.locality)
        }
    }
}