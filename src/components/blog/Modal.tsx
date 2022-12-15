import { Dispatch, ReactNode, SetStateAction } from 'react';

type ConfirmDeleteModalProps = {
    id: string | undefined;
    className?: string;
    children: ReactNode;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ children, id, open, setOpen, className }: ConfirmDeleteModalProps) => {
    return (
        <>
            <input checked={open} onChange={(e) => setOpen(e.target.checked)} type="checkbox" id={id} className="modal-toggle" />
            <label htmlFor={id} className={className ? `modal cursor-pointer ${className}` : 'modal cursor-pointer backdrop-blur bg-primary/30'}>
                <label className="modal-box relative" htmlFor="">
                    {children}
                </label>
            </label>
        </>
    )
}

export default Modal