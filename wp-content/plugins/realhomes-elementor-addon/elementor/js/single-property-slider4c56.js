/**
 * ES6 Class for Elementor Single Properties Slider Widget
 *
 * @since 1.0.2
 * */

class RHEAPropertySingleSliderWidgetClass extends elementorModules.frontend.handlers.Base {

    getDefaultSettings() {
        return {
            selectors : {
                sliderWrapper          : '.rhea-single-property-slider-wrapper',
                propertySlider         : '.rhea-single-property-slider',
                testimonialsSliderText : '.rhea_testimonials_text_3',
                navigationWrap         : '.rhea-single-property-slider-nav'
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings( 'selectors' );
        return {
            $sliderWrapper          : this.$element.find( selectors.sliderWrapper ),
            $propertySlider         : this.$element.find( selectors.propertySlider ),
            $testimonialsSliderText : this.$element.find( selectors.testimonialsSliderText ),
            $navigationWrap         : this.$element.find( selectors.navigationWrap )
        };

    }

    bindEvents() {
        this.loadPropertySlider();
    }

    loadPropertySlider( event ) {
        let sliderWrapper  = this.elements.$sliderWrapper,
            propertySlider = this.elements.$propertySlider,
            contentWrapper = sliderWrapper.find( '.rhea-single-property-content-wrap' ),
            navigationWrap = this.elements.$navigationWrap;

        if ( jQuery().flexslider ) {
            jQuery( propertySlider ).flexslider( {
                animation          : "fade",
                slideshowSpeed     : 7000,
                animationSpeed     : 1500,
                slideshow          : true,
                controlNav         : false,
                keyboardNav        : true,
                directionNav       : true,
                customDirectionNav : navigationWrap.find( '.nav-buttons' ),
                start              : function ( slider ) {
                    slider.removeClass( 'loading' );
                }
            } );

        }

        // Toggles class on first item on hover.
        sliderWrapper.find( '.rhea-single-property-meta-item' ).first().hover(
            function () {
                contentWrapper.addClass( 'disable-border-radius disable-first-border-radius' );
            }, function () {
                contentWrapper.removeClass( 'disable-border-radius disable-first-border-radius' );
            }
        );

        if ( sliderWrapper.find( '.rhea-single-property-meta-item' ).length > 2 ) {
            // Toggles class on last item on hover.
            sliderWrapper.find( '.rhea-single-property-meta-item' ).last().hover(
                function () {
                    contentWrapper.addClass( 'disable-border-radius disable-last-border-radius' );
                }, function () {
                    contentWrapper.removeClass( 'disable-border-radius disable-last-border-radius' );
                }
            );
        }
    }
}

jQuery( window ).on( 'elementor/frontend/init', () => {
    const propertySingleSliderHandler = ( $element ) => {
        elementorFrontend.elementsHandler.addHandler( RHEAPropertySingleSliderWidgetClass, {
            $element
        } );
    };

    elementorFrontend.hooks.addAction( 'frontend/element_ready/rhea-single-property-slider-widget.default', propertySingleSliderHandler );
} );