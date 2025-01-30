import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureAdService {
  private msalClient: ConfidentialClientApplication;

  constructor(private configService: ConfigService) {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: this.configService.get('AZURE_CLIENT_ID'),
        authority: `https://login.microsoftonline.com/${this.configService.get('AZURE_TENANT_ID')}`,
        clientSecret: this.configService.get('AZURE_CLIENT_SECRET'),
      },
    });
  }

  async getAuthUrl(): Promise<string> {
    return this.msalClient.getAuthCodeUrl({
      scopes: ['openid', 'profile', 'email'],
      redirectUri: this.configService.get('AZURE_REDIRECT_URI'),
    });
  }

  async acquireTokenByCode(code: string): Promise<any> {
    try {
      const tokenResponse = await this.msalClient.acquireTokenByCode({
        code,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: this.configService.get('AZURE_REDIRECT_URI'),
      });
      return tokenResponse;
    } catch (error) {
      throw new UnauthorizedException('Failed to acquire token');
    }
  }
}
