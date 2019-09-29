import React from 'react';
import { withRouter } from 'react-router-dom';
const google = window.google

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: {}
    }
  }

  componentDidMount() {
    
    if (this.props.location.pathname.includes('walks')) {
      
    }

    const mapOptions = {
      center: { lat: 37.798887, lng: -122.401373 }, 
      zoom: 17
    };

    this.map = new google.maps.Map(this.mapNode, mapOptions);
    
    if (this.props.location.pathname.includes('walks')) {

    } else {
      this.props.receiveRoom(this.props.match.params.requestId)
      let rooms = [this.props.match.params.requestId];
      this.sendLocation(rooms);
    }

    let locationCallBack = (data) => {
      let location = data.latLng;
      let user = data.currentUser.id;
      
      if (this.state.markers[user]) {
        this.state.markers[user].setPosition(location)
      } else {

        let marker = new google.maps.Marker({
          position: location,
          map: this.map,
          label: data.currentUser.name
        })

        this.state.markers[user] = marker;
        this.map.setCenter(location)
      }
    }

    let locationListener = { action: 'sendLocation', callback: locationCallBack}

    this.props.receiveListener(locationListener)
  }

  sendLocation(rooms) {
    const locationTag = document.getElementById('unsupported');
    if (navigator.geolocation) {
      setInterval(() => {
        rooms.forEach(room => {
          navigator.geolocation.getCurrentPosition((position) => {
            let latLng = { lat: position.coords.latitude, lng: position.coords.longitude }
            let data = { currentUser: this.props.currentUser, latLng, room }
            let locationEmit = { action: 'sendLocation', value: data }
            this.props.receiveEmit(locationEmit)
          })
        })
      }, 4000)
    } else {
      locationTag.innerHTML = "Geolocation isn't supported by your browser."
    }
  }


  render() {
    return (
      <div>

        <div id="map-container" ref={map => this.mapNode = map}>
        </div>
        <p id="unsupported"></p>
      </div>
    )
  }
}

export default withRouter(Map)