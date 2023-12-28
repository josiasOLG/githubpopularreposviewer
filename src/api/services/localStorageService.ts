const localStorageService = {
  insert(key: string, item: any) {
    const existingItems = this.getAll(key) || [];
    if (
      existingItems.some((existingItem: any) => existingItem.id === item.id)
    ) {
      return false;
    }
    existingItems.push(item);
    localStorage.setItem(key, JSON.stringify(existingItems));
    return true;
  },

  get(key: string, id: number) {
    const existingItems = this.getAll(key) || [];
    return existingItems.find((item: any) => item.id === id);
  },

  getAll(key: string) {
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  },

  update(key: string, updatedItem: any) {
    let existingItems = this.getAll(key) || [];
    existingItems = existingItems.map((item: any) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    localStorage.setItem(key, JSON.stringify(existingItems));
  },

  delete(key: string, id: number) {
    const existingItems = this.getAll(key) || [];
    const filteredItems = existingItems.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filteredItems));
  },
};

export default localStorageService;
