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

export const attendanceService = {
  async getSubjects() {
    const res = await fetch(`${API_BASE}/subjects`);
    return handleResponse(res);
  },

  async createSubject(data) {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateSubject(id, data) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async markPresent(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}/present`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  async markAbsent(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}/absent`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  async markBulkAttendance(attendanceList) {
    const res = await fetch(`${API_BASE}/attendance/mark`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendance: attendanceList }),
    });
    return handleResponse(res);
  },

  async deleteSubject(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async getSummary() {
    const res = await fetch(`${API_BASE}/attendance/summary`);
    return handleResponse(res);
  },
};
