import {
  Plane,
  Utensils,
  GraduationCap,
  Dumbbell,
  BookOpen,
  ShoppingBag,
  Laptop,
  Home,
  Zap,
  Film,
  Target,
} from 'lucide-react';

export const getBudgetProgressColor = (percentage) => {
  if (percentage > 90) return '#EF4444';
  if (percentage >= 70) return '#F59E0B';
  return '#55F130';
};

export const formatCurrency = (amount) => {
  return `₹${(Number(amount) || 0).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getBudgetIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('travel') || lower.includes('trip') || lower.includes('flight')) {
    return { icon: Plane, emoji: '✈️', color: '#00C9A7' };
  }
  if (lower.includes('food') || lower.includes('snack') || lower.includes('mess') || lower.includes('eat') || lower.includes('dining')) {
    return { icon: Utensils, emoji: '🍔', color: '#55F130' };
  }
  if (lower.includes('college') || lower.includes('school') || lower.includes('study') || lower.includes('exam') || lower.includes('tuition')) {
    return { icon: GraduationCap, emoji: '🎓', color: '#38BDF8' };
  }
  if (lower.includes('gym') || lower.includes('fit') || lower.includes('workout')) {
    return { icon: Dumbbell, emoji: '🏋️', color: '#A855F7' };
  }
  if (lower.includes('book') || lower.includes('course') || lower.includes('note') || lower.includes('learning')) {
    return { icon: BookOpen, emoji: '📚', color: '#10B981' };
  }
  if (lower.includes('shop') || lower.includes('cloth') || lower.includes('shoe')) {
    return { icon: ShoppingBag, emoji: '🛍️', color: '#EC4899' };
  }
  if (lower.includes('laptop') || lower.includes('tech') || lower.includes('gadget') || lower.includes('phone')) {
    return { icon: Laptop, emoji: '💻', color: '#06B6D4' };
  }
  if (lower.includes('rent') || lower.includes('room') || lower.includes('flat') || lower.includes('house')) {
    return { icon: Home, emoji: '🏠', color: '#8B5CF6' };
  }
  if (lower.includes('recharge') || lower.includes('wifi') || lower.includes('bill') || lower.includes('electric')) {
    return { icon: Zap, emoji: '⚡', color: '#EAB308' };
  }
  if (lower.includes('movie') || lower.includes('game') || lower.includes('party') || lower.includes('fun')) {
    return { icon: Film, emoji: '🍿', color: '#F43F5E' };
  }
  return { icon: Target, emoji: '🎯', color: '#55F130' };
};
