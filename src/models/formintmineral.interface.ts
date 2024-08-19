export interface FormIntMineral{
  id: number;
  formIntId: number;     // Identificador de la muestra
  mineralId: number;    // Identificador del mineral
  ley?: number;          // Ley del mineral (generalmente un valor decimal)
  unidad?: string;       // Unidad de medida
}