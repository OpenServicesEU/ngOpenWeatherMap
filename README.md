ngOpenWeatherMap
================

[![Build Status](https://travis-ci.org/OpenServicesEU/ngOpenWeatherMap.svg?branch=master)](https://travis-ci.org/OpenServicesEU/ngOpenWeatherMap)

Angular.js provider for fetching current weather and forecasts (5 days and 16
days) using Openweathermap API. It only fetches the requested data, and leaves
the actual presentation to the developer. For a Angular.js directive that
displass the same information directly, please see
[angular-openweathermap](https://github.com/drtechie/angular-openweathermap)
from which this provider draws some inspiration.

An API key from [OpenWeatherMap](http://openweathermap.org/) is required in
order to use this provider. See the section [How to get API
key](http://openweathermap.org/appid#get) on the OpenWeatherMap API
documentation for further information.

A directive is also included that maps OpenWeatherMap.org weather condition IDs
to the excellent [weather-icons](http://erikflowers.github.io/weather-icons/) by
Erik Flowers.

Getting started
---------------

 * Include the script on your page after the AngularJS tag:

        <script type='text/javascript' src='path/to/angular.min.js'></script>
        <script type='text/javascript' src='path/to/ng-openweathermap.min.js'></script>

 * Ensure that your application module specifies ngOpenWeatherMap as a dependency:

        var app = angular.module('myApplication', ['ngOpenWeatherMap']);

 * Configure the provider by setting the API key:

        app.config(['owmProvider', function(owmProvider) {
            owmProvider
                .setApiKey('XXXXXXX')
                .useMetric()
                .setLanguage('en');
        }]);

* Inject the `owm` provider into your controller:

        app.controller(
            'weatherCtrl',
            [
                '$scope',
                'owm',
                function($scope, owm) {
                    owm.current.name('Graz,AT').then(function(weather) {
                        $scope.weather = weather;
                    });
                }
            ]
        );


Provider API
------------

The `owm` provider exposes three OpenWeatherMap APIs to fetch data and one
helper API that maps weather conditions to icon names:

 * `owm.icons`: [Weather condition
     ids](http://openweathermap.org/weather-conditions) to
     [weather-icons](http://erikflowers.github.io/weather-icons/) names
 * `owm.current`: [Current weather data](http://openweathermap.org/current)
 * `owm.forecast5`: [5 day weather forecast](http://openweathermap.org/forecast5)
 * `owm.forecast16`: [16 day weather forecast](http://openweathermap.org/forecast16)

Each of the three data APIs provides the same set of functions for weather data
lookup that returns a Angular.js `$q` promise This promise is resolved once the
weather data has been retrieved or gets rejected if there was an error.

The data retrieved from OpenWeatherMap.org is directly passed to the function
that gets called by the `then` methode of the promise:

 * [Structure of current weather](http://openweathermap.org/current#current_JSON)
 * [Structure of 5 days forecast](http://openweathermap.org/forecast5#JSON)
 * [Structure of 16 days forecast](http://openweathermap.org/forecast16#JSON)

### Configuration

 * `setApiKey('key')`: Set the OpenWeatherMap API key
 * `useMetric()`: Use metric units for weather data
 * `useImperial()`: Use imperial units for weather data
 * `setLanguage('en')`: Set the language for strings in the weather data, see
     the [list of supported languages](http://openweathermap.org/current#multi)

### Icon names

Each weather condition is mapped to a set of up to three distinctive icon names,
a neutral one, one for daytime and one for nighttime. To get the icon names just
pass the weather condition ID to one of the follwoing three functions:

    owm.icons.neutral(200)
    owm.icons.day(200)
    owm.icons.night(200)

The name returned by those functions is the name of the icons from
[weather-icons](http://erikflowers.github.io/weather-icons/) minus the leading
`wi-`.

### City name

    owm.current.name('Graz')
    owm.forecast5.name('Graz')
    owm.forecast16.name('Graz')

    owm.current.name('Graz,AT')
    owm.forecast5.name('Graz,AT')
    owm.forecast16.name('Graz,AT')

    owm.current.find('London')
    owm.forecast5.find('London')
    owm.forecast16.find('London')

Lookup by city name and optional [ISO
3166](http://www.iso.org/iso/country_codes.htm) country code. `name()` is to be used for
accurate name lookups i.e. when the correct name of the city is already known.
`find()` searches for city names similar to the queried one.

### City ID

    owm.forecast16.id(2778067)

Lookup by OpenWeatherMap city ID.

### Coordinates

    owm.current.coordinates(47.066667, 15.433333)
    owm.forecast5.coordinates(47.066667, 15.433333)
    owm.forecast16.coordinates(47.066667, 15.433333)

Lookup using latitude and longitued. Fetches the weather data from the nearest
city to the given coordinates.

### Zip code

    owm.current.zip('8045,AT')
    owm.forecast5.zip('8045,AT')
    owm.forecast16.zip('8045,AT')

Lookup using the zip code and an optional [ISO
3166](http://www.iso.org/iso/country_codes.htm) country code.

Directive
---------

Using the directive is simple, just pass the weather condition ID:

    <owm-icon id="{{ condition.id }}"></owm-icon>

For the directive to be able to display any icons, please install the
[weather-icons](http://erikflowers.github.io/weather-icons/) package.

License
-------

**ngOpenWeatherMap** is licensed under the MIT license. See the LICENSE file for more details.
