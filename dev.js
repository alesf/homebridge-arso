const HBModule = require('./index');

class DemoService {
	characteristics = {};
	characteristic = null;

	constructor(name) {
		this.name = name;
	}

	setCharacteristic(c, val) {
		this.characteristics[c] = val;
		return this;
	}
	getCharacteristic(c) {
		this.characteristic = c;
		return this;
	}
	on(call, callback) {
		console.log(`${call} | ${this.characteristic.name}`);
	}
	updateValue(value, err) {
		console.log(`${this.name} ${this.characteristic.name} || ${value}`);
	}
}

const hapService = {
	AccessoryInformation: DemoService,
	TemperatureSensor: DemoService,
	HumiditySensor: DemoService,
	ContactSensor: DemoService,
	AirQualitySensor: DemoService
}

const homebridge = {
	config: {
		air_station: 'E801'
	},
	log: function (data) {
		console.log('LOG: ' + data);
	},
	callback: function (error, data) {
		if (error) {
			console.warn('ERROR ' + error);
		} else {
			console.info('DATA ' + data);
		}
	},
	registerAccessory: function (accID, accName, accClass) {
		this[accName] = new accClass(this.log, this.config);
		this[accName].getServices();
	},
	callStates: function () {
		this['ARSO'].getState(this.callback, 'weather', 'temperature');
		this['ARSO'].getState(this.callback, 'weather', 'humidity');
		this['ARSO'].getState(this.callback, 'air', 'air_quality');
	},
	hap: {
		Service: hapService,
		Characteristic: {
			CurrentTemperature: {
				name: 'T'
			},
			CurrentRelativeHumidity: {
				name: 'H'
			},
			PM2_5Density: {
				name: 'PM25'
			},
			PM10Density: {
				name: 'PM10'
			},
			OzoneDensity: {
				name: 'O'
			},
			NitrogenDioxideDensity: {
				name: 'NO2'
			},
			SulphurDioxideDensity: {
				name: 'SO2'
			},
			ContactSensorState: {
				name: 'CONTACT'
			},
			AirQuality: {
				name: 'AQ',
				EXCELLENT: 'EXCELLENT',
				GOOD: 'GOOD',
				FAIR: 'FAIR',
				INFERIOR: 'INFERIOR',
				POOR: 'POOR',
				UNKNOWN: 'UNKNOWN'
			}
		}
	}
}

HBModule(homebridge);
homebridge.callStates();

// options: light, mod, heavy
// FG: megla
// DZ: rosenje
// FZDZ: rosenje, ki zmrzuje
// RA: dež
// FZRA: dež, ki zmrzuje
// RASN: dež s snegom
// SN: sneg
// SHRA: ploha dežja
// SHRASN: ploha dežja s snegom
// SHSN: snežna ploha
// SHGR: ploha sodre
// TS: nevihta
// TSRA: nevihta z dežjem
// TSRASN: nevihta z dežjem in snegom
// TSSN: nevihta s sneženjem
// TSGR: nevihta s točo

