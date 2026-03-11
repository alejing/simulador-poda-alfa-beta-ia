import { useState } from 'react';
import type { TreeNode } from '../core/tree';
import { parseTreeFromJSON } from '../core/tree';
import { VisualTreeBuilder } from './VisualTreeBuilder';

interface TreeBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadTree: (newTree: TreeNode) => void;
}

type BuilderMode = 'json' | 'visual';

export const TreeBuilderModal = ({ isOpen, onClose, onLoadTree }: TreeBuilderModalProps) => {
    const [mode, setMode] = useState<BuilderMode>('visual');
    const [jsonInput, setJsonInput] = useState<string>('[\n  [4, 5],\n  [8, 50]\n]');
    const [visualData, setVisualData] = useState<any>(null);
    const [error, setError] = useState<string>('');

    if (!isOpen) return null;

    const handleLoad = () => {
        try {
            setError('');
            let dataToParse;

            if (mode === 'json') {
                dataToParse = JSON.parse(jsonInput);
            } else {
                dataToParse = visualData || [[3, 5]]; // Fallback si no hubo cambios
            }

            const newTree = parseTreeFromJSON(dataToParse);
            onLoadTree(newTree);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al procesar el árbol. Verifica la estructura.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in max-h-[90vh]">

                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 flex items-center">
                                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                Configurar Árbol
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">Elige cómo prefieres definir la estructura del juego</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-300 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 self-start">
                        <button
                            onClick={() => setMode('visual')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'visual' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Constructor Visual (No-Code)
                        </button>
                        <button
                            onClick={() => setMode('json')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'json' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Editor JSON (Avanzado)
                        </button>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    {mode === 'json' ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-slate-300">
                                Escribe el árbol usando arreglos anidados. Los números solitarios serán interpretados como Hojas.
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400/60 leading-relaxed">
                                <span className="text-slate-500">// Ejemplo: Árbol original</span><br />
                                [ [ [4, 5], [8, 50] ], [ [3, 2], [0, 10] ] ]
                            </div>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                className="w-full h-48 bg-slate-950/50 text-slate-200 border border-slate-700 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
                                placeholder="[ [1, 2], [3, 4] ]"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-slate-300">
                                Haz clic en los botones para añadir hojas o sub-niveles. El simulador alternará MAX/MIN automáticamente.
                            </p>
                            <VisualTreeBuilder onChange={setVisualData} />
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 bg-red-950/50 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start animate-shake">
                            <span className="mr-2">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleLoad}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Generar y Simular
                    </button>
                </div>

            </div>
        </div>
    );
};

