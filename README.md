# Points Distribution SDK

A TypeScript SDK for managing and distributing points to blockchain addresses. Easy to integrate, fully typed, and Promise-based.

## 📦 Installation

```bash
npm install points-distribution-sdk
```

## 🚀 Quick Start

```typescript
import { PointsSDK } from 'points-distribution-sdk';

// Register for a new API key
const registration = await PointsSDK.register('MyProject', 'email@example.com');
const apiKey = registration.apiKey;

// Initialize the SDK
const sdk = new PointsSDK(apiKey);

// Distribute points
await sdk.distribute('eventName', [
  { address: '0x123...', points: 100 }
]);

// Query points
const points = await sdk.getPointsByAddress('0x123...');
```

## 🔧 API Reference

### Initialization

```typescript
const sdk = new PointsSDK(apiKey: string, baseURL?: string);
```

- `apiKey`: Your API key obtained through registration
- `baseURL`: (Optional) Custom API endpoint. Defaults to 'https://points-distribution-sdk.onrender.com/api'

### Methods

#### Register for API Key

```typescript
static async register(
  projectName: string,
  projectEmail: string,
  baseURL?: string
): Promise
```

#### Distribute Points

```typescript
async distribute(
  eventName: string,
  pointsData: PointsData[]
): Promise
```

#### Get Points by Address

```typescript
async getPointsByAddress(
  address: string
): Promise
```

#### Get Points by Address and Event

```typescript
async getPointsByAddressAndEvent(
  address: string,
  eventName: string
): Promise
```

#### Get Total Points for Address

```typescript
async getTotalPointsByAddress(
  address: string
): Promise
```

## 📝 Types

### PointsData

```typescript
interface PointsData {
  points: number;
  address: string;
}
```

### PointsResponse

```typescript
interface PointsResponse {
  event_name: string;
  points: number;
  created_at: string;
}
```

## 🎯 Examples

### Registering for an API Key

```typescript
import { PointsSDK } from 'points-distribution-sdk';

try {
  const registration = await PointsSDK.register(
    'MyProject',
    'contact@example.com'
  );
  console.log('API Key:', registration.apiKey);
} catch (error) {
  console.error('Registration failed:', error);
}
```

### Distributing Points

```typescript
const sdk = new PointsSDK('your-api-key');

try {
  await sdk.distribute('Hackathon2024', [
    { address: '0x123...', points: 100 },
    { address: '0x456...', points: 150 }
  ]);
  console.log('Points distributed successfully');
} catch (error) {
  console.error('Distribution failed:', error);
}
```

### Querying Points

```typescript
const sdk = new PointsSDK('your-api-key');

// Get all points for an address
const allPoints = await sdk.getPointsByAddress('0x123...');

// Get points for specific event
const eventPoints = await sdk.getPointsByAddressAndEvent('0x123...', 'Hackathon2024');

// Get total points
const totalPoints = await sdk.getTotalPointsByAddress('0x123...');
```

## 🔐 Error Handling

The SDK includes comprehensive error handling. All methods throw errors with descriptive messages when:
- API key is invalid
- Network requests fail
- Server returns an error response
- Invalid parameters are provided

```typescript
try {
  await sdk.distribute('eventName', pointsData);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  }
}
```

## 🌐 Base URL Configuration

You can customize the API endpoint when needed:

```typescript
const sdk = new PointsSDK(
  'your-api-key',
  'https://your-custom-endpoint.com/api'
);
```
