// Simple test suite for CustomerAppointments
describe('CustomerAppointments', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            APT_ID: 1,
            CUST_NAME: 'Test Customer',
            CUST_PHONE: '1234567890',
            APT_DATE: '2024-03-20',
            SERVICE_TITLE: 'Test Service',
            EMP_NAME: 'Test Employee',
            APT_STATUS: 'reserve',
            START_TIME: '09:00',
            END_TIME: '10:00'
          }
        ])
      })
    );
  });

  it('should fetch appointments on mount', async () => {
    const mockId = '123';
    const mockParams = { id: mockId };
    
    // Mock useParams
    jest.mock('next/navigation', () => ({
      useParams: () => mockParams
    }));

    // Import and render component
    const { CustomerAppointments } = require('./page');
    const { render, waitFor } = require('@testing-library/react');
    
    render(<CustomerAppointments />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/customer-appointments/${mockId}`);
    });
  });

  it('should show loading state initially', () => {
    const { getByTestId } = render(<CustomerAppointments />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));
    
    const { getByText } = render(<CustomerAppointments />);
    await waitFor(() => {
      expect(getByText('Failed to load appointments')).toBeInTheDocument();
    });
  });
}); 