const WHISKER_API_BASE_URL = "https://whisker-interview.vercel.app";


export async function fetchSelectOptions() {
    try {
        const response = await fetch(`${WHISKER_API_BASE_URL}/data/list_data?page=1&per_page=20`);
        if (!response.ok) throw new Error('Failed to fetch options');
        return await response.json();
    } catch (error) {
        console.error('Error fetching options:', error);
        throw error;
    }
}

export async function fetchTimeSeriesData(macDate) {
    /**
     * macDate is an object with mac and date properties
     * mac is a string
     * date is a string in the format YYYY-MM-DD
     * 
     * returns a JSON object with the time series data
     * {
     *      ix: Array(60901), 
     *      voltage4hzCal: Array(60901), 
     *      sldminAveragePeaksMax: Array(60901)
     * }
     */

    console.log(macDate);
    if (macDate)
    try {
        const response = await fetch(`/api/data/get_data?mac=${macDate.mac}&date=${macDate.date}`);
        if (!response.ok) throw new Error('Failed to fetch time series data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching time series data:', error);
        throw error;
    }
} 