import { MoreHorizontal, Eye, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TempleAdmin } from '../types';

interface TempleActionsProps {
  temple: TempleAdmin;
  onView: (temple: TempleAdmin) => void;
  onEdit: (temple: TempleAdmin) => void;
  onToggleActive: (temple: TempleAdmin) => void;
  onDelete: (temple: TempleAdmin) => void;
}

export function TempleActions({ temple, onView, onEdit, onToggleActive, onDelete }: TempleActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      } />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onView(temple)}>
            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onEdit(temple)}>
            <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
            Edit Temple
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onToggleActive(temple)}>
            {temple.isActive ? (
              <>
                <PowerOff className="mr-2 h-4 w-4 text-destructive" />
                <span className="text-destructive">Deactivate</span>
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4 text-green-600" />
                <span className="text-green-600">Activate</span>
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onDelete(temple)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Temple
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
