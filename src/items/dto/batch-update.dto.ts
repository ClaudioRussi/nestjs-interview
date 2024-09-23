import { IsArray, IsInt, Min } from "class-validator";

export class BatchUpdateDto {
  @IsArray()
  @IsInt({each: true})
  ids: number[];
}