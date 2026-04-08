export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

export interface QuantityMeasurement {
  id: number;
  thisValue: number;
  thisUnit: string;
  thisMeasurementType: string;
  thatValue: number;
  thatUnit: string;
  thatMeasurementType: string;
  operation: string;
  resultValue: number;
  resultUnit: string;
}