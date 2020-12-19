import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './products';
import * as XLSX from 'xlsx';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hatley-admin';
  opened: boolean= true;

  productDialog: boolean;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  submitted: boolean;
  statuses: any[];
  cols: any[];
  exportColumns: any[];
  data: any;
  data2: any;
  items: MenuItem[];

    constructor(private productService: ProductService) {
      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: '#9CCC65',
                borderColor: '#7CB342',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }

    this.data2 = {
      labels: ['A','B','C'],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]
      }

  }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.statuses = [
            {label: 'INSTOCK', value: 'instock'},
            {label: 'LOWSTOCK', value: 'lowstock'},
            {label: 'OUTOFSTOCK', value: 'outofstock'}
        ];

        // export data from table
        this.productService.getProductsSmall().then(data => this.products = data);
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

        this.items = [
          {
          label: 'Products',
          icon:'pi pi-fw pi-file',
          items: [
              {
                  label: 'New',
                  icon:'pi pi-fw pi-plus',
                  items: [
                      {
                      label: 'Bookmark',
                      icon:'pi pi-fw pi-bookmark'
                      },
                      {
                      label: 'Video',
                      icon:'pi pi-fw pi-video'
                      }
                  ]
              },
              {
                  label: 'Delete',
                  icon:'pi pi-fw pi-trash'
              },
              {
                  label: 'Export',
                  icon:'pi pi-fw pi-external-link'
              }
          ]
          },
          {
          label: 'Edit',
          icon:'pi pi-fw pi-pencil',
          items: [
              {
                  label: 'Left',
                  icon:'pi pi-fw pi-align-left'
              },
              {
                  label: 'Right',
                  icon:'pi pi-fw pi-align-right'
              },
              {
                  label: 'Center',
                  icon:'pi pi-fw pi-align-center'
              },
              {
                  label: 'Justify',
                  icon:'pi pi-fw pi-align-justify'
              }
          ]
          },
          {
          label: 'Users',
          icon:'pi pi-fw pi-user',
          items: [
              {
                  label: 'New',
                  icon:'pi pi-fw pi-user-plus',

              },
              {
                  label: 'Delete',
                  icon:'pi pi-fw pi-user-minus',
              },
              {
                  label: 'Search',
                  icon:'pi pi-fw pi-users',
                  items: [
                      {
                      label: 'Filter',
                      icon:'pi pi-fw pi-filter',
                      items: [
                          {
                              label: 'Print',
                              icon:'pi pi-fw pi-print'
                          }
                      ]
                      },
                      {
                      icon:'pi pi-fw pi-bars',
                      label: 'List'
                      }
                  ]
              }
          ]
          },
          {
          label: 'Events',
          icon:'pi pi-fw pi-calendar',
          items: [
              {
                  label: 'Edit',
                  icon:'pi pi-fw pi-pencil',
                  items: [
                      {
                      label: 'Save',
                      icon:'pi pi-fw pi-calendar-plus'
                      },
                      {
                      label: 'Delete',
                      icon:'pi pi-fw pi-calendar-minus'
                      }
                  ]
              },
              {
                  label: 'Archieve',
                  icon:'pi pi-fw pi-calendar-times',
                  items: [
                      {
                      label: 'Remove',
                      icon:'pi pi-fw pi-calendar-minus'
                      }
                  ]
              }
          ]
          }
      ]
    }


  //   exportPdf() {
  //     import("jspdf").then(jsPDF => {
  //         import("jspdf-autotable").then(x => {
  //             const doc = new jsPDF.default(0,0);
  //             doc.autoTable(this.exportColumns, this.products);
  //             doc.save('products.pdf');
  //         })
  //     })
  // }

  exportExcel() {
    const newLocal = "xlsx";
      import(newLocal).then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.products);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "products");
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      import("file-saver").then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    // deleteSelectedProducts() {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure you want to delete the selected products?',
    //         header: 'Confirm',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             this.products = this.products.filter(val => !this.selectedProducts.includes(val));
    //             this.selectedProducts = null;
    //             this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
    //         }
    //     });
    // }

    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }

    // deleteProduct(product: Product) {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure you want to delete ' + product.name + '?',
    //         header: 'Confirm',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             this.products = this.products.filter(val => val.id !== product.id);
    //             this.product = {};
    //             this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
    //         }
    //     });
    // }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            }
            else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
