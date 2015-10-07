/**
 * ng-openweathermap
 *
 * A simple & configurable provider for openweathermap.org
 *
 * @link https://github.com/OpenServices/ng-weathermap
 * @author Michael Fladischer <michael@openservices.at>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(root.angular);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root.angular || (window && window.angular));
  } else {
    factory(root.angular);
  }
})(this, function (angular) {
  'use strict';

  angular.module('ngOpenWeatherMap', [])
  .provider('owm', function() {
    var apiKey;
    var units = 'metric';
    var language = 'en';
    var mappings = [
      {
        ids: [200,201,230,231],
        neutral: 'storm-showers',
        day: 'day-storm-showers',
        night: 'night-storm-showers'
      },
      {
        ids: [202,232],
        neutral: 'thunderstorm',
        day: 'day-thunderstorm',
        night: 'night-thunderstorm'
      },
      {
        ids: [210,211,212,221],
        neutral: 'lightning',
        day: 'day-lightning',
        night: 'night-lightning'
      },
      {
        ids: [300,301,302],
        neutral: 'sprinkle',
        day: 'day-sprinkle',
        night: 'night-sprinkle'
      },
      {
        ids: [310,311,312,500,],
        neutral: 'rain-mix',
        day: 'day-rain-mix',
        night: 'night-rain-mix'
      },
      {
        ids: [313,314,321,520,521,522,531],
        neutral: 'showers',
        day: 'day-showers',
        night: 'night-showers'
      },
      {
        ids: [500,501,502,503,504],
        neutral: 'rain',
        day: 'day-rain',
        night: 'night-rain'
      },
      {
        ids: [511,611,612,615,616,620,621,622],
        neutral: 'sleet',
        day: 'day-sleet',
        night: 'night-sleet'
      },
      {
        ids: [600,601,602],
        neutral: 'snow',
        day: 'day-snow',
        night: 'night-snow'
      },
      {
        ids: [701,741],
        neutral: 'fog',
        day: 'day-fog',
        night: 'night-fog'
      },
      {
        ids: [711],
        neutral: 'smoke'
      },
      {
        ids: [721],
        neutral: 'day-haze'
      },
      {
        ids: [781],
        neutral: 'tornado'
      },
      {
        ids: [771],
        neutral: 'strong-wind',
        day: 'day-windy'
      },
      {
        ids: [731,751,761,762],
        neutral: 'dust'
      },
      {
        ids: [800],
        neutral: 'day-sunny',
        night: 'night-clear'
      },
      {
        ids: [801,802,803,804],
        neutral: 'cloudy',
        day: 'day-cloudy',
        night: 'night-cloudy'
      },
      {
        ids: [900,901,902],
        neutral: 'tornado'
      },
      {
        ids: [903],
        neutral: 'snowflake-cold'
      },
      {
        ids: [904],
        neutral: 'hot'
      },
      {
        ids: [905],
        neutral: 'windy'
      },
      {
        ids: [906],
        neutral: 'hail',
        day: 'day-hail',
        night: 'night-hail'
      },
      {
        ids: [951],
        neutral: 'beafort-0'
      },
      {
        ids: [952],
        neutral: 'beafort-1'
      },
      {
        ids: [953],
        neutral: 'beafort-2'
      },
      {
        ids: [954],
        neutral: 'beafort-3'
      },
      {
        ids: [955],
        neutral: 'beafort-4'
      },
      {
        ids: [956],
        neutral: 'beafort-5'
      },
      {
        ids: [957],
        neutral: 'beafort-6'
      },
      {
        ids: [958],
        neutral: 'beafort-7'
      },
      {
        ids: [959],
        neutral: 'beafort-8'
      },
      {
        ids: [960],
        neutral: 'beafort-9'
      },
      {
        ids: [961],
        neutral: 'beafort-10'
      },
      {
        ids: [962],
        neutral: 'beafort-11'
      }
    ];
    this.setApiKey = function(value) {
      apiKey = value;
      return this;
    };
    this.useMetric = function() {
      units = 'metric';
      return this;
    };
    this.useImperial = function() {
      units = 'imperial';
      return this;
    };
    this.setLanguage = function(value) {
      language = value;
      return this;
    };
    this.$get = ['$http', '$q', function($http, $q) {
      if (!apiKey) {
        console.warn('No OpenWeatherMap API key set.');
      }
      var fetch = function(base, query) {
        var url = base + "?APPID=" + apiKey + "&lang=" + language + '&units=' + units + '&' + query;
        var deferred = $q.defer();
        $http
        .get(url)
        .then(function(data, status, headers, config) {
          if (parseInt(data.data.cod) === 200) {
            deferred.resolve(data.data);
          } else {
            deferred.reject(data.data);
          }
        })
        .catch(function(data, status, headers, config) {
          deferred.reject(status);
        });
        return deferred.promise;
      };
      var api = function(base) {
        return {
          find: function(city) {
            return fetch(base, 'q=' + city + '&type=like');
          },
          name: function(city) {
            return fetch(base, 'q=' + city + '&type=accurate');
          },
          id: function(id) {
            return fetch(base, 'id=' + id);
          },
          coordinates: function(lat, lon) {
            return fetch(base, 'lat=' + lat + '&lon=' + lon);
          },
          zip: function(zip) {
            return fetch(base, 'zip=' + zip);
          }
        };
      };
      var icon = function(type) {
        return function(id) {
          var iid = parseInt(id);
          var mapping = mappings.filter(function(m) {
            return (m.ids.indexOf(iid) >= 0);
          });
          if (mapping.length !== 1) {
            return 'umbrella'; // Better safe than sorry
          }
          if (!mapping[0].hasOwnProperty(type)) {
            return mapping[0].neutral;
          }
          return mapping[0][type];
        };
      };
      return {
        icons: {
          neutral: icon('neutral'),
          day: icon('day'),
          night: icon('night')
        },
        current: api('http://api.openweathermap.org/data/2.5/weather'),
        forecast5: api('http://api.openweathermap.org/data/2.5/forecast'),
        forecast16: api('http://api.openweathermap.org/data/2.5/forecast/daily')
      };
    }];
  })
  .directive('owmIcon', function() {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        type: '@'
      },
      template: '<i class="wi wi-{{ name }}"></i>',
      controller: ['$scope', 'owm', function($scope, owm) {
        $scope.$watchGroup(['id', 'type'], function() {
          if (owm.icons.hasOwnProperty($scope.type)) {
            $scope.name = owm.icons[$scope.type]($scope.id);
          } else {
            $scope.name = owm.icons.neutral($scope.id);
          }
        });
      }]
    };
  });
});
