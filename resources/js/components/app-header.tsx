import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import { BookOpen, Folder, LayoutGrid, Menu, Search, GraduationCap, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const rightNavItems: NavItem[] = [];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { url } = page;
    const getInitials = useInitials();
    const t = (str: string) => str;

    const sidebarData = auth.sidebar || [];
    const match = url.match(/^\/(cms|lecturer|mahasiswa|dosen|kaprodi|admin)/);
    const prefix = match ? match[0] : '';

    // Parse DB menus to NavItems
    const dynamicNavItems: NavItem[] = sidebarData.map((menu: any) => {
        const DynamicIcon = (LucideIcons[menu.icon as keyof typeof LucideIcons] as LucideIcon) || LayoutGrid;
        return {
            title: t(menu.name),
            url: menu.url === 'dashboard' ? route('dashboard') : `${prefix}/${menu.url}`,
            icon: DynamicIcon,
            items: menu.sub_menus && menu.sub_menus.length > 0
                ? menu.sub_menus.map((sub: any) => ({
                    title: t(sub.name),
                    url: `${prefix}/${sub.url}`,
                    icon: sub.icon ? (LucideIcons[sub.icon as keyof typeof LucideIcons] as LucideIcon) : undefined,
                }))
                : undefined,
        };
    });

    const allNavItems = [
        { title: 'Dashboard', url: route('dashboard'), icon: LayoutGrid },
        ...dynamicNavItems,
    ];

    const activeItemStyles = 'bg-emerald-900/50 text-white font-semibold';
    const triggerStyles = 'h-9 px-3 text-emerald-100 hover:text-white hover:bg-emerald-700/50 bg-transparent focus:bg-emerald-700/50 data-[state=open]:bg-emerald-700/50 data-[active]:bg-emerald-900/50';

    return (
        <>
            <div className="bg-emerald-800 shadow-lg border-b border-emerald-900/50 sticky top-0 z-50">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px] text-emerald-100 hover:bg-emerald-700 hover:text-white">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left items-center flex-row gap-2">
                                    <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-bold text-lg text-emerald-900 dark:text-emerald-400">Sistem Skripsi</span>
                                </SheetHeader>
                                <div className="mt-6 flex h-full flex-1 flex-col space-y-4 overflow-y-auto">
                                    <div className="flex flex-col space-y-2 text-sm">
                                        {allNavItems.map((item) => (
                                            <div key={item.title}>
                                                {item.items ? (
                                                    <div className="flex flex-col space-y-1">
                                                        <span className="flex items-center space-x-2 font-semibold px-2 py-1.5 text-sidebar-foreground/70 uppercase text-xs tracking-wider">
                                                            {item.icon && <Icon iconNode={item.icon} className="h-4 w-4" />}
                                                            <span>{item.title}</span>
                                                        </span>
                                                        <div className="flex flex-col space-y-1 pl-4 border-l border-sidebar-border ml-4">
                                                            {item.items.map((sub) => (
                                                                <Link key={sub.title} href={sub.url} className={cn("flex items-center space-x-2 font-medium px-2 py-1.5 rounded-md hover:bg-sidebar-accent", page.url.startsWith(sub.url) && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                                                                    {sub.icon && <Icon iconNode={sub.icon} className="h-4 w-4" />}
                                                                    <span>{sub.title}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link href={item.url} className={cn("flex items-center space-x-2 font-medium px-2 py-2 rounded-md hover:bg-sidebar-accent", page.url === item.url && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={route('dashboard')} prefetch className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors shrink-0 mr-6">
                        <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white hidden sm:inline tracking-tight">Sistem Skripsi</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden h-full items-center space-x-2 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-1">
                                {allNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        {item.items ? (
                                            <>
                                                <NavigationMenuTrigger className={cn(triggerStyles, page.url.startsWith(item.url) && activeItemStyles)}>
                                                    {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                    {item.title}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[240px] gap-1 p-2 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-800">
                                                        {item.items.map((subItem) => (
                                                            <li key={subItem.title}>
                                                                <NavigationMenuLink asChild>
                                                                    <Link
                                                                        href={subItem.url}
                                                                        className={cn(
                                                                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 flex items-center gap-2",
                                                                            page.url === subItem.url && "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100 font-medium"
                                                                        )}
                                                                    >
                                                                        {subItem.icon && <Icon iconNode={subItem.icon} className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                                                                        <div className="text-sm">{subItem.title}</div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    triggerStyles,
                                                    page.url === item.url && activeItemStyles
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 rounded-full pl-2 pr-4 bg-emerald-900/50 hover:bg-emerald-700 border border-emerald-700/50 text-white gap-2 transition-all">
                                    <Avatar className="size-7 overflow-hidden rounded-full border border-emerald-600">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-emerald-700 text-white text-xs">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start text-left hidden sm:flex">
                                        <span className="text-xs font-bold leading-none">{auth.user.name}</span>
                                        <span className="text-[10px] text-emerald-300 leading-none mt-1">{auth.user.email}</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-b bg-white dark:bg-neutral-950 dark:border-neutral-800">
                    <div className="mx-auto flex h-10 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
