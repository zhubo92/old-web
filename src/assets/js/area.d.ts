interface Area {
  [code: string]: string;
}

declare const area: {
  province_list: Area;
  city_list: Area;
  county_list: Area;
};

export default area;
