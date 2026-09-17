export default function InputField(
	{ label, type, name, placeholder, status, value }:
		{ value?: string, label: string, type: React.HTMLInputTypeAttribute, name: string, placeholder?: string, status?: string[] }
) {
	return (
		<div className="mb-4">
			<label className="grid gap-2">
				<span>{label}</span>
				<input
					type={type}
					name={name}
					defaultValue={value}
					placeholder={placeholder}
					className={`w-full min-w-0 border px-3 py-2 ${Boolean(status) ? "border-red-500" : "border-gray-100"} rounded-md`}
					aria-invalid={Boolean(status)}
					aria-describedby={Boolean(status) ? `${name}_statusMessage` : undefined}
				/>
			</label>
			{Boolean(status) && <p id={`${name}_statusMessage`} role="alert">
				{status?.map((message, index) => (
					<span className="text-red-500" key={`${message}_${index}`}>
						{message}
					</span>
				))}
			</p>}
		</div>
	);
}