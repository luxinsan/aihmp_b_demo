import Input from "antd/es/input";

type SearchFieldProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function SearchField({
  onChange,
  placeholder = "搜索",
  value,
}: SearchFieldProps) {
  const { Search } = Input;

  return (
    <Search
      allowClear
      className="ds-antd-search-field"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
