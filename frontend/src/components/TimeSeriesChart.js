import { useEffect, useState } from 'react';
import { fetchTimeSeriesData } from '@/lib/api';
import { mockTimeSeriesData } from '@/lib/mockData';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

const TimeSeriesChart = ({macDate}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const timeseriesData = mockTimeSeriesData;
    
    useEffect(() => {
        console.log("MACDATE", macDate.mac);
        if (macDate.mac)
        try {
            fetchTimeSeriesData(macDate).then((res) => {
                console.log(res);
                setData(data)}
            );
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    },[macDate])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!data) {
        console.log("No Data", data)
        return <div>No data</div>
    }
    
    console.log("DATA: ", data);
    return (
        <div className="w-full h-[600px]">
            <Plot
                data={[
                    {
                        x: data.map(d => d.timestamp),
                        y: data.map(d => d.value),
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: 'blue' },
                    },
                ]}
                layout={{
                    title: 'Time Series Data',
                    xaxis: {
                        title: 'Time',
                        rangeslider: { visible: true }
                    },
                    yaxis: { title: 'Value' },
                    autosize: true
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
};

export default TimeSeriesChart; 