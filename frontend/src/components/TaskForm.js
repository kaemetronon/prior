import React, { useState, useEffect } from 'react';
import { HINTS } from '../constants/hints';

const TaskForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagNames: '',
    urgency: 3,
    personalInterest: 3,
    executionTime: 3,
    complexity: 3,
    concentration: 3,
    blocked: false
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tagNames: formData.tagNames.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tagNames"
              value={formData.tagNames}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="work, important, project"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Urgency
              </label>
              <input
                type="range"
                name="urgency"
                min="1"
                max="10"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{formData.urgency}/10</span>
              <details className="mt-1 text-xs text-gray-500">
                <summary>хинт</summary>
                <ul>
                  {HINTS.urgency.map((text, idx) => <li key={idx}>{text}</li>)}
                </ul>
              </details>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Personal Interest
              </label>
              <input
                type="range"
                name="personalInterest"
                min="1"
                max="10"
                value={formData.personalInterest}
                onChange={handleChange}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{formData.personalInterest}/10</span>
              <details className="mt-1 text-xs text-gray-500">
                <summary>хинт</summary>
                <ul>
                  {HINTS.personalInterest.map((text, idx) => <li key={idx}>{text}</li>)}
                </ul>
              </details>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Execution Time
              </label>
              <input
                type="range"
                name="executionTime"
                min="1"
                max="10"
                value={formData.executionTime}
                onChange={handleChange}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{formData.executionTime}/10</span>
              <details className="mt-1 text-xs text-gray-500">
                <summary>хинт</summary>
                <ul>
                  {HINTS.executionTime.map((text, idx) => <li key={idx}>{text}</li>)}
                </ul>
              </details>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Complexity
              </label>
              <input
                type="range"
                name="complexity"
                min="1"
                max="10"
                value={formData.complexity}
                onChange={handleChange}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{formData.complexity}/10</span>
              <details className="mt-1 text-xs text-gray-500">
                <summary>хинт</summary>
                <ul>
                  {HINTS.complexity.map((text, idx) => <li key={idx}>{text}</li>)}
                </ul>
              </details>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Concentration
              </label>
              <input
                type="range"
                name="concentration"
                min="1"
                max="10"
                value={formData.concentration}
                onChange={handleChange}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{formData.concentration}/10</span>
              <details className="mt-1 text-xs text-gray-500">
                <summary>хинт</summary>
                <ul>
                  {HINTS.concentration.map((text, idx) => <li key={idx}>{text}</li>)}
                </ul>
              </details>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="blocked"
                checked={formData.blocked}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 text-sm font-bold">Blocked</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 