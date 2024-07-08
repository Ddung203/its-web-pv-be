// Will always create a number of 6 digits and it ensures the first digit will never be 0.
const generateNumber = () => Math.floor(100000 + Math.random() * 900000);

export default generateNumber;
