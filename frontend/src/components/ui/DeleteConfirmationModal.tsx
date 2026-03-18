import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Journal?",
    message = "Are you sure you want to delete this journal? This action cannot be undone."
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                        <img src="/assets/Journal_assets/25  trash.svg" alt="Delete" className="w-8 h-8 opacity-80" />
                    </div>

                    <h3 className="text-xl font-bold text-[#4F3422]">{title}</h3>
                    <p className="text-[#926247] text-sm leading-relaxed opacity-80 mb-4">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-[#4F3422] font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 h-12 rounded-xl bg-[#FE814B] text-white font-semibold shadow-md hover:bg-[#ff7135] transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
