import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { IType } from '../shared/models/type';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchTerm: ElementRef;
  products: IProduct[];
  types: IType[];
  brands: IBrand[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(): void {
    this.shopService.getProducts(this.shopParams).subscribe(
      (response) => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getBrands(): void {
    this.shopService.getBrands().subscribe(
      (response) => {
        this.brands = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getTypes(): void {
    this.shopService.getTypes().subscribe(
      (response) => {
        this.types = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // tslint:disable-next-line: typedef
  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }
  // tslint:disable-next-line: typedef
  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }
  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProducts();
  }
  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    this.shopParams.pageNumber = event;
    this.getProducts();
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
