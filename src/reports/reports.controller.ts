import { Controller, Post, Body, UseGuards, Param, Patch, Get, Query } from '@nestjs/common';
import { CreateReportDTO } from './DTO/create-report.dto';
import { ReportsService } from '../reports/reports.service'
import { AuthGuard } from 'src/guards/auth-guards';
import { CurrentUser } from 'src/users/decorators/current-user-decorator';
import { User } from 'src/users/users.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDTO } from './DTO/report.dto';
import { ApprovedReportDto } from './DTO/approved-report.dto';
import { AdminGuard } from 'src/guards/admin-guards';
import { GetEstimateDto } from './DTO/estimated-report.dto';

@Controller('reports')
export class ReportsController {
    constructor (private reportsService : ReportsService) {}

    @Post('createReport')
    @UseGuards(AuthGuard)
    @Serialize(ReportDTO)
    creatReport(@Body() body : CreateReportDTO, @CurrentUser() user : User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approvedReports(@Param('id') id : string ,@Body() body: ApprovedReportDto) {
        return this.reportsService.changeApproval(id , body.approved);
    }

    @Get('')
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
    }
}
