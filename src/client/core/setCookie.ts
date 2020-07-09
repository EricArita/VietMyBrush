import { config } from '@client/config';

export const setCookie = async (req: any, res: any) => {
  const token = req.body.token;
  const uid = req.body.uid;
  res.cookie('token', token, { domain: config.cookies.domain });
  res.cookie('vietmyuid', uid, { domain: config.cookies.domain }).redirect('/');
};
