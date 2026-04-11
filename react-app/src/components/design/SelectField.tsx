import Select from "antd/es/select";

type SelectFieldOption<T extends string> = {
  label: string;
  value: T;
};

type SelectFieldProps<T extends string> = {
  allowClear?: boolean;
  onChange: (value: T | undefined) => void;
  options: Array<SelectFieldOption<T>>;
  placeholder?: string;
  value?: T;
};

export function SelectField<T extends string>({
  allowClear = true,
  onChange,
  options,
  placeholder = "请选择",
  value,
}: SelectFieldProps<T>) {
  return (
    <Select<T>
      allowClear={allowClear}
      className="ds-antd-select-field"
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(nextValue) => onChange(nextValue)}
    />
  );
}
