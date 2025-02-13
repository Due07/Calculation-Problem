
export type TRandomType = {
  /** 符号 */
  symbols?: boolean,
  /** 字母 */
  letter?: boolean,
  // number?: boolean, /** 数字 */
}

/**
 * 生成随机数
 * @param num 数量 > 0
 * @param type 生成类型 可以包含 *符号 or 字母*
 * @returns
 */
export const CreateRandomStr = (num: number, type: TRandomType = {}) => {
  if (!num) return '';

  const randomObjStr: Record<keyof TRandomType, string> = {
    symbols: '~!@#$%^&*-/+.',
    letter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  };
  const characters = Object.entries(randomObjStr).reduce((pre, [key, value]) => {
    const resultStr = type[key] ? value : '';
    return `${pre}${resultStr}`;
  }, '0123456789');

  return Array(num).fill(Math.random).reduce<string>((pre, cur) => {
    return `${pre}${characters[~~(cur() * characters.length)]}`;
  }, '');
};
