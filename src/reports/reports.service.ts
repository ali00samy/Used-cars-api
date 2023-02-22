import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './DTO/create-report.dto';
import { Report } from './reports.entity';
import { GetEstimateDto } from './DTO/estimated-report.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo : Repository<Report>
    ) {}

    create(reportDto : CreateReportDTO, user : User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }

    async changeApproval(id : string, approved : boolean) {
        const report = await this.repo.findOne({where : {id : parseInt(id)}})
        if (!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }

    async createEstimate({make , lat , lng , model, year,miles} : GetEstimateDto) {
        return this.repo.createQueryBuilder()
                .select('AVG(price)', 'price')
                .where('make = :make', { make })
                .andWhere('model = :model', { model })
                .andWhere('lng - :lng BETWEEN -5 AND 5 ', {lng} )
                .andWhere('lat - :lat BETWEEN -5 AND 5 ', {lat} )
                .andWhere('approved IS TRUE')
                .andWhere('year - :year BETWEEN -3 AND 3 ', {year} )
                .orderBy('ABS(miles - :miles)', 'DESC')
                .setParameters({miles})
                .limit(3)
                .getRawOne()
    }
}
