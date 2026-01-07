export default () => {
  const getRandomInt = ({ min = 1, max = 10 }) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }

  return {
    getRandomInt,
  }
}
