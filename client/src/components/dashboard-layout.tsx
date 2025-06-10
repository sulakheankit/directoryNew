import { Users, BarChart3, Vote, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigationItems = [
    { name: 'Contact Directory', icon: Users, href: '#', current: true },
    { name: 'Analytics', icon: BarChart3, href: '#', current: false },
    { name: 'Surveys', icon: Vote, href: '#', current: false },
    { name: 'Settings', icon: Settings, href: '#', current: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Experience Manager</h1>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      item.current
                        ? 'bg-blue-50 text-primary border-r-2 border-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <Icon
                      className={cn(
                        item.current ? 'text-primary' : 'text-gray-400',
                        'mr-3 h-4 w-4'
                      )}
                    />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}
