import { render, screen } from '@testing-library/react';
import DataSelect from '../../components/DataSelect';
import { mockSelectOptions } from '../../lib/mockData';

jest.mock('../../lib/api', () => ({
    fetchSelectOptions: jest.fn(() => Promise.resolve(mockSelectOptions))
}));

describe('DataSelect', () => {
    it('displays options after loading', async () => {
        render(<DataSelect />);
        const select = await screen.findByText('Select Options');
        expect(select).toBeInTheDocument();
    });
}); 