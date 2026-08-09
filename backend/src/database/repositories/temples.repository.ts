import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient, PaginationParams, PaginatedResult } from '../common/repository.interfaces';
import { buildPaginationClause, formatPaginatedResult } from '../common/pagination.helper';

export interface SearchParams extends PaginationParams {
  search?: string;
  state?: string;
  city?: string;
  category?: string;
  live?: string; // query parameters usually come as strings 'true'/'false'
}

export interface Temple {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: number | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  address_line: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  official_website: string | null;
  official_email: string | null;
  official_phone: string | null;
  google_maps_url: string | null;
  is_featured: boolean;
  live_enabled: boolean;
  notifications_enabled: boolean;
  is_active: boolean;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
  is_verified: boolean;
  verified_by_admin_id: string | null;
  verified_at: Date | null;
  verification_notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  youtube_channel_url: string | null;
  youtube_channel_id: string | null;
  youtube_channel_name: string | null;
  youtube_channel_handle: string | null;
  youtube_verification_status: 'VERIFIED' | 'PENDING' | 'FAILED' | null;
  last_verified_at: Date | null;
  is_live: boolean;
  last_live_check_at: Date | null;
}

@Injectable()
export class TemplesRepository extends BaseRepository<Temple> {
  constructor(db: DatabaseService) {
    super(db, 'temples');
  }

