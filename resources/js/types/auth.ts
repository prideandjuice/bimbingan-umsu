import type { RoleData } from './role';

export interface MenuData {
    id: number | null;
    name: string;
    url: string;
    category: string;
    icon: string;
    main_menu_id?: number | null;
    active: boolean | number;
    orders?: number;
    sub_menus?: MenuData[];
    created_at?: string;
    updated_at?: string;
}

export interface AccessUserData {
    id: number;
    name: string;
    email: string;
    roles: RoleData[];
    permission_ids: number[];
}

export interface UserManagementData {
    id: number | null;
    name: string;
    email: string;
    username: string;
    password?: string;
    roles?: RoleData[];
    role_ids?: number[];
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

export type { AccessRoleData } from './access-role';
