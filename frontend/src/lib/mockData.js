// Mock data for development and testing
export const mockTimeSeriesData = Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(2024, 0, i + 1).toISOString(),
    value: Math.random() * 100
}));

export const mockSelectOptions = [
    { id: 1, value: 'Option 1', label: 'First Option' },
    { id: 2, value: 'Option 2', label: 'Second Option' },
    { id: 3, value: 'Option 3', label: 'Third Option' },
    { id: 4, value: 'Option 4', label: 'Fourth Option' },
    { id: 5, value: 'Option 5', label: 'Fifth Option' },
]; 