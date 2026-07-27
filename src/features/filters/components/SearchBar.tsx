import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { useI18n } from '../../../i18n/i18nContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useI18n();
  return (
    <Input
      icon={<Search size={16} />}
      placeholder={t.filters.search}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={t.filters.search}
    />
  );
}
