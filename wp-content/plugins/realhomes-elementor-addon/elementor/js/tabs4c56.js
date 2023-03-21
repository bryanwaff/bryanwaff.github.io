/**
 * ES6 Class for Elementor Tabs Properties
 *
 * @since 1.0.2
 * */

class RHEATabsWidgetClass extends elementorModules.frontend.handlers.Base {
    getDefaultSettings() {
        return {
            selectors : {
                tabsContainer : '.rhea-tabs-container'
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings( 'selectors' );
        return {
            $tabsContainer : this.$element.find( selectors.tabsContainer )
        };
    }

    bindEvents() {
        this.loadFeaturedPropertiesSlider();
    }

    loadFeaturedPropertiesSlider( event ) {

        let tabsContainer      = this.elements.$tabsContainer,
            tabsList           = tabsContainer.find( '.rhea-tabs-list li' ),
            tabsContentWrapper = tabsContainer.find( '.rhea-tabs-content-wrapper' ),
            tabsContent        = tabsContainer.find( '.rhea-tabs-content-wrapper .rhea-tabs-content' );

        if ( tabsContent.length ) {
            let minHeight      = 0;
            let contentHeights = [];

            tabsContent.each( function ( index ) {
                // Gather all content wrapper heights.
                contentHeights.push( jQuery( this ).outerHeight() );
            } );

            if ( contentHeights ) {
                // Find max value in the array and add with wrapper's space.
                minHeight = Math.max.apply( Math, contentHeights ) + ( tabsContentWrapper.outerHeight() - tabsContentWrapper.height() );

                // Set container minimum height
                tabsContainer.css( 'min-height', minHeight );
            }
        }

        tabsList.on( 'click', function ( event ) {
            const $this = jQuery( this );

            tabsList.removeClass( 'rhea-tabs-active' );
            $this.addClass( 'rhea-tabs-active' );

            // Hide all content and show current one.
            tabsContent.hide().removeClass( 'rhea-tabs-active' );
            tabsContent.eq( $this.index() ).show().addClass( 'rhea-tabs-active' );
        } );

    }
}

jQuery( window ).on( 'elementor/frontend/init', () => {
    const tabsWidgetHandler = ( $element ) => {
        elementorFrontend.elementsHandler.addHandler( RHEATabsWidgetClass, {
            $element
        } );
    };

    elementorFrontend.hooks.addAction( 'frontend/element_ready/inspiry-tabs-widget.default', tabsWidgetHandler );
} );