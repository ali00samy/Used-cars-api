import { Expose, Transform } from "class-transformer";
import { User } from "src/users/users.entity";

export class ReportDTO {
    @Expose()
    id : number;
    @Expose()
    price : number;
    @Expose()
    approved : boolean;
    @Expose()
    year : number;
    @Expose()
    lat : number;
    @Expose()
    lng : number;
    @Expose()
    make : string;
    @Expose()
    model : string;
    @Expose()
    miles : number;

    @Transform(({ obj })=> obj.user.id)
    @Expose()
    userId : number
}