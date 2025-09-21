// src/hooks/use-toast.ts

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import { create } from "zustand"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ToastState = {
  toasts: ToasterToast[]
  toast: (toast: Omit<ToasterToast, "id">) => void
  dismiss: (toastId?: string) => void
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  toast: (newToast) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...newToast, id: crypto.randomUUID() },
      ].slice(-TOAST_LIMIT),
    }))
  },
  dismiss: (toastId) => {
    if (toastId) {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }))
      return
    }
    set({ toasts: [] })
  },
}))