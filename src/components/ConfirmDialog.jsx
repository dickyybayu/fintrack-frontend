import {useRef } from 'react';

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  const dialogRef = useRef(null);

  const handleBackgroundClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onCancel(); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"  onClick={handleBackgroundClick}>
      <div ref={dialogRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-2">{title || 'Konfirmasi'}</h3>
        <p className="text-sm text-gray-600 mb-6">{message || 'Apakah Anda yakin?'}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
