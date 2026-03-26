import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';

addIcons({ 'arrow-up': arrowUpOutline, 'arrow-down': arrowDownOutline });

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'status';
  width?: string;
  cellTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T = any> {
  @Input() columns: DataTableColumn[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No data found';
  @Input() sortKey = '';
  @Input() sortDir: 'asc' | 'desc' = 'asc';
  @Input() rowLinkFn: ((row: T) => string) | null = null;
  @Input() page = 1;
  @Input() pages = 1;
  @Input() total = 0;
  @Input() pageSize = 20;
  @Input() showPagination = true;
  @Input() striped = true;

  @Output() sortChange = new EventEmitter<{ key: string; dir: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<T>();

  sort(col: DataTableColumn) {
    if (!col.sortable) return;
    const dir =
      this.sortKey === col.key && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key: col.key, dir });
  }

  getValue(row: T, key: string): any {
    const keys = key.split('.');
    let val: any = row;
    for (const k of keys) val = val?.[k];
    return val;
  }

  formatValue(val: any, col: DataTableColumn): string {
    if (val == null) return '—';
    if (col.type === 'date')
      return new Date(val).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    if (col.type === 'number' && typeof val === 'number')
      return new Intl.NumberFormat('en-IN').format(val);
    return String(val);
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.pages) this.pageChange.emit(p);
  }
}
