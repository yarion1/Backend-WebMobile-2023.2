import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiServiceService {
  constructor(private httpService: HttpService) { }

  async getHttpResponse(url: string): Promise<any> {
    const config = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDg1NWJlNDNhZTE0ZjJlN2RkNjlhM2ViNzU2YWYzNCIsInN1YiI6IjYxZjA0OWQyZDExZTBlMDA0NjZiMDQwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PbyXVRy-QKIPp-Q3xihsWjaO8pJ54Ez4gZbl3evCRvo'
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
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDg1NWJlNDNhZTE0ZjJlN2RkNjlhM2ViNzU2YWYzNCIsInN1YiI6IjYxZjA0OWQyZDExZTBlMDA0NjZiMDQwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PbyXVRy-QKIPp-Q3xihsWjaO8pJ54Ez4gZbl3evCRvo'
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
