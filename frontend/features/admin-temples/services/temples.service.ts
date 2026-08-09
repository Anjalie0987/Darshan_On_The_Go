import { adminApi } from '@/features/admin-auth/services/admin-auth-service';
import { TempleFormValues } from '../components/temple-form';

export const templeService = {
  async createTemple(data: TempleFormValues) {
    try {
      if (data.coverImage) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key !== 'coverImage' && data[key as keyof TempleFormValues] !== undefined) {
            formData.append(key, data[key as keyof TempleFormValues] as string);
          }
        });
        formData.append('coverImage', data.coverImage);
        
        const response = await adminApi.post('/api/v1/admin/temples', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const response = await adminApi.post('/api/v1/admin/temples', data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to create temple', error);
      throw error;
    }
  },
  async updateTemple(id: string, data: TempleFormValues) {
    try {
      if (data.coverImage) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key !== 'coverImage' && data[key as keyof TempleFormValues] !== undefined) {
            formData.append(key, data[key as keyof TempleFormValues] as string);
          }
        });
        formData.append('coverImage', data.coverImage);
        
        const response = await adminApi.put(`/api/v1/admin/temples/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const response = await adminApi.put(`/api/v1/admin/temples/${id}`, data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to update temple', error);
      throw error;
    }
  },
  async deleteTemple(id: string) {
    try {
      const response = await adminApi.delete(`/api/v1/admin/temples/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete temple', error);
      throw error;
    }
  },
  async getTempleById(id: string) {
    try {
      const response = await adminApi.get(`/api/v1/admin/temples/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get temple from API, returning mock data for development.', error);
      // Return a complete mock temple for UI development
      return {
        id,
        name: 'Kashi Vishwanath',
        slug: 'kashi-vishwanath',
        description: 'One of the most famous Hindu temples dedicated to Lord Shiva.',
        category: 'Jyotirlinga',
        state: 'Uttar Pradesh',
        city: 'Varanasi',
        isActive: true,
        status: 'PUBLISHED',
        youtubeChannelUrl: 'https://www.youtube.com/@MHONESHRADDHA',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      };
    }
  },
  async getAdminTemples(params: any) {
    const response = await adminApi.get('/api/v1/admin/temples', { params });
    return response.data;
  },
  async getDashboardStats() {
    const response = await adminApi.get('/api/v1/admin/dashboard/stats');
    return response.data.data;
  },
  async getRecentActivity() {
    const response = await adminApi.get('/api/v1/admin/dashboard/recent-activity');
    return response.data.data;
  }
};
