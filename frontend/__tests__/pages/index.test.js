import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';
import { mockSelectOptions } from '../../lib/mockData';

// Mock the components used in the page
jest.mock('../../components/DataSelect', () => {
    return function MockDataSelect() {
        return <div data-testid="mock-data-select">Data Select Component</div>;
    };
});

jest.mock('next/link', () => {
    return function MockLink({ children, href }) {
        return <a href={href}>{children}</a>;
    };
});

describe('Home Page', () => {
    it('renders the page title', () => {
        render(<Home />);
        expect(screen.getByText('Data Selection')).toBeInTheDocument();
    });

    it('renders the DataSelect component', () => {
        render(<Home />);
        expect(screen.getByTestId('mock-data-select')).toBeInTheDocument();
    });

    it('includes a link to the chart page', () => {
        render(<Home />);
        const chartLink = screen.getByText('Go to Chart View');
        expect(chartLink).toBeInTheDocument();
        expect(chartLink.closest('a')).toHaveAttribute('href', '/chart');
    });
}); 