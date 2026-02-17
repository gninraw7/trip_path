import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TripsModule } from './modules/trips/trips.module';
import { PlacesModule } from './modules/places/places.module';
import { CollabModule } from './modules/collab/collab.module';
import { BudgetModule } from './modules/budget/budget.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationModule } from './modules/notification/notification.module';

/**
 * 루트 애플리케이션 모듈
 * 설계서 Section 4.1: 모듈형 모놀리식(Modular Monolith) 아키텍처
 * 설계서 Section 8.1: 모듈 구조
 */
@Module({
  imports: [
    // 환경 설정 (글로벌)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 스케줄러 (BR-DER-001: 여행 상태 자동 전환 등)
    ScheduleModule.forRoot(),

    // 데이터베이스
    DatabaseModule,

    // 도메인 모듈 (설계서 Section 8.1 모듈 구조)
    AuthModule,
    UsersModule,
    TripsModule,
    PlacesModule,
    CollabModule,
    BudgetModule,
    SearchModule,
    NotificationModule,
  ],
})
export class AppModule {}
