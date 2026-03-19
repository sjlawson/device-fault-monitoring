import { useState } from 'react';
import DataSelect from '@/components/DataSelect';
import Layout from '@/components/Layout';
import Image from 'next/image';
import HeatmapChart from '@/components/HeatmapChart';


export default function HeatmapPlot() {
    const [selectedMac, setSelectedMac] = useState([]);
    const [plotUrl, setPlotUrl] = useState(null);

    // Update plot when selection changes
    const updatePlot = (selection) => {
	setSelectedMac(selection);
	if (selection) {
	    setPlotUrl(`/api/data/get_heatmap_data/${selection.mac}/${selection.date}`);
	}
    };

    return (
        <Layout>
	    <div className="max-w-4xl mx-auto">
	    <h1 className="text-2xl font-bold mb-6">Heatmap View</h1>

	    <div className="mb-8">
	    <DataSelect
	      id="mac-select"
	      selectedMac={selectedMac}
	      setSelectedMac={updatePlot}
	      />
	    </div>

	    {plotUrl && (
	    <div className="mt-8 p-4 bg-white rounded-lg shadow">
		    <HeatmapChart macDate={selectedMac} id="heat-map-chart"/>
	    </div>
	    )}
	    </div>
	</Layout>
	);
}
