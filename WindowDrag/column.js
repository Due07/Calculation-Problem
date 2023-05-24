// export const all = [
//   0, 'qwe', 2, 3, 4, 5, 'asdf', 7, 'ghgg', 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49
// ]
export const allColumn = () => {
  return Array(180).fill(null).reduce((pre, cur, index) => {
    if (!index) return pre
    return pre.length ? [...pre, index + 1] : [index + 1]
  }, [])
}
