import { config } from '@client/config';
export const clearCookie = async (_req: any, res: any) => {
  res.clearCookie('token', { domain: config.cookies.domain });
  res.clearCookie('vietmyuid', { domain: config.cookies.domain }).redirect('/auth/login');
};
