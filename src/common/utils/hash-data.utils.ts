import * as bcrypt from 'bcryptjs';

export const hashData = async (data: string) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(data, salt);
  return hash;
};
