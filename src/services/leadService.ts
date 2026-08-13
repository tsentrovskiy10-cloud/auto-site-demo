export type Lead = { name:string; phone:string; car:string; comment:string; createdAt:string }

export const leadService = {
  async submit(data: Omit<Lead, 'createdAt'>) {
    await new Promise(resolve => setTimeout(resolve, 650))
    const lead = { ...data, createdAt: new Date().toISOString() }
    try {
      const current = JSON.parse(localStorage.getItem('apex-leads') ?? '[]')
      localStorage.setItem('apex-leads', JSON.stringify([...current, lead]))
    } catch { /* demo remains functional when storage is unavailable */ }
    return lead
  }
}
