import { ISession } from '@mezon/store';

export const saveMezonSession = (session: ISession | null) => {
  localStorage.setItem('mezonSession', JSON.stringify(session));
};

export const getMezonSession = () => {
  const storedSession = localStorage.getItem('mezonSession');
  return storedSession ? JSON.parse(storedSession) : null;
};

export const removeMezonSession = () => {
  localStorage.removeItem('mezonSession');
};
    