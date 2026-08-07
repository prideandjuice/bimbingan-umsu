import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo | null;
    }
}

window.Pusher = Pusher;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

export const echo = reverbKey ? new Echo({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
}) : null;

export default echo;
