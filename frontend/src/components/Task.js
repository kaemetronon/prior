import React, { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import { calculateTaskWeight } from '../utils/taskUtils';
import { HINTS } from '../constants/hints';

const getWeightColor = (weight) => {
  // Convert weight to a value between 0 and 1
  const normalizedWeight = (weight - 1) / 9;
  
  // Calculate RGB values for gradient from red (1) to green (10)
  const red = Math.round(255 * (1 - normalizedWeight));
  const green = Math.round(255 * normalizedWeight);
  
  return `rgb(${red}, ${green}, 0)`;
};

const Task = ({ task, onUpdateTask, onDeleteTask }) => {
  const { id, title, description, tagNames, urgency, personalInterest, executionTime, complexity, concentration, blocked, completed } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedParams, setEditedParams] = useState({
    urgency,
    personalInterest,
    executionTime,
    complexity,
    concentration
  });
  const [editedContent, setEditedContent] = useState({
    title,
    description
  });

  const weight = calculateTaskWeight(isEditing ? editedParams : task);
  const weightColor = getWeightColor(weight);

  const handleParamChange = (name, value) => {
    setEditedParams(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleContentChange = (name, value) => {
    setEditedContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updatedTask = {
      ...task,
      ...editedParams,
      ...editedContent
    };
    onUpdateTask(id, updatedTask);
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    const updatedTask = {
      ...task,
      completed: !completed
    };
    onUpdateTask(id, updatedTask);
  };

  const handleToggleBlocked = () => {
    const updatedTask = {
      ...task,
      blocked: !blocked
    };
    onUpdateTask(id, updatedTask);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteTask(id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div 
        className={`bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow flex items-start gap-4 ${blocked ? 'bg-red-50' : ''}`}
        style={{ borderLeft: `4px solid ${weightColor}` }}
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-sm font-medium px-2 py-1 rounded"
              style={{ 
                backgroundColor: weightColor,
                color: weight > 5 ? 'white' : 'black'
              }}
            >
              Weight: {weight.toFixed(1)}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedContent.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 flex-1"
                placeholder="Task title"
              />
            ) : (
              <h3 className={`text-lg font-semibold text-gray-800 ${completed ? 'line-through text-gray-500' : ''}`}>
                {title}
              </h3>
            )}
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                title={isEditing ? "Cancel editing" : "Edit task"}
              >
                {isEditing ? '✕' : '✏️'}
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-sm px-2 py-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={editedContent.description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              className="text-gray-600 mb-3 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full resize-none"
              placeholder="Task description"
              rows="3"
            />
          ) : (
            <p className={`text-gray-600 mb-3 ${completed ? 'line-through text-gray-400' : ''}`}>
              {description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tagNames.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2 text-sm mb-3">
            <div className="flex flex-col">
              <span className="text-red-600 font-medium">Urgency:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.urgency}
                    onChange={(e) => handleParamChange('urgency', e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{editedParams.urgency}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      {HINTS.urgency.map((text, idx) => <li key={idx}>{text}</li>)}
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{urgency}/10</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-yellow-600 font-medium">Interest:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.personalInterest}
                    onChange={(e) => handleParamChange('personalInterest', e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{editedParams.personalInterest}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      {HINTS.personalInterest.map((text, idx) => <li key={idx}>{text}</li>)}
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{personalInterest}/10</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-green-600 font-medium">Time:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.executionTime}
                    onChange={(e) => handleParamChange('executionTime', e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{editedParams.executionTime}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      {HINTS.executionTime.map((text, idx) => <li key={idx}>{text}</li>)}
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{executionTime}/10</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-medium">Complexity:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.complexity}
                    onChange={(e) => handleParamChange('complexity', e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{editedParams.complexity}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      <li>10 – всё предельно понятно и элементарно</li>
                      <li>9 – понятно, но надо чуть подумать</li>
                      <li>8 – есть пара неопределённостей, но в целом ясно</li>
                      <li>7 – почти ясно, надо уточнить пару моментов</li>
                      <li>6 – есть препятствия, нужно готовиться</li>
                      <li>5 – требует размышлений и усилий</li>
                      <li>4 – много неясного, сложно начать</li>
                      <li>3 – почти не понимаю, как делать</li>
                      <li>2 – очень туманно, чувствую тупик</li>
                      <li>1 – полная неизвестность, не знаю с чего начать</li>
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{complexity}/10</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-purple-600 font-medium">Concentration:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.concentration}
                    onChange={(e) => handleParamChange('concentration', e.target.value)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{editedParams.concentration}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      <li>1 – максимальная концентрация, полное погружение</li>
                      <li>2 – очень высокая концентрация</li>
                      <li>3 – высокая концентрация</li>
                      <li>4 – средне-высокая концентрация</li>
                      <li>5 – средняя концентрация</li>
                      <li>6 – ниже среднего</li>
                      <li>7 – можно выполнять на фоне других дел</li>
                      <li>8 – почти не требует концентрации</li>
                      <li>9 – минимальная концентрация</li>
                      <li>10 – не требует концентрации, полностью фоновая активность</li>
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{concentration}/10</span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mb-3">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
              >
                Save Changes
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 border-t pt-2">
            <input
              type="checkbox"
              checked={blocked}
              onChange={handleToggleBlocked}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-600">Blocked</span>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        taskTitle={title}
      />
    </>
  );
};

export default Task; 