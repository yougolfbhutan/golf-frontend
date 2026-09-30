interface urlsAttributes {
  url: string;
}

interface categoryAttributes {
  name: string;
}

interface itemAttributes {
  name: string;
  description: string;
  category: categoryAttributes;
}

interface SouvenirsAttributes {
  id: number;
  itemId: number;
  sku: string;
  color: string;
  size: string;
  packQuantity: number;
  price: string;
  stockQty: number;
  availability: boolean;
  item: itemAttributes;
  urls: urlsAttributes[];
}

interface SouvenirsData {
  Souvenirs: SouvenirsAttributes[];
}
export interface ExtractItemDataResponse {
  status: number;
  message: string;
  data: SouvenirsData;
}
