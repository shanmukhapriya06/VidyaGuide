// LocalStorage helper functions
const Storage = {
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    load: (key) => JSON.parse(localStorage.getItem(key)) || [],
    clear: () => localStorage.clear()
};
