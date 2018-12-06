import { RegistroPessoal } from './model';

export interface Dictionary<T> {
    [key: string]: T;
}

export interface ModalData<T> {
    editEnabled: boolean;
    payload: T;
    updated?: boolean;
}

export interface ConfirmModalData {
    titulo?: string;
    message: string;
    okLabel?: string;
    cancelLabel?: string;
}
