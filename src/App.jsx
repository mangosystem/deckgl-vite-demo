import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl';
import DeckGL, { ArcLayer, GeoJsonLayer } from 'deck.gl';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { colorScale, matchObject } from './const';
import './App.css';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const GISSERVER_URL = import.meta.env.VITE_GISSERVER_URL;

const INITIAL_VIEW_STATE = {
	latitude: 36.5,
	longitude: 127.2,
	// altitude: 5,
	zoom: 9,
	bearing: 0,
	pitch: 30,
};

const MAP_STYLE =
	'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

export default function Root() {
	const [layers, setLayers] = useState([]);

	const [scaleVal, setScaleVal] = useState(1);

	const makeHubGeoJsonLayer = (data) => {
		return new GeoJsonLayer({
			data,
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
		});
	};

	const makeGeoJsonLayer = (data, type) => {
		return new GeoJsonLayer({
			data,
			opacity: 0.8,
			// visible: false,
			// stroked: false,
			stroked: true,
			filled: true,
			extruded: true,
			wireframe: true,
			elevationScale: 0.3,
			// updateTriggers: {
			// 	elevationScale: scaleVal,
			// },
			getElevation: (f) => {
				return f.properties.pop_out ?? 0;
			},
			getFillColor: (f) => colorScale(f.properties.pop_out, type),
			getLineColor: [255, 255, 255],

			pickable: true,
		});
	};

	const makeArcLayerData = (source, target, key) => {
		const features = target.reduce((acc, cur) => {
			return [
				...acc,
				{
					geometry: {
						coordinates: [cur.coordinate_x, cur.coordinate_y],
					},
				},
			];
		}, []);

		return features;
	};

	const getLayerFeatures = (name) => {
		return new Promise((resolve) => {
			const request = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				outputFormat: 'application/json',
				srsName: 'EPSG:4326',
				typeName: 'pinogio:' + name,
			};

			axios({
				method: 'GET',
				url: GISSERVER_URL,
				params: request,
			}).then((res) => {
				resolve(res.data);
			});
		});
	};

	const getHubLayerFeatures = () => {
		return new Promise((resolve) => {
			const request = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				outputFormat: 'application/json',
				srsName: 'EPSG:4326',
				typeName: 'pinogio:cof_hub',
			};

			axios({
				method: 'GET',
				url: GISSERVER_URL,
				params: request,
			}).then((res) => {
				res.data.features = [res.data.features[3]];
				resolve(res.data);
			});
		});
	};

	const makeArcLayer = () => {
		return new Promise((resolve) => {
			axios({
				method: 'GET',
				url: 'http://interactive.mangosystem.com/interactive/api/cof/data.json',
			}).then((res) => {
				const { data } = res.data;
				const { hub, gov_building } = data;

				const arcData = makeArcLayerData(hub, gov_building, 'gov_building');
				const arcLayer = new ArcLayer({
					id: 'arcs',
					data: arcData,
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
				});

				resolve(arcLayer);
			});
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			const { city_hall, gov_building } = matchObject;
			const arcLayer = await makeArcLayer();
			const hubFeatures = await getHubLayerFeatures();
			const hubLayer = makeHubGeoJsonLayer(hubFeatures);
			const govLayerFeatures = await getLayerFeatures(gov_building.gs_layer_nm);
			const govGeoJsonLayer = makeGeoJsonLayer(govLayerFeatures, 'out');
			setLayers([hubLayer, arcLayer, govGeoJsonLayer]);
		};

		fetchData();
	}, []);

	// const onViewStateChange = (e) => {
	// 	// console.log(e);
	// };

	const handleScaleVal = (e) => {
		console.log(e);
		setScaleVal(e.target.value);
	};

	return (
		<>
			<DeckGL
				initialViewState={INITIAL_VIEW_STATE}
				controller={true}
				layers={layers}
				// onViewStateChange={onViewStateChange}
				// getTooltip={({ object }) =>
				// 	object &&
				// 	`x: ${object.position[0]}\ny: ${object.position[1]}\nin: ${object.points[0].source.in}\nout: ${object.points[0].source.out}`
				// }
			>
				<Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
			</DeckGL>
			<div className="toc">
				<div className="slider_box">
					<label htmlFor="scale_slider">scale</label>
					<input
						type="range"
						min={0}
						max={500}
						id="scale_slider"
						step={0.1}
						value={scaleVal}
						onChange={handleScaleVal}
					/>
					<input type="text" value={scaleVal} onChange={handleScaleVal} />
				</div>
			</div>
		</>
	);
}

/* global document */
const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);
