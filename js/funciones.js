const API_URL = 'https://api.covid19api.com/';
const PAISES = 'countries';
const ACTUAL = 'summary';
const PAISX = 'dayone/country/:pais';
const opts = { crossDomain : true};
var resumenDatos;

var comboPaises = document.getElementById('comboPaises');
var fecha = document.getElementById('fecha');
comboPaises.addEventListener('change', cargarDatosPais);
fecha.addEventListener('change', cargarDatosPais)
llenarFecha();

function cargarDatosPais(){
  //let pais = comboPaises.value;
  llenarDatosActualizados();

  //Cargo Datos según la fecha:
  datosPorPais()
  .then((paisx) => {
    // console.log(paisx);
    let fecha = document.getElementById('fecha');
    let datosDia = paisx.find(pais => pais.Date.substring(0,10) == fecha.value)
    let spanConfirmadosPais = document.getElementById('spanConfirmadosPais');
    let spanActivosPais = document.getElementById('spanActivosPais');
    let spanMuertesPais = document.getElementById('spanMuertesPais');
    let spanRecuperadosPais = document.getElementById('spanRecuperadosPais');
    spanConfirmadosPais.innerText = datosDia.Confirmed.toLocaleString();
    spanActivosPais.innerText = datosDia.Active.toLocaleString();
    spanMuertesPais.innerText = datosDia.Deaths.toLocaleString();
    spanRecuperadosPais.innerText = datosDia.Recovered.toLocaleString();
  }).
  catch((e) => alert(e))
}

function datosPorPais(){
  return new Promise((resolve, reject) => {
    const URL = API_URL + PAISX.replace(':pais', comboPaises.value);
    $.get(URL, opts, (paisx) => {
      resolve(paisx)
    }).fail((e) => reject(e))
  })
}

//Actualiza la fecha en el calendario
function llenarFecha(){
  let hoy = new Date();
  let dia = hoy.getDate()-1;
  let mes = hoy.getMonth()+1;
  if (dia < 10) {
    dia = '0' + dia;
  }
  if (mes < 10) {
    mes = '0' + mes;
  }

  fecha.value = `${hoy.getFullYear()}-${mes}-${dia}`
}

function cargarResumen(){
  return new Promise((resolve, reject) => {
    const URL = API_URL + ACTUAL;
    $.get(URL, opts, (resumen) => {
      resolve(resumen)
    }).fail((e) => reject(e))
  })
}

function imprimirResumen(){
  cargarResumen()
  .then((resumen) => {
    resumenDatos = resumen;
    llenarPaises();
    llenarDatosMundo(resumenDatos.Global);
  })
  // .catch((e) => alert('asdsadas'))
   .catch((e) => alert(`${e.statusText}, ${e.responseJSON.message}`))
}

function llenarDatosMundo(globales){
  let totalConfirmadosMundo = document.getElementById('totalConfirmadosMundo');
  let totalMuertesMundo = document.getElementById('totalMuertesMundo');
  let totalRecuperadosMundo = document.getElementById('totalRecuperadosMundo');
  totalConfirmadosMundo.innerText = globales.TotalConfirmed.toLocaleString();
  totalMuertesMundo.innerText = globales.TotalDeaths.toLocaleString();
  totalRecuperadosMundo.innerText = globales.TotalRecovered.toLocaleString();
}

imprimirResumen();

function llenarPaises(){
  try {
    let paises = resumenDatos.Countries;
    paises = ordenarPaises(paises);
    paises.map((pais) => {
      comboPaises.add(new Option(pais.Country, pais.Slug), undefined);
    })
    comboPaises.value = 'colombia'
    cargarDatosPais();
  } catch (e) {
    alert(e)
  }
}

function llenarDatosActualizados(){

  try {
    let paises = resumenDatos.Countries;
    let paisx = paises.find((pais) => pais.Slug == comboPaises.value )
    console.log(paisx);
    let spanFecha = document.getElementById('spanFechaActualizacion');
    let spanNuevosConfirmados = document.getElementById('spanNuevosConfirmados');
    let spanNuevasMuertes = document.getElementById('spanNuevasMuertes');
    let spanNuevosRecuperados = document.getElementById('spanNuevosRecuperados');
    spanFecha.innerText = paisx.Date;
    spanNuevosConfirmados.innerText = paisx.NewConfirmed.toLocaleString();
    spanNuevasMuertes.innerText = paisx.NewDeaths.toLocaleString();
    spanNuevosRecuperados.innerText = paisx.NewRecovered.toLocaleString();

    let spanPais = document.getElementById('spanPais');
    spanPais.innerText = paisx.Country;
  } catch (e) {
    alert(e);
  }
}

function ordenarPaises(paises){
  return paises.sort((unPais, otroPais) => unPais.Country.localeCompare(otroPais.Country));
}
