import 'select2/dist/css/select2.css';
import { useEffect, useRef, useState } from 'react';

// Dynamic loader for jQuery and Select2 to prevent SSR environment crashes
let jqueryPromise: Promise<any> | null = null;
const loadJqueryAndSelect2 = () => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if (!jqueryPromise) {
        jqueryPromise = Promise.all([
            import('jquery'),
            import('select2')
        ]).then(([jqueryModule, select2Module]) => {
            const $ = jqueryModule.default;
            const select2 = select2Module.default;
            if (typeof $.fn.select2 === 'undefined') {
                (select2 as any)(window, $);
            }
            return $;
        });
    }
    return jqueryPromise;
};

interface Select2Props {
    options: { id: number | string; text: string }[];
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    multiple?: boolean;
    valueType?: 'number' | 'string';
}

export default function Select2({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    multiple = false,
    valueType = 'number'
}: Select2Props) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const isProgrammaticUpdate = useRef(false);
    const [jqueryInstance, setJqueryInstance] = useState<any>(null);

    useEffect(() => {
        let active = true;
        loadJqueryAndSelect2().then(($) => {
            if ($ && active) {
                setJqueryInstance(() => $);
            }
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!jqueryInstance) return;
        const $ = jqueryInstance;
        const $el = $(selectRef.current!);

        // Inisialisasi ulang jika sudah ada instansi (sesuai code PHP Anda)

        const $dialog = $el.closest('[role="dialog"]');
        const $dropdownParent = $dialog.length ? $dialog : $(document.body);

        ($el as any).select2({
            dropdownParent: $dropdownParent,
            placeholder,
            width: 'resolve',
            multiple,
            allowClear: true,
            data: options,
            dropdownCssClass: 'select2-dropdown-high-z',
        });

        // Set nilai awal
        isProgrammaticUpdate.current = true;
        ($el as any).val(value).trigger('change.select2');
        isProgrammaticUpdate.current = false;

        // Handler perubahan
        ($el as any).on('change.select2', (e: any) => {
            if (isProgrammaticUpdate.current) return;
            const val = $(e.target).val();

            if (multiple) {
                if (valueType === 'string') {
                    onChange(Array.isArray(val) ? val.map(String) : []);
                } else {
                    onChange(Array.isArray(val) ? val.map(Number) : []);
                }
            } else {
                if (valueType === 'string') {
                    onChange(val ? String(val) : null);
                } else {
                    onChange(val ? Number(val) : null);
                }
            }
        });

        // Mencegah scroll lock dari Radix (karena select2 di-append ke body)
        const stopScrollPropagation = (e: Event) => e.stopPropagation();
        ($el as any).on('select2:open', () => {
            setTimeout(() => {
                const dropdown = document.querySelector('.select2-container--open .select2-dropdown');
                if (dropdown) {
                    dropdown.removeEventListener('wheel', stopScrollPropagation);
                    dropdown.removeEventListener('touchmove', stopScrollPropagation);
                    dropdown.addEventListener('wheel', stopScrollPropagation, { passive: false });
                    dropdown.addEventListener('touchmove', stopScrollPropagation, { passive: false });
                }
            }, 10);
        });

        return () => {
            ($el as any).off('change.select2');
            if (typeof ($el as any).select2 === 'function') {
                ($el as any).select2('destroy');
            }
            $el.empty();
        };
    }, [jqueryInstance, options, multiple, placeholder]);

    // Sinkronisasi nilai dari parent
    useEffect(() => {
        if (!jqueryInstance) return;
        const $ = jqueryInstance;
        const $el = $(selectRef.current!);
        const currentValue = ($el as any).val();

        // Normalize keduanya ke string untuk perbandingan (karena .val() selalu string)
        const normalize = (v: any) =>
            Array.isArray(v) ? v.map(String).sort() : String(v ?? '');

        if (JSON.stringify(normalize(currentValue)) !== JSON.stringify(normalize(value))) {
            isProgrammaticUpdate.current = true;
            ($el as any).val(value).trigger('change.select2');
            isProgrammaticUpdate.current = false;
        }
    }, [jqueryInstance, value]);

    return (
        <div className="select2-wrapper w-full relative z-0">
            <style>{`
                .select2-wrapper .select2-container .select2-selection--single {
                    height: 40px !important;
                    border: 1px solid hsl(var(--input)) !important;
                    border-radius: calc(var(--radius) - 2px) !important;
                    background-color: transparent !important;
                }
                .select2-wrapper .select2-container--default .select2-selection--single .select2-selection__rendered {
                    line-height: 38px !important;
                    color: hsl(var(--foreground)) !important;
                    padding-left: 12px !important;
                }
                .select2-wrapper .select2-container--default .select2-selection--single .select2-selection__arrow {
                    height: 38px !important;
                    right: 8px !important;
                }
                .select2-wrapper .select2-container--default .select2-selection--single .select2-selection__clear {
                    height: 38px !important;
                    line-height: 38px !important;
                    margin-right: 24px !important;
                }
            `}</style>
            <select
                ref={selectRef}
                disabled={disabled}
                multiple={multiple}
                className="w-full"
            />
        </div>
    );
}
