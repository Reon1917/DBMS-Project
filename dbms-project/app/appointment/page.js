'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { calculateRequiredSlots, groupAvailableSlots } from '@/lib/timeSlots';

export default function AppointmentPage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeBlocks, setAvailableTimeBlocks] = useState([]);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    fetchServices();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee && selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedEmployee, selectedDate, selectedService]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);

      // If service was pre-selected from URL, set it
      if (searchParams.get('service')) {
        const selectedServiceData = data.find(s => s.serviceId.toString() === searchParams.get('service'));
        if (selectedServiceData) {
          setSelectedService(selectedServiceData.serviceId.toString());
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load services');
      setError('Failed to load services');
    } finally {
      setLoading(false);
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
      setError('Failed to load employees');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/appointments/timeslots?date=${selectedDate}&employeeId=${selectedEmployee}`
      );
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const slots = await response.json();

      // Get selected service duration
      const service = services.find(s => s.serviceId.toString() === selectedService);
      if (!service) return;

      // Calculate required slots and group available slots
      const requiredSlots = calculateRequiredSlots(service.avgDur);
      const timeBlocks = groupAvailableSlots(slots, requiredSlots);
      setAvailableTimeBlocks(timeBlocks);
      setSelectedTimeBlock(null); // Reset selection when slots change
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load time slots');
      setError('Failed to load time slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedEmployee || !selectedDate || !selectedTimeBlock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          employeeId: selectedEmployee,
          date: selectedDate,
          slots: selectedTimeBlock.slotIds,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone
        })
      });

      if (!response.ok) throw new Error('Failed to book appointment');
      
      toast.success('Appointment booked successfully!');
      // Reset form
      setSelectedService('');
      setSelectedEmployee('');
      setSelectedDate('');
      setSelectedTimeBlock(null);
      setCustomerInfo({ name: '', phone: '' });
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setSelectedTimeBlock(null); // Reset time selection when service changes
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.serviceTitle} - ${service.price} ({service.avgDur} mins)
              </option>
            ))}
          </select>
        </div>

        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Stylist
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => {
              setSelectedEmployee(e.target.value);
              setSelectedTimeBlock(null); // Reset time selection when employee changes
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Choose a stylist</option>
            {employees
              .filter(employee => 
                employee.services.some(service => service.id.toString() === selectedService)
              )
              .map((employee) => (
                <option key={employee.empId} value={employee.empId}>
                  {employee.empName}
                </option>
              ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTimeBlock(null); // Reset time selection when date changes
            }}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Time Blocks */}
        {selectedEmployee && selectedDate && selectedService && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimeBlocks.map((block) => (
                <button
                  key={block.startSlot.slotId}
                  type="button"
                  onClick={() => setSelectedTimeBlock(block)}
                  className={`p-3 text-sm rounded-lg transition-colors ${
                    selectedTimeBlock?.startSlot.slotId === block.startSlot.slotId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {block.displayTime}
                </button>
              ))}
            </div>
            {availableTimeBlocks.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No available time slots for this date. Please try another date.
              </p>
            )}
          </div>
        )}

        {/* Customer Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
} 