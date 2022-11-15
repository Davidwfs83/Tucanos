import React, { useRef, useCallback } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import StartFlag from '../../../../images/startflag.svg';
import FinishFlag from '../../../../images/finishflag.svg';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGF2aWR3ZnM4MyIsImEiOiJjbDgwdmhwYWgwYTBiM3B0OTNyaDY5cTY4In0.71h2R4VVNm4fETOYA_W3Ww';

const MapView = ({ origin, destination }) => {
    const mapRef = useRef();
    const dataOne = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: [
                [origin.longitude, origin.latitude],
                [destination.longitude, destination.latitude]
            ]
        }
    };

    const onMapLoad = useCallback(() => {
        mapRef.current.fitBounds(
            [
                [origin.longitude, origin.latitude],
                [destination.longitude, destination.latitude]
            ],
            { padding: 40, duration: 1000 }
        );
    }, []);
    return (
        <Map
            id="mymap"
            ref={mapRef}
            onLoad={onMapLoad}
            style={{ width: "auto", height: 600 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
        >

            <Source id="polylineLayer" type="geojson" data={dataOne}>
                <Layer
                    id="lineLayer"
                    type="line"
                    source="my-data"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round"
                    }}
                    paint={{
                        "line-color": "rgba(255, 23, 50, 0.5)",
                        "line-width": 5
                    }}
                />
            </Source>
            {/*Start Flag*/}
            <Marker
                anchor="center"
                longitude={origin.longitude}
                latitude={origin.latitude}
            >
                <img style={{ width: "40px", height: "50px" }} src={StartFlag} />
            </Marker>
            {/*Finish Flag*/}
            <Marker
                anchor="center"
                longitude={destination.longitude}
                latitude={destination.latitude}
            >
                <img style={{ width: "40px", height: "50px" }} src={FinishFlag} />
            </Marker>

        </Map>
    )
}
export default MapView;