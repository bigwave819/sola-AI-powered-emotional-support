import { Body, Controller, Get, Headers, Post, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import * as crypto from 'crypto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  // No JwtAuthGuard here — this is called by RevenueCat's servers, not your app.
  // Verified instead via a shared secret header, per RevenueCat's webhook docs.
  @Post('webhook')
  @ApiOperation({
    summary: 'RevenueCat server-to-server webhook — do NOT call this from the docs UI',
    description:
      'Called by RevenueCat servers with an Authorization header matching REVENUECAT_WEBHOOK_SECRET. ' +
      'Calls from the Swagger UI will always fail with 403.',
  })
  @ApiResponse({ status: 201, description: 'Event received' })
  @ApiResponse({ status: 403, description: 'Invalid webhook signature' })
  async webhook(@Headers('authorization') authHeader: string, @Body() body: any) {
    const expected = `Bearer ${process.env.REVENUECAT_WEBHOOK_SECRET}`;
    if (authHeader !== expected) throw new ForbiddenException('Invalid webhook signature');

    await this.subscriptionsService.handleWebhookEvent(body.event);
    return { received: true };
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current user\u2019s subscription tier and status' })
  @ApiResponse({ status: 200, description: 'Entitlement info, e.g. { tier: "free" | "plus" }' })
  getMine(@Req() req: any) {
    return this.subscriptionsService.getEntitlement(req.user.userId);
  }
}