import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { useCrudForm } from '@/hooks/use-crud-form';
import { useUserStore } from '@/stores/useUserStore';
import { ModalMode } from '@/types/enums';
import type { UserManagementData } from '@/types/auth';
import type { RoleData } from '@/types/role';
import { useTranslation } from '@/hooks/use-translation';

interface UserFormModalProps {
    allRoles: RoleData[];
}

export default function UserFormModal({ allRoles }: UserFormModalProps) {
    const { t } = useTranslation();
    const { mode, editData, closeModal } = useUserStore();

    const { data, setData, post, put, processing, errors, isOpen, isReadOnly } =
        useCrudForm<UserManagementData>({
            mode,
            editData,
            initialValues: {
                name: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
                role_ids: [] as number[],
            },
            transformData: (item) => ({
                name: item.name || '',
                username: item.username || '',
                email: item.email || '',
                password: '',
                password_confirmation: '',
                role_ids: item.roles ? item.roles.map((r) => r.id) : [],
            }),
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isReadOnly) {
            return;
        }

        const options = {
            onSuccess: () => closeModal(),
        };

        if (mode === ModalMode.EDIT && editData?.id) {
            put(route('configuration.users.update', editData.id), options);
        } else {
            post(route('configuration.users.store'), options);
        }
    };

    const handleRoleChange = (roleId: number, checked: boolean) => {
        const currentRoleIds = [...(data.role_ids || [])];
        if (checked) {
            if (!currentRoleIds.includes(roleId)) {
                setData('role_ids', [...currentRoleIds, roleId]);
            }
        } else {
            setData('role_ids', currentRoleIds.filter((id) => id !== roleId));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={
                mode === ModalMode.CREATE
                    ? t('Add New User')
                    : mode === ModalMode.EDIT
                      ? t('Edit User')
                      : t('Detail User')
            }
            maxWidth="lg"
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                    >
                        {isReadOnly ? t('Close') : t('Cancel')}
                    </Button>
                    {!isReadOnly && (
                        <Button
                            type="submit"
                            form="user-form"
                            disabled={processing}
                        >
                            {processing
                                ? t('Saving...')
                                : mode === ModalMode.CREATE
                                  ? t('Save')
                                  : t('Update')}
                        </Button>
                    )}
                </>
            }
        >
            <form onSubmit={submit} id="user-form" className="space-y-4">
                <fieldset disabled={isReadOnly} className="space-y-4">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('Full Name')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. John Doe"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Username */}
                    <div className="grid gap-2">
                        <Label htmlFor="username">{t('Username')}</Label>
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="e.g. johndoe"
                            required
                        />
                        <InputError message={errors.username} />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('Email Address')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="e.g. johndoe@umsu.ac.id"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password (Only show on CREATE mode) */}
                    {mode === ModalMode.CREATE && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('Password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('Confirm Password')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>
                    )}

                    {/* Roles Checkboxes */}
                    <div className="grid gap-2">
                        <Label>{t('Assign Roles')}</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                            {allRoles.map((role) => {
                                const isChecked = data.role_ids?.includes(role.id) || false;
                                return (
                                    <div
                                        key={role.id}
                                        className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                                    >
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                                handleRoleChange(role.id, !!checked)
                                            }
                                        />
                                        <Label
                                            htmlFor={`role-${role.id}`}
                                            className="text-xs font-semibold capitalize cursor-pointer select-none"
                                        >
                                            {role.name}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                        <InputError message={errors.role_ids} />
                    </div>
                </fieldset>
            </form>
        </Modal>
    );
}
