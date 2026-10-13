import * as Lucide from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const pick = (...names: string[]): LucideIcon => {
  const lib = Lucide as unknown as Record<string, LucideIcon | undefined>;
  for (const n of names) if (lib[n]) return lib[n] as LucideIcon;
  return lib.Circle as LucideIcon;
};

export const HouseIcon = pick('House', 'Home');
export const BookIcon = pick('BookOpen');
export const ChartIcon = pick('ChartColumn', 'ChartNoAxesColumn', 'BarChart3');
export const UserIcon = pick('User');
export const SettingsIcon = pick('Settings');
export const ShieldIcon = pick('ShieldCheck');
export const HelpIcon = pick('CircleHelp', 'HelpCircle');
export const LeafIcon = pick('Leaf');
export const ChevronRightIcon = pick('ChevronRight');
export const TrashIcon = pick('Trash2');
export const LogOutIcon = pick('LogOut');
export const PencilIcon = pick('Pencil');

export const SmileIcon = pick('Smile');
export const SproutIcon = pick('Sprout', 'Leaf');
export const MessageIcon = pick('MessageCircle', 'MessageSquare');
export const ArrowRightIcon = pick('ArrowRight');

export const SearchIcon = pick('Search');
export const PlusIcon = pick('Plus');
export const CloseIcon = pick('X');
export const MehIcon = pick('Meh');
export const FrownIcon = pick('Frown');
export const ComposeIcon = pick('SquarePen', 'PenSquare', 'Pencil');

export const CalendarIcon = pick('Calendar', 'CalendarDays');
export const InsightIcon = pick('HeartPulse', 'Heart', 'Sparkles');
