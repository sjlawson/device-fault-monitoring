import { useState } from 'react';
import DataSelect from '@/components/DataSelect';
import Layout from '@/components/Layout';
import Image from 'next/image';

export default function StaticPlot() {
    const [selectedMac, setSelectedMac] = useState([]);
    const [plotUrl, setPlotUrl] = useState(null);

    // Update plot when selection changes
    const updatePlot = (selection) => {
        setSelectedMac(selection);
        if (selection) {
            setPlotUrl(`/api/data/get_heatmap_plot/${selection.mac}/${selection.date}`);
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
                        {/* Using next/image for better performance */}
                        <img
                            src={plotUrl}
                            alt="Heatmap Plot"
                            className="w-full"
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}
