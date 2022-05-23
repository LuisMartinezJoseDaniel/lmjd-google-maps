let map, infoWindow;

async function initMap() {
  let options = {
    zoom: 8,
    center: { lat: 23.634501, lng: -102.552784 },
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  //infoWindow
  infoWindow = new google.maps.InfoWindow();

  //Agregar marcardor
  const addMarker = (coords, mensaje) => {
    const marker = new google.maps.Marker({
      position: coords,
      map,
      animation: google.maps.Animation.DROP,
    });

    marker.addListener("click", () => {
      infoWindow.setPosition(coords);
      infoWindow.setContent(
        `<h3>${mensaje ?? "Coordenadas desde la base de datos"}</h3>`
      );
      infoWindow.open(map, marker);
    });

    map.setCenter(coords);
  };

  const locationButton = crearBoton();
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(locationButton);

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const pos = {
            lat: coords.latitude,
            lng: coords.longitude,
          };
          addMarker(pos, "Mi ubicación actual"); //Agregar marcador a mi ubicacion
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  try {
    const arrayCoordenadas = await getCoordenadasApi();

    if (!!arrayCoordenadas) {
      const coordsActualizadas = arrayCoordenadas.map(
        ({ attributes: { lat, lng } }) => ({ lat, lng })
      );

      //agregar multiples marcadores de la base de datos
      coordsActualizadas.forEach((coordenada) => {
        addMarker(coordenada);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

//Manejar error en caso de no tener geolocalizacion
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: El servicio de localización ha fallado."
      : "Error: Tu navegador no soporta la geolocalización."
  );
  infoWindow.open(map);
}

const crearBoton = () => {
  const btnUbicacion = document.createElement("button");
  btnUbicacion.textContent = "Ir a mi ubicación";
  btnUbicacion.classList.add("btn");
  btnUbicacion.classList.add("btn-primary");

  return btnUbicacion;
};

const getCoordenadasApi = async () => {
  try {
    const url = `http://localhost:1337/api/coordenadas`;
    const respuesta = await fetch(url);
    if (!!respuesta) {
      return;
    }
    const { data: coordenadas } = await respuesta.json();
    return coordenadas;
  } catch (error) {
    throw new Error("No se ha podido hacer el fetch a la API");
  }
};
