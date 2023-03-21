/**
 * Ajax Search Results Feature
 *
 * @since 3.21.0
 */
( function ( $ ) {
    "use strict";

    const propertiesSection = $( '#properties-listing' );
    const additionalFields  = localized.additionalFields;
    const mapService        = localized.mapService;

    if ( propertiesSection.hasClass( 'realhomes_ajax_search' ) ) {

        // Generating an array of Additional Fields using the localized strings
        let additionalFieldsArray = [];
        if ( typeof additionalFields !== "undefined" ) {
            if ( 0 < additionalFields.length ) {
                additionalFields.map( ( fields ) => additionalFieldsArray.push( fields.field_key ) )
            }
        }

        const searchHeader        = $( '.rh_page__head' ),
              loader              = $( '#ajax-loader' ),
              searchContainer     = $( '.rh_page__listing' ),
              statsContainer      = $( '.rh_pagination__stats' ),
              paginationContainer = $( '.rh_pagination' ),
              pageID              = statsContainer.data( 'page-id' );

        // Object containing the values of the search fields on first page load
        let searchFieldValues = {
            keywords               : $( '#keyword-txt' ).val(),
            locations              : $( "#location" ).val(),
            agents                 : $( '#select-agent' ).val(),
            agencies               : $( '#select-agency' ).val(),
            types                  : $( '#select-property-type' ).val(),
            beds                   : $( '#select-bedrooms' ).val(),
            baths                  : $( '#select-bathrooms' ).val(),
            minPrice               : $( '#select-min-price' ).val(),
            maxPrice               : $( '#select-max-price' ).val(),
            garages                : $( '#select-garages' ).val(),
            minArea                : $( '#min-area' ).val(),
            maxArea                : $( '#max-area' ).val(),
            propertyID             : $( '#property-id-txt' ).val(),
            minLotSize             : $( '#min-lot-size' ).val(),
            maxLotSize             : $( '#max-lot-size' ).val(),
            statuses               : $( '#select-status' ).val(),
            additionalFieldsValues : [],
            features               : []
        }

        // If pagination container is not found then create it
        if ( paginationContainer.length <= 0 ) {
            $( '.svg-loader' ).after( '<div class="rh_pagination"></div>' );
        }

        if ( typeof statsContainer.data( 'query-strings' ) === 'undefined' || statsContainer.data( 'query-strings' ).length <= 0 ) {
            statsContainer.attr( 'data-query-strings', window.location.search );
        }

        // Binding the classes to trigger Ajax Search
        $( '.inspiry_select_picker_trigger,.ajax-location-field, .rh_keyword_field_wrapper, .rh_mod_text_field input, .more-options-wrapper' )
        .each( function () {

            // If any field is changed and has a new value
            $( this ).on( 'change', () => {

                let selectedField                        = $( this ),
                    fieldName                            = selectedField.attr( 'name' ),
                    fieldValue                           = selectedField.val();
                searchFieldValues.keywords               = $( '#keyword-txt' ).val();
                searchFieldValues.locations              = $( "#location" ).val();
                searchFieldValues.agents                 = $( '#select-agent' ).val();
                searchFieldValues.agencies               = $( '#select-agency' ).val();
                searchFieldValues.types                  = $( '#select-property-type' ).val();
                searchFieldValues.bedrooms               = $( '#select-bedrooms' ).val();
                searchFieldValues.bathrooms              = $( '#select-bathrooms' ).val();
                searchFieldValues.minPrice               = $( '#select-min-price' ).val();
                searchFieldValues.maxPrice               = $( '#select-max-price' ).val();
                searchFieldValues.garages                = $( '#select-garages' ).val();
                searchFieldValues.minArea                = $( '#min-area' ).val();
                searchFieldValues.maxArea                = $( '#max-area' ).val();
                searchFieldValues.propertyID             = $( '#property-id-txt' ).val();
                searchFieldValues.minLotSize             = $( '#min-lot-size' ).val();
                searchFieldValues.maxLotSize             = $( '#max-lot-size' ).val();
                searchFieldValues.statuses               = $( '#select-status' ).val();
                searchFieldValues.features               = [];
                searchFieldValues.additionalFieldsValues = [];

                // Generating an array of Additional Fields with values
                additionalFieldsArray.forEach( ( field, index ) => {
                    const current_field        = $( '#' + field )
                    let additional_field_name  = current_field.attr( 'name' );
                    let additional_field_value = current_field.val();
                    if ( additional_field_value.length > 0 && additional_field_value !== 'any' ) {
                        searchFieldValues.additionalFieldsValues.push( [{
                            additional_field_name,
                            additional_field_value
                        }] );
                    }
                } );

                // Generating an array of Property Features
                $( "input[name='features[]']:checked" )
                .each( ( index, feature ) => searchFieldValues.features.push( feature.value ) );

                // Getting an array of selected values if any
                let fieldValues = realhomes_search_values( searchFieldValues );
                if ( typeof fieldValues !== 'undefined' ) {

                    // Updating the current URL and window history
                    const url = new URL( window.location );

                    // Check if we are on a paginated page
                    if ( url.pathname.lastIndexOf( 'page' ) !== -1 ) {
                        url.pathname = url.pathname.slice( 0, url.pathname.lastIndexOf( 'page' ) );
                    }

                    // Update the browser URL based on selected field/features values
                    realhomes_update_browser_URL( fieldName, fieldValue, url );
                    realhomes_update_browser_URL( 'features[]', searchFieldValues.features, url );

                    searchContainer
                    .hide()
                    .html( '' );

                    loader.show();

                    // Sending AJAX Request to filter search results
                    $.ajax( {
                        url     : ajaxurl,
                        type    : 'post',
                        data    : {
                            action  : 'realhomes_filter_ajax_search_results',
                            ...searchFieldValues,
                            page_id : pageID
                        },
                        success : ( response ) => {
                            loader.hide();

                            let currentURL = url.href;
                            realhomes_update_pagination_and_stats( currentURL );

                            searchContainer
                            .html( response.data.search_results )
                            .show();

                            statsContainer
                            .attr( 'data-max', response.data.max_pages )
                            .attr( 'data-page', response.data.paged );

                            // Scrolling the user smoothly to ajax search container
                            if ( fieldValues.length > 0 ) {
                                if ( fieldValue.length > 0 && fieldValue !== 'any' ) {
                                    $( 'html, body' ).animate( {
                                        scrollTop : searchHeader.offset().top - 50
                                    }, 1000 );
                                }
                            }

                        },
                        complete : ( response ) => {
                            let responseText = JSON.parse( response.responseText );
                            if ( responseText.data.page_template === 'templates/properties-search-half-map.php' ) {
                                realhomesInfoboxPopupTrigger();
                            }
                            // Binding Favorites & Compare Properties Features
                            realhomes_update_favorites();
                            realhomes_update_compare_properties();
                        }
                    } );

                    // Sending AJAX Request to filter search results for MAP
                    $.ajax( {
                        url     : ajaxurl,
                        type    : 'post',
                        data    : {
                            action : 'realhomes_map_ajax_search_results',
                            ...searchFieldValues
                        },
                        success : ( response ) => {
                            let propertiesMapData = response.data.propertiesData;
                            let mapServiceType    = mapService.toString();
                            realhomes_update_properties_on_map( mapServiceType, propertiesMapData );
                        }
                    } );

                }
            } );
        } );

        /**
         * Update the browser URL when select any field in ajax search
         * @param fieldName
         * @param fieldValue
         * @param url
         *
         * @since 3.21.0
         */
        let realhomes_update_browser_URL = ( fieldName, fieldValue, url ) => {
            statsContainer.attr( 'data-query-strings', window.location.search );
            if ( fieldValue.length > 0 && fieldValue !== 'any' ) {
                if ( Array.isArray( fieldValue ) ) {
                    url.searchParams.delete( fieldName );
                    fieldValue.forEach( ( value, index ) => {
                        url.searchParams.append( fieldName, value );
                    } );
                } else {
                    url.searchParams.set( fieldName, fieldValue );
                }
                window.history.pushState( {}, '', url );
            } else {
                url.searchParams.delete( fieldName, fieldValue );
                window.history.pushState( {}, '', url );
            }
        }

        /**
         * Check for fields which are set as 'any', 'undefined' or empty arrays
         *
         * @param searchFieldValuesObj
         * @returns {*[]} (array)
         *
         * @since 3.21.0
         */
        let realhomes_search_values = ( searchFieldValuesObj ) => {
            let searchValues = [];
            Object.entries( searchFieldValuesObj ).forEach( ( [key, value] ) => {
                ( value !== 'any' && value !== '' && typeof value !== 'undefined' && value.length > 0 ) ? searchValues.push( value ) : '';
            } );
            return searchValues;
        }

        /**
         * Update the filteres properties on the map according to map service type
         * @param mapServiceType
         * @param propertiesMapData
         *
         * @since 3.21.0
         */
        let realhomes_update_properties_on_map = ( mapServiceType, propertiesMapData ) => {
            if ( typeof mapServiceType !== "undefined" && mapServiceType === 'openstreetmaps' ) {
                realhomes_update_open_street_map( propertiesMapData );
            } else if ( typeof mapServiceType !== "undefined" && mapServiceType === 'mapbox' ) {
                $( '#map-head' ).empty().append( '<div id="listing-map"></div>' );
                realhomes_update_mapbox( propertiesMapData );
            } else {
                realhomes_update_google_map( propertiesMapData );
            }
        }

        /**
         * Update the map results based on Search Fields - Ajax Search
         * @param paged
         *
         * @since 3.21.0
         */
        window.realhomes_update_ajax_map_results = ( paged ) => {

            $.ajax( {
                url     : ajaxurl,
                type    : 'post',
                data    : {
                    action : 'realhomes_map_ajax_search_results',
                    ...searchFieldValues,
                    page   : paged
                },
                success : ( response ) => {
                    let propertiesMapData = response.data.propertiesData;
                    let mapServiceType    = mapService.toString();
                    realhomes_update_properties_on_map( mapServiceType, propertiesMapData );
                }
            } );
        }

    }

    /**
     * Update Pagination and Statistics - Ajax Search & Listing Pages
     * @param sourceURL
     *
     * @since 3.21.0
     */
    window.realhomes_update_pagination_and_stats = ( sourceURL ) => {
        const statsContainer      = $( '.rh_pagination__stats' );
        const paginationContainer = $( '.rh_pagination' );
        paginationContainer.load( sourceURL + ' ' + '.rh_pagination > *' );
        statsContainer.load( sourceURL + ' ' + '.rh_pagination__stats > *' );
    }

} )( jQuery );