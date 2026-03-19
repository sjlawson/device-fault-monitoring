import { useEffect, useState } from 'react';
import { fetchHeatmapData } from '@/lib/api';

import dynamic from 'next/dynamic';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

const HeatmapChart = ({macDate}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
	console.log("MACDATE", macDate.mac);
	if (macDate.mac) {
	    try {
		setLoading(true);
		fetchHeatmapData(macDate).then((res) => {
		    // console.log("RES: ", res);
		    setData(JSON.parse(res))
		});
	    } catch (err) {
		setError(err);
	    } finally {
		setLoading(false);
	    }
	}
    },[macDate])

    if (loading === null) return <div>Select an option</div>
    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!data) {
	console.log("No Data", data)
	return <div style={{animation: "blink 1s infinite"}}>. . .</div>
    }

    console.log("DATA: ", data.splice(0, 5));
    const convertedData = Object.fromEntries(data.map((item) => [item.ix, item.averagePeaksMax]));
    const plotData = {
	  z: data.map(item => item.averagePeaksMax),
	  x: data.map(item => item.ix),
	  y: data.map(item => item.iy),
	  type: 'heatmap',
	};
    console.log("PLOT DATA: ", plotData.z.splice(0, 5));
    return (
	<div className="w-full h-[600px]">
	  {Array.isArray(data) && (
	  <Plot
	      data={plotData}
	      type="heatmap"
	      layout={{
		  title: 'Heatmap',
		  xaxis: { title: 'X Axis' },
		  yaxis: { title: 'Y Axis' },
	      }}
	      style={{ width: '100%', height: '100%' }}
		  />
	  )}
	</div>
	);
}

export default HeatmapChart;
