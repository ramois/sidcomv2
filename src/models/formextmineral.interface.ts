import { Decimal } from '@prisma/client/runtime/library';
export interface FormExtMineral{
  formExtId: number;     // Identificador de la muestra
  mineralId: number;    // Identificador del mineral
  ley?: Decimal;          // Ley del mineral (generalmente un valor decimal)
  unidad?: string;       // Unidad de medida
}