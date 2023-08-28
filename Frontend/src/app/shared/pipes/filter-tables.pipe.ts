import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTables'
})
export class FilterTablesPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      
      return Object.keys(item).some(key => {
        return item[key].toString().toLowerCase().includes(searchText);
      });
    });
  }

}