# homebridge-arso
Homebridge plugin for Slovenian weather data (ARSO)

## Installation

Install [Homebridge](https://homebridge.io).

Run `npm i homebridge-arso` in your homebridge folder or install globally `-g`.

Update your config.json file.

## Sample config

Minimal:

	{
		"accessory": "ARSO",
		"name": "ARSO",
		"weather_station": "BABNO-POL", // see weather station options
		"air_station": "E26" // see air station options
	}

Full:

	{
		"accessory": "ARSO",
		"name": "ARSO",
		"weather_station": "SEE OPTIONS", // see weather station options
		"air_station": "SEE OPTIONS", // see air station options
		"temperature": {
			"show": true,
			"name": "Temperature"
		},
		"humidity": {
			"show": true,
			"name": "Humidity"
		},
		"rain": {
			"show": true,
			"name": "Rain"
		},
		"snow": {
			"show": true,
			"name": "Snow"
		},
		"air_quality": {
			"show": true,
			"name": "Air Quality"
		},
		"httpTimeout": "3000", // in miliseconds
		"weather_station_interval": 300, // in seconds, default is 300,
		"air_station_interval": 1800, // in seconds, default is 1800
	}

## Options
Shows temperature, humidity, rain, snow and air quality for a given city.

Weather station options:

	Babno Polje (756 m) -> BABNO-POL
	Bilje Nova Gorica -> NOVA-GOR_BILJE
	Blegoš (1188 m) -> BLEGOS
	Bohinjska Češnjica (596 m) -> BOHIN-CES
	Boršt Gorenja vas -> BORST_GOREN-VAS
	Bovec -> BOVEC
	Breginj (546 m) -> BREGINJ
	Bukovski vrh (780 m) -> BUKOV-VRH
	Celje -> CELJE_MEDLOG
	Cerkniško jezero (586 m) -> CERKN-JEZ
	Davča (1001 m) -> DAVCA
	Dobliče Črnomelj -> CRNOMELJ
	Dolenje Ajdovščina -> AJDOV-INA_DOLENJE
	Gačnik -> GACNIK
	Godnje -> GODNJE
	Gornji Grad -> GORNJ-GRA
	Hočko Pohorje (585 m) -> HOCKO-POH
	Hrastnik -> HRASTNIK
	Idrija -> IDRIJA_CISTI-NAP
	Ilirska Bistrica -> ILIRS-BIS
	Iskrba (540 m) -> ISKRBA
	Jeronim (760 m) -> JERONIM
	Jeruzalem -> JERUZ-LEM
	Jezersko (894 m) -> JEZERSKO
	Kamniška Bistrica (549 m) -> KAMNI-BIS
	Kanin (2260 m) -> KANIN
	Kočevje -> KOCEVJE
	Koper Kapitanija -> KOPER_KAPET-IJA
	Korensko sedlo (1072 m) -> KOREN-SED
	Krajinski park Goričko -> GORICKO_KRAJI-PAR
	Kranj -> KRANJ
	Kredarica (2514 m) -> KREDA-ICA
	Krn (910 m) -> KRN
	Krško -> KRSKO_NEK
	Krvavec (1740 m) -> KRVAVEC
	Kubed -> KUBED
	Kum (1211 m) -> KUM
	Lendava -> LENDAVA
	Letališče Cerklje ob Krki -> CERKLJE_LETAL-SCE
	Letališče Edvarda Rusjana Maribor -> MARIBOR_SLIVNICA
	Letališče Jožeta Pučnika Ljubljana -> LJUBL-ANA_BRNIK
	Letališče Lesce -> LESCE
	Letališče Portorož -> PORTOROZ_SECOVLJE
	Lisca (947 m) -> LISCA
	Litija -> LITIJA_GRBIN
	Ljubljana -> LJUBL-ANA_BEZIGRAD
	Logarska dolina (776 m) -> LOGAR-DOL
	Logatec -> LOGATEC
	Luka Koper -> KOPER_LUKA
	Malkovec -> MALKOVEC
	Maribor -> MARIBOR_VRBAN-PLA
	Marinča vas -> MARIN-VAS
	Metlika -> METLIKA
	Mežica -> MEZICA
	Miklavž na Gorjancih (959 m) -> MIKLAVZ_NA-GOR
	Murska Sobota -> MURSK-SOB
	Nanos (1242 m) -> NANOS
	Nova Gorica -> NOVA-GOR
	Nova vas - Bloke (718 m) -> NOVA-VAS_BLOKE
	Novo mesto -> NOVO-MES
	Osilnica -> OSILNICA
	Otlica (965 m) -> OTLICA
	Park Škocjanske jame -> SKOCJAN
	Pasja ravan (1019 m) -> PASJA-RAV
	Pavličevo sedlo (1337 m) -> PAVLI-SED
	Piran - oceanografska boja -> PIRAN_OCEAN-BOJ
	Planina pod Golico (957 m) -> PLANI-POD
	Podčetrtek -> PODCE-TEK_ATOMS-TOP
	Podnanos -> PODNANOS
	Postojna (538 m) -> POSTOJNA
	Predel (1155 m) -> PREDEL
	Ptuj -> PTUJ
	Radegunda (794 m) -> RADEG-NDA
	Rateče (864 m) -> RATECE
	Ratitovec (1639 m) -> RATIT-VEC
	Ravne na Koroškem -> RAVNE_NA-KOR
	Rogaška Slatina -> ROGAS-SLA
	Rogla (1495 m) -> ROGLA
	Rudno polje (1344 m) -> RUDNO-POL
	Sevno (556 m) -> SEVNO
	Slavnik (1020 m) -> SLAVNIK
	Slovenske Konjice -> SLOVE-KON
	Sveti Trije Kralji na Pohorju (1230 m) -> TRIJE-KRA_NA-POH
	Sviščaki (1302 m) -> SVISCAKI
	Šebreljski vrh (1066 m) -> SEBRE-VRH
	Šmartno pri Slovenj Gradcu -> SLOVE-GRA
	Tatre (748 m) -> TATRE
	Tolmin - Volče -> TOLMIN_VOLCE
	Topol (695 m) -> TOPOL
	Trbovlje -> TRBOVLJE
	Trebnje -> TREBNJE
	Trojane - Limovce (673 m) -> TROJANE_LIMOVCE
	Uršlja gora (1696 m) -> URSLJ-GOR
	Vedrijan -> VEDRIJAN
	Velenje -> VELENJE
	Velike Lašče (528 m) -> VELIK-LAS
	Vogel (1515 m) -> VOGEL
	Vrhnika -> VRHNIKA
	Vršič (1684 m) -> VRSIC
	Zadlog (716 m) -> ZADLOG
	Zelenica (1534 m) -> ZELENICA
	Zgornja Kapla (722 m) -> ZGORN-KAP
	Zgornja Radovna (778 m) -> ZGORN-RAD
	Zgornja Sorica (846 m) -> ZGORN-SOR

Air station options:

	LJ Bežigrad -> E403
	LJ Celovška -> E405
	LJ Vič -> E404
	Kranj -> E417
	MB Titova -> E407
	MB Vrbanski -> E408
	CE bolnica -> E411
	CE Ljubljanska -> E412
	Ptuj -> E801
	MS Rakičan -> E409
	MS Cankarjeva -> E410
	Solkan -> E804
	NG Grčna -> E421
	Otlica -> E424
	Koper -> E423
	Trbovlje -> E413
	Zagorje -> E415
	Hrastnik -> E414
	Novo mesto -> E418
	Iskrba -> E420
	Krvavec -> E419

## Disclaimer

All data provided by [ARSO](https://www.arso.gov.si).

Weather data source: http://www.meteo.si/met/sl/service/

Air quality data source: https://www.arso.gov.si/zrak/kakovost%20zraka/podatki/kakovost_zraka_xml.html
