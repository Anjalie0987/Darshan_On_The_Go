import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, UserCog } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'Add Temple',
      icon: Plus,
      href: '/admin/temples/new',
      description: 'Register a new temple to the platform',
      variant: 'default' as const,
    },
    {
      title: 'Manage Temples',
      icon: ListTodo,
      href: '/admin/temples',
      description: 'View, edit, or remove existing temples',
      variant: 'outline' as const,
    },
    {
      title: 'Profile Settings',
      icon: UserCog,
      href: '/admin/profile',
      description: 'Update your admin account details',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className="block">
            <Button
              variant={action.variant}
              className="w-full h-full min-h-[120px] py-4 px-4 flex flex-col items-center gap-3 justify-center text-center group whitespace-normal"
            >
              <action.icon className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform shrink-0" />
              <div className="space-y-1">
                <div className="font-semibold">{action.title}</div>
                <div className="text-xs opacity-80 font-normal hidden sm:block">
                  {action.description}
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
