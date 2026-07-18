import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export function usePreventBack() {
    useEffect(() => {
        // Push state dummy agar back button tidak ke halaman sebelumnya
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
            // Redirect ke dashboard jika user coba back
            router.visit(route('dashboard'));
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);
}
