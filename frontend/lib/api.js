const API_BASE_URL = "https://whisker-interview.vercel.app";

export async function fetchSelectOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/data/list_data?page=1&per_page=20`);
        if (!response.ok) throw new Error('Failed to fetch options');
        return await response.json();
    } catch (error) {
        console.error('Error fetching options:', error);
        throw error;
    }
}

export async function fetchTimeSeriesData(macDate) {
    console.log(macDate);
    // mdObj = JSON.parse(macDate);
    if (macDate)
    try {
        const response = await fetch(`${API_BASE_URL}/data/get_data?mac=${macDate.mac}&date=${macDate.date}`);
        if (!response.ok) throw new Error('Failed to fetch time series data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching time series data:', error);
        throw error;
    }
} 