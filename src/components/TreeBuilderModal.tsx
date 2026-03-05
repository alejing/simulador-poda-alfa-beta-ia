import { useState } from 'react';
import type { TreeNode } from '../core/tree';
import { parseTreeFromJSON } from '../core/tree';

interface TreeBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadTree: (newTree: TreeNode) => void;
}

export const TreeBuilderModal = ({ isOpen, onClose, onLoadTree }: TreeBuilderModalProps) => {
    const [jsonInput, setJsonInput] = useState<string>('[\n  [4, 5],\n  [8, 50]\n]');
    const [error, setError] = useState<string>('');

    if (!isOpen) return null;

    const handleLoad = () => {
        try {
            setError('');
            // Parsear string a arreglo JS puro
            const parsedArray = JSON.parse(jsonInput);

            // Transformar el arreglo anidado a un TreeNode validado
            const newTree = parseTreeFromJSON(parsedArray);

            // Emitir evento al padre
            onLoadTree(newTree);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al parsear el JSON. Verifica la sintaxis.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in">

                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center">
                            <span className="text-blue-400 mr-2">⮔</span>
                            Añadir Árbol Personalizado
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Modo Avanzado (Anidación JSON)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-300 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-4">
                    <p className="text-sm text-slate-300">
                        Escribe el árbol usando arreglos anidados. Cada nivel de profundidad alterna automáticamente entre <strong>MAX</strong> y <strong>MIN</strong> (comenzando en MAX). Los números solitarios serán interpretados como Hojas.
                    </p>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400/80">
                        // Ejemplo: Árbol de la imagen original<br />
                        [<br />
                        &nbsp;&nbsp;[ [4, 5], [8, 50] ],<br />
                        &nbsp;&nbsp;[ [3, 2], [0, 10] ]<br />
                        ]
                    </div>

                    <div className="flex-1 min-h-[200px] relative mt-2">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-full min-h-[200px] bg-slate-950/50 text-slate-200 border border-slate-700 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-y custom-scrollbar"
                            placeholder="[ [1, 2], [3, 4] ]"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-950/50 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start">
                            <span className="mr-2">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleLoad}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center"
                    >
                        Generar y Simular
                    </button>
                </div>

            </div>
        </div>
    );
};
