'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CreateRidePage() {
  const [form, setForm] = useState({
    source: '',
    destination: '',
    date: '',
    seats: 1,
    notes: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.source || !form.destination || !form.date || form.seats < 1) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    try {
      const res = await axios.post('/api/rides', form);
      toast.success('Ride created successfully!');
      setForm({
        source: '',
        destination: '',
        date: '',
        seats: 1,
        notes: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create ride.');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Ride</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Source*</label>
          <input
            type="text"
            name="source"
            value={form.source}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Where are you leaving from?"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Destination*</label>
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Where are you going?"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date & Time*</label>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Available Seats*</label>
          <input
            type="number"
            name="seats"
            min="1"
            value={form.seats}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Notes (Optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Any additional info"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Ride
        </button>
      </form>
    </div>
  );
}
