import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    [key: string]: any;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Daftar Akun Baru" 
            description="Silakan lengkapi formulir di bawah ini untuk membuat akun bimbingan tesis Anda."
        >
            <Head title="Daftar Akun Baru" />
            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-5">
                    {/* Name Input */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                            Nama Lengkap
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nama lengkap Anda beserta gelar"
                                className="pl-10 border-gray-200 dark:border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                            />
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    {/* Email Input */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                            Alamat Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="nama@umsu.ac.id atau email Anda"
                                className="pl-10 border-gray-200 dark:border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                            Kata Sandi
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Buat kata sandi minimal 8 karakter"
                                className="pl-10 border-gray-200 dark:border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                            Konfirmasi Kata Sandi
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Ulangi kata sandi Anda"
                                className="pl-10 border-gray-200 dark:border-zinc-800 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-6 rounded-xl transition-all shadow-md shadow-emerald-700/10 active:scale-[0.98] cursor-pointer" 
                        tabIndex={5} 
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        Daftar Sekarang
                    </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Sudah memiliki akun?{' '}
                    <TextLink href={route('login')} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold" tabIndex={6}>
                        Masuk ke Sistem
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
