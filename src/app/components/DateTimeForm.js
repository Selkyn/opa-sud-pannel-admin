"use client";

import React from "react";

export default function DateTimeForm({
  formData,
  onChange,
  onSubmit,
  additionalFields,
  submitButtonLabel,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };


  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
            Date début
          </label>
          <input
            type="date"
            name="start_time"
            id="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="start_time_hour" className="block text-sm font-medium text-gray-700">
            Heure début
          </label>
          <input
            type="time"
            name="start_time_hour"
            id="start_time_hour"
            value={formData.start_time_hour || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
            Date fin
          </label>
          <input
            type="date"
            name="end_time"
            id="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="end_time_hour" className="block text-sm font-medium text-gray-700">
            Heure fin
          </label>
          <input
            type="time"
            name="end_time_hour"
            id="end_time_hour"
            value={formData.end_time_hour || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      {additionalFields && <div className="space-y-4">{additionalFields}</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitButtonLabel}
        </button>
      </div>
    </form>
  );
}
