import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Подтверждение удаления
        </h3>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить задачу "{taskTitle}"? Это действие нельзя отменить.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 