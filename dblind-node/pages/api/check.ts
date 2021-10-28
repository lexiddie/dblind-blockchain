import { NextApiRequest, NextApiResponse } from 'next';

const check = (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ status: 'ok' });
};

export default check;
