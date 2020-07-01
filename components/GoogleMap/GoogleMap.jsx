import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

// Icons

import {EnvironmentOutlined} from '@ant-design/icons';

const AnyReactComponent = ({text}) => <div><EnvironmentOutlined style={{fontSize: 30, color: '#f5222d'}} /></div>;

const handleApiLoaded = (map, maps) => {
    // use map and maps objects
};

function GoogleMap(props) {
    return (
        <div style={{height: '300px', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: 'AIzaSyDjwG0kIIoevXXDp3GMdIw-UwUDvKpfwsA',
                    language: 'vi',
                    region: 'vi'
                }}
                center={props.center}
                defaultCenter={{
                    lat: 10.8225079,
                    lng: 106.68809549999999
                }}
                defaultZoom={props.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
            >
                <AnyReactComponent
                    lat={props.center.lat}
                    lng={props.center.lng}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
}

GoogleMap.propTypes = {

};

GoogleMap.defaultProps = {
    center: {
        lat: 10.8225079,
        lng: 106.68809549999999
    },
    zoom: 15,
    styles: {}
};

export default GoogleMap;

