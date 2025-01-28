import { render, screen } from '@testing-library/react';
import TimeSeriesChart from '../../components/TimeSeriesChart';
import { mockTimeSeriesData } from '../../lib/mockData';

jest.mock('../../lib/api', () => ({
    fetchTimeSeriesData: jest.fn(() => Promise.resolve(mockTimeSeriesData))
}));

// Mock Plotly component since it's not compatible with Jest DOM environment
jest.mock('react-plotly.js', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-plot">Plot Component</div>
}));

describe('TimeSeriesChart', () => {
    /* it('renders loading state initially', () => {
        render(<TimeSeriesChart />);
        expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
    }); */

    it('renders plot after loading', async () => {
        render(<TimeSeriesChart />);
        const plot = await screen.findByTestId('mock-plot');
        expect(plot).toBeInTheDocument();
    });
}); 