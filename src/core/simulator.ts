import type { TreeNode } from './tree';
import { cloneTree } from './tree';

/**
 * Representa un estado específico de la simulación para la línea de tiempo.
 */
export interface SimulationStep {
    tree: TreeNode;         // Clon del árbol en este paso
    message: string;        // Narrativa de lo que ocurre
    activeNodeId: string | null; // ID del nodo resaltado
}

/**
 * Ejecuta el algoritmo Minimax con Poda Alfa-Beta y captura cada micro-paso.
 */
export function runAlphaBetaSimulation(root: TreeNode): SimulationStep[] {
    const steps: SimulationStep[] = [];

    // Helper para asegurar que la raíz simulada y sus hijos estén totalmente limpios (Paso 0)
    const createPristineTree = (node: TreeNode): TreeNode => {
        const cloned = cloneTree(node);
        const cleanNode = (n: TreeNode) => {
            n.isCurrent = false;
            n.isEvaluated = false;
            n.isPruned = false;
            n.alpha = -Infinity;
            n.beta = Infinity;
            if (n.type !== 'LEAF') n.value = null;
            n.children.forEach(cleanNode);
        };
        cleanNode(cloned);
        return cloned;
    };

    const simulationRoot = createPristineTree(root);

    const addStep = (tree: TreeNode, message: string, activeNodeId: string | null) => {
        steps.push({
            tree: cloneTree(tree),
            message,
            activeNodeId,
        });
    };

    addStep(simulationRoot, "Estado Inicial. El árbol no ha sido evaluado aún.", null);

    const traverse = (node: TreeNode, currentAlpha: number, currentBeta: number): number => {
        node.isCurrent = true;
        node.alpha = currentAlpha;
        node.beta = currentBeta;

        addStep(simulationRoot, `Evaluando nodo ${node.id} (${node.type}). Alfa=${currentAlpha}, Beta=${currentBeta}`, node.id);

        // Caso Base: Nodo Hoja
        if (node.type === 'LEAF') {
            node.isEvaluated = true;
            node.isCurrent = false;
            addStep(simulationRoot, `El nodo hoja ${node.id} retorna valor ${node.value}`, node.id);
            return node.value as number;
        }

        let isMax = node.type === 'MAX';
        let bestValue = isMax ? -Infinity : Infinity;

        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];

            if (node.isPruned) {
                child.isPruned = true;
                addStep(simulationRoot, `Rama ${child.id} podada, no se evaluará.`, child.id);
                continue;
            }

            const childValue = traverse(child, currentAlpha, currentBeta);

            node.isCurrent = true; // Volver el foco a este nodo tras retornar del hijo

            if (isMax) {
                if (childValue > bestValue) {
                    bestValue = childValue;
                    node.value = bestValue;
                    addStep(simulationRoot, `Nodo ${node.id} actualiza su valor máximo a ${bestValue}`, node.id);
                }
                if (bestValue > currentAlpha) {
                    currentAlpha = bestValue;
                    node.alpha = currentAlpha;
                    addStep(simulationRoot, `Nodo ${node.id} actualiza Alfa a ${currentAlpha}`, node.id);
                }
            } else {
                if (childValue < bestValue) {
                    bestValue = childValue;
                    node.value = bestValue;
                    addStep(simulationRoot, `Nodo ${node.id} actualiza su valor mínimo a ${bestValue}`, node.id);
                }
                if (bestValue < currentBeta) {
                    currentBeta = bestValue;
                    node.beta = currentBeta;
                    addStep(simulationRoot, `Nodo ${node.id} actualiza Beta a ${currentBeta}`, node.id);
                }
            }

            // --- Lógica Vital: Condición de Poda Alfa-Beta ---
            if (currentAlpha >= currentBeta) {
                // En lugar de hacer break inmediatamente, marcamos que las siguientes ramas se podan
                addStep(simulationRoot, `¡PODA! En ${node.id}: Alfa (${currentAlpha}) >= Beta (${currentBeta}). Se ignoran los siguientes hijos.`, node.id);
                // Marcar los hijos restantes como podados para registrarlos visualmente
                for (let j = i + 1; j < node.children.length; j++) {
                    node.children[j].isPruned = true;
                    // Esto los marcará rojo en el diagrama
                }
                break; // Cortamos el ciclo
            }
        }

        node.isEvaluated = true;
        node.isCurrent = false;
        addStep(simulationRoot, `Nodo ${node.id} completamente evaluado. Retorna ${bestValue}.`, node.id);
        return bestValue;
    };

    traverse(simulationRoot, -Infinity, Infinity);

    addStep(simulationRoot, `Análisis Alfa-Beta finalizado exitosamente.`, null);

    return steps;
}
