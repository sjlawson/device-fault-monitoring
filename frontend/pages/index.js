import { useState } from 'react';
import DataSelect from '../components/DataSelect';
import Layout from '../components/Layout';
import TimeSeriesChart from '../components/TimeSeriesChart';


export default function Home() {
    const [selectedMac, setSelectedMac] = useState([]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Data Selection</h1>
                
                <div className="mb-8">
                    <DataSelect 
                    selectedMac={selectedMac} 
                    setSelectedMac={setSelectedMac} />
                </div>
                <div className="mt-4">
                <h3>Selected Values:</h3>
                    <pre>{JSON.stringify(selectedMac, null, 2)}</pre>
                </div>  
                <div className="text-center mt-8 p-4 bg-white rounded-lg shadow">
                    <p className="mb-4 text-gray-600">
                        Data visualization
                    </p>
                    
                </div>
                <h1 className="text-2xl font-bold mb-6">Time Series Chart</h1>
                <TimeSeriesChart macDate={selectedMac} />
            </div>
        </Layout>
    );
} 