import React, { useState } from 'react';

const TaskForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagNames: '',
    urgency: 3,
    personalInterest: 3,
    executionTime: 3,
    complexity: 3,
    blocked: false
  });

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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                  <li>10 – нужно было сделать ещё вчера, максимум — сегодня же</li>
                  <li>9 – сегодня до конца дня, иначе — последствия</li>
                  <li>8 – завтра утром край, отложить нельзя</li>
                  <li>7 – в течение ближайших 2–3 дней</li>
                  <li>6 – желательно на этой неделе</li>
                  <li>5 – неделя-другая, без жёсткого дедлайна</li>
                  <li>4 – можно отложить до следующего месяца</li>
                  <li>3 – не будет проблем, если сделать через месяц</li>
                  <li>2 – сильно не срочно, когда-нибудь потом</li>
                  <li>1 – вообще неважно когда, можно забыть</li>
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
                  <li>10 – вдохновляет: хочу сделать прямо сейчас</li>
                  <li>9 – очень хочется сделать, вызывает азарт</li>
                  <li>8 – нравится задача, приятная</li>
                  <li>7 – делать можно, вызывает умеренный интерес</li>
                  <li>6 – не вызывает эмоций, но не против</li>
                  <li>5 – нейтрально, может быть скучно</li>
                  <li>4 – немного отталкивает, откладываю</li>
                  <li>3 – не хочется, делаю через силу</li>
                  <li>2 – очень не хочется, вызывает раздражение</li>
                  <li>1 – противно: ненавижу эту задачу</li>
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
                  <li>10 – меньше 5 минут</li>
                  <li>9 – 5–15 минут</li>
                  <li>8 – до 30 минут</li>
                  <li>7 – 30–60 минут</li>
                  <li>6 – 1–2 часа</li>
                  <li>5 – 2–3 часа</li>
                  <li>4 – полдня</li>
                  <li>3 – один рабочий день</li>
                  <li>2 – несколько дней</li>
                  <li>1 – неделя и больше</li>
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
                  <li>10 – всё предельно понятно и элементарно</li>
                  <li>9 – понятно, но надо чуть подумать</li>
                  <li>8 – есть пара неопределенностей, но в целом ясно</li>
                  <li>7 – почти ясно, надо уточнить пару моментов</li>
                  <li>6 – есть препятствия, нужно готовиться</li>
                  <li>5 – требует размышлений и усилий</li>
                  <li>4 – много неясного, сложно начать</li>
                  <li>3 – почти не понимаю, как делать</li>
                  <li>2 – очень туманно, чувствую тупик</li>
                  <li>1 – полная неизвестность: вообще не знаю, с чего начать</li>
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