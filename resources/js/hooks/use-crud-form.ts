import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { ModalMode } from '@/types/enums';

interface UseCrudFormProps<T> {
    mode: ModalMode;
    editData: T | null;
    initialValues: any;
    transformData?: (data: T) => any;
}

export function useCrudForm<T>({ mode, editData, initialValues, transformData }: UseCrudFormProps<T>) {
    const form = useForm(initialValues);
    const { setData, reset, clearErrors } = form;

    const defaultValues = useRef(initialValues).current;

    const isOpen = mode !== ModalMode.CLOSED;
    const isReadOnly = mode === ModalMode.DETAIL;

    useEffect(() => {
        if (isOpen) {
            if (editData && mode !== ModalMode.CREATE) {
                const dataToSet = transformData ? transformData(editData) : editData;
                setData(dataToSet);
            } else {
                reset();
                setData(defaultValues);
            }

            clearErrors();
        } else {
            reset();
            setData(defaultValues);
            clearErrors();
        }
    }, [isOpen, editData, mode, setData, reset, clearErrors, transformData, defaultValues]);

    return { ...form, isOpen, isReadOnly };
}
