import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";

@Component({
    selector: 'app-inventory',
    imports: [RouterLink, MatDividerModule],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  items : string[] = ['Item 1', 'Item 2', 'Item 3','Item 4', 'Item 5', 'Item 6','Item 7', 'Item 8', 'Item 9','Item 10', 'Item 11', 'Item 12'];
}
