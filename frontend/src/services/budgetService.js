const API_BASE = '/api';

const handleResponse = async (res) => {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || `HTTP error ${res.status}` };
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
};

export const budgetService = {
  async getCategories(type) {
    const query = type ? `?type=${type}` : '';
    const res = await fetch(`${API_BASE}/categories${query}`);
    return handleResponse(res);
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async getTransactions(month, year, type, category) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    if (type) params.append('type', type);
    if (category) params.append('category', category);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/transactions${query}`);
    return handleResponse(res);
  },

  async createTransaction(data) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateTransaction(id, data) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async setBudget(data) {
    const res = await fetch(`${API_BASE}/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getBudget(month, year) {
    const res = await fetch(`${API_BASE}/budget?month=${month}&year=${year}`);
    return handleResponse(res);
  },

  async getBudgetSummary(month, year) {
    const res = await fetch(`${API_BASE}/budget/summary?month=${month}&year=${year}`);
    return handleResponse(res);
  },

  async getCategorySummary(month, year) {
    const res = await fetch(`${API_BASE}/budget/categories?month=${month}&year=${year}`);
    return handleResponse(res);
  },
};

