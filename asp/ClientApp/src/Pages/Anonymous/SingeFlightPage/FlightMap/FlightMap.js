import * as React from 'react';
import { MapProvider } from 'react-map-gl';
import MapView from './MapView';

const FlightMap = ({ origin, destination }) => {



    return (
        <div className="maping-api" style={{ border: "2px solid #ccc", minHeight: "300px" }}
        >
            {(origin === undefined || destination === undefined) ?
                null :
                (
                    <MapProvider>

                        <MapView origin={origin} destination={destination} />

                    </MapProvider>
                )
            }
        </div>
    );
}
export default FlightMap;