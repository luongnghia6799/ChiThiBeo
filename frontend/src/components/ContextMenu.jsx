import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight, 
    RotateCcw, 
    Moon, 
    Sun, 
    LogOut, 
    LayoutDashboard, 
    ShoppingCart, 
    History, 
    Maximize, 
    Minimize,
    Save, 
    PlusCircle,
    Warehouse,
    Sparkles,
    CheckCircle2,
    X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

// Staggered container and item variants for premium slide-in per line
const menuContainerVariants = {
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
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.032,
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

const menuItemVariants = {
    hidden: { 
        opacity: 0, 
        x: -16,
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

const ContextMenu = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark');
    const [appTheme, setAppTheme] = useState(() => document.documentElement.getAttribute('data-theme') || localStorage.getItem('app_theme') || 'agri');
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isPOS = location.pathname === '/pos';
    const isPurchase = location.pathname === '/purchase';
    const isDashboard = location.pathname === '/';
    const isHistory = location.pathname === '/history';

    // Theme listener & reactive observer
    useEffect(() => {
        const updateThemeState = () => {
            const currentDataTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('app_theme') || 'agri';
            const currentDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
            setAppTheme(currentDataTheme);
            setIsDarkMode(currentDark);
        };

        updateThemeState();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class') {
                    updateThemeState();
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        window.addEventListener('storage', updateThemeState);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', updateThemeState);
        };
    }, []);

    // Theme style mapping
    const themeStyles = useMemo(() => {
        switch (appTheme) {
            case 'luxury':
                return {
                    containerBg: isDarkMode 
                        ? 'bg-[#150f0c]/96 border-[#d4a574]/30 text-[#f5ede4] shadow-[0_25px_65px_rgba(20,12,7,0.85)] ring-1 ring-white/10' 
                        : 'bg-[#fdfbf7]/98 border-[#8b5a2b]/25 text-[#3e2723] shadow-[0_20px_55px_rgba(139,90,43,0.22)] ring-1 ring-black/5',
                    activePill: isDarkMode
                        ? 'bg-[#8b5a2b]/35 text-[#f5ede4] border border-[#d4a574]/40 shadow-md shadow-[#8b5a2b]/20 font-black'
                        : 'bg-[#8b5a2b]/15 text-[#6b4226] border border-[#8b5a2b]/25 shadow-xs font-black',
                    activeIcon: isDarkMode ? 'text-[#d4a574]' : 'text-[#8b5a2b]',
                    hoverItem: isDarkMode 
                        ? 'hover:bg-white/8 text-[#f5ede4]/80 hover:text-white' 
                        : 'hover:bg-[#8b5a2b]/10 text-[#5d4037] hover:text-[#3e2723]',
                    borderDivider: isDarkMode ? 'border-white/10' : 'border-[#8b5a2b]/15',
                    topNavBtn: isDarkMode ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-[#8b5a2b]/12 text-[#5d4037] hover:text-[#3e2723]',
                    shortcutBadge: isDarkMode ? 'bg-white/10 text-white/40 border border-white/5' : 'bg-[#8b5a2b]/10 text-[#8b5a2b] border border-[#8b5a2b]/20',
                    activeShortcutBadge: isDarkMode ? 'bg-white/20 text-[#d4a574] border border-[#d4a574]/30' : 'bg-[#8b5a2b]/20 text-[#6b4226] border border-[#8b5a2b]/30',
                    badgeText: isDarkMode ? 'text-[#d4a574]' : 'text-[#8b5a2b]',
                    pulseDot: 'bg-[#d4a574]',
                    footerBg: isDarkMode ? 'bg-white/5' : 'bg-[#8b5a2b]/8',
                    label: 'Luxury'
                };
            case 'tet':
                return {
                    containerBg: isDarkMode 
                        ? 'bg-[#1c0808]/96 border-rose-500/35 text-rose-50 shadow-[0_25px_65px_rgba(30,5,5,0.85)] ring-1 ring-white/10' 
                        : 'bg-[#fff8f8]/98 border-rose-400/30 text-[#881337] shadow-[0_20px_55px_rgba(244,63,94,0.22)] ring-1 ring-black/5',
                    activePill: isDarkMode
                        ? 'bg-rose-500/30 text-rose-100 border border-rose-500/45 shadow-md shadow-rose-950/40 font-black'
                        : 'bg-rose-500/15 text-rose-800 border border-rose-500/30 shadow-xs font-black',
                    activeIcon: isDarkMode ? 'text-rose-400' : 'text-rose-600',
                    hoverItem: isDarkMode 
                        ? 'hover:bg-rose-500/15 text-rose-100/80 hover:text-white' 
                        : 'hover:bg-rose-100/70 text-rose-800 hover:text-rose-950',
                    borderDivider: isDarkMode ? 'border-rose-500/20' : 'border-rose-200',
                    topNavBtn: isDarkMode ? 'hover:bg-rose-500/20 text-rose-200/80 hover:text-white' : 'hover:bg-rose-100 text-rose-700 hover:text-rose-900',
                    shortcutBadge: isDarkMode ? 'bg-rose-500/20 text-rose-300/60 border border-rose-500/10' : 'bg-rose-100 text-rose-700 border border-rose-300/40',
                    activeShortcutBadge: isDarkMode ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40' : 'bg-rose-200 text-rose-800 border border-rose-400/40',
                    badgeText: 'text-rose-400',
                    pulseDot: 'bg-rose-500',
                    footerBg: isDarkMode ? 'bg-rose-950/40' : 'bg-rose-100/60',
                    label: 'Tết Vàng'
                };
            case 'agri':
            default:
                return {
                    containerBg: isDarkMode 
                        ? 'bg-[#102214]/96 border-emerald-500/25 text-emerald-50 shadow-[0_25px_65px_rgba(5,20,10,0.85)] ring-1 ring-white/10' 
                        : 'bg-[#faf8f3]/98 border-[#8b6f47]/25 text-[#2d5016] shadow-[0_20px_55px_rgba(45,80,22,0.2)] ring-1 ring-black/5',
                    activePill: isDarkMode
                        ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 shadow-md shadow-emerald-950/40 font-black'
                        : 'bg-emerald-700/12 text-emerald-800 border border-emerald-600/25 shadow-xs font-black',
                    activeIcon: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
                    hoverItem: isDarkMode 
                        ? 'hover:bg-emerald-500/12 text-emerald-100/80 hover:text-white' 
                        : 'hover:bg-[#8b6f47]/10 text-[#3f2f18] hover:text-[#2d5016]',
                    borderDivider: isDarkMode ? 'border-emerald-500/15' : 'border-[#8b6f47]/15',
                    topNavBtn: isDarkMode ? 'hover:bg-emerald-500/15 text-emerald-200/80 hover:text-white' : 'hover:bg-[#8b6f47]/12 text-[#2d5016] hover:text-emerald-900',
                    shortcutBadge: isDarkMode ? 'bg-white/10 text-white/40 border border-white/5' : 'bg-[#8b6f47]/10 text-[#8b6f47] border border-[#8b6f47]/20',
                    activeShortcutBadge: isDarkMode ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-700/20 text-emerald-800 border border-emerald-600/30',
                    badgeText: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
                    pulseDot: isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600',
                    footerBg: isDarkMode ? 'bg-white/5' : 'bg-[#8b6f47]/8',
                    label: 'Agri Green'
                };
        }
    }, [appTheme, isDarkMode]);

    const handleContextMenu = useCallback((e) => {
        // If holding Shift key, allow native browser context menu (Inspect Element)
        if (e.shiftKey) {
            return;
        }

        // Only show custom menu if not clicking on restricted areas (like inputs or scrollbars)
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        e.preventDefault();
        
        // Calculate position to prevent overflow
        let x = e.clientX;
        let y = e.clientY;
        const menuWidth = 250;
        const menuHeight = isPOS ? 440 : 380;

        if (x + menuWidth > window.innerWidth - 12) {
            x = Math.max(12, window.innerWidth - menuWidth - 12);
        }
        if (y + menuHeight > window.innerHeight - 12) {
            y = Math.max(12, window.innerHeight - menuHeight - 12);
        }

        setPosition({ x, y });
        setIsVisible(true);
    }, [isPOS]);

    const handleClick = useCallback(() => {
        setIsVisible(false);
    }, []);

    useEffect(() => {
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleClick, true);
        
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                if (window.__TAURI__) {
                    window.__TAURI__.core.invoke('open_devtools').catch(console.error);
                }
            }
            if (e.key === 'Escape') {
                setIsVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const handleFullscreenChange = () => {
            if (window.__TAURI__) {
                try {
                    window.__TAURI__.window.getCurrentWindow().isFullscreen()
                        .then(setIsFullscreen)
                        .catch(() => setIsFullscreen(prev => !prev));
                } catch (e) {
                    setIsFullscreen(prev => !prev);
                }
            } else {
                setIsFullscreen(!!document.fullscreenElement);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('tauri-fullscreenchange', handleFullscreenChange);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleClick, true);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('tauri-fullscreenchange', handleFullscreenChange);
        };
    }, [handleContextMenu, handleClick]);

    const handleAction = (action) => {
        setIsVisible(false);
        switch (action) {
            case 'back': window.history.back(); break;
            case 'forward': window.history.forward(); break;
            case 'reload': window.location.reload(); break;
            case 'theme': 
                const nextDark = !document.documentElement.classList.contains('dark');
                document.documentElement.classList.toggle('dark', nextDark);
                setIsDarkMode(nextDark);
                localStorage.setItem('theme', nextDark ? 'dark' : 'light');
                break;
            case 'fullscreen':
                if (window.__TAURI__) {
                    window.__TAURI__.core.invoke('toggle_fullscreen')
                        .then(() => {
                            window.dispatchEvent(new CustomEvent('tauri-fullscreenchange'));
                        })
                        .catch(console.error);
                } else {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                }
                break;
            case 'devtools':
                if (window.__TAURI__) {
                    window.__TAURI__.core.invoke('open_devtools').catch(console.error);
                }
                break;
            case 'pos': navigate('/pos'); break;
            case 'dashboard': navigate('/'); break;
            case 'purchase': navigate('/purchase'); break;
            case 'history': navigate('/history'); break;
            case 'logout':
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                navigate('/welcome');
                break;
            default: break;
        }
    };

    if (!isVisible) return null;

    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <m.div
                    ref={menuRef}
                    variants={menuContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ 
                        position: 'fixed', 
                        top: position.y, 
                        left: position.x, 
                        zIndex: 999999 
                    }}
                    className={cn(
                        "w-[250px] backdrop-blur-3xl rounded-2xl border p-1.5 overflow-hidden select-none",
                        themeStyles.containerBg
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Navigation Group Header */}
                    <m.div 
                        variants={menuItemVariants}
                        className={cn(
                            "flex items-center justify-between px-2 py-1.5 mb-1 border-b rounded-t-xl",
                            themeStyles.borderDivider
                        )}
                    >
                        <div className="flex items-center gap-1">
                            <MenuIconButton 
                                icon={ArrowLeft} 
                                onClick={() => handleAction('back')} 
                                title="Quay lại" 
                                className={themeStyles.topNavBtn} 
                            />
                            <MenuIconButton 
                                icon={ArrowRight} 
                                onClick={() => handleAction('forward')} 
                                title="Đi tới" 
                                className={themeStyles.topNavBtn} 
                            />
                            <MenuIconButton 
                                icon={RotateCcw} 
                                onClick={() => handleAction('reload')} 
                                title="Tải lại trang" 
                                className={themeStyles.topNavBtn} 
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <div className={cn("w-px h-4 mx-0.5", themeStyles.borderDivider)} />
                            <MenuIconButton 
                                icon={isDarkMode ? Sun : Moon} 
                                onClick={() => handleAction('theme')} 
                                title={isDarkMode ? "Chuyển giao diện sáng" : "Chuyển giao diện tối"} 
                                className={cn(
                                    themeStyles.topNavBtn,
                                    isDarkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-700"
                                )}
                            />
                        </div>
                    </m.div>

                    {/* Section 1: Main Pages */}
                    <div className="space-y-0.5">
                        <MenuItem 
                            icon={LayoutDashboard} 
                            label="Tổng quan" 
                            shortcut="Ctrl+Q"
                            active={isDashboard}
                            themeStyles={themeStyles}
                            onClick={() => handleAction('dashboard')} 
                        />
                        <MenuItem 
                            icon={ShoppingCart} 
                            label="Bán hàng (POS)" 
                            shortcut="Ctrl+P"
                            active={isPOS}
                            themeStyles={themeStyles}
                            onClick={() => handleAction('pos')} 
                        />
                        <MenuItem 
                            icon={Warehouse} 
                            label="Nhập hàng" 
                            active={isPurchase}
                            themeStyles={themeStyles}
                            onClick={() => handleAction('purchase')} 
                        />
                        <MenuItem 
                            icon={History} 
                            label="Lịch sử đơn" 
                            active={isHistory}
                            themeStyles={themeStyles}
                            onClick={() => handleAction('history')} 
                        />
                    </div>

                    {/* Section 2: POS Shortcuts if on POS */}
                    {isPOS && (
                        <>
                            <m.div variants={menuItemVariants} className={cn("h-px my-1.5", themeStyles.borderDivider)} />
                            <div className="space-y-0.5">
                                <MenuItem 
                                    icon={Save} 
                                    label="Lưu hóa đơn" 
                                    shortcut="F12"
                                    themeStyles={themeStyles}
                                    onClick={() => {
                                        setIsVisible(false);
                                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F12' }));
                                    }} 
                                />
                                <MenuItem 
                                    icon={PlusCircle} 
                                    label="Tạo đơn mới" 
                                    shortcut="F4"
                                    themeStyles={themeStyles}
                                    onClick={() => {
                                        setIsVisible(false);
                                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F4' }));
                                    }} 
                                />
                            </div>
                        </>
                    )}

                    {/* Section 3: Utilities */}
                    <m.div variants={menuItemVariants} className={cn("h-px my-1.5", themeStyles.borderDivider)} />

                    <div className="space-y-0.5">
                        <MenuItem 
                            icon={isFullscreen ? Minimize : Maximize} 
                            label={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"} 
                            shortcut="F11" 
                            themeStyles={themeStyles}
                            onClick={() => handleAction('fullscreen')} 
                        />
                        <MenuItem 
                            icon={LogOut} 
                            label="Đăng xuất" 
                            danger
                            themeStyles={themeStyles}
                            onClick={() => handleAction('logout')} 
                        />
                    </div>

                    {/* Footer Branding with Theme Badge */}
                    <m.div 
                        variants={menuItemVariants}
                        className={cn(
                            "mt-2 px-3 py-2 rounded-xl flex items-center justify-between border",
                            themeStyles.footerBg,
                            themeStyles.borderDivider
                        )}
                    >
                        <div className="flex items-center gap-1.5">
                            <span className={cn("text-[9px] font-black tracking-[0.2em] uppercase opacity-60", themeStyles.badgeText)}>
                                LYANGPOS V4.0
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-bold uppercase tracking-wider opacity-40">
                                {themeStyles.label}
                            </span>
                            <div className="flex gap-1">
                                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", themeStyles.pulseDot)} />
                                <div className={cn("w-1.5 h-1.5 rounded-full opacity-40", themeStyles.pulseDot)} />
                            </div>
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

const MenuItem = ({ icon: Icon, label, shortcut, onClick, active, danger, themeStyles }) => (
    <m.button
        variants={menuItemVariants}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer outline-none relative group",
            active 
                ? themeStyles.activePill 
                : danger
                    ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/20"
                    : themeStyles.hoverItem
        )}
    >
        <div className="flex items-center gap-2.5 min-w-0">
            <Icon 
                size={16} 
                strokeWidth={active ? 2.5 : 2}
                className={cn(
                    "shrink-0 transition-transform duration-200 group-hover:scale-110",
                    active 
                        ? themeStyles.activeIcon 
                        : danger 
                            ? "text-rose-500" 
                            : "opacity-60 group-hover:opacity-100"
                )} 
            />
            <span className={cn("text-xs tracking-tight truncate", active ? "font-black" : "font-bold")}>
                {label}
            </span>
        </div>
        {shortcut && (
            <kbd className={cn(
                "text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 shadow-xs",
                active 
                    ? themeStyles.activeShortcutBadge 
                    : themeStyles.shortcutBadge
            )}>
                {shortcut}
            </kbd>
        )}
    </m.button>
);

const MenuIconButton = ({ icon: Icon, onClick, title, className }) => (
    <m.button
        whileHover={{ scale: 1.15, y: -1 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        title={title}
        className={cn(
            "p-1.5 rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer outline-none",
            className
        )}
    >
        <Icon size={15} strokeWidth={2.2} />
    </m.button>
);

export default ContextMenu;
