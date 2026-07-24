import { Head, router } from '@inertiajs/react';
import { Plus, Search, Check, ShieldAlert, LogOut } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import TableAction from '@/components/ui/table-action';
import { useConfirm } from '@/hooks/use-confirm';
import { usePermission } from '@/hooks/use-permission';
import { useUserStore } from '@/stores/useUserStore';
import type { UserManagementData } from '@/types/auth';
import type { RoleData } from '@/types/role';
import UserFormModal from './form';
import { useTranslation } from '@/hooks/use-translation';

interface PaginationProps {
    data: UserManagementData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function UserIndex({
    users,
    allRoles,
    filters,
}: {
    users: PaginationProps;
    allRoles: RoleData[];
    filters: any;
}) {
    const { t } = useTranslation();
    const confirmDelete = useConfirm<UserManagementData>();
    const confirmApprove = useConfirm<UserManagementData>();
    const confirmClearSession = useConfirm<UserManagementData>();
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');
    const [isProcessing, setIsProcessing] = useState(false);
    const { can } = usePermission();

    const { openAdd, openEdit, openDetail } = useUserStore();

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.users.index'),
                { search: searchTerm, per_page: perPage, page: 1 },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, perPage, filters.search, filters.per_page]);

    const handleConfirmDelete = () => {
        if (!confirmDelete.data?.id) {
            return;
        }

        setIsProcessing(true);
        router.delete(route('configuration.users.destroy', confirmDelete.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                confirmDelete.close();
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false),
        });
    };

    const handleConfirmApprove = () => {
        if (!confirmApprove.data?.id) {
            return;
        }

        setIsProcessing(true);
        router.patch(route('configuration.users.approve', confirmApprove.data.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                confirmApprove.close();
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false),
        });
    };

    const handleConfirmClearSession = () => {
        if (!confirmClearSession.data?.email) {
            return;
        }

        setIsProcessing(true);
        router.delete(route('configuration.users.destroy-sessions', confirmClearSession.data.email), {
            preserveScroll: true,
            onSuccess: () => {
                confirmClearSession.close();
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false),
        });
    };

    return (
        <>
            <Head title={t('User Management')} />

            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{t('User Management')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {t('Kelola pengguna sistem dan hak akses.')}
                            </p>
                        </div>
                        {can('create configuration/users') && (
                            <Button onClick={openAdd}>
                                <Plus className="mr-2 h-4 w-4" /> {t('Add User')}
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex w-full max-w-sm items-center gap-3 max-sm:flex-col">
                            <div className="relative w-full flex-1">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('Search user...')}
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                value={perPage}
                                onChange={(e) => setPerPage(e.target.value)}
                                className="h-9 w-20 rounded-md border border-input bg-background text-xs outline-none"
                            >
                                {['10', '20', '50', '100'].map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>{users.from ?? 0}</strong> to{' '}
                            <strong>{users.to ?? 0}</strong> of {users.total}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Username')}</TableHead>
                                    <TableHead>{t('Email')}</TableHead>
                                    <TableHead>{t('Roles')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                    <TableHead className="text-right">{t('Actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length > 0 ? (
                                    users.data.map((user, idx) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                {users.from + idx}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {user.username}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((role) => (
                                                        <Badge
                                                            key={role.id}
                                                            variant="outline"
                                                            className="text-[10px] capitalize font-medium py-0.5 px-2 bg-blue-50/50 text-blue-700 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800"
                                                        >
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                    {(!user.roles || user.roles.length === 0) && (
                                                        <span className="text-xs text-muted-foreground italic">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.is_verified ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] font-semibold py-0.5 px-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1 w-fit"
                                                    >
                                                        <Check className="h-3 w-3" /> {t('Verified')}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] font-semibold py-0.5 px-2 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 w-fit"
                                                    >
                                                        <ShieldAlert className="h-3 w-3" /> {t('Unverified')}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <TableAction
                                                    route="configuration/users"
                                                    onEdit={(isEdit) =>
                                                        isEdit
                                                            ? openEdit(user)
                                                            : openDetail(user)
                                                    }
                                                    onDelete={() =>
                                                        confirmDelete.open(user)
                                                    }
                                                    onApprove={
                                                        !user.is_verified && can('approve configuration/users')
                                                            ? () => confirmApprove.open(user)
                                                            : undefined
                                                    }
                                                    onClearSession={
                                                        can('delete configuration/users')
                                                            ? () => confirmClearSession.open(user)
                                                            : undefined
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            {t('No users found.')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                {users.links.map((link, i) => (
                                    <PaginationItem key={i}>
                                        <Button
                                            variant={
                                                link.active ? 'outline' : 'ghost'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url && router.visit(link.url)
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>

            <UserFormModal allRoles={allRoles} />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={confirmDelete.close}
                onConfirm={handleConfirmDelete}
                loading={isProcessing}
                title={t('Delete User')}
                description={t('Are you sure you want to delete this user? This action cannot be undone.')}
            />

            {/* Confirm Approve Modal */}
            <ConfirmModal
                isOpen={confirmApprove.isOpen}
                onClose={confirmApprove.close}
                onConfirm={handleConfirmApprove}
                loading={isProcessing}
                title={t('Verify / Approve User')}
                description={t(`Are you sure you want to verify user "${confirmApprove.data?.name}"?`)}
                confirmText={t('Verify')}
                variant="success"
            />

            {/* Confirm Clear Sessions Modal */}
            <ConfirmModal
                isOpen={confirmClearSession.isOpen}
                onClose={confirmClearSession.close}
                onConfirm={handleConfirmClearSession}
                loading={isProcessing}
                title={t('Clear User Sessions')}
                description={t(`Are you sure you want to clear active sessions for user "${confirmClearSession.data?.email}"?`)}
                confirmText={t('Clear')}
                variant="warning"
            />
        </>
    );
}

UserIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Configuration',
                href: '#',
            },
            {
                title: 'Users',
                href: '/users',
            }
        ]}
    >
        {page}
    </AppLayout>
);
