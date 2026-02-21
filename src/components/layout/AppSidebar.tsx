import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCircle, FileText, Video, Settings, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', emoji: '🏠' },
  { label: 'Criar Avatar', icon: UserCircle, path: '/avatar', emoji: '🎨' },
  { label: 'Roteiros UGC', icon: FileText, path: '/roteiros', emoji: '📝' },
  { label: 'Produção de Vídeo', icon: Video, path: '/video', disabled: true, emoji: '🎬' },
  { label: 'Configurações', icon: Settings, path: '/configuracoes', emoji: '⚙️' },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <span className="text-xl shrink-0 group-data-[collapsible=icon]:text-lg">✨</span>
          <span className="font-bold font-display text-sidebar-foreground truncate group-data-[collapsible=icon]:hidden">
            Avatar Creator
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => !item.disabled && navigate(item.path)}
                      className={item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                      {item.disabled && (
                        <span className="ml-auto text-[10px] text-muted-foreground">🔜</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
