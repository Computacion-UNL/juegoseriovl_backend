const shuffle = (array) => {
  return new Promise((resolve) => {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    resolve([...array]);
  });
};

const validateIDCard = async (CI) => {
  await new Promise((resolve) => setTimeout(resolve, 0));

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const thirdDigit = parseInt(CI.substring(2, 3));
  const totalDigits = CI.length;
  let sum = 0;

  if (totalDigits !== 10 || isNaN(CI)) {
    return false;
  }

  for (let i = 0; i < coefficients.length; i++) {
    let product = coefficients[i] * parseInt(CI.charAt(i));

    sum += product >= 10 ? product - 9 : product;
  }

  const lastDigit = parseInt(CI.charAt(9));
  const result = sum % 10 === 0 ? 0 : 10 - (sum % 10);

  return (
    result === lastDigit &&
    !(thirdDigit === 6 || (thirdDigit === 9 && result !== 0))
  );
};

const generatorPass = () => {
  const character =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passLength = character.length;
  let password = "";

  for (let i = 0; i < 16; i++) {
    const indice = Math.floor(Math.random() * [passLength]);
    password += character.charAt(indice);
  }

  return password;
};


const calculateCsr =  (score) => {
  let percentage;

  if (score >= 0 && score <= 3) {
    percentage = (score / 3) * 84;
  } else if (score === 4) {
    percentage = 89;
  } else if (score === 5) {
    percentage = 96;
  } else if (score >= 6) {
    percentage = 100;
  } else {
    console.error("Invalid score");
    return null;
  }

  return percentage;
};

module.exports = { shuffle, validateIDCard, generatorPass, calculateCsr };
