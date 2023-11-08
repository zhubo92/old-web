export interface IShoppingAddress {
  id: string;
  name: string;
  phone: string;
  detail: string;
  openId: null | string;
  unionId: null | string;
  userId: string;
  province: string;
  city: string;
  county: string;
  address: string;
  nickName: null | string;
  areaCode: string;
  tag: null;
  default: boolean;
}

export function defaultShoppingAddress(): IShoppingAddress {
  return {
    id: "",
    name: "",
    phone: "",
    detail: "",
    openId: null,
    unionId: null,
    userId: "",
    province: "",
    city: "",
    county: "",
    address: "",
    nickName: null,
    areaCode: "",
    tag: null,
    default: false,
  };
}

export interface IAddressForm {
  name: string;
  phone: string;
  province: string;
  city: string;
  county: string;
  areaCode: string;
  detail: string;
  default: boolean;
  id: null;
}
