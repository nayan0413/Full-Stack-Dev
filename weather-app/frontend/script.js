let iconMap = {
    "01" : "./icons/clear.png",
    "02" : "./icons/cloudy.png",
    "03" : "./icons/cloudy.png",
    "04" : "./icons/cloudy.png",
    "09" : "./icons/rain.png",
    "10" : "./icons/rain.png",
    "11" : "./icons/thuderstorm.png",
    "13" : "./icons/snow.png",
    "50" : "./icons/haze.png",
}

async function search(){
    let cityName = document.getElementById("input").value;
    cityName = cityName.trim();

    if(!cityName){
        alert("Please enter city!");
        return;
    }

    let response = await fetch(`http://127.0.0.1:3000/city?city=${cityName}`)
    const json = await response.json();

    if(!response.ok){
        alert(json.msg);
        return;
    }

    if(!json.name){
        alert("Enter correct city!");
        return;
    }

    document.getElementById("city").innerHTML = json.name;
    document.getElementById("desc").innerHTML = json.weather[0].main;
    document.getElementById("icon").src = iconMap[json.weather[0].icon.substring(0,2)]

    const temperature = degreeCelsius(parseInt(json.main.temp));
    document.getElementById("temp").innerHTML = `${temperature.toFixed(2)}°C`;

    const feels_like = degreeCelsius(parseInt(json.main.feels_like));
    document.getElementById("feels_like").innerHTML = `${feels_like.toFixed(2)}°C`;

    document.getElementById("humidity").innerHTML = `${json.main.humidity}%`;
    document.getElementById("wind").innerHTML = `${(3.6 * json.wind.speed).toFixed(2)}km/h`;
}

function degreeCelsius(temp){
    return (temp - 32) * 5 / 9;
}

document.getElementById("input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    search();
  }
});