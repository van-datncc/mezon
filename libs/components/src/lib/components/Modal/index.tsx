interface ModalProps {
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}

const Modal = ({ onClose, className, children }: ModalProps) => {
	return (
		<div className={`flex items-center justify-center fixed top-0 bottom-0 left-0 right-1 z-[100] ${className}`} onClick={onClose}>
			<div onClick={(e) => e.stopPropagation()}>{children}</div>
		</div>
	);
};
export default Modal;
