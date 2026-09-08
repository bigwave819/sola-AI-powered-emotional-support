import { Body, Controller, Get, Headers, Post, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import * as crypto from 'crypto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  // No JwtAuthGuard here — this is called by RevenueCat's servers, not your app.
  // Verified instead via a shared secret header, per RevenueCat's webhook docs.
  @Post('webhook')
  async webhook(@Headers('authorization') authHeader: string, @Body() body: any) {
    const expected = `Bearer ${process.env.REVENUECAT_WEBHOOK_SECRET}`;
    if (authHeader !== expected) throw new ForbiddenException('Invalid webhook signature');

    await this.subscriptionsService.handleWebhookEvent(body.event);
    return { received: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMine(@Req() req: any) {
    return this.subscriptionsService.getEntitlement(req.user.userId);
  }
}