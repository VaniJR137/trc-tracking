// store/userStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userStore = create(
  persist(
    (set, get) => ({
      users: [], // All users
      activeUser: null, // Currently logged-in user

      // Add or update user and set as active
      setUser: ({ infoid, role }) => {
        const existingUsers = get().users;
        const updatedUsers = [
          ...existingUsers.filter((u) => u.infoid !== infoid),
          { infoid, role },
        ];
        set({ users: updatedUsers, activeUser: { infoid, role } });
      },

      // Switch active user by infoid
      setActiveUser: (infoid) => {
        const foundUser = get().users.find((u) => u.infoid === infoid) || null;
        set({ activeUser: foundUser });
      },

      // Clear current active user
      clearUser: () => set({ activeUser: null }),

      // Remove all users
      clearAllUsers: () => set({ users: [], activeUser: null }),
    }),
    {
      name: "user-storage", // Stored in localStorage
    }
  )
);
export const sidebarStore = create((set) => ({
  open: true,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));