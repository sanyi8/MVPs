import { useTranslation } from 'react-i18next';
import { languages } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);
      window.location.reload(); // Force reload to ensure all components update
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className="h-5 w-5 text-[#F95432]" />
      <Select
        value={i18n.language}
        onValueChange={changeLanguage}
      >
        <SelectTrigger className="w-[140px] h-9 text-sm bg-white border-2 hover:bg-gray-50">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};