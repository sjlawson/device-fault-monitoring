import { useEffect, useState } from 'react';
import { fetchTimeSeriesData } from '@/lib/api';
// import { mockTimeSeriesData } from '@/lib/mockData';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

const TimeSeriesChart = ({macDate}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        console.log("MACDATE", macDate.mac);
        if (macDate.mac)
        try {
            setLoading(true);
            fetchTimeSeriesData(macDate).then((res) => {
                console.log("RES: ", res);
                setData(JSON.parse(res))}
            );
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    },[macDate])

    if (loading === null) return <div>Select an option</div>
    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!data) {
        console.log("No Data", data)
        return <div style={{animation: "blink 1s infinite"}}>. . .</div>
    }
    
    console.log("DATA: ", data);
    return (
        <div className="w-full h-[600px]">
            {Array.isArray(data) && (
            <Plot
                data={[
                    {
                        x: data.map(d => d.ix),
                        y: data.map(d => d.voltage4hzCal),
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
            )}
        </div>
    )
};

export default TimeSeriesChart; 