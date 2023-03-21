/**
 * ES6 Class for Elementor News Widget
 *
 * @since 1.0.2
 * */

class RHEANewsWidgetClass extends elementorModules.frontend.handlers.Base {
    getDefaultSettings() {
        return {
            selectors : {
                newsWidgetSlider : '.listing-slider_elementor'
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings( 'selectors' );
        return {
            $newsWidgetSlider : this.$element.find( selectors.newsWidgetSlider )
        };
    }

    bindEvents() {
        this.loadFlexOnNewsWidget();
    }

    loadFlexOnNewsWidget( event ) {

        let newsSlider = this.elements.$newsWidgetSlider,
            thumbHeight = newsSlider.find('img').height();

        // adding height of img element to stop the flickr on slider loading
        newsSlider.css( 'height', thumbHeight );

        if ( jQuery().flexslider ) {
            jQuery( newsSlider ).each( function () {
                jQuery( this ).flexslider( {
                    animation          : "slide",
                    slideshow          : false,
                    controlNav         : false,
                    customDirectionNav : jQuery( this ).next( '.rh_flexslider__nav_main_gallery' ).find( '.nav-mod' ),
                    start              : function ( slider ) {
                        slider.removeClass( 'loading' ).css( 'height', 'auto' ).children( '.gallery-loader' ).fadeOut( 200 );
                    }
                } );
            } );
        }
    }
}

jQuery( window ).on( 'elementor/frontend/init', () => {
    const RHEANewsWidgetHandler = ( $element ) => {
        elementorFrontend.elementsHandler.addHandler( RHEANewsWidgetClass, {
            $element
        } );
    };

    elementorFrontend.hooks.addAction( 'frontend/element_ready/ere-news-widget-home.default', RHEANewsWidgetHandler );
} );