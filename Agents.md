# Agentes y Flujo de Trabajo

Este documento describe la estructura de desarrollo, el contexto de negocio de la aplicación y la información relevante para cualquier Agente de IA o desarrollador que trabaje en `FixtureWebMundial2026`.

## Stack Tecnológico
- **Frontend**: React 18, TypeScript, Vite.
- **Estilos**: CSS Modules o Vanilla CSS, preferentemente sin frameworks como TailwindCSS salvo que se indique explícitamente.
- **Gestión de Estado**: Context API (`FixtureContext.tsx`).

## Dominios de la Aplicación
1. **Partidos y Resultados (`src/features/matches`)**: Lista y estado de los partidos.
2. **Fase de Grupos (`src/features/groups`)**: Posiciones, puntos y diferencia de goles (se recalcula automáticamente cuando cambian los resultados).
3. **Fase Eliminatoria (`src/features/bracket`)**: Árbol de clasificación para octavos, cuartos, semifinales y final.

## Reglas para Agentes (IA)
1. **Optimización**: Reutilizar siempre funciones auxiliares (`helpers.ts`) y memoizar valores pesados o funciones dependientes que pasan por contexto.
2. **Diseño**: Mantener una estética moderna, responsiva, con modos claro/oscuro integrados.
3. **Limpieza de Código**: No dejar console.logs, código muerto o tipos sin usar. Utilizar `useCallback` y `useMemo` donde el árbol de componentes lo requiera (especialmente en renderizados grandes como listas de partidos).
4. **Seguridad / Variables**: Asegurarse de mantener las llamadas a las APIs centralizadas y de controlar su renderización mediante estados (loading, error).

## Consideraciones de Mantenimiento
Cualquier nuevo componente debe residir en `src/components` o dentro del directorio de su respectiva característica (feature) en `src/features/[feature]/components`.
