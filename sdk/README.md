# Points Distribution SDK

A TypeScript SDK for distributing and managing points.

## Installation

```bash
npm install points-distribution-sdk
```

## Usage

```typescript
import { PointsSDK } from 'points-distribution-sdk';

// Register for an API key
const registration = await PointsSDK.register('MyProject', 'email@example.com');
const apiKey = registration.apiKey;

// Initialize the SDK
const sdk = new PointsSDK(apiKey);

// Distribute points
await sdk.distribute('eventName', [
  { address: '0x123...', points: 100 },
  { address: '0x456...', points: 200 }
]);

// Get points for an address
const points = await sdk.getPointsByAddress('0x123...');
```

## API Reference

### `PointsSDK.register(projectName: string, projectEmail: string): Promise<{ apiKey: string }>`
Register for a new API key.

### `distribute(eventName: string, pointsData: PointsData[]): Promise<void>`
Distribute points to multiple addresses.

### `getPointsByAddress(address: string): Promise<PointsResponse[]>`
Get all points for a specific address.

### `getPointsByAddressAndEvent(address: string, eventName: string): Promise<PointsResponse[]>`
Get points for a specific address filtered by event name.

### `getTotalPointsByAddress(address: string): Promise<{ totalPoints: number }>`
Get total points for a specific address.

## License

MIT