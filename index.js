"use strict";

const request = require('request');
const parseString = require('xml2js').parseString;

let Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-arso", "ARSO", ARSO);
};

function ARSO(log, config) {
    this.log = log;

	this.name = config['name'] || "ARSO";
	this.serial_number = config['serial_number'] || "0111-0111-0111";

	this.weather_station = config['weather_station'] || 'si';
	this.air_station = config['air_station'] || null;

    this.temperature = {
		show: (config['temperature'] || {})['show'] || true,
		name: (config['temperature'] || {})['name'] || 'Temperature',
	};
	this.humidity = {
		show: (config['humidity'] || {})['show'] || true,
		name: (config['humidity'] || {})['name'] || 'Humidity',
	};
	this.rain = {
		show: (config['rain'] || {})['show'] || true,
		name: (config['rain'] || {})['name'] || 'Rain',
	};
	this.snow = {
		show: (config['snow'] || {})['show'] || true,
		name: (config['snow'] || {})['name'] || 'Snow',
	};
    this.air_quality = {
		show: (config['air_quality'] || {})['show'] || true,
		name: (config['air_quality'] || {})['name'] || 'Air Quality',
	};

	this.httpTimeout = Number(config['httpTimeout']) || 3000; // in milliseconds

    this.weather = {
		url: 'http://www.meteo.si/uploads/probase/www/observ/surface/text/sl/observationAms_' + this.weather_station + '_latest.xml',
		data: null,
		lastUpdate: 0,
		dateUpdated: null,
		fetchInProgress: false,
		pollingInterval: 420, // in seconds | 7 min | recommended 5 min after valid or 10 min

		icon_rain: /RA|FZRA|RASN|SHRA|SHRASN|SHGR|TS|TSRA|TSRASN/,
		icon_snow: /RASN|SN|SHRASN|SHSN|TSRASN|TSSN|TSGR/,
		icon_mod: /light|mod|heavy/,

		services: {
			'temperature': Service.TemperatureSensor,
			'humidity': Service.HumiditySensor,
			'rain': Service.MotionSensor,
			'snow': Service.MotionSensor
		},

		characteristics: {
			'temperature': Characteristic.CurrentTemperature,
			'humidity': Characteristic.CurrentRelativeHumidity,
			'rain': Characteristic.MotionDetected,
			'snow': Characteristic.MotionDetected
		}
	};

	this.air = {
		url: 'http://www.arso.gov.si/xml/zrak/ones_zrak_urni_podatki_zadnji.xml',
		data: null,
		lastUpdate: 0,
		dateUpdated: null,
		fetchInProgress: false,
		pollingInterval: 1800, // in seconds | 30 min | recommended 48 min after hour or 60 min

		// excelent, good, fair, inferior, poor
		// https://www.aircheckr.com/help-and-guides/air-quality-index
		// https://www.tecamgroup.com/acceptable-voc-levels/
		// https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf
		limits: {
			'pm10': [0, 20, 40, 75, 100],
			'pm2.5': [0, 15, 30, 50, 70],
			'o3': [0, 40, 100, 140, 180],
			'no2': [0, 10, 30, 100, 150],
			'so2': [0, 2, 35, 75, 185]
		},
		levels: {
			0: Characteristic.AirQuality.EXCELLENT,
			1: Characteristic.AirQuality.GOOD,
			2: Characteristic.AirQuality.FAIR,
			3: Characteristic.AirQuality.INFERIOR,
			4: Characteristic.AirQuality.POOR
		},
		characteristics: {
			'air_quality': Characteristic.AirQuality,
			'pm2.5': Characteristic.PM2_5Density,
			'pm10': Characteristic.PM10Density,
			'o3': Characteristic.OzoneDensity,
			'no2': Characteristic.NitrogenDioxideDensity,
			'so2': Characteristic.SulphurDioxideDensity,
		}
	}

	this.services = {};
}

