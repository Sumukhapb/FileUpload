const button = document.getElementById("location");
const cityName = document.getElementById("city-Name");
const cityTime = document.getElementById("city-Time");
const cityTemp = document.getElementById("city-Temp");

async function getData(lat, long) {
  const promise = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=972426454d2648038d7115917242708&q=${lat},${long}&aqi=yes`
  );
  return await promise.json();
}

async function getlocation(position) {
  const result = await getData(
    position.coords.latitude,
    position.coords.longitude
  );
  console.log(result);

  cityName.innerText = `${result.location.name},${result.location.region},${result.location.country}`;
  cityTime.innerText = `${result.location.localtime}`;
  cityTemp.innerText = `${result.current.feelslike_c}`;
}

async function Failed() {
  console.log("There was an error");
}

button.addEventListener("click", async () => {
  navigator.geolocation.getCurrentPosition(getlocation, Failed);
});
