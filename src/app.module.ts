import { PrismaModule } from './common/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { UserModule } from './modules/user/user.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, CategoriesModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
