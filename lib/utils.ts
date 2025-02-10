import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function resolveRedirectPath(template: string, record: any) {
  return template.replace(/{([\w.]+)}/g, (_, path) => {
      return getNestedValue(record, path) || `{${path}}`; // Si el valor no existe, deja el placeholder.
  });
}
