import { useState, useRef, useEffect } from 'react';

interface DraggableStatePanelProps {
    message: string;
}

export const DraggableStatePanel = ({ message }: DraggableStatePanelProps) => {
    // Definimos posición inicial en la parte inferior izquierda de The Main Canvas
    const [position, setPosition] = useState({ x: 30, y: window.innerHeight - 200 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

    // Limit position inside viewport when window restarts
    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => ({
                x: Math.min(prev.x, window.innerWidth - 300),
                y: Math.min(prev.y, window.innerHeight - 150)
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y
        };
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        setPosition({
            x: dragRef.current.initialX + dx,
            y: dragRef.current.initialY + dy
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragRef.current = null;
    };

    return (
        <div
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`fixed top-0 left-0 z-50 w-80 bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-700 shadow-2xl flex flex-col transition-shadow ${isDragging ? 'shadow-blue-900/50 border-blue-500/50' : ''}`}
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
            <h3 className="text-blue-400 font-bold mb-3 uppercase text-[10px] tracking-[0.2em] border-b border-slate-800 pb-2 flex items-center select-none">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Estado Analítico (Arrastrame)
            </h3>
            <div className="text-slate-200 text-sm leading-relaxed font-medium pointer-events-none min-h-[60px]">
                <p className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 w-full animate-fade-in shadow-inner">
                    {message}
                </p>
            </div>
        </div>
    );
};
