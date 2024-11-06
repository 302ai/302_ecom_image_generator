import { create } from 'zustand';

type State = {
  task: any;
  updateTask: (data: any) => void;
};

export const useTaskStore = create<State>((set) => ({
  task: {},
  updateTask: (newTask) => set({ task: newTask }),
}));

