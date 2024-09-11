const Checkbox = ({ id, label, checked, onChange }) => {
	return (
		<div className='flex items-center'>
			<input
				checked={checked}
				id={id}
				type='radio'
				onChange={onChange}
				value=''
				name='default-radio'
				className='w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600'
			/>
			<label
				htmlFor={id}
				className='ms-2 text-sm font-medium text-gray-300'
			>
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
