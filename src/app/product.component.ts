import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from './product';
import { ProductService } from './product.service';

 
 
@Component({
  templateUrl: "product.component.html",
})
export class ProductComponent
{
 
   products:Product[];
   ProductLoginData: any = '';
   userNameS:string = "sysdice";
   constructor(private authService:AuthService,private productService: ProductService){
    this.authService.SharingData.subscribe((res: any) => {  
      this.ProductLoginData = res;  
    }) 

    this.authService.userNameS.subscribe(uname => {  
      this.userNameS = uname;  
    }) 

   }
 
   ngOnInit() {
    
 
      this.productService.getProducts()
        .subscribe(data => {
          this.products=data;
          this.authService.SharingData.subscribe((res: any) => {  
            this.ProductLoginData = res;  
          })
        })
   }
  
}
 