export interface UserDetails {
  birthDate: string;
  phoneNumber: string;
  address: {
    city: string;
    street: string;
    buildingNumber: string;
    apartmentNumber?: string;
    zipCode: string;
  }
}
