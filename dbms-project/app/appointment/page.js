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
  const [selectedDates, setSelectedDates] = useState([{ date: '', timeBlock: null }]);
  const [availableTimeBlocks, setAvailableTimeBlocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });

  // Calculate required days based on service duration
  const getRequiredDays = (avgDur) => {
    const hoursPerDay = 10; // Assuming 10-hour workday
    const minutesPerDay = hoursPerDay * 60;
    return Math.ceil(avgDur / minutesPerDay);
  };

  useEffect(() => {
    fetchServices();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedService) {
      const service = services.find(s => s.serviceId.toString() === selectedService);
      if (service) {
        const requiredDays = getRequiredDays(service.avgDur);
        setSelectedDates(Array(requiredDays).fill({ date: '', timeBlock: null }));
      }
    }
  }, [selectedService, services]);

  useEffect(() => {
    if (selectedEmployee) {
      selectedDates.forEach((dateObj, index) => {
        if (dateObj.date) {
          fetchAvailableSlots(dateObj.date, index);
        }
      });
    }
  }, [selectedEmployee, selectedDates.map(d => d.date).join(',')]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);

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

  const fetchAvailableSlots = async (date, dayIndex) => {
    try {
      const response = await fetch(
        `/api/appointments/timeslots?date=${date}&employeeId=${selectedEmployee}`
      );
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const slots = await response.json();

      const service = services.find(s => s.serviceId.toString() === selectedService);
      if (!service) return;

      // Calculate slots needed per day
      const totalMinutes = service.avgDur;
      const requiredDays = getRequiredDays(totalMinutes);
      const minutesPerDay = Math.min(totalMinutes / requiredDays, 600); // Max 10 hours per day
      
      const requiredSlots = calculateRequiredSlots(minutesPerDay);
      const timeBlocks = groupAvailableSlots(slots, requiredSlots);
      
      setAvailableTimeBlocks(prev => ({
        ...prev,
        [date]: timeBlocks
      }));
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load time slots');
      setError('Failed to load time slots');
    }
  };

  const handleDateChange = (date, index) => {
    const newDates = [...selectedDates];
    newDates[index] = { date, timeBlock: null };
    setSelectedDates(newDates);
  };

  const handleTimeBlockSelect = (timeBlock, index) => {
    const newDates = [...selectedDates];
    newDates[index] = { ...newDates[index], timeBlock };
    setSelectedDates(newDates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required dates and time blocks are selected
    if (!selectedService || !selectedEmployee || 
        selectedDates.some(d => !d.date || !d.timeBlock)) {
      toast.error('Please select all required dates and time slots');
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          employeeId: selectedEmployee,
          dates: selectedDates.map(d => ({
            date: d.date,
            slots: d.timeBlock.slotIds
          })),
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone
        })
      });

      if (!response.ok) throw new Error('Failed to book appointment');
      
      toast.success('Appointment booked successfully!');
      // Reset form
      setSelectedService('');
      setSelectedEmployee('');
      setSelectedDates([{ date: '', timeBlock: null }]);
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

  const selectedServiceData = services.find(s => s.serviceId.toString() === selectedService);
  const requiredDays = selectedServiceData ? getRequiredDays(selectedServiceData.avgDur) : 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reserve Time Slot</h1>

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
              setSelectedDates([{ date: '', timeBlock: null }]);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.serviceTitle} - ${service.price} ({Math.ceil(service.avgDur / 60)} hours)
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
              setSelectedDates(dates => dates.map(d => ({ ...d, timeBlock: null })));
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

        {/* Multi-day Selection */}
        {selectedService && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Select Dates and Times ({requiredDays} {requiredDays === 1 ? 'day' : 'days'} required)
            </h3>
            {selectedDates.map((dateObj, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Day {index + 1}</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={dateObj.date}
                    onChange={(e) => handleDateChange(e.target.value, index)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {dateObj.date && selectedEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeBlocks[dateObj.date]?.map((block) => (
                        <button
                          key={block.startSlot.slotId}
                          type="button"
                          onClick={() => handleTimeBlockSelect(block, index)}
                          className={`p-3 text-sm rounded-lg transition-colors ${
                            dateObj.timeBlock?.startSlot.slotId === block.startSlot.slotId
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {block.displayTime}
                        </button>
                      ))}
                    </div>
                    {(!availableTimeBlocks[dateObj.date] || availableTimeBlocks[dateObj.date].length === 0) && (
                      <p className="text-sm text-gray-500 mt-2">
                        No available time slots for this date. Please try another date.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
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
          Reserve Time Slot
        </button>
      </form>
    </div>
  );
} 