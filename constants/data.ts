import { BadgeDollarSign, Boxes, BringToFront, Building2, LayoutDashboard, Ungroup, UsersRound, Warehouse, ContactRound, CircleDollarSign, LockKeyhole, Key } from 'lucide-react';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: React.ElementType;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Inicio',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: false,
    items: []
  },
  {
    title: 'Productos',
    url: '/dashboard/product',
    icon: Boxes,
    isActive: false,
    items: []
  },
  {
    title: 'Categorías de Productos',
    url: '/dashboard/productCategory',
    icon: Ungroup,
    isActive: false,
    items: []
  },
  {
    title: 'Categorías de Precios',
    url: '/dashboard/priceList',
    icon: BadgeDollarSign,
    isActive: false,
    items: []
  },
  {
    title: 'Órdenes de Pedido',
    url: '/dashboard/warehouseOrder',
    icon: BringToFront,
    isActive: false,
    items: []
  },
  {
    title: 'Compañías',
    url: '/dashboard/company',
    icon: Building2,
    isActive: false,
    items: []
  },
  {
    title: 'Empleados',
    url: '/dashboard/employee',
    icon: ContactRound,
    isActive: false,
    items: []
  },
  {
    title: 'Divisas',
    url: '/dashboard/currency',
    icon: CircleDollarSign,
    isActive: false,
    items: []
  },
  {
    title: 'Usuarios',
    url: '/dashboard/apiUser',
    icon: UsersRound,
    isActive: false,
    items: []
  },
  {
    title: 'Roles',
    url: '/dashboard/role',
    icon: LockKeyhole,
    isActive: false,
    items: []
  },
  {
    title: 'Permisos',
    url: '/dashboard/permissions',
    icon: Key,
    isActive: false,
    items: []
  },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  // {
  //   title: 'Almacén',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: Warehouse,
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'Producto',
  //       url: '/dashboard/product',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Categoría de Producto',
  //       url: '/dashboard/product-category',
  //       shortcut: ['m', 'm']
  //     },

  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //     }
  //   ]
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];