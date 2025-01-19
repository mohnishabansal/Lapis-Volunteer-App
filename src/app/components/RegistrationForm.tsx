import React, { useState } from 'react';
import Input from "./ui/input";
import { Button } from '../components/ui/button';
import { User, Phone, Mail, MapPin, Clock } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    place: '',
    availability: '',
    duration: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to the server
      await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      // Reset form data
      setFormData({
        name: '',
        phone: '',
        email: '',
        place: '',
        availability: '',
        duration: ''
      });
      // Display success message or redirect to a thank you page
    } catch (error) {
      console.error('Error submitting form:', error);
      // Display error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Volunteer Registration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="tel"
            name="phone"
            placeholder="Contact Number"
            value={formData.phone}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            name="place"
            placeholder="Place"
            value={formData.place}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="mt-4 relative">
        <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        {/* <Textarea
          name="availability"
          placeholder="Availability (time slots)"
          value={formData.availability}
          onChange={handleInputChange}
          className="pl-10"
          rows={3}
          required
        /> */}
      </div>
      <div className="mt-4 relative">
        <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          name="duration"
          placeholder="Duration (hours/days)"
          value={formData.duration}
          onChange={handleInputChange}
          className="pl-10"
          required
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" className="bg-sky-500 text-white hover:bg-sky-600 transition-colors">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;