// domain_title: [ 'CELJE-MEDLOG' ],
// domain_id: [ '' ],
// domain_shortTitle: [ 'CELJE' ],
// domain_longTitle: [ 'Celje' ],
// domain_meteosiId: [ 'CELJE_MEDLOG_' ],
// domain_meteosiType: [ 'SI_RNSTATION' ],
// domain_lat: [ '46.2366' ],
// domain_lon: [ '15.2259' ],
// domain_altitude: [ '244.0' ],
// dataSource_title: [ 'M25' ],
// sunrise: [ '21.01.2021 7:33 CET' ],
// sunset: [ '21.01.2021 16:48 CET' ],
// tsValid_issued: [ '21.01.2021 14:00 CET' ],
// tsValid_issued_day: [ 'Četrtek CET' ],
// tsValid_issued_UTC: [ '21.01.2021 13:00 UTC' ],
// tsValid_issued_RFC822: [ '21 Jan 2021 13:00:00 +0000' ],
// tsUpdated: [ '21.01.2021 14:03 CET' ],
// tsUpdated_day: [ 'Četrtek CET' ],
// tsUpdated_UTC: [ '21.01.2021 13:03 UTC' ],
// tsUpdated_RFC822: [ '21 Jan 2021 13:03:00 +0000' ], // TODO: check this date - if not today discard all data
// valid_day: [ 'Četrtek CET' ],
// valid: [ '21.01.2021 14:00 CET' ],
// valid_UTC: [ '21.01.2021 13:00 UTC' ],
// validStart: [ '21.01.2021 12:30 UTC' ],
// validEnd: [ '21.01.2021 13:00 UTC' ],
// webcam: [ [Object], [Object] ], // TODO: use webcams for images
// nn_var_desc: [ 'Ocenjena oblačnost' ],
// wwsyn_var_desc: [ 'Pojavi' ],
// 'nn_icon-wwsyn_icon': [ 'overcast' ],
// wwsyn_icon: [ '' ], // TODO: use icon for rain, snow, hail switches
// t_var_desc: [ 'Temperatura' ],
// t_var_unit: [ '°C' ],
// t: [ '10.4' ],
// t_state: [ '0' ],
// td_var_desc: [ 'Temperatura rosišča' ],
// td_var_unit: [ '°C' ],
// td: [ '4.3' ],
// td_state: [ '0' ],
// tavg_var_desc: [ 'Povprečna temperatura v časovnem intervalu' ],
// tavg_var_unit: [ '°C' ],
// tavg: [ '10.3' ],
// tavg_state: [ '0' ],
// tx_var_desc: [ 'Maksimalna temperatura v časovnem intervalu' ],
// tx_var_unit: [ '°C' ],
// tx: [ '10.9' ],
// tx_state: [ '0' ],
// tn_var_desc: [ 'Minimalna temperatura v časovnem intervalu' ],
// tn_var_unit: [ '°C' ],
// tn: [ '9.8' ],
// tn_state: [ '0' ],
// rh_var_desc: [ 'Relativna vlažnost' ],
// rh_var_unit: [ '%' ],
// rh: [ '66' ],
// rh_state: [ '0' ],
// rhavg_var_desc: [ 'Povprečna relativna vlažnost v časovnem intervalu' ],
// rhavg_var_unit: [ '%' ],
// rhavg: [ '66' ],
// rhavg_state: [ '0' ],
// dd_var_desc: [ 'Smer vetra' ],
// dd_var_unit: [ '°' ],
// dd_val: [ '262' ],
// dd_shortText: [ 'Z' ],
// dd_icon: [ 'W' ],
// dd_state: [ '0' ],
// ddavg_var_desc: [ 'Povprečna smer vetra v časovnem intervalu' ],
// ddavg_var_unit: [ '°' ],
// ddavg_val: [ '263' ],
// ddavg_shortText: [ 'Z' ],
// ddavg_longText: [ 'zahodnik' ],
// ddavg_icon: [ 'W' ],
// ddavg_state: [ '0' ],
// ddmax_var_desc: [ 'Smer največjega sunka vetra v časovnem intervalu' ],
// ddmax_var_unit: [ '°' ],
// ddmax_val: [ '250' ],
// ddmax_shortText: [ 'Z' ],
// ddmax_icon: [ 'W' ],
// ddmax_state: [ '0' ],
// ff_var_desc: [ 'Hitrost vetra' ],
// ff_var_unit: [ 'm/s' ],
// ff_val: [ '3.2' ],
// ff_val_kmh: [ '12' ],
// ff_state: [ '0' ],
// ffavg_var_desc: [ 'Povprečna hitrost vetra v časovnem intervalu' ],
// ffavg_var_unit: [ 'm/s' ],
// ffavg_val: [ '2.9' ],
// ffavg_val_kmh: [ '10' ],
// ffavg_state: [ '0' ],
// ffmax_var_desc: [ 'Maksimalna hitrost vetra v časovnem intervalu' ],
// ffmax_var_unit: [ 'm/s' ],
// ffmax_val: [ '8' ],
// ffmax_val_kmh: [ '29' ],
// ffmax_state: [ '0' ],
// msl_var_desc: [ 'Zračni tlak reduciran na morski nivo' ],
// msl_var_unit: [ 'hPa' ],
// msl: [ '1012.9' ],
// msl_state: [ '0' ],
// mslavg_var_desc: [
// 	'Povprečni zračni tlak v časovnem intervalu reduciran na morski nivo'
// ],
// mslavg_var_unit: [ 'hPa' ],
// mslavg: [ '1012.9' ],
// mslavg_state: [ '0' ],
// p_var_desc: [ 'Zračni tlak na lokaciji' ],
// p_var_unit: [ 'hPa' ],
// p: [ '984' ],
// p_state: [ '0' ],
// pavg_var_desc: [ 'Povprečni zračni tlak na lokaciji v časovnem intervalu' ],
// pavg_var_unit: [ 'hPa' ],
// pavg: [ '984' ],
// pavg_state: [ '0' ],
// rr_var_desc: [ 'Vsota padavin v časovnem intervalu' ],
// rr_var_unit: [ 'mm' ],
// rr_val: [ '0' ],
// rr_state: [ '0' ],
// snow_var_desc: [ 'Višina snežne odeje' ],
// snow_var_unit: [ 'cm' ],
// snow: [ '' ],
// snow_state: [ '' ],
// tp_1h_acc_var_desc: [ '1-urne padavine' ],
// tp_1h_acc_var_unit: [ 'mm' ],
// tp_1h_acc: [ '0' ],
// tp_1h_acc_state: [ '0' ],
// tp_12h_acc_var_desc: [ 'Vsota padavin (od 6 oz. 18 UTC dalje)' ],
// tp_12h_acc_var_unit: [ 'mm' ],
// tp_12h_acc: [ '0' ],
// tp_12h_acc_state: [ '0' ],
// tp_24h_acc_var_desc: [ '24-urna vsota padavin' ],
// tp_24h_acc_var_unit: [ 'mm' ],
// tp_24h_acc: [ '' ],
// tp_24h_acc_state: [ '' ],
// tw_var_desc: [ 'Temperatura vode' ],
// tw_var_unit: [ '°C' ],
// tw: [ '' ],
// tw_state: [ '' ],
// gSunRad_var_desc: [ 'Globalno sončno obsevanje' ],
// gSunRad_var_unit: [ 'W/m2' ],
// gSunRad: [ '45' ],
// gSunRad_state: [ '0' ],
// gSunRadavg_var_desc: [ 'Povprečno globalno sončno obsevanje v časovnem intervalu' ],
// gSunRadavg_var_unit: [ 'W/m2' ],
// gSunRadavg: [ '47' ],
// gSunRadavg_state: [ '0' ],
// diffSunRad_var_desc: [ 'Difuzno sončno obsevanje' ],
// diffSunRad_var_unit: [ 'W/m2' ],
// diffSunRad: [ '' ],
// diffSunRad_state: [ '' ],
// diffSunRadavg_var_desc: [ 'Povprečno difuzno sončno obsevanje v časovnem intervalu' ],
// diffSunRadavg_var_unit: [ 'W/m2' ],
// diffSunRadavg: [ '' ],
// diffSunRadavg_state: [ '' ],
// vis_desc: [ 'Vidnost' ],
// vis_val: [ '' ],
// vis_unit: [ 'km' ],
// t_5_cm_var_desc: [ 'Temperatura na 5 cm' ],
// t_5_cm_var_unit: [ '°C' ],
// t_5_cm: [ '' ],
// t_5_cm_state: [ '' ],
// tavg_5_cm_var_desc: [ 'Temperatura na 5 cm' ],
// tavg_5_cm_var_unit: [ '°C' ],
// tavg_5_cm: [ '' ],
// tavg_5_cm_state: [ '' ],
// tg_5_cm_var_desc: [ 'Temperatura tal v globini 5 cm' ],
// tg_5_cm_var_unit: [ '°C' ],
// tg_5_cm: [ '3.5' ],
// tg_5_cm_state: [ '0' ],
// tgavg_5_cm_var_desc: [ 'Povprečna temperatura tal v časovnem intervalu v globini 5 cm' ],
// tgavg_5_cm_var_unit: [ '°C' ],
// tgavg_5_cm: [ '3.5' ],
// tgavg_5_cm_state: [ '0' ],
// tg_10_cm_var_desc: [ 'Temperatura tal v globini 10 cm' ],
// tg_10_cm_var_unit: [ '°C' ],
// tg_10_cm: [ '3.3' ],
// tg_10_cm_state: [ '0' ],
// tgavg_10_cm_var_desc: [
// 	'Povprečna temperatura tal v časovnem intervalu v globini 10 cm'
// ],
// tgavg_10_cm_var_unit: [ '°C' ],
// tgavg_10_cm: [ '3.2' ],
// tgavg_10_cm_state: [ '0' ],
// tg_20_cm_var_desc: [ 'Temperatura tal v globini 20 cm' ],
// tg_20_cm_var_unit: [ '°C' ],
// tg_20_cm: [ '' ],
// tg_20_cm_state: [ '' ],
// tgavg_20_cm_var_desc: [
// 	'Povprečna temperatura tal v časovnem intervalu v globini 20 cm'
// ],
// tgavg_20_cm_var_unit: [ '°C' ],
// tgavg_20_cm: [ '' ],
// tgavg_20_cm_state: [ '' ],
// tg_30_cm_var_desc: [ 'Temperatura tal v globini 30 cm' ],
// tg_30_cm_var_unit: [ '°C' ],
// tg_30_cm: [ '2.8' ],
// tg_30_cm_state: [ '0' ],
// tgavg_30_cm_var_desc: [
// 	'Povprečna temperatura tal v časovnem intervalu v globini 30 cm'
// ],
// tgavg_30_cm_var_unit: [ '°C' ],
// tgavg_30_cm: [ '2.7' ],
// tgavg_30_cm_state: [ '0' ],
// tg_50_cm_var_desc: [ 'Temperatura tal v globini 50 cm' ],
// tg_50_cm_var_unit: [ '°C' ],
// tg_50_cm: [ '' ],
// tg_50_cm_state: [ '' ],
// tgavg_50_cm_var_desc: [
// 	'Povprečna temperatura tal v časovnem intervalu v globini 50 cm'
// ],
// tgavg_50_cm_var_unit: [ '°C' ],
// tgavg_50_cm: [ '' ],
// tgavg_50_cm_state: [ '' ],
// hhs_var_desc: [ 'Višina oblačnih slojev (1-4)' ],
// hhs_var_unit: [ 'feet' ],
// ns_var_desc: [ 'Količina oblačnosti po slojih (1-4)' ],
// ns_var_unit: [ 'decas' ],
// hhs1_val: [ '' ],
// hhs1_state: [ '' ],
// ns1_val: [ '' ],
// ns1_state: [ '' ],
// hhs2_val: [ '' ],
// hhs2_state: [ '' ],
// ns2_val: [ '' ],
// ns2_state: [ '' ],
// hhs3_val: [ '' ],
// hhs3_state: [ '' ],
// ns3_val: [ '' ],
// ns3_state: [ '' ],
// hhs4_val: [ '' ],
// hhs4_state: [ '' ],
// ns4_val: [ '' ],
// ns4_state: [ '' ],
// rrHh: [ '0.5' ]
