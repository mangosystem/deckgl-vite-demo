import { ArcLayer, GeoJsonLayer } from 'deck.gl';

const test_layers = {
	hub: new GeoJsonLayer({
		// data,
		id: 'hub_layer',
		opacity: 1,
		stroked: false,
		filled: true,
		extruded: true,
		wireframe: true,
		getElevation: (f) => 200,
		// getFillColor: (f) => [0, 102, 255],
		// getFillColor: (f) => [255, 255, 255],
		getFillColor: (f) => [255, 0, 102],
		// getFillColor: (f) => [63, 140, 255],
		getLineColor: [255, 255, 255],
		pickable: true,
	}),
	city_hall: {
		grid: new GeoJsonLayer({}),
		arc: new ArcLayer({}),
	},
	jochiwon: {
		grid: new GeoJsonLayer({}),
		arc: new ArcLayer({}),
	},
	yeonseo: {
		grid: new GeoJsonLayer({}),
		arc: new ArcLayer({}),
	},
	gov_building: {
		grid: new GeoJsonLayer({
			// data,
			id: 'gov_grid_layer',
			opacity: 0.8,
			// visible: false,
			// stroked: false,
			stroked: true,
			filled: true,
			extruded: true,
			wireframe: true,
			// elevationScale: scaleVal,
			getElevation: (f) => {
				return f.properties.pop_out ?? 0;
			},
			// getFillColor: (f) => colorScale(f.properties.pop_out, type),
			getLineColor: [255, 255, 255],

			pickable: true,
		}),
		arc: new ArcLayer({
			id: 'gov_arc_layer',
			// data: arcData,
			pickable: true,
			autoHighlight: true,
			// Styles
			opacity: 0.5,
			getSourcePosition: (f) => [127.25133019541006, 36.5016757735377],
			getTargetPosition: (f) => f.geometry.coordinates,
			getSourceColor: [0, 128, 200],
			// getTargetColor: [200, 0, 80],
			getTargetColor: [0, 128, 200],
			getWidth: 1,
		}),
	},
};

export { test_layers };
