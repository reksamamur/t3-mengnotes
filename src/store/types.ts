interface DataPrice {
  currency?: string;
  float?: number | undefined;
  formatted?: string | undefined;
  value?: string | undefined;
}

type Member = {
  index: number;
  name: string;
  email: string;
  manual_edit: boolean;
  currency?: string;
  price: DataPrice;
};

export type { Member, DataPrice };
