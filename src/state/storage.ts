export default function storage<T>(key: string) {
  return (value?: T): T | null => {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    }
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
}
