const apiKey = 'at_zDl4pTkZZ7YkVj30WvLxxWyK8CdgW';
const geoApiKey = 'efb7a6fdbe274c30bb988766d3b0d08f';
const btn = document.querySelector('.btn');
const ipAddress = document.querySelector('.ip-address');
const area = document.querySelector('.location');
const timezone = document.querySelector('.timezone');
const isp = document.querySelector('.isp');
const infoContainer = document.querySelector('.info-wrap');
const input = document.querySelector('.input');
const form = document.querySelector('.form-inp')


class App{
    #map
    #zoomMax = 15;
    #searchIP;
    #searchDN;
    #area;

    constructor(){
        // Get User Position
        this._getLocation();
        //Event handlers
        btn.addEventListener('click', this._callRequest.bind(this));
      form.addEventListener('submit', (e) =>{
        e.preventDefault()
        window.addEventListener('keydown', (e) => {
            if(e.key !== 'Enter') return
            this._callRequest();
            input.value = '';
        })
      })
    };

    // Get Location
    _getLocation() {
        if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
          function () {
            alert(`could not get your position`);
          }
        );
    };

    // Load Map
    _loadMap(pos) {
        const { latitude } = pos.coords;
        const { longitude } = pos.coords;
    
        const coords = [latitude, longitude];
       this.#map = L.map('map',{zoomControl: false}).setView(coords, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: this.#zoomMax,
    attribution: '© OpenStreetMap'
}).addTo(this.#map);
    };

    // Check if Input is Ip address or domain
     _checkInput(input) {
        // Regular expression patterns for IP address and domain name
        const ipAddressPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const domainNamePattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (ipAddressPattern.test(input)) {
          return 'IP Address';
        } else if (domainNamePattern.test(input)) {
          return 'Domain Name';
        } else {
          return 'Invalid input';
        }
      };

      // Handle input
     async  _callRequest() {
        
          try{
            const input = document.querySelector('.input');
        const val = input.value.toLowerCase();
        if(this._checkInput(val) === 'IP Address'){
         this.#searchIP = val;
         this.#searchDN = '';
        };

        if(this._checkInput(val) === 'Domain Name'){
         this.#searchDN = val;
         this.#searchIP = '';
        };
        if(this._checkInput(val) === 'Invalid input'){
         alert('Please search for a valid domain or ip address')
        };

      const res = await  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${this.#searchIP}&domain=${this.#searchDN}`);
      if(!res.ok){
        alert('Could not get information, Try again.');
        infoContainer.style.opacity = 0;
      }
      
      const data = await res.json();

      const {lat, lng} = data.location;
      this._displayMarker([lat, lng]);
      this._displayInfo(data);
      
      infoContainer.style.opacity = 1;
      } catch(err) {
        console.error(err);
      }
      input.value = '';
      };

      //Display Infomation
      _displayInfo(data) {
        ipAddress.textContent = data.ip
        timezone.textContent = data.location.timezone
        isp.textContent = data.isp
        area.textContent = `${data.location.city}, ${data.location.country}`;
      };

      // Display Marker and move map
      _displayMarker(coords) {
        const myIcon = L.icon({
            iconUrl: 'images/icon-location.svg'
        });

        const marker = L.marker(coords, {icon: myIcon}).addTo(this.#map);
        this.#map.setView(coords, this.#zoomMax, {
            animate: true,
            pan:{
              duration: 1
            }
          })
      }

}

const app = new App();

