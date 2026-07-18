import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useAccessUserStore } from '@/stores/useAccessUserStore';
import type { AccessUserData } from '@/types/auth';
import AccessUserFormModal from './form';
import { useTranslation } from '@/hooks/use-translation';

interface PaginationProps {
    data: AccessUserData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function AccessUserIndex({
    users,
    filters,
    allMenus,
    allUsers,
}: {
    users: PaginationProps;
    filters: any;
    allMenus: any[];
    allUsers: AccessUserData[];
}) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');

    const { openEdit, openDetail } = useAccessUserStore();

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.access-user.index'),
                {
                    search: searchTerm,
                    per_page: perPage,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, perPage, filters.search, filters.per_page]);

    return (
        <>
            <Head title={t('Access User')} />

            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t('Access User')}</h2>
                        <p className="text-sm text-muted-foreground">
                            {t('Manajemen hak akses user terhadap menu dan aksi sistem.')}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3">
                        <div className="relative w-full flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user..."
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
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-12">{t('No')}</TableHead>
                                <TableHead>{t('Name')}</TableHead>
                                <TableHead>{t('Email')}</TableHead>
                                <TableHead>{t('Roles')}</TableHead>
                                <TableHead className="w-24 text-right">{t('Action')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            {users.from + index}
                                        </TableCell>
                                        <TableCell className="font-bold uppercase">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            {user.roles.map((role, i) => (
                                                <span
                                                    key={role.id}
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 ${i <
                                                        user.roles.length - 1
                                                        ? 'mr-1'
                                                        : ''
                                                        }`}
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TableAction
                                                onEdit={(isEditMode) =>
                                                    isEditMode
                                                        ? openEdit(user)
                                                        : openDetail(user)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

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

            <AccessUserFormModal allMenus={allMenus} allUsers={allUsers} />
        </>
    );
}

AccessUserIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Configuration',
                href: '#',
            },
            {
                title: 'Access User',
                href: '/access-user',
            }
        ]}
    >
        {page}
    </AppLayout>
);
