export type IncotermRule = 'FOB' | 'CFR' | 'CIF' | 'CPT' | 'FCA';
export type RfqStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTED' | 'ACCEPTED' | 'REJECTED';

export interface CreateRfqDto {
  buyerCompanyId: string;
  productId: string;
  quantityMetricTons: number;
  targetPricePerTonUsd?: number;
  incoterm: IncotermRule;
  destinationPortOrCity: string;
  notes?: string;
}

export interface RfqRecord extends CreateRfqDto {
  id: string;
  status: RfqStatus;
  createdAt: string;
  updatedAt: string;
}
