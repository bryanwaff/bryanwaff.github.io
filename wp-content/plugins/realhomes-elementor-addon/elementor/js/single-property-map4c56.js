/**
 * ES6 Class for Elementor Single Property Map Widget
 *
 * @since 1.0.2
 * */

class RHEASinglePropertyMapWidgetClass extends elementorModules.frontend.handlers.Base {
    getDefaultSettings() {
        return {
            selectors : {
                propertyMapWrapper : '.rhea-single-property-map-wrapper',
                propertyMap        : '.rhea-single-property-map'
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings( 'selectors' );
        return {
            $propertyMapWrapper : this.$element.find( selectors.propertyMapWrapper ),
            $propertyMap        : this.$element.find( selectors.propertyMap )
        };
    }

    bindEvents() {
        this.loadSinglePropertyMap();
    }

    loadSinglePropertyMap( event ) {

        let propertyMapWrapper = this.elements.$propertyMapWrapper,
            mapContainerDOM    = this.elements.$propertyMap,
            mapContainerString = mapContainerDOM[0].id,
            mapContainer       = document.getElementById( mapContainerString ),
            propertyLabel      = propertyMapWrapper.data( 'label' ),
            mapLat             = propertyMapWrapper.data( 'lat' ),
            mapLong            = propertyMapWrapper.data( 'long' ),
            mapZoom            = propertyMapWrapper.data( 'zoom' ),
            mapType            = propertyMapWrapper.data( 'map-type' ),
            mapWaterColor      = propertyMapWrapper.data( 'water-color' ),
            mapMarker          = propertyMapWrapper.data( 'map-marker' ),
            mapStyles          = [{
                "featureType" : "administrative",
                "elementType" : "labels.text",
                "stylers"     : [{
                    "color" : "#000000"
                }]
            }, {
                "featureType" : "administrative",
                "elementType" : "labels.text.fill",
                "stylers"     : [{
                    "color" : "#444444"
                }]
            }, {
                "featureType" : "administrative",
                "elementType" : "labels.text.stroke",
                "stylers"     : [{
                    "visibility" : "off"
                }]
            }, {
                "featureType" : "administrative",
                "elementType" : "labels.icon",
                "stylers"     : [{
                    "visibility" : "on"
                }, {
                    "color" : "#380d0d"
                }]
            }, {
                "featureType" : "landscape",
                "elementType" : "all",
                "stylers"     : [{
                    "color" : "#f2f2f2"
                }]
            }, {
                "featureType" : "poi",
                "elementType" : "all",
                "stylers"     : [{
                    "visibility" : "off"
                }]
            }, {
                "featureType" : "road",
                "elementType" : "all",
                "stylers"     : [{
                    "saturation" : -100
                }, {
                    "lightness" : 45
                }]
            }, {
                "featureType" : "road",
                "elementType" : "geometry",
                "stylers"     : [{
                    "visibility" : "on"
                }, {
                    "color" : "#dedddb"
                }]
            }, {
                "featureType" : "road",
                "elementType" : "labels.text",
                "stylers"     : [{
                    "color" : "#000000"
                }]
            }, {
                "featureType" : "road",
                "elementType" : "labels.text.fill",
                "stylers"     : [{
                    "color" : "#1f1b1b"
                }]
            }, {
                "featureType" : "road",
                "elementType" : "labels.text.stroke",
                "stylers"     : [{
                    "visibility" : "off"
                }]
            }, {
                "featureType" : "road",
                "elementType" : "labels.icon",
                "stylers"     : [{
                    "visibility" : "on"
                }, {
                    "hue" : "#ff0000"
                }]
            }, {
                "featureType" : "road.highway",
                "elementType" : "all",
                "stylers"     : [{
                    "visibility" : "simplified"
                }]
            }, {
                "featureType" : "road.arterial",
                "elementType" : "labels.icon",
                "stylers"     : [{
                    "visibility" : "off"
                }]
            }, {
                "featureType" : "transit",
                "elementType" : "all",
                "stylers"     : [{
                    "visibility" : "off"
                }]
            }, {
                "featureType" : "water",
                "elementType" : "all",
                "stylers"     : [{
                    "color" : mapWaterColor
                }, {
                    "visibility" : "on"
                }]
            }];

        if ( propertyMapWrapper.data( 'map-style' ) !== undefined ) {
            mapStyles = JSON.parse( atob( propertyMapWrapper.data( 'map-style' ), false ) );
        }

        const latLng = {
            lat : mapLat,
            lng : mapLong
        };

        if ( mapLat && mapLong ) {

            // Google Map
            if ( 'google-maps' === mapType ) {

                const mapOptions = {
                    zoom              : parseInt( mapZoom ),
                    center            : latLng,
                    streetViewControl : false,
                    scrollwheel       : false,
                    styles            : mapStyles
                };

                const map = new google.maps.Map( mapContainer, mapOptions );

                new google.maps.Marker( {
                    position : latLng,
                    map,
                    icon     : {
                        url : mapMarker
                    }
                } );

            } else if ( 'mapbox' === mapType ) {

                let mapboxAPI   = propertyMapWrapper.data( 'mapbox-api' ),
                    mapboxStyle = propertyMapWrapper.data( 'mapbox-style' );

                if ( mapboxAPI !== null ) {

                    const mapCenter = L.latLng( mapLat, mapLong );

                    mapboxgl.accessToken = mapboxAPI;
                    const propertyMap    = new mapboxgl.Map( {
                        attributionControl : false,
                        container          : mapContainerString,
                        style              : mapboxStyle,
                        center             : mapCenter,
                        zoom               : mapZoom
                    } ).addControl( new mapboxgl.AttributionControl( {} ) );

                    // create DOM element for the marker
                    const marker_icon     = document.createElement( 'div' );
                    marker_icon.className = 'mapbox-marker';

                    const marker_icon_img = document.createElement( 'img' );
                    marker_icon_img.src   = mapMarker;
                    marker_icon_img.alt   = propertyLabel;
                    marker_icon.append( marker_icon_img );

                    const propertyMarker = new mapboxgl.Marker( marker_icon )
                    .setLngLat( mapCenter )
                    .addTo( propertyMap );
                }

            } else {

                // Open Street Map
                const tileLayer  = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                } );
                const latLng     = L.latLng( mapLat, mapLong );
                const mapOptions = {
                    zoom   : parseInt( mapZoom ),
                    center : latLng
                };
                const map        = L.map( mapContainer, mapOptions );
                map.scrollWheelZoom.disable();
                map.addLayer( tileLayer );

                // Marker
                var markerOptions = {
                    icon : L.icon( {
                        iconUrl : mapMarker
                    } )
                };

                L.marker( [mapLat, mapLong], markerOptions ).addTo( map );
            }
        } else {
            mapContainer.style.display = 'none';
        }

    }
}

jQuery( window ).on( 'elementor/frontend/init', () => {
    const singlePropertyMapHandler = ( $element ) => {
        elementorFrontend.elementsHandler.addHandler( RHEASinglePropertyMapWidgetClass, {
            $element
        } );
    };

    elementorFrontend.hooks.addAction( 'frontend/element_ready/rhea-single-property-map-widget.default', singlePropertyMapHandler );
} );