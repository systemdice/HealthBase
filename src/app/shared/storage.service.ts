import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class StorageService {
  Id: string = "Id";
  Username: string = "Username";
  Role:string="Role";
  Location:string="Location"
  ProductType:string="NA"
  get sessionId(): any {
    return sessionStorage[this.Id] ? sessionStorage[this.Id] : undefined;
  }
  
  get sessionUsername(): any {
    return sessionStorage[this.Username]
      ? sessionStorage[this.Username]
      : undefined;
  }
  get sessionRole(): any {
    return sessionStorage[this.Role]
      ? sessionStorage[this.Role]
      : undefined;
  }
  get sessionLocation(): any {
    return sessionStorage[this.Location]
      ? sessionStorage[this.Location]
      : undefined;
  }
  get sessionProductType(): any {
    return sessionStorage[this.ProductType]
      ? sessionStorage[this.ProductType]
      : undefined;
  }
  set sessionId(value: any) {
    sessionStorage[this.Id] = value;
  }
  set sessionUsername(value: any) {
    sessionStorage[this.Username] = value;
  }
  set sessionRole(value: any) {
    sessionStorage[this.Role] = value;
  }
  set sessionLocation(value: any) {
    sessionStorage[this.Location] = value;
  }
  set sessionProductType(value: any) {
    sessionStorage[this.ProductType] = value;
  }

  deleteSession(): void {
    sessionStorage.removeItem(this.Id);
    sessionStorage.removeItem(this.Username);
    sessionStorage.removeItem(this.Role);
    sessionStorage.removeItem(this.Location);
    sessionStorage.removeItem(this.ProductType);
  }

  get localId(): any {
    return localStorage[this.Id] ? localStorage[this.Id] : undefined;
  }
  get localUsername(): any {
    return localStorage[this.Username]
      ? localStorage[this.Username]
      : undefined;
  }
  get localRole(): any {
    return localStorage[this.Role]
      ? localStorage[this.Role]
      : undefined;
  }
  get localLocation(): any {
    return localStorage[this.Location]
      ? localStorage[this.Location]
      : undefined;
  }
  set localId(value: any) {
    localStorage[this.Id] = value;
  }
  set localUsername(value: any) {
    localStorage[this.Username] = value;
  }
  set localRole(value: any) {
    localStorage[this.Role] = value;
  }
  set localLocation(value: any) {
    localStorage[this.Location] = value;
  }
  set localProductType(value: any) {
    localStorage[this.ProductType] = value;
  }

  deleteLocal(): void {
    localStorage.removeItem(this.Id);
    localStorage.removeItem(this.Username);
    localStorage.removeItem(this.Role);
    localStorage.removeItem(this.Location);
    localStorage.removeItem(this.ProductType);
  }
}
