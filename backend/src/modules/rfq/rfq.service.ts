import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRfqDto, RfqRecord, RfqStatus } from './rfq.interface';

@Injectable()
export class RfqService {
  private rfqs: RfqRecord[] = [
    {
      id: 'rfq-2026-001',
      buyerCompanyId: 'comp-rus-01',
      productId: 'prod-dates-001',
      quantityMetricTons: 20,
      targetPricePerTonUsd: 1350,
      incoterm: 'CFR',
      destinationPortOrCity: 'Astrakhan Port',
      notes: 'Requires cold-chain transport certificate and phytosanitary seal.',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  create(dto: CreateRfqDto): RfqRecord {
    const newRecord: RfqRecord = {
      id: `rfq-${Date.now()}`,
      ...dto,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rfqs.push(newRecord);
    return newRecord;
  }

  findAll(): RfqRecord[] {
    return this.rfqs;
  }

  findById(id: string): RfqRecord {
    const found = this.rfqs.find((r) => r.id === id);
    if (!found) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }
    return found;
  }

  updateStatus(id: string, status: RfqStatus): RfqRecord {
    const record = this.findById(id);
    record.status = status;
    record.updatedAt = new Date().toISOString();
    return record;
  }
}
