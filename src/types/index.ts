export interface UserCredentials {
  username: string;
  password: string;
}

export interface Product {
  name: string;
  price?: string;
}

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

export interface OrderDetails {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}
