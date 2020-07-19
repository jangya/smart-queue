import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByLoginUser'
})
export class OrderByLoginUser implements PipeTransform {

  transform(items: any[], userId: string): unknown {
    if (!items || !userId) {
        return items;
    }
    let item_order = [userId];

    return items.sort((a, b) => {
      if(item_order.indexOf(a.treatedBy) > item_order.indexOf(b.treatedBy)) {
          return -1;
      } 
      if(item_order.indexOf(a.treatedBy) < item_order.indexOf(b.treatedBy)) {
          return 1;
      }
    });
  }
}
