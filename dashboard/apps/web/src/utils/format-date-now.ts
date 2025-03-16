type DateNow = {
  day: string;
  month: string;
  year: number;
};

export const getDateNowAndFormat = (): DateNow => {
  const dateNow = new Date();
  const months = [
    "Jan", "Fev", "Mar", "Abril", "Maio", "Jun",
    "Jul", "Ago", "Set", "Out", "Nom", "Dez"
  ];

  return {
    day: String(dateNow.getDate()).padStart(2, '0'),
    month: months[dateNow.getMonth()]!,
    year: dateNow.getFullYear(),
  };
};
