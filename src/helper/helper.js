export const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const toCamelCase = (str) => {
  return str
    .split(" ")
    .map(function (word, index) {
      // If it is the first word make sure to lowercase all the chars.
      if (index === 0) {
        return word.toLowerCase();
      }
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export const toppingsTitle = (topping) => {
  switch (parseInt(topping)) {
    case 0:
      return "Whole";

    case 1:
      return "First-Half";

    case 2:
      return "Second-Half";

    default:
      break;
  }
};
