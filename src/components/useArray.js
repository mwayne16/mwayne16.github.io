import { useCallback, useState } from 'react';

const useArray = initial => {
  const [value, setValue] = useState(initial);
  return {
    value,
    setValue,
    filterByPrice: useCallback(
      range => setValue(arr => arr.filter(v => v.price >= range)),
      []
    ),
    filterByColor: useCallback(
      c => setValue(arr => arr.filter(v => v.color === c)),
      []
    ),
    sortAscending: () => setValue(arr => arr.sort((a, b) => a.price - b.price))
  };
};
export default useArray;

// useEffect(() => {
//   async function DatatoFilter() {
//     let data = props.results;
//     if (props.loading) {
//       return;
//     }
//     try {
//       data
//         .filter(product => product.price - product.sale >= props.min.price)
//         .map(product => console.log(product));
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   DatatoFilter();
// }, [props]);
