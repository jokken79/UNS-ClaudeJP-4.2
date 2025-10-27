'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

export interface VisibilidadTemplate {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  sidebar: {
    width: string;
    backgroundColor: string;
    textColor: string;
    activeItemBg: string;
    activeItemText: string;
    activeItemBorder: string;
  };
  nav: {
    spacing: string;
    iconSize: string;
    fontSize: string;
    hoverEffect: boolean;
  };
}

interface VisibilidadStore {
  templates: VisibilidadTemplate[];
  activeTemplate: VisibilidadTemplate | null;
  addTemplate: (template: VisibilidadTemplate) => void;
  updateTemplate: (id: string, updates: Partial<VisibilidadTemplate>) => void;
  deleteTemplate: (id: string) => void;
  setActiveTemplate: (id: string) => void;
  getDefaultTemplate: () => VisibilidadTemplate;
}

const createStorage = (): StateStorage => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }
  return localStorage;
};

const defaultTemplate: VisibilidadTemplate = {
  id: 'default-visibilidad-rrhh',
  name: 'Visibilidad RRHH Default',
  description: 'Plantilla por defecto del sistema de visibilidad para RRHH',
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
  },
  sidebar: {
    width: 'w-64',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-600',
    activeItemBg: 'bg-blue-50',
    activeItemText: 'text-blue-700',
    activeItemBorder: 'border-blue-600',
  },
  nav: {
    spacing: 'space-y-1',
    iconSize: 'w-5 h-5',
    fontSize: 'text-sm',
    hoverEffect: true,
  },
};

export const useVisibilidadTemplateStore = create<VisibilidadStore>()(
  persist(
    (set, get) => ({
      templates: [defaultTemplate],
      activeTemplate: defaultTemplate,

      getDefaultTemplate: () => defaultTemplate,

      addTemplate: (template) =>
        set((state) => {
          const exists = state.templates.some((t) => t.id === template.id);
          const templates = exists
            ? state.templates.map((t) => (t.id === template.id ? { ...t, ...template } : t))
            : [...state.templates, template];

          const isActiveTemplate = state.activeTemplate?.id === template.id;

          return {
            templates,
            activeTemplate: isActiveTemplate ? template : state.activeTemplate,
          };
        }),

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
          activeTemplate:
            state.activeTemplate?.id === id
              ? { ...state.activeTemplate, ...updates }
              : state.activeTemplate,
        })),

      deleteTemplate: (id) =>
        set((state) => {
          const remaining = state.templates.filter((t) => t.id !== id);
          const fallback = get().getDefaultTemplate();

          if (!remaining.length) {
            return {
              templates: [fallback],
              activeTemplate: fallback,
            };
          }

          const nextActive =
            state.activeTemplate?.id === id
              ? remaining.find((t) => t.id === fallback.id) ?? remaining[0]
              : state.activeTemplate;

          return {
            templates: remaining,
            activeTemplate: nextActive ?? fallback,
          };
        }),

      setActiveTemplate: (id) =>
        set((state) => {
          const fallback = get().getDefaultTemplate();
          const selected = state.templates.find((t) => t.id === id);
          if (selected) {
            return { activeTemplate: selected };
          }

          if (state.activeTemplate) {
            return { activeTemplate: state.activeTemplate };
          }

          return {
            activeTemplate:
              state.templates.find((t) => t.id === fallback.id) ?? fallback,
          };
        }),
    }),
    {
      name: 'visibilidad-template-store',
      version: 1,
      storage: createJSONStorage(createStorage),
      partialize: (state) => ({
        templates: state.templates,
        activeTemplate: state.activeTemplate,
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState) {
          return currentState;
        }

        const fallback = currentState.getDefaultTemplate();
        const incoming = persistedState as Partial<VisibilidadStore>;

        const templates = incoming.templates?.length
          ? incoming.templates
          : [fallback];

        const activeTemplate = incoming.activeTemplate
          ? templates.find((t) => t.id === incoming.activeTemplate?.id) ?? incoming.activeTemplate
          : templates.find((t) => t.id === fallback.id) ?? templates[0] ?? fallback;

        return {
          ...currentState,
          ...incoming,
          templates,
          activeTemplate,
        };
      },
    }
  )
);
