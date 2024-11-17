import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

export const registerApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { projectName, projectEmail } = req.body;

  if (!projectName || !projectEmail) {
    res.status(400).json({ error: 'Project name and email are required' });
    return;
  }

  try {
    const apiKey = uuidv4();
    await query(
      'INSERT INTO api_keys (api_key, project_name, project_email) VALUES ($1, $2, $3)',
      [apiKey, projectName, projectEmail]
    );

    res.status(201).json({ apiKey });
  } catch (error) {
    console.error('Error registering API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const distributePoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { apiKey, eventName, pointsData } = req.body;

  if (!apiKey || !eventName || !pointsData || !Array.isArray(pointsData)) {
    res.status(400).json({ error: 'API key, event name, and points data array are required' });
    return;
  }

  try {
    // First, validate the API key
    const apiKeyResult = await query(
      'SELECT api_key FROM api_keys WHERE api_key = $1',
      [apiKey]
    );

    if (apiKeyResult.rows.length === 0) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }

    // Begin transaction
    await query('BEGIN');

    try {
      // Insert points data
      for (const data of pointsData) {
        if (!data.points || !data.address) {
          throw new Error('Invalid points data format');
        }

        await query(
          'INSERT INTO points_data (api_key, event_name, points, address) VALUES ($1, $2, $3, $4)',
          [apiKey, eventName, data.points, data.address]
        );
      }

      await query('COMMIT');
      res.status(200).json({ message: 'Points distributed successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error distributing points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPointsByAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { address } = req.params;

  if (!address) {
    res.status(400).json({ error: 'Address is required' });
    return;
  }

  try {
    const result = await query(
      'SELECT event_name, points, created_at FROM points_data WHERE address = $1',
      [address]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPointsByAddressAndEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { address } = req.params;
  const { eventName } = req.query;

  if (!address || !eventName) {
    res.status(400).json({ error: 'Address and event name are required' });
    return;
  }

  try {
    const result = await query(
      'SELECT points, created_at FROM points_data WHERE address = $1 AND event_name = $2',
      [address, eventName]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTotalPointsByAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { address } = req.params;

  if (!address) {
    res.status(400).json({ error: 'Address is required' });
    return;
  }

  try {
    const result = await query(
      'SELECT SUM(points) as total_points FROM points_data WHERE address = $1',
      [address]
    );

    res.status(200).json({ totalPoints: result.rows[0].total_points || 0 });
  } catch (error) {
    console.error('Error retrieving total points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};