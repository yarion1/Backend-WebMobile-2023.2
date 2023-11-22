import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiServiceService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) { }


  async getHttpResponse(url: string): Promise<any> {
    const config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.configService.get<string>('JWT_TMDB')}`
      }
    }
    return await this.httpService
      .get(url, config)
      .toPromise()
      .then((res) => {
        return res.data;
      });
  }

  async postHttpResponse(url: any, data: any): Promise<any> {
    const config = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.configService.get<string>('JWT_TMDB')}`
      }
    }

    return await this.httpService.axiosRef
      .post(url, { params: data }, config)
      .then((res) => {
        return res.data;
      }).catch(() => {
        return false
      });
  }

  async postHttpResponseBody(url: any, data: any): Promise<any> {
    return await this.httpService
      .post(url, data)
      .toPromise()
      .then((res) => {
        return res.data;
      }).catch(() => {
        return false
      });
  }
}
