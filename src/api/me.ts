import request from "@/utils/request";
import type { IAddressForm, IShoppingAddress } from "@/types/me";
export function getMobileAddressRequest() {
  return request<IShoppingAddress[]>({
    url: `mall/mobile/address/get`,
    method: "GET",
    headers: {
      platform: "H5",
    },
  });
}

export function getMobileAddressByIdRequest(id: string) {
  return request({
    url: `mall/mobile/address/${id}`,
    method: "GET",
    headers: {
      platform: "H5",
    },
  });
}

export function updateMobileAddressRequest(data: IAddressForm) {
  return request({
    url: `mall/mobile/address/update`,
    method: "PUT",
    data,
    headers: {
      platform: "H5",
    },
  });
}

export function addMobileAddressRequest(data: IAddressForm) {
  return request({
    url: `mall/mobile/address/add`,
    method: "POST",
    data,
    headers: {
      platform: "H5",
    },
  });
}
