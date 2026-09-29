import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

// Staggered variants for item cascading slide-in
const actionContainerVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.92, 
    y: -8,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.03,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -6,
    filter: "blur(2px)",
    transition: {
      duration: 0.12,
      ease: "easeIn"
    }
  }
};

const actionItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -14,
    filter: "blur(2px)" 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 420, 
      damping: 26 
    } 
  }
};

export default function ActionContextMenu({
  isOpen,
  position, // { x, y }
  onClose,
  title,
  subtitle,
  icon: HeaderIcon,
  badge,
  badgeColor = "emerald",
  items = []
}) {
  const menuRef = useRef(null);
  const [adjustedPos, setAdjustedPos] = useState({ x: 0, y: 0 });
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark');
  const [appTheme, setAppTheme] = useState(() => document.documentElement.getAttribute('data-theme') || localStorage.getItem('app_theme') || 'agri');

  // React to theme changes
  useEffect(() => {
    const updateThemeState = () => {
      const currentDataTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('app_theme') || 'agri';
      const currentDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
      setAppTheme(currentDataTheme);
      setIsDarkMode(currentDark);
    };

    updateThemeState();

    const observer = new MutationObserver(() => updateThemeState());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    window.addEventListener('storage', updateThemeState);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', updateThemeState);
    };
  }, []);

  const themeStyles = useMemo(() => {
    switch (appTheme) {
      case 'luxury':
        return {
          container: isDarkMode
            ? 'bg-[#150f0c]/96 border-[#d4a574]/30 text-[#f5ede4] shadow-[0_25px_65px_rgba(20,12,7,0.85)] ring-1 ring-white/10'
            : 'bg-[#fdfbf7]/98 border-[#8b5a2b]/25 text-[#3e2723] shadow-[0_20px_55px_rgba(139,90,43,0.22)] ring-1 ring-black/5',
          headerBorder: isDarkMode ? 'border-white/10' : 'border-[#8b5a2b]/15',
          titleColor: isDarkMode ? 'text-[#e8cbb0]' : 'text-[#6b4226]',
          hoverRow: isDarkMode ? 'hover:bg-white/8 text-[#f5ede4]/85 hover:text-white' : 'hover:bg-[#8b5a2b]/10 text-[#5d4037] hover:text-[#3e2723]',
          divider: isDarkMode ? 'border-white/10' : 'border-[#8b5a2b]/15',
          iconColor: isDarkMode ? 'text-[#d4a574]' : 'text-[#8b5a2b]',
        };
      case 'tet':
        return {
          container: isDarkMode
            ? 'bg-[#1c0808]/96 border-rose-500/35 text-rose-50 shadow-[0_25px_65px_rgba(30,5,5,0.85)] ring-1 ring-white/10'
            : 'bg-[#fff8f8]/98 border-rose-400/30 text-[#881337] shadow-[0_20px_55px_rgba(244,63,94,0.22)] ring-1 ring-black/5',
          headerBorder: isDarkMode ? 'border-rose-500/20' : 'border-rose-200',
          titleColor: isDarkMode ? 'text-rose-300' : 'text-[#881337]',
          hoverRow: isDarkMode ? 'hover:bg-rose-500/15 text-rose-100/85 hover:text-white' : 'hover:bg-rose-100/70 text-rose-800 hover:text-rose-950',
          divider: isDarkMode ? 'border-rose-500/20' : 'border-rose-200',
          iconColor: isDarkMode ? 'text-rose-400' : 'text-rose-600',
        };
      case 'agri':
      default:
        return {
          container: isDarkMode
            ? 'bg-[#102214]/96 border-emerald-500/25 text-emerald-50 shadow-[0_25px_65px_rgba(5,20,10,0.85)] ring-1 ring-white/10'
            : 'bg-[#faf8f3]/98 border-[#8b6f47]/25 text-[#2d5016] shadow-[0_20px_55px_rgba(45,80,22,0.2)] ring-1 ring-black/5',
          headerBorder: isDarkMode ? 'border-emerald-500/15' : 'border-[#8b6f47]/15',
          titleColor: isDarkMode ? 'text-[#4ade80]' : 'text-[#2d5016]',
          hoverRow: isDarkMode ? 'hover:bg-emerald-500/12 text-emerald-100/85 hover:text-white' : 'hover:bg-[#8b6f47]/10 text-[#3f2f18] hover:text-[#2d5016]',
          divider: isDarkMode ? 'border-emerald-500/15' : 'border-[#8b6f47]/15',
          iconColor: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
        };
    }
  }, [appTheme, isDarkMode]);

  useEffect(() => {
    if (!isOpen || !position) return;

    const menuWidth = 250;
    const estimatedHeight = Math.min(items.length * 44 + 75, 460);
    
    let x = position.x;
    let y = position.y;

    if (x + menuWidth > window.innerWidth - 12) {
      x = Math.max(12, window.innerWidth - menuWidth - 12);
    }
    if (y + estimatedHeight > window.innerHeight - 12) {
      y = Math.max(12, window.innerHeight - estimatedHeight - 12);
    }

    setAdjustedPos({ x, y });
  }, [isOpen, position, items.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    const handleScroll = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick);
      window.addEventListener('contextmenu', handleGlobalClick);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('keydown', handleKeyDown);
    }, 10);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('contextmenu', handleGlobalClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] pointer-events-none">
        <m.div
          ref={menuRef}
          variants={actionContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            top: adjustedPos.y,
            left: adjustedPos.x,
          }}
          className={cn(
            "pointer-events-auto min-w-[240px] max-w-[320px] backdrop-blur-3xl border rounded-2xl p-1.5 z-[999999] select-none overflow-hidden",
            themeStyles.container
          )}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Header Info */}
          {(title || subtitle) && (
            <m.div 
              variants={actionItemVariants}
              className={cn("px-3 py-2 border-b mb-1 flex items-start gap-2.5", themeStyles.headerBorder)}
            >
              {HeaderIcon && (
                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <HeaderIcon size={15} strokeWidth={2.5} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn("font-black text-xs uppercase tracking-tight truncate block leading-tight", themeStyles.titleColor)}>
                    {title}
                  </span>
                  {badge && (
                    <span className={cn(
                      "text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md shrink-0 shadow-xs",
                      badgeColor === 'emerald' && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
                      badgeColor === 'amber' && "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30",
                      badgeColor === 'blue' && "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30",
                      badgeColor === 'purple' && "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                    )}>
                      {badge}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <span className="text-[10px] font-bold opacity-60 truncate block mt-0.5">
                    {subtitle}
                  </span>
                )}
              </div>
            </m.div>
          )}

          {/* Action List */}
          <div className="space-y-0.5 max-h-[350px] overflow-y-auto no-scrollbar">
            {items.map((item, idx) => {
              if (item.divider) {
                return (
                  <m.div 
                    variants={actionItemVariants}
                    key={`div-${idx}`} 
                    className={cn("my-1 border-t", themeStyles.divider)} 
                  />
                );
              }

              const ItemIcon = item.icon;
              const isCopied = copiedIndex === idx;

              return (
                <m.button
                  key={idx}
                  variants={actionItemVariants}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={item.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.copyText) {
                      navigator.clipboard.writeText(item.copyText);
                      setCopiedIndex(idx);
                      setTimeout(() => {
                        setCopiedIndex(null);
                        onClose?.();
                      }, 500);
                    } else {
                      item.onClick?.(e);
                      onClose?.();
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all duration-150 cursor-pointer outline-none group",
                    item.disabled && "opacity-40 cursor-not-allowed",
                    item.danger 
                      ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/20" 
                      : item.highlight
                        ? "text-primary dark:text-[#4ade80] hover:bg-emerald-500/10 font-black"
                        : themeStyles.hoverRow
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {ItemIcon && (
                      <ItemIcon 
                        size={15} 
                        strokeWidth={2.2}
                        className={cn(
                          "shrink-0 transition-transform duration-200 group-hover:scale-110",
                          item.danger 
                            ? "text-rose-500" 
                            : item.color === 'emerald'
                              ? "text-emerald-500 dark:text-emerald-400"
                              : item.color === 'amber'
                                ? "text-amber-500 dark:text-amber-400"
                                : item.color === 'blue'
                                  ? "text-blue-500 dark:text-blue-400"
                                  : themeStyles.iconColor
                        )} 
                      />
                    )}
                    <div className="min-w-0 flex flex-col">
                      <span className="truncate leading-tight font-black">
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="text-[10px] font-medium opacity-50 truncate mt-0.5">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {isCopied ? (
                    <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 shrink-0 animate-in fade-in duration-200">
                      <Check size={12} strokeWidth={3} /> Đã chép
                    </span>
                  ) : item.shortcut ? (
                    <kbd className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 shadow-xs bg-black/5 dark:bg-white/10 opacity-70">
                      {item.shortcut}
                    </kbd>
                  ) : null}
                </m.button>
              );
            })}
          </div>
        </m.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
