interface PointsData {
    points: number;
    address: string;
}
interface PointsResponse {
    event_name: string;
    points: number;
    created_at: string;
}
export declare class PointsSDK {
    private client;
    private apiKey;
    constructor(apiKey: string, baseURL?: string);
    /**
     * Distributes points to a specific address for an event
     * @param eventName Name of the event
     * @param pointsData Array of points data containing address and points
     */
    distribute(eventName: string, pointsData: PointsData[]): Promise<void>;
    /**
     * Get all points for a specific address
     * @param address User's address
     */
    getPointsByAddress(address: string): Promise<PointsResponse[]>;
    /**
     * Get points for a specific address filtered by event name
     * @param address User's address
     * @param eventName Name of the event
     */
    getPointsByAddressAndEvent(address: string, eventName: string): Promise<PointsResponse[]>;
    /**
     * Get total points for a specific address
     * @param address User's address
     */
    getTotalPointsByAddress(address: string): Promise<{
        totalPoints: number;
    }>;
    /**
     * Register for a new API key
     * @param projectName Name of the project
     * @param projectEmail Project contact email
     */
    static register(projectName: string, projectEmail: string, baseURL?: string): Promise<{
        apiKey: string;
    }>;
    private static handleError;
    private handleError;
}
export type { PointsData, PointsResponse };
