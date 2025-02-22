'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminCustomerAppointments() {
  const params = useParams();
  const id = params.id;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/customer-appointments/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [id]);

  const handleDelete = async (aptId) => {
    try {
      const response = await fetch(`/api/customer-appointments/${aptId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      toast.success('Appointment cancelled successfully');
      // Refresh the appointments list
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">No appointments found</h2>
        <p className="text-gray-600 mb-4">There are no appointments for customer ID: {id}</p>
        <Link href="/admin/appointments" className="text-blue-500 hover:underline">
          Return to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Appointments for Customer ID: {id}</h2>
        <Link 
          href="/admin/appointments" 
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Appointments
        </Link>
      </div>
      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.APT_ID}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-medium">{appointment.CUST_NAME}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{appointment.CUST_PHONE}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{appointment.APT_DATE}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium">{appointment.SERVICE_TITLE}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employee</p>
                <p className="font-medium">{appointment.EMP_NAME}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${
                  appointment.APT_STATUS === 'reserve' ? 'text-green-600' : 
                  appointment.APT_STATUS === 'cancel' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {appointment.APT_STATUS.charAt(0).toUpperCase() + appointment.APT_STATUS.slice(1)}
                </p>
              </div>
              {appointment.START_TIME && appointment.END_TIME && (
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{appointment.START_TIME} - {appointment.END_TIME}</p>
                </div>
              )}
              <div className="flex items-end">
                {appointment.APT_STATUS === 'reserve' && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this appointment?')) {
                        handleDelete(appointment.APT_ID);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 