  async findBySlug(slug: string, client?: DbClient): Promise<Temple | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temples WHERE slug = $1 AND deleted_at IS NULL`,
      [slug],
    );
    return result.rows[0] || null;
  }

  async findBySlugWithLiveStream(slug: string, client?: DbClient): Promise<any | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT 
         t.*,
         c.name as city,
         s.name as state,
         ls.id as stream_id,
         ls.title as stream_title,
         ls.thumbnail_url as stream_thumbnail_url,
         ls.stream_url,
         ls.embed_url,
         ls.started_at as stream_started_at,
         ls.viewer_count
       FROM temples t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN states s ON t.state_id = s.id
       LEFT JOIN live_streams ls ON t.id = ls.temple_id AND ls.status = 'LIVE'
       WHERE t.slug = $1 AND t.is_active = true AND t.status = 'PUBLISHED' AND t.deleted_at IS NULL`,
      [slug]
    );
    return result.rows[0] || null;
  }

  async findAllWithFilters(
    params: SearchParams,
    client?: DbClient
  ): Promise<PaginatedResult<any>> {
    const runner = this.getClient(client);
    const pagination = buildPaginationClause(params);
    
    const whereClauses: string[] = ["t.status = 'PUBLISHED'", "t.is_active = true", "t.deleted_at IS NULL"];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      whereClauses.push(`(t.name ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex} OR s.name ILIKE $${paramIndex})`);
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    if (params.state) {
      whereClauses.push(`s.name ILIKE $${paramIndex}`);
      queryParams.push(`%${params.state}%`);
      paramIndex++;
    }

    if (params.city) {
      whereClauses.push(`c.name ILIKE $${paramIndex}`);
      queryParams.push(`%${params.city}%`);
      paramIndex++;
    }

    if (params.category) {
      whereClauses.push(`tc.name ILIKE $${paramIndex}`);
      queryParams.push(`%${params.category}%`);
      paramIndex++;
    }

    if (params.live !== undefined && params.live !== '') {
      const isLive = params.live === 'true';
      whereClauses.push(`t.is_live = $${paramIndex}`);
      queryParams.push(isLive);
      paramIndex++;
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const baseQuery = `
      FROM temples t
      LEFT JOIN states s ON t.state_id = s.id
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN temple_categories tc ON t.category_id = tc.id
      ${whereStr}
    `;

    const dataQuery = `
      SELECT 
        t.id, t.name, t.slug, t.is_live,
        c.name as city, s.name as state, tc.name as category,
        (SELECT url FROM temple_images WHERE temple_id = t.id AND is_primary = true LIMIT 1) as "imageUrl"
      ${baseQuery}
      ORDER BY t.created_at DESC
      ${pagination}
    `;
    
    const countQuery = `
      SELECT COUNT(t.id) 
      ${baseQuery}
    `;

    const [dataResult, countResult] = await Promise.all([
      runner.query(dataQuery, queryParams),
      runner.query(countQuery, queryParams)
    ]);
    
    return formatPaginatedResult(dataResult.rows, parseInt(countResult.rows[0].count), params);
  }


  async findEligibleForLiveMonitoring(batchSize: number = 5, client?: DbClient): Promise<Temple[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temples 
       WHERE is_active = true 
         AND status = 'PUBLISHED'
         AND live_enabled = true 
         AND youtube_verification_status = 'VERIFIED'
         AND youtube_channel_id IS NOT NULL
         AND deleted_at IS NULL
       ORDER BY last_live_check_at ASC NULLS FIRST
       LIMIT $1`,
      [batchSize]
    );
    return result.rows;
  }

  async updateLastLiveCheckAt(id: string, isLive: boolean, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `UPDATE temples 
       SET last_live_check_at = NOW(), is_live = $2
       WHERE id = $1`,
      [id, isLive]
    );
  }

  async findAdminAllWithFilters(
    params: SearchAdminParams,
    client?: DbClient
  ): Promise<PaginatedResult<any>> {
    const runner = this.getClient(client);
    const pagination = buildPaginationClause(params);
    
    const whereClauses: string[] = ["t.deleted_at IS NULL"];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      whereClauses.push(`(t.name ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex} OR s.name ILIKE $${paramIndex})`);
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    if (params.state && params.state !== 'all') {
      whereClauses.push(`s.name ILIKE $${paramIndex}`);
      queryParams.push(`%${params.state}%`);
      paramIndex++;
    }

    if (params.category && params.category !== 'all') {
      whereClauses.push(`tc.name ILIKE $${paramIndex}`);
      queryParams.push(`%${params.category}%`);
      paramIndex++;
    }

    if (params.status && params.status !== 'all') {
      const isActive = params.status === 'active';
      whereClauses.push(`t.is_active = $${paramIndex}`);
      queryParams.push(isActive);
      paramIndex++;
    }

    if (params.liveStatus && params.liveStatus !== 'all') {
      const isLive = params.liveStatus === 'live';
      whereClauses.push(`t.is_live = $${paramIndex}`);
      queryParams.push(isLive);
      paramIndex++;
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const baseQuery = `
      FROM temples t
      LEFT JOIN states s ON t.state_id = s.id
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN temple_categories tc ON t.category_id = tc.id
      ${whereStr}
    `;

    const dataQuery = `
      SELECT 
        t.id, t.name, t.slug, t.is_live as "isLive", t.is_active as "isActive",
        c.name as city, s.name as state, tc.name as category,
        t.created_at as "createdAt",
        (SELECT url FROM temple_images WHERE temple_id = t.id AND is_primary = true LIMIT 1) as "imageUrl"
      ${baseQuery}
      ORDER BY t.created_at DESC
      ${pagination}
    `;
    
    const countQuery = `
      SELECT COUNT(t.id) 
      ${baseQuery}
    `;

    const [dataResult, countResult] = await Promise.all([
      runner.query(dataQuery, queryParams),
      runner.query(countQuery, queryParams)
    ]);
    
    return formatPaginatedResult(dataResult.rows, parseInt(countResult.rows[0].count), params);
  }

  async getAdminTempleById(id: string, client?: DbClient): Promise<any> {
    const runner = this.getClient(client);
    const dataQuery = `
      SELECT 
        t.id, t.name, t.slug, t.description, t.is_active as "isActive", t.is_live as "isLive",
        c.name as city, s.name as state, tc.name as category,
        t.youtube_channel_url as "youtubeChannelUrl",
        t.status,
        (SELECT url FROM temple_images WHERE temple_id = t.id AND is_primary = true LIMIT 1) as "imageUrl"
      FROM temples t
      LEFT JOIN states s ON t.state_id = s.id
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN temple_categories tc ON t.category_id = tc.id
      WHERE t.id = $1 AND t.deleted_at IS NULL
    `;
    const result = await runner.query(dataQuery, [id]);
    return result.rows[0] || null;
  }

  async createAdminTemple(data: any, client?: DbClient): Promise<any> {
    const runner = this.getClient(client);
    
    // Category lookup/insert
    let catRes = await runner.query(`SELECT id FROM temple_categories WHERE name ILIKE $1`, [data.category]);
    if (catRes.rowCount === 0) {
      catRes = await runner.query(`INSERT INTO temple_categories(name, slug) VALUES($1, $2) RETURNING id`, [data.category, data.category.toLowerCase().replace(/ /g, '-')]);
    }
    
    // State lookup/insert
    let stateRes = await runner.query(`SELECT id FROM states WHERE name ILIKE $1`, [data.state]);
    if (stateRes.rowCount === 0) {
      const stateCode = data.state.substring(0, 3).toUpperCase();
      stateRes = await runner.query(`INSERT INTO states(name, code, country_id) VALUES($1, $2, 1) RETURNING id`, [data.state, stateCode]);
    }
    
    // City lookup/insert
    let cityRes = await runner.query(`SELECT id FROM cities WHERE name ILIKE $1 AND state_id = $2`, [data.city, stateRes.rows[0].id]);
    if (cityRes.rowCount === 0) {
      cityRes = await runner.query(`INSERT INTO cities(name, state_id) VALUES($1, $2) RETURNING id`, [data.city, stateRes.rows[0].id]);
    }

    const isActive = data.isActive === 'true' || data.isActive === true;
    
    const result = await runner.query(
      `INSERT INTO temples (
        name, slug, description, category_id, state_id, city_id, 
        youtube_channel_url, is_active, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *`,
      [
        data.name, data.slug, data.description || null, catRes.rows[0].id, stateRes.rows[0].id, cityRes.rows[0].id,
        data.youtubeChannelUrl || null, isActive, isActive ? 'PUBLISHED' : 'DRAFT'
      ]
    );

    if (data.imageUrl) {
      await runner.query(
        `INSERT INTO temple_images (temple_id, url, is_primary, image_type, display_order) VALUES ($1, $2, true, 'BANNER', 0)`,
        [result.rows[0].id, data.imageUrl]
      );
    }
    
    return result.rows[0];
  }

  async updateAdminTemple(id: string, data: any, client?: DbClient): Promise<any> {
    const runner = this.getClient(client);
    
    let catRes = await runner.query(`SELECT id FROM temple_categories WHERE name ILIKE $1`, [data.category]);
    if (catRes.rowCount === 0) {
      catRes = await runner.query(`INSERT INTO temple_categories(name, slug) VALUES($1, $2) RETURNING id`, [data.category, data.category.toLowerCase().replace(/ /g, '-')]);
    }
    
    let stateRes = await runner.query(`SELECT id FROM states WHERE name ILIKE $1`, [data.state]);
      if (stateRes.rowCount === 0) {
        // Need country ID, assuming India = 1
        const stateCode = data.state.substring(0, 3).toUpperCase();
        stateRes = await runner.query(`INSERT INTO states(name, code, country_id) VALUES($1, $2, 1) RETURNING id`, [data.state, stateCode]);
      }
    
    let cityRes = await runner.query(`SELECT id FROM cities WHERE name ILIKE $1 AND state_id = $2`, [data.city, stateRes.rows[0].id]);
    if (cityRes.rowCount === 0) {
      cityRes = await runner.query(`INSERT INTO cities(name, state_id) VALUES($1, $2) RETURNING id`, [data.city, stateRes.rows[0].id]);
    }

    const isActive = data.isActive === 'true' || data.isActive === true;
    
    const result = await runner.query(
      `UPDATE temples SET 
        name = $1, slug = $2, description = $3, category_id = $4, state_id = $5, city_id = $6, 
        youtube_channel_url = $7, is_active = $8, status = $9, updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [
        data.name, data.slug, data.description || null, catRes.rows[0].id, stateRes.rows[0].id, cityRes.rows[0].id,
        data.youtubeChannelUrl || null, isActive, isActive ? 'PUBLISHED' : 'DRAFT',
        id
      ]
    );

    if (result.rowCount === 0) {
      throw new Error(`Temple with ID ${id} not found`);
    }

    if (data.imageUrl) {
      const existingImage = await runner.query(
        `SELECT id FROM temple_images WHERE temple_id = $1 AND is_primary = true`,
        [id]
      );
      if (existingImage.rowCount && existingImage.rowCount > 0) {
        await runner.query(
          `UPDATE temple_images SET url = $1 WHERE id = $2`,
          [data.imageUrl, existingImage.rows[0].id]
        );
      } else {
        await runner.query(
          `INSERT INTO temple_images (temple_id, url, is_primary, image_type, display_order) VALUES ($1, $2, true, 'BANNER', 0)`,
          [id, data.imageUrl]
        );
      }
    }

    return result.rows[0];
  }

  async getDashboardStats(client?: DbClient): Promise<any> {
    const runner = this.getClient(client);
    
    const result = await runner.query(`
      SELECT
        COUNT(*) as "totalTemples",
        COUNT(CASE WHEN is_live = true THEN 1 END) as "liveTemples",
        COUNT(CASE WHEN is_live = false THEN 1 END) as "offlineTemples",
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as "newlyAdded"
      FROM temples
      WHERE deleted_at IS NULL
    `);
    
    return {
      totalTemples: parseInt(result.rows[0].totalTemples || '0'),
      liveTemples: parseInt(result.rows[0].liveTemples || '0'),
      offlineTemples: parseInt(result.rows[0].offlineTemples || '0'),
      newlyAdded: parseInt(result.rows[0].newlyAdded || '0'),
    };
  }

  async getRecentActivity(client?: DbClient): Promise<any[]> {
    const runner = this.getClient(client);
    
    const result = await runner.query(`
      SELECT 
        id, 
        name, 
        created_at as date,
        CASE 
          WHEN is_live = true THEN 'Live'
          WHEN is_active = false THEN 'Pending'
          ELSE 'Offline'
        END as status
      FROM temples
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    return result.rows;
  }

  async deleteAdminTemple(id: string, client?: DbClient): Promise<boolean> {
    const runner = this.getClient(client);
    
    // Using soft delete
    const result = await runner.query(
      `UPDATE temples SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    
    return (result.rowCount ?? 0) > 0;
  }
}

export interface SearchAdminParams extends PaginationParams {
  search?: string;
  state?: string;
  category?: string;
  status?: string; 
  liveStatus?: string; 
}
