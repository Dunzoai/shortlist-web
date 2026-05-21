'use client';

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function TextFieldEditor({ label, value, onChange, placeholder }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-400">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </label>
  );
}
