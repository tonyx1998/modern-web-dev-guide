import * as Icons from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export function getGuideIcon(iconName: string): LucideIcon {
  return (Icons[iconName as keyof typeof Icons] as LucideIcon) ?? Icons.BookOpen;
}
