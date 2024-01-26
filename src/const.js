const matchObject = {
	city_hall: {
		hub_nm: '시청',
		gs_layer_nm: 'cof_city_hall',
		value: {
			pop_in: {
				min: 5,
				max: 590,
			},
			pop_out: {
				min: 5,
				max: 667,
			},
		},
	},
	jochiwon: {
		hub_nm: '조치원',
		gs_layer_nm: 'cof_jochiwon',
		value: {
			pop_in: {
				min: 5,
				max: 340,
			},
			pop_out: {
				min: 5,
				max: 394,
			},
		},
	},
	yeonseo: {
		hub_nm: '연서면',
		gs_layer_nm: 'cof_yeonseo',
		value: {
			pop_in: {
				min: 5,
				max: 208,
			},
			pop_out: {
				min: 5,
				max: 39,
			},
		},
	},
	gov_building: {
		hub_nm: '청사',
		gs_layer_nm: 'cof_gov_building',
		value: {
			pop_in: {
				min: 5,
				max: 928,
			},
			pop_out: {
				min: 5,
				max: 3631,
			},
		},
	},
};

const COLOR_SCALE_IN = [
	// in
	[255, 255, 178], // #ffffb2
	// [254, 217, 118], // #fed976
	[254, 178, 76], // #feb24c
	// [253, 141, 60], // #fd8d3c
	[240, 59, 32], // #f03b20
	[189, 0, 38], // #bd0026
];

const COLOR_SCALE_OUT = [
	// out
	[241, 238, 246], //#f1eef6
	// [208, 209, 230], //#d0d1e6
	[166, 189, 219], //#a6bddb
	// [116, 169, 207], //#74a9cf
	[43, 140, 190], //#2b8cbe
	[4, 90, 141], //#045a8d
];

function colorScale(x, type) {
	let result = [255, 255, 255];
	if (type === 'in') {
		if (5 <= x && x <= 10) {
			result = COLOR_SCALE_IN[0];
		} else if (11 <= x && x <= 50) {
			result = COLOR_SCALE_IN[1];
		} else if (51 <= x && x <= 500) {
			result = COLOR_SCALE_IN[2];
		} else if (501 <= x && x <= 928) {
			result = COLOR_SCALE_IN[3];
		}
	} else {
		if (5 <= x && x <= 10) {
			result = COLOR_SCALE_OUT[0];
		} else if (11 <= x && x <= 50) {
			result = COLOR_SCALE_OUT[1];
		} else if (51 <= x && x <= 500) {
			result = COLOR_SCALE_OUT[2];
		} else if (501 <= x && x <= 3631) {
			result = COLOR_SCALE_OUT[3];
		}
	}
	return result;
}

export { matchObject, colorScale };
