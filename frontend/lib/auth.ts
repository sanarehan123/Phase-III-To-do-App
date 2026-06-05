export interface User {
  token: string;
  user_id: string;
  name: string;
  email: string;
}

export const saveUser = (user: User) => {
  localStorage.setItem("token", user.token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return !!getUser();
};