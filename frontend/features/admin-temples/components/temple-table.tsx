import { TempleAdmin } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TempleActions } from './temple-actions';

interface TempleTableProps {
  temples: TempleAdmin[];
  onView: (temple: TempleAdmin) => void;
  onEdit: (temple: TempleAdmin) => void;
  onToggleActive: (temple: TempleAdmin) => void;
  onDelete: (temple: TempleAdmin) => void;
}

export function TempleTable({ temples, onView, onEdit, onToggleActive, onDelete }: TempleTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Temple Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Date Added</TableHead>
            <TableHead>Live Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {temples.map((temple) => (
            <TableRow key={temple.id}>
              <TableCell className="font-medium">
                {temple.name}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{temple.city}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{temple.state}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className="font-normal text-xs">{temple.category}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {new Date(temple.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {temple.isLive ? (
                  <Badge className="bg-red-500 hover:bg-red-600 border-none text-white animate-pulse">Live</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">Offline</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={temple.isActive ? "default" : "destructive"} 
                  className={temple.isActive ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                >
                  {temple.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <TempleActions 
                  temple={temple} 
                  onView={onView}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
