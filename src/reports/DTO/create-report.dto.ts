import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude  } from "class-validator";

export class CreateReportDTO {
    @IsString()
    make : string;

    @IsString()
    model : string;

    @IsNumber()
    @Min(1930)
    @Max(2023)
    year : number;

    @IsNumber()
    @Min(0)
    @Max(100000)
    miles : number;

    @IsLongitude()
    lng : number;

    @IsLatitude()
    lat : number;

    @IsNumber()
    @Min(0)
    @Max(500000)
    price : number;
}