ARSO.prototype = {

    needsUpdate: function(service) {
        if (this[service].lastUpdate === 0) {
            return true;
        }

        if(this[service].lastUpdate + this[service].pollingInterval < (new Date().getTime() / 1000)) {
            return true;
        }

        if (this[service].data === null) {
            return true;
        }

        return false;
    },

    fetchData: function (service) {
        if (this[service].fetchInProgress) {
            // Avoid fetchData as previous response has not arrived yet.
            return false;
        }

        this[service].fetchInProgress = true;

        this[service].dataUpdated = new Promise((resolve, reject) => {
            var options = {
                uri: this[service].url,
                method: 'GET',
                timeout: this.httpTimeout
            };

            request(options, (error, res, body) => {
                var data = null;
                if (error) {
                    this.log(`${service}: bad response (${options.uri}): ${error.message}`);
                } else {
                    try {
						data = this[`${service}Data`](body);
                        this.log(`${service}: successful response | ` + JSON.stringify(data));
                        this[service].lastUpdate = new Date().getTime() / 1000;
                    } catch (parseErr) {
                        this.log(`${service}: Error processing received information: ${parseErr.message}`);
                        error = parseErr;
                    }
                }

                if (error) {
                    reject(error.message);
                } else {
                    resolve(data);
                }

                this[service].fetchInProgress = false;
            });
        }).then((data) => {
            return data;
        }, (error) => {
            // Avoid NodeJS warning about uncatched rejected promises
            return error;
        });
    },

	weatherData: function(body) {

		var postaja;
		var data = {};

		let self = this;

		parseString(body, function (err, result) {
			if (err) {
				throw new Error('weather: XML Parse error' + err.message);
			}
			postaja = result.data.metData[0];
			postaja.temperature = postaja.t || null;
			postaja.humidity = postaja.rh || null;
			data.rain = self.getRain(postaja.wwsyn_icon);
			data.snow = self.getSnow(postaja.wwsyn_icon);
		});

		for (const attr in this.weather.characteristics) {
			if(data[attr] === undefined) {
				var cValue = parseFloat(postaja[attr]);
				if (!isNaN(cValue))  {
					data[attr] = cValue;
				}
			}
			if (data[attr] !== undefined && this[attr].show) {
				this.services[attr]
					.getCharacteristic(this.weather.characteristics[attr])
					.updateValue(data[attr], null);
			}
		}

		if (Object.keys(data).length === 0) {
            this.weather.data = null;
            throw new Error('weather: No data');
		}

		this.weather.data = data;

		return data;
	},

	getRain(data) {
		data = String(data) || '';
		data = data.replace(this.weather.icon_mod, '');

		return data.search(this.weather.icon_rain) > -1
			? 1
			: 0;
	},

	getSnow(data) {
		data = String(data) || '';
		data = data.replace(this.weather.icon_mod, '');

		return data.search(this.weather.icon_snow) > -1
			? 1
			: 0;
	},

    airData: function(body) {

		var postaja;
		var data = {};

		var air_station = this.air_station;

        parseString(body, function (err, result) {
			if (err) {
				throw new Error('air: XML Parse error' + err.message);
			}
			const postaje = result.arsopodatki.postaja;
			postaja = postaje[Object.keys(postaje).find(key => postaje[key]['$'].sifra === air_station)];
		});

        for (const attr in this.air.characteristics) {
            var cValue = parseFloat(postaja[attr]);
            if (!isNaN(cValue) && this.air_quality.show)  {
				data[attr] = cValue;
				this.services.airQuality
					.getCharacteristic(this.air.characteristics[attr])
					.updateValue(data[attr], null);
            }
        }

        if (Object.keys(data).length === 0) {
            this.air.data = null;
            throw new Error('air: No data');
		}

		data.air_quality = this.calculateAirQuality(data);

        this.air.data = data;

        return data;
	},

	calculateAirQuality: function(data) {
		let max_aqi = 0;

		for (const attr in data) {
			this.air.limits[attr].forEach(function (limit, key) {
				if (data[attr] > limit && max_aqi < key) {
					max_aqi = key;
				}
			});
		};

		return this.air.levels[max_aqi] || Characteristic.AirQuality.UNKNOWN;
	},

    getState: function (callback, service, characteristic) {
        if (!this.needsUpdate(service)) {
            callback(null, this[service].data[characteristic]);
            return this[service].data[characteristic];
        }

        this.fetchData(service);
        this[service].dataUpdated.then((data) => {
            callback(null, data[characteristic]);
            return data[characteristic];
        }, (error) => {
            callback(error, null);
            return error;
        });
    },

    getServices: function () {
        this.services.information = new Service.AccessoryInformation();
        this.services.information
            .setCharacteristic(Characteristic.Manufacturer, "AL.FA")
            .setCharacteristic(Characteristic.Model, "http")
			.setCharacteristic(Characteristic.SerialNumber, this.serial_number);

		if (this.weather_station) {
			for (const attr in this.weather.characteristics) {
				if (this[attr].show) {
					this.services[attr] = new this.weather.services[attr](this[attr].name, 'arso-subtype-' + attr);
					if (attr == 'temperature') {
						this.services[attr].getCharacteristic(Characteristic.CurrentTemperature).setProps({minValue: -60});
					}
					this.services[attr]
						.getCharacteristic(this.weather.characteristics[attr])
						.on('get', (callback) => {
							this.getState(callback, 'weather', attr);
						});
				}
			}
		}

		if (this.air_quality.show && this.air_station) {
			this.services.airQuality = new Service.AirQualitySensor(this.air_quality.name);
			for (const attr in this.air.characteristics) {
				this.services.airQuality
					.getCharacteristic(this.air.characteristics[attr])
					.on('get', (callback) => {
						this.getState(callback, 'air', attr);
					});
			}
		}

        this.weather.timer = setInterval(() => { this.fetchData('weather') }, this.weather.pollingInterval * 1000);
        this.air.timer = setInterval(() => { this.fetchData('air') }, this.air.pollingInterval * 1000);

        return Object.values(this.services);
    }
};
