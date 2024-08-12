export const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    // Faire une requête pour vérifier la validité du token
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};
