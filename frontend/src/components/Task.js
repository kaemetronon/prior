import React, { useState, useRef, useEffect } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import { HINTS } from '../constants/hints';
import { calculateTaskWeight, getWeightColor, isAppleWatch } from '../utils/taskUtils';


// Компонент для отображения описания с поддержкой переносов строк
const DescriptionDisplay = ({ description, completed, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpandButton, setNeedsExpandButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && description) {
      // Подсчитываем количество строк, разделяя по переносам строк
      const lines = description.split('\n').length;
      // Если есть переносы строк или текст длинный, показываем кнопку
      setNeedsExpandButton(lines > 3 || description.length > 150);
    }
  }, [description]);

  if (!description) return null;

  return (
    <div className={className}>
      <div 
        ref={textRef}
        className={`${completed ? 'line-through text-gray-400' : ''} whitespace-pre-wrap break-words`}
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: isExpanded ? 'visible' : 'hidden'
        }}
      >
        {description}
      </div>
      {needsExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700 mt-1 underline focus:outline-none"
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      )}
    </div>
  );
};

const Task = ({ task, onUpdateTask, onDeleteTask }) => {
  const { id, title, description, tags, importance, urgency, personalInterest, executionTime, complexity, concentration, blocked, completed, weight } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedParams, setEditedParams] = useState({
    importance,
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

  const currentWeight = isEditing ? 
    calculateTaskWeight(editedParams) :
    (weight !== undefined ? weight : calculateTaskWeight(task));
  const weightColor = getWeightColor(currentWeight);

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
        className={`bg-white rounded-lg shadow-md p-3 sm:p-4 mb-3 sm:mb-4 hover:shadow-lg transition-shadow flex items-start gap-2 sm:gap-4 ${blocked ? 'bg-red-50' : ''}`}
        style={{ borderLeft: `4px solid ${weightColor}` }}
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleComplete}
          className="mt-1 h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-2">
            <span 
              className="text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
              style={{ 
                backgroundColor: weightColor,
                color: currentWeight > 5 ? 'white' : 'black'
              }}
            >
              Weight: {currentWeight.toFixed(1)}
            </span>
            <div className="flex gap-1 sm:gap-2 ml-auto flex-shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm sm:text-base px-2 py-1.5 sm:px-3 sm:py-2 rounded hover:bg-gray-100 transition-colors"
                title={isEditing ? "Cancel editing" : "Edit task"}
              >
                {isEditing ? '✕' : '✏️'}
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-sm sm:text-base px-2 py-1.5 sm:px-3 sm:py-2 rounded hover:bg-red-100 text-red-600 transition-colors"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editedContent.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="text-base sm:text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded px-1.5 sm:px-2 py-1 w-full min-w-0"
                placeholder="Task title"
              />
            ) : (
              <h3 className={`text-base sm:text-lg font-semibold text-gray-800 ${completed ? 'line-through text-gray-500' : ''} w-full`}>
                {title}
              </h3>
            )}
          </div>
          
          <div className="sm:hidden mb-2">
            <details className="text-sm">
              <summary className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Подробнее
              </summary>
              <div className="mt-2">
                <div>
                  {isEditing ? (
                    isAppleWatch() ? (
                      <input
                        type="text"
                        value={editedContent.description}
                        onChange={(e) => handleContentChange('description', e.target.value)}
                        className="text-gray-600 mb-2 bg-gray-50 border border-gray-300 rounded px-1.5 py-1 w-full text-sm"
                        placeholder="Task description"
                      />
                    ) : (
                      <textarea
                        value={editedContent.description}
                        onChange={(e) => handleContentChange('description', e.target.value)}
                        className="text-gray-600 mb-2 bg-gray-50 border border-gray-300 rounded px-1.5 py-1 w-full resize-y text-sm min-h-[3rem]"
                        placeholder="Task description"
                        rows="3"
                      />
                    )
                  ) : (
                    <DescriptionDisplay 
                      description={description}
                      completed={completed}
                      className="text-gray-600 mb-2 text-sm"
                    />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs mb-2">
                  <div className="flex flex-col">
                    <span className="text-pink-600 font-medium text-sm">Importance:</span>
                    {isEditing ? (
                      <>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editedParams.importance}
                          onChange={(e) => handleParamChange('importance', e.target.value)}
                          className="w-full h-6"
                        />
                        <span className="text-xs text-gray-600">{editedParams.importance}/10</span>
                        <details className="mt-1 text-xs text-gray-500">
                          <summary>хинт</summary>
                          <ul>
                            {HINTS.importance.map((text, idx) => <li key={idx}>{text}</li>)}
                          </ul>
                        </details>
                      </>
                    ) : (
                      <span className="ml-1">{importance}/10</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-red-600 font-medium text-sm">Urgency:</span>
                    {isEditing ? (
                      <>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editedParams.urgency}
                          onChange={(e) => handleParamChange('urgency', e.target.value)}
                          className="w-full h-6"
                        />
                        <span className="text-xs text-gray-600">{editedParams.urgency}/10</span>
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
                    <span className="text-yellow-600 font-medium text-sm">Interest:</span>
                    {isEditing ? (
                      <>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editedParams.personalInterest}
                          onChange={(e) => handleParamChange('personalInterest', e.target.value)}
                          className="w-full h-6"
                        />
                        <span className="text-xs text-gray-600">{editedParams.personalInterest}/10</span>
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
                    <span className="text-green-600 font-medium text-sm">Time:</span>
                    {isEditing ? (
                      <>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editedParams.executionTime}
                          onChange={(e) => handleParamChange('executionTime', e.target.value)}
                          className="w-full h-6"
                        />
                        <span className="text-xs text-gray-600">{editedParams.executionTime}/10</span>
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
                    <span className="text-blue-600 font-medium text-sm">Complexity:</span>
                    {isEditing ? (
                      <>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editedParams.complexity}
                          onChange={(e) => handleParamChange('complexity', e.target.value)}
                          className="w-full h-6"
                        />
                        <span className="text-xs text-gray-600">{editedParams.complexity}/10</span>
                        <details className="mt-1 text-xs text-gray-500">
                          <summary>хинт</summary>
                          <ul>
                            {HINTS.complexity.map((text, idx) => <li key={idx}>{text}</li>)}
                          </ul>
                        </details>
                      </>
                    ) : (
                      <span className="ml-1">{complexity}/10</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-purple-600 font-medium text-sm">Concentration:</span>
                    {isEditing ? (
                      <>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editedParams.concentration}
                          onChange={(e) => handleParamChange('concentration', e.target.value)}
                          className="w-full h-6"
                        />
                        <span className="text-xs text-gray-600">{editedParams.concentration}/10</span>
                        <details className="mt-1 text-xs text-gray-500">
                          <summary>хинт</summary>
                          <ul>
                            {HINTS.concentration.map((text, idx) => <li key={idx}>{text}</li>)}
                          </ul>
                        </details>
                      </>
                    ) : (
                      <span className="ml-1">{concentration}/10</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
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
            </details>
          </div>

          <div className="hidden sm:block">
            {isEditing ? (
              isAppleWatch() ? (
                <input
                  type="text"
                  value={editedContent.description}
                  onChange={(e) => handleContentChange('description', e.target.value)}
                  className="text-gray-600 mb-2 sm:mb-3 bg-gray-50 border border-gray-300 rounded px-1.5 sm:px-2 py-1 w-full text-sm sm:text-base"
                  placeholder="Task description"
                />
              ) : (
                <textarea
                  value={editedContent.description}
                  onChange={(e) => handleContentChange('description', e.target.value)}
                  className="text-gray-600 mb-2 sm:mb-3 bg-gray-50 border border-gray-300 rounded px-1.5 sm:px-2 py-1 w-full resize-y text-sm sm:text-base min-h-[3rem]"
                  placeholder="Task description"
                  rows="3"
                />
              )
            ) : (
              <DescriptionDisplay 
                description={description}
                completed={completed}
                className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base"
              />
            )}
          </div>
          
          <div className="hidden sm:flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-2 text-xs sm:text-sm mb-2 sm:mb-3">
            <div className="flex flex-col">
              <span className="text-pink-600 font-medium text-sm sm:text-base">Importance:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.importance}
                    onChange={(e) => handleParamChange('importance', e.target.value)}
                    className="w-full h-6 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{editedParams.importance}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      {HINTS.importance.map((text, idx) => <li key={idx}>{text}</li>)}
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{importance}/10</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-red-600 font-medium text-sm sm:text-base">Urgency:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.urgency}
                    onChange={(e) => handleParamChange('urgency', e.target.value)}
                    className="w-full h-6 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{editedParams.urgency}/10</span>
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
              <span className="text-yellow-600 font-medium text-sm sm:text-base">Interest:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.personalInterest}
                    onChange={(e) => handleParamChange('personalInterest', e.target.value)}
                    className="w-full h-6 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{editedParams.personalInterest}/10</span>
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
              <span className="text-green-600 font-medium text-sm sm:text-base">Time:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.executionTime}
                    onChange={(e) => handleParamChange('executionTime', e.target.value)}
                    className="w-full h-6 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{editedParams.executionTime}/10</span>
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
              <span className="text-blue-600 font-medium text-sm sm:text-base">Complexity:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.complexity}
                    onChange={(e) => handleParamChange('complexity', e.target.value)}
                    className="w-full h-6 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{editedParams.complexity}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      {HINTS.complexity.map((text, idx) => <li key={idx}>{text}</li>)}
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{complexity}/10</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-purple-600 font-medium text-sm sm:text-base">Concentration:</span>
              {isEditing ? (
                <>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedParams.concentration}
                    onChange={(e) => handleParamChange('concentration', e.target.value)}
                    className="w-full h-6 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{editedParams.concentration}/10</span>
                  <details className="mt-1 text-xs text-gray-500">
                    <summary>хинт</summary>
                    <ul>
                      {HINTS.concentration.map((text, idx) => <li key={idx}>{text}</li>)}
                    </ul>
                  </details>
                </>
              ) : (
                <span className="ml-1">{concentration}/10</span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="hidden sm:flex justify-end mb-2 sm:mb-3">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 sm:gap-3 border-t pt-2 sm:pt-3">
            <input
              type="checkbox"
              checked={blocked}
              onChange={handleToggleBlocked}
              className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm sm:text-base text-gray-600">Blocked</span>
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