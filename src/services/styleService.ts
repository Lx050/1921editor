import api from '../utils/api';

// Define the interface locally for frontend
export interface StyleTemplate {
    id: string;
    name: string;
    type: 'title' | 'body' | 'intro';
    preview: string;
    fullExample: string;
    isCustom: boolean;
    tenantId: string | null;
    ownerId: string | null;
    createdAt: string;
    updatedAt: string;
}

class StyleService {
    async getAllStyles(): Promise<StyleTemplate[]> {
        const response = await api.get('/style-templates');
        return response.data;
    }

    async getStyle(id: string): Promise<StyleTemplate> {
        const response = await api.get(`/style-templates/${id}`);
        return response.data;
    }

    async createStyle(data: {
        name: string;
        type: string;
        preview: string;
        fullExample: string;
    }): Promise<StyleTemplate> {
        const response = await api.post('/style-templates', data);
        return response.data;
    }

    async updateStyle(id: string, data: Partial<StyleTemplate>): Promise<StyleTemplate> {
        const response = await api.put(`/style-templates/${id}`, data);
        return response.data;
    }

    async deleteStyle(id: string): Promise<void> {
        await api.delete(`/style-templates/${id}`);
    }
}

export const styleService = new StyleService();
