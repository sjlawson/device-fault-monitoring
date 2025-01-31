import { useState, useEffect } from 'react';
import { fetchSelectOptions } from '@/lib/api';
import dynamic from 'next/dynamic';
const Select = dynamic(import('react-select').then(mod => mod.default), { ssr: false });
// disable ssr to fix server/client mismatch on id

const DataSelect = ({selectedMac, setSelectedMac}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const loadOptions = async () => {
            try {
                fetchSelectOptions().then(
                    data => {
                        console.log(data);
                        setOptions(data.data?.map(opt => ({
                            value: {"mac": opt.mac, "date": opt.date},
                            label: `${opt.mac} | ${opt.date}`
                        })))
                    }
                )
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadOptions();
    }, []);

    if (loading) return <div>Loading options...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <h2 className="text-xl mb-4">Select Options</h2>
            {loading ? (<div>Loading options...</div>) : ( 
            <Select
                options={options}
                value={{"label": selectedMac.mac, "value": selectedMac.date}}
                onChange={(item) => setSelectedMac(item.value)}
                className="basic-multi-select"
                classNamePrefix="select"
            />
            )}
        </div>
    );
};

export default DataSelect; 