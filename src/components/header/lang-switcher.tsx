import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { localeNames } from '@/i18n';
import { usePathname, useRouter } from '@/navigation';
import { useLocale } from 'next-intl';

export const LangSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleSwitchLanguage = (value: string) => {
    router.push(pathname, { locale: value });
  };

  return (
    <div className={className}>
      <Select value={locale} onValueChange={handleSwitchLanguage}>
        <SelectTrigger aria-label="select language">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(localeNames).map((key: string) => {
            const name = localeNames[key];
            return (
              <SelectItem
                aria-label={key}
                className="cursor-pointer"
                key={key}
                value={key}
              >
                {name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
