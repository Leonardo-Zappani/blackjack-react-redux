const scoreMapping = {
    'A': 11,
    'K': 10,
    'Q': 10,
    'J': 10
  };
  
  export const calculateCardScore = (value) => {
    return scoreMapping[value] || parseInt(value, 10); // Se não estiver no map, retorna o próprio valor
  };