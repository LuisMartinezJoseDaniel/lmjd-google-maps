let map, infoWindow;

async function initMap() {
  let options = {
    zoom: 8,
    center: { lat: 23.634501, lng: -102.552784 },
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  //infoWindow
  infoWindow = new google.maps.InfoWindow({
    content: "<h3>Hey estoy aquí</h3>",
  });

  //Agregar marcardor
  const addMarker = (coords) => {
    const marker = new google.maps.Marker({
      position: coords,
      map,
      animation: google.maps.Animation.DROP,
    });

    marker.addListener("click", () => {
      infoWindow.setPosition(coords);
      infoWindow.setContent("<h3> Hey estoy aqui</h3>");
      infoWindow.open(map, marker);
    });

    map.setCenter(coords);
  };

  const locationButton = crearBoton();

  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(locationButton);

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const pos = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        addMarker(pos); //Agregar marcador a mi ubicacion
      });
    }
  });

  const arrayCoordenadas = await getCoordenadasApi();
  //Limpiar las coordenadas
  const coordsActualizadas = arrayCoordenadas.map(
    ({ attributes: { lat, lng } }) => ({ lat, lng })
  );
  coordsActualizadas.forEach((coordenada) => {
    addMarker(coordenada);
  });
}

const crearBoton = () => {
  const btnUbicacion = document.createElement("button");
  btnUbicacion.textContent = "Ir a mi ubicación";
  btnUbicacion.classList.add("btn");
  btnUbicacion.classList.add("btn-primary");

  return btnUbicacion;
};

const getCoordenadasApi = async () => {
  const url = `http://localhost:1337/api/coordenadas`;
  const respuesta = await fetch(url);
  const { data: coordenadas } = await respuesta.json();

  return coordenadas;
};
