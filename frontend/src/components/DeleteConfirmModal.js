import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Подтверждение удаления
        </h3>
        <p className="text-gray-600 mb-6 text-base">
          Вы уверены, что хотите удалить задачу "{taskTitle}"? Это действие нельзя отменить.
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 sm:gap-0">
          <button
            onClick={onClose}
            className="px-6 py-3 sm:px-4 sm:py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors text-base sm:text-sm font-medium"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 sm:px-4 sm:py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors text-base sm:text-sm font-medium"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 