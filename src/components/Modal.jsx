const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div
				className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out'
				onClick={onClose}
				style={{
					animation: isOpen
						? "fadeIn 0.3s ease-out"
						: "fadeOut 0.3s ease-in",
				}}
			></div>
			<div
				className='relative bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl h-full mx-4 overflow-y-auto transition-all duration-300 ease-in-out'
				style={{
					animation: isOpen
						? "scaleIn 0.3s ease-out"
						: "scaleOut 0.3s ease-in",
				}}
			>
				<div className='p-6'>
					<button
						onClick={onClose}
						className='absolute top-4 right-4 text-gray-400 hover:text-gray-500'
					>
						<svg
							className='h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
					{children}
				</div>
			</div>
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				@keyframes fadeOut {
					from {
						opacity: 1;
					}
					to {
						opacity: 0;
					}
				}
				@keyframes scaleIn {
					from {
						transform: scale(0.95);
						opacity: 0;
					}
					to {
						transform: scale(1);
						opacity: 1;
					}
				}
				@keyframes scaleOut {
					from {
						transform: scale(1);
						opacity: 1;
					}
					to {
						transform: scale(0.95);
						opacity: 0;
					}
				}
			`}</style>
		</div>
	);
};

export default Modal;
