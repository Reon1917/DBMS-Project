'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { use } from 'react';

export default function AppointmentDetailPage({ params }) {
  const id = use(params).id;
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    serviceId: '',
    employeeId: ''
  });

  useEffect(() => {
    fetchAppointmentDetails();
    fetchServices();
    fetchEmployees();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      console.log('Fetching appointment details for ID:', id);
      const response = await fetch(`/api/appointments/${id}`);
      if (!response.ok) throw new Error('Failed to fetch appointment details');
      const data = await response.json();
      console.log('Appointment details:', data);
      setAppointment(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load appointment details');
      toast.error('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load services');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load employees');
    }
  };

  const handleStatusUpdate = async (serviceRecordId, newStatus) => {
    try {
      console.log('Updating service status:', { serviceRecordId, newStatus });
      const response = await fetch(`/api/appointments/${id}/services/${serviceRecordId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update service status');
      toast.success('Service status updated');
      fetchAppointmentDetails();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to update service status');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding new service:', newService);
      const response = await fetch(`/api/appointments/${id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });

      if (!response.ok) throw new Error('Failed to add service');
      toast.success('Service added successfully');
      setShowAddService(false);
      setNewService({ serviceId: '', employeeId: '' });
      fetchAppointmentDetails();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to add service');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAppointmentDetails}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Appointments
      </button>

      {/* Appointment Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Appointment Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Customer Name</p>
            <p className="font-medium">{appointment?.custName}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium">{appointment?.custPhone}</p>
          </div>
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-medium">{appointment?.aptDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Time</p>
            <p className="font-medium">{appointment?.startTime} - {appointment?.endTime}</p>
          </div>
        </div>
      </div>

      {/* Service Records */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
        <div className="space-y-4">
          {appointment?.serviceRecords.map((record) => (
            <div
              key={record.esrId}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{record.serviceTitle}</h3>
                  <p className="text-sm text-gray-500">Provider: {record.empName}</p>
                </div>
                <select
                  value={record.serviceStatus}
                  onChange={(e) => handleStatusUpdate(record.esrId, e.target.value)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    record.serviceStatus === 'complete'
                      ? 'bg-green-100 text-green-800'
                      : record.serviceStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Completed</option>
                  <option value="cancel">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!showAddService ? (
          <button
            onClick={() => setShowAddService(true)}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        ) : (
          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                value={newService.serviceId}
                onChange={(e) => setNewService({ ...newService, serviceId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceTitle}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee
              </label>
              <select
                value={newService.employeeId}
                onChange={(e) => setNewService({ ...newService, employeeId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select an employee</option>
                {employees
                  .filter(employee => 
                    employee.services.some(service => 
                      service.id.toString() === newService.serviceId
                    )
                  )
                  .map((employee) => (
                    <option key={employee.empId} value={employee.empId}>
                      {employee.empName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddService(false);
                  setNewService({ serviceId: '', employeeId: '' });
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Service
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 