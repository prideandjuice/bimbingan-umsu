import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Masuk ke Sistem"
            description="Silakan masukkan email dan kata sandi Anda untuk mengakses dashboard bimbingan tesis."
        >
            <Head title="Masuk ke Sistem" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email or Username</Label>
                        <Input
                            id="email"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com or username"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                                Kata Sandi
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300" tabIndex={5}>
                                    Lupa kata sandi?
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan kata sandi"
                                className="pl-10 border-gray-200 dark:border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            className="rounded border-gray-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Label htmlFor="remember" className="text-xs font-normal text-muted-foreground select-none cursor-pointer">
                            Ingat saya di perangkat ini
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-6 rounded-xl transition-all shadow-md shadow-emerald-700/10 active:scale-[0.98] cursor-pointer"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        Masuk Sekarang
                    </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Belum memiliki akun?{' '}
                    <TextLink href={route('register')} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold" tabIndex={6}>
                        Daftar Akun Baru
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
