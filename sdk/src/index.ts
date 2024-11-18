// src/index.ts
import axios, { AxiosInstance } from 'axios';

interface PointsData {
  points: number;
  address: string;
}

interface PointsResponse {
  event_name: string;
  points: number;
  created_at: string;
}

export class PointsSDK {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, baseURL: string = 'https://points-distribution-sdk.onrender.com/api') {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Distributes points to a specific address for an event
   * @param eventName Name of the event
   * @param pointsData Array of points data containing address and points
   */
  async distribute(eventName: string, pointsData: PointsData[]): Promise<void> {
    try {
      await this.client.post('/distribute', {
        apiKey: this.apiKey,
        eventName,
        pointsData,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all points for a specific address
   * @param address User's address
   */
  async getPointsByAddress(address: string): Promise<PointsResponse[]> {
    try {
      const response = await this.client.get(`/points/${address}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get points for a specific address filtered by event name
   * @param address User's address
   * @param eventName Name of the event
   */
  async getPointsByAddressAndEvent(
    address: string,
    eventName: string
  ): Promise<PointsResponse[]> {
    try {
      const response = await this.client.get(`/points/${address}/events`, {
        params: { eventName },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get total points for a specific address
   * @param address User's address
   */
  async getTotalPointsByAddress(address: string): Promise<{ totalPoints: number }> {
    try {
      const response = await this.client.get(`/points/${address}/total`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register for a new API key
   * @param projectName Name of the project
   * @param projectEmail Project contact email
   */
  static async register(
    projectName: string,
    projectEmail: string,
    baseURL: string = 'https://points-distribution-sdk.onrender.com/api'
  ): Promise<{ apiKey: string }> {
    try {
      const response = await axios.post(`${baseURL}/register`, {
        projectName,
        projectEmail,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.error || 'An error occurred while making the request'
      );
    }
    return error;
  }

  private handleError(error: any): Error {
    return PointsSDK.handleError(error);
  }
}

// Export types
export type { PointsData, PointsResponse };