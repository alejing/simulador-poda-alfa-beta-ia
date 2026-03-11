import { useState } from 'react';

type VisualTreeNode = {
    id: string;
    type: 'node' | 'leaf';
    value: number | string;
    children: VisualTreeNode[];
};

interface VisualTreeBuilderProps {
    onChange: (data: any) => void;
}

export const VisualTreeBuilder = ({ onChange }: VisualTreeBuilderProps) => {
    const [tree, setTree] = useState<VisualTreeNode>({
        id: 'root',
        type: 'node',
        value: 0,
        children: [
            { id: '1', type: 'leaf', value: 3, children: [] },
            { id: '2', type: 'leaf', value: 5, children: [] }
        ]
    });

    const convertToJSON = (node: VisualTreeNode): any => {
        if (node.type === 'leaf') {
            const val = Number(node.value);
            return isNaN(val) ? 0 : val;
        }
        return node.children.map(convertToJSON);
    };

    const updateTree = (newTree: VisualTreeNode) => {
        setTree(newTree);
        onChange(convertToJSON(newTree));
    };

    const addNode = (parentId: string, type: 'node' | 'leaf') => {
        const newNode: VisualTreeNode = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            value: 0,
            children: type === 'node' ? [{ id: Math.random().toString(36).substr(2, 9), type: 'leaf', value: 0, children: [] }] : []
        };

        const findAndAdd = (node: VisualTreeNode): VisualTreeNode => {
            if (node.id === parentId) {
                return { ...node, type: 'node', children: [...node.children, newNode] };
            }
            return { ...node, children: node.children.map(findAndAdd) };
        };

        updateTree(findAndAdd(tree));
    };

    const removeNode = (id: string) => {
        if (id === 'root') return;
        const findAndRemove = (node: VisualTreeNode): VisualTreeNode => {
            return {
                ...node,
                children: node.children
                    .filter(child => child.id !== id)
                    .map(findAndRemove)
            };
        };
        updateTree(findAndRemove(tree));
    };

    const updateValue = (id: string, value: string) => {
        const findAndUpdate = (node: VisualTreeNode): VisualTreeNode => {
            if (node.id === id) return { ...node, value };
            return { ...node, children: node.children.map(findAndUpdate) };
        };
        updateTree(findAndUpdate(tree));
    };

    const renderNode = (node: VisualTreeNode, depth: number = 0) => {
        const isMax = depth % 2 === 0;
        const isRoot = node.id === 'root';

        return (
            <div key={node.id} className={`ml-4 mt-2 p-3 border-l-2 ${isMax ? 'border-blue-500/30' : 'border-emerald-500/30'} bg-slate-800/20 rounded-r-xl`}>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isMax ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {isMax ? 'MAX' : 'MIN'}
                    </span>

                    {node.type === 'leaf' ? (
                        <input
                            type="text"
                            value={node.value}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Permitimos solo números, el signo menos al inicio y string vacío
                                if (val === '' || val === '-' || /^-?\d+$/.test(val)) {
                                    updateValue(node.id, val);
                                }
                            }}
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                    ) : (
                        <span className="text-xs text-slate-500 font-mono">Nodo {node.id.split('-')[0]}</span>
                    )}

                    <div className="flex gap-1 ml-auto">
                        {node.type === 'node' && (
                            <>
                                <button
                                    onClick={() => addNode(node.id, 'leaf')}
                                    className="p-1 hover:bg-emerald-500/20 text-emerald-500 rounded transition-colors"
                                    title="Añadir Hoja"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </button>
                                <button
                                    onClick={() => addNode(node.id, 'node')}
                                    className="p-1 hover:bg-blue-500/20 text-blue-500 rounded transition-colors"
                                    title="Añadir Sub-árbol"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16" /></svg>
                                </button>
                            </>
                        )}
                        {!isRoot && (
                            <button
                                onClick={() => removeNode(node.id)}
                                className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                title="Eliminar"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                {node.children.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {node.children.map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {renderNode(tree)}
        </div>
    );